import appError from '../utils/appError';
import CommunityModel, {
  Community,
  CommunityRule,
  removalReason,
  ImageWidget,
  TextWidget,
  ButtonWidget,
  ContentControls,
  PostSettings,
  Details,
} from '../model/community.model';
import { Post } from '../model/posts.model';
import { findUserById, findUserByUsername } from './user.service';
import { findPostById } from './post.service';
import { findCommentById } from './comment.service';
import UserModel, { Moderator } from '../model/user.model';
import { Ref } from '@typegoose/typegoose';
/**
 * Finds a community by its subreddit name.
 *
 * @param {string} name - The subreddit name to search for.
 * @return {Promise<any>} The community object found based on the subreddit name.
 */
export async function findCommunityByName(name: string) {
  try {
    return await CommunityModel.findOne({ name: name });
  } catch (error) {
    console.error('Error in findCommunityByName:', error);
    throw error; // Re-throw the error to be caught by the caller
  }
}

/**
 * Fetches communities based on the provided array of community IDs.
 *
 * @param {string[]} commIDs - An array of community IDs.
 * @return {Promise<any[]>} A promise that resolves to an array of populated communities.
 */
export async function getUserCommunities(commIDs: string[]) {
  // Fetch communities based on the provided commIDs
  const communities = await CommunityModel.find({ _id: { $in: commIDs } });

  // Return the populated communities
  return communities;
}
/**
 * Finds a comment by their ID.
 *
 * @param id - The ID of the post to find.
 * @returns A promise that resolves to the user object if found, or null if not found.
 */
export function findCommunityByID(id: string) {
  return CommunityModel.findById(id);
}
export async function getCommunityByID(id: string) {
  return CommunityModel.findById(id);
}

/**
 * Create subreddit
 * @param {string} body contain rules details
 * @param {string} user user information
 * @return {Object} state
 * @function
 */
export async function createSubreddit(communityName: string, privacyType: string, over18: boolean, userID: string) {
  const user = await findUserById(userID);

  if (!user) {
    return {
      status: false,
      error: 'user not found',
    };
  }

  if (!user.canCreateSubreddit) {
    return {
      status: false,
      error: 'this user cannot create subreddit',
    };
  }
  const result = await availableSubreddit(communityName);

  if (!result.state) {
    return {
      errorType: 0,
      status: false,
      error: 'subreddit is already made',
    };
  }
  const moderator = {
    userID: userID,
    role: 'creator',
  };
  const memInComm = {
    userID: userID,
    isMuted: {
      value: false,
      date: new Date(),
      reason: 'member is not muted',
    },
    isBanned: {
      value: true,
      date: new Date(),
      reason: 'member not banned',
      note: 'member not banned',
      period: 'member not banned',
    },
  };

  const mods = [moderator];
  const mems = [memInComm];

  // Create the new community
  const new_community = new CommunityModel({
    privacyType: privacyType,
    over18: over18,
    name: communityName,
    moderators: mods,
    members: mems,
  });

  try {
    const createdCommunity = await createcomm(new_community);
    const updatedCommunity2 = await CommunityModel.findByIdAndUpdate(
      createdCommunity._id,
      { $inc: { membersCnt: 1 } },
      { upsert: true, new: true }
    );
    return {
      createdCommunity,
      status: true,
    };
  } catch {
    return {
      errorType: 1,
      status: false,
      error: 'operation failed',
    };
  }
}
/**
 * Check whether subreddit is available or not
 * @param {string} subreddit
 * @returns {object} {state and subreddit}
 * @function
 */
export async function availableSubreddit(subreddit: string) {
  const subre = await findCommunityByName(subreddit);
  if (subre) {
    return {
      state: false,
      subreddit: subre,
    };
  } else {
    return {
      state: true,
      subreddit: null,
    };
  }
}

/**
 * Creates a new community.
 *
 * @param {Partial<Community>} input - The partial community data to create.
 * @return {Promise<Community>} A promise that resolves to the created community.
 */
export function createcomm(input: Partial<Community>) {
  return CommunityModel.create(input);
}

/**
 * addMemberToCom
 * @param {string} body contain rules details
 * @param {string} user user information
 * @return {Object} state
 * @function
 */
export async function addMemberToCom(userID: string, subreddit: string) {
  const community = await findCommunityByName(subreddit);

  if (!community) {
    return {
      status: false,
      error: 'user not found',
    };
  }

  const memInComm = {
    userID: userID,
    isMuted: {
      value: false,
      date: new Date(),
      reason: 'member is not muted',
    },
    isBanned: {
      value: false,
      date: new Date(),
      reason: 'member not banned',
      note: 'member not banned',
      period: 'member not banned',
    },
  };

  try {
    const updatedCommunity = await CommunityModel.findByIdAndUpdate(
      community._id,
      { $addToSet: { members: memInComm } },
      { upsert: true, new: true }
    );
    const updatedCommunity2 = await CommunityModel.findByIdAndUpdate(
      community._id,
      { $inc: { membersCnt: 1 } },
      { upsert: true, new: true }
    );
  } catch (error) {
    return {
      status: false,
      error: error,
    };
  }
  return {
    status: true,
  };
}

/**
 * addModeratorToCom
 * @param {string} body contain rules details
 * @param {string} user user information
 * @return {Object} state
 * @function
 */
export async function addModeratorToCom(userID: string, subreddit: string) {
  const community = await findCommunityByName(subreddit);

  if (!community) {
    return {
      status: false,
      error: 'user not found',
    };
  }

  const moderator = {
    userID: userID,
    role: 'moderator',
  };

  try {
    const updatedCommunity = await CommunityModel.findByIdAndUpdate(
      community._id,
      { $addToSet: { moderators: moderator } },
      { upsert: true, new: true }
    );
  } catch (error) {
    return {
      status: false,
      error: error,
    };
  }
  return {
    status: true,
  };
}

/**
 * addModeratorToCom
 * @param {string} body contain rules details
 * @param {string} user user information
 * @return {Object} state
 * @function
 */
export async function updateModeratorToCom(userID: string, subreddit: string, info: Moderator) {
  const community = await findCommunityByName(subreddit);

  if (!community) {
    return {
      status: false,
      error: 'user not found',
    };
  }

  const moderator = {
    ...info,
    userID: userID,
    role: 'moderator',
  };

  try {
    const updatedCommunity1 = await CommunityModel.findByIdAndUpdate(
      community._id,
      { $pull: { moderators: { userID: userID } } },
      { new: true }
    );
    const updatedCommunity2 = await CommunityModel.findByIdAndUpdate(
      community._id,
      { $addToSet: { moderators: moderator } },
      { upsert: true, new: true }
    );
  } catch (error) {
    return {
      status: false,
      error: error,
    };
  }
  return {
    status: true,
  };
}

/**
 * Removes a moderator from a community.
 *
 * @param {string} userID - The ID of the moderator to be removed.
 * @param {string} subreddit - The name of the community.
 * @returns {Object} - An object indicating the status of the operation.
 *                    - If the moderator is successfully removed, the status will be true.
 *                    - If the community or the moderator is not found, the status will be false and an error message will be provided.
 */
export async function removeModeratorFromCom(userID: string, subreddit: string) {
  const community = await findCommunityByName(subreddit);

  if (!community) {
    return {
      status: false,
      error: 'user not found',
    };
  }

  try {
    const updatedCommunity = await CommunityModel.findByIdAndUpdate(
      community._id,
      { $pull: { moderators: { userID: userID } } },
      { new: true }
    );
  } catch (error) {
    return {
      status: false,
      error: error,
    };
  }
  return {
    status: true,
  };
}

/**
 * Removes a member from a community.
 *
 * @param {string} userID - The ID of the user to be removed.
 * @param {string} subreddit - The name of the community.
 * @returns {Object} - An object with the status of the operation.
 *                    - If the user or community is not found, the status will be false and an error message will be provided.
 *                    - If the operation is successful, the status will be true.
 */
export async function removeMemberFromCom(userID: string, subreddit: string) {
  const community = await findCommunityByName(subreddit);

  if (!community) {
    return {
      status: false,
      error: 'user not found',
    };
  }

  try {
    const updatedCommunity = await CommunityModel.findByIdAndUpdate(
      community._id,
      { $pull: { members: { userID: userID } } },
      { new: true }
    );
    const updatedCommunity2 = await CommunityModel.findByIdAndUpdate(
      community._id,
      { $inc: { membersCnt: -1 } },
      { upsert: true, new: true }
    );
  } catch (error) {
    return {
      status: false,
      error: error,
    };
  }
  return {
    status: true,
  };
}

/**
 * Retrieves the users who are banned in a community.
 *
 * @param {string} communityName - The name of the community.
 * @return {Promise<{status: boolean, users?: {avatar: string, username: string, _id: string, about: string, bannedTime: Date}[]}>} - A promise that resolves to an object with the status of the operation and the banned users, if successful.
 */
export async function getUsersAsBannedInCommunity(communityName: string) {
  // Find the community by name
  const community = await findCommunityByName(communityName);

  // If community is not found, return status false
  if (!community || !community.members) {
    return { status: false };
  }

  // Extract the IDs and bannedTime of banned users
  const bannedUsers = community.members.filter((member) => member.isBanned?.value === true);
  const userIDs = bannedUsers.map((member) => member.userID);
  const bann = bannedUsers.map((member) => member.isBanned);

  // Fetch the banned users from the database, selecting specific attributes
  const users = await UserModel.find({ _id: { $in: userIDs } }).select('avatar username _id about createdAt');

  // Combine banned users with their bannedTime
  const usersWithBannedTime = users.map((user, index) => ({
    ...user.toObject(),
    banInfo: bann[index],
  }));

  return { status: true, users: usersWithBannedTime };
}

/**
 * Retrieves the users who are banned in a community.
 *
 * @param {string} communityName - The name of the community.
 * @return {Promise<{status: boolean, users?: {avatar: string, username: string, _id: string, about: string, bannedTime: Date}[]}>} - A promise that resolves to an object with the status of the operation and the banned users, if successful.
 */
export async function getBannedUserInCommunity(userID: string, communityName: string) {
  // Find the community by name
  const community = await findCommunityByName(communityName);

  // If community is not found, return status false
  if (!community || !community.members) {
    return { status: false };
  }

  // Extract the IDs and bannedTime of banned users
  const bannedUser = community.members.filter(
    (member) => member.isBanned?.value === true && member.userID?.toString() == userID
  );

  // Fetch the banned users from the database, selecting specific attributes
  const user = await UserModel.findOne({ _id: { $in: userID } }).select('avatar username about createdAt');

  // Combine banned users with their bannedTime
  const userWithBanInfo = {
    user,
    banInfo: bannedUser,
  };

  return { status: true, userr: userWithBanInfo };
}

/**
 * Retrieves the users who are banned in a community.
 *
 * @param {string} communityName - The name of the community.
 * @return {Promise<{status: boolean, users?: {avatar: string, username: string, _id: string, about: string, bannedTime: Date}[]}>} - A promise that resolves to an object with the status of the operation and the banned users, if successful.
 */
export async function getUsersAsMutedInCommunity(communityName: string) {
  // Find the community by name
  const community = await findCommunityByName(communityName);

  // If community is not found, return status false
  if (!community || !community.members) {
    return { status: false };
  }

  // Extract the IDs and bannedTime of banned users
  const bannedUsers = community.members.filter((member) => member.isMuted?.value === true);
  const userIDs = bannedUsers.map((member) => member.userID);
  const bann = bannedUsers.map((member) => member.isMuted);

  // Fetch the banned users from the database, selecting specific attributes
  const users = await UserModel.find({ _id: { $in: userIDs } }).select('avatar username _id about createdAt');

  // Combine banned users with their bannedTime
  const usersWithBannedTime = users.map((user, index) => ({
    ...user.toObject(),
    muteInfo: bann[index],
  }));

  return { status: true, users: usersWithBannedTime };
}

/**
 * Retrieves the users who are banned in a community.
 *
 * @param {string} communityName - The name of the community.
 * @return {Promise<{status: boolean, users?: {avatar: string, username: string, _id: string, about: string, bannedTime: Date}[]}>} - A promise that resolves to an object with the status of the operation and the banned users, if successful.
 */
export async function getMutedUserInCommunity(userID: string, communityName: string) {
  // Find the community by name
  const community = await findCommunityByName(communityName);

  // If community is not found, return status false
  if (!community || !community.members) {
    return { status: false };
  }

  // Extract the IDs and bannedTime of banned users
  const bannedUser = community.members.filter(
    (member) => member.isMuted?.value === true && member.userID?.toString() == userID
  );

  // Fetch the banned users from the database, selecting specific attributes
  const user = await UserModel.findOne({ _id: { $in: userID } }).select('avatar username about createdAt');

  // Combine banned users with their bannedTime
  const userWithMuteInfo = {
    user,
    muteInfo: bannedUser,
  };

  return { status: true, userr: userWithMuteInfo };
}

/**
 * Retrieves the IDs and roles of the moderators of a community.
 *
 * @param {string} communityName - The name of the community.
 * @return {Promise<{status: boolean, users?: {avatar: string, username: string, _id: string, about: string, createdAt: Date, modRole: string}[]}>} - A promise that resolves to an object with the status of the operation and the moderators' IDs and roles, if successful.
 */
export async function getCommunityModerators(communityName: string) {
  // Find the community by name
  const community = await findCommunityByName(communityName);

  // If community is not found, return status false
  if (!community || !community.moderators) {
    return { status: false };
  }
  const moderators = community.moderators.filter((member) => member);
  const moderatorsIDs = moderators.map((mod) => mod.userID);
  const modRole = moderators.map((mod) => mod.role);

  const users = await UserModel.find({ _id: { $in: moderatorsIDs } }).select('avatar username _id about createdAt');

  // Combine banned users with their modRole
  const usersWithModRole = users.map((user, index) => ({
    ...user.toObject(),
    modRole: modRole[index],
  }));

  return { status: true, users: usersWithModRole };
}

/**
 * Retrieves the IDs and attributes of the users who are not banned in a community.
 *
 * @param {string} communityName - The name of the community.
 * @return {Promise<{status: boolean, users?: {avatar: string, username: string, _id: string, about: string, createdAt: Date}[]}>} - A promise that resolves to an object with the status of the operation and the not banned users' IDs and attributes, if successful.
 */
export async function getCommunityMembers(communityName: string) {
  // Find the community by name
  const community = await findCommunityByName(communityName);

  // If community is not found, return status false
  if (!community || !community.members) {
    return { status: false };
  }

  // Extract the IDs of not banned users
  const notBannedUsers = community.members.filter((member) => member.isBanned?.value !== true);
  const userIDs = notBannedUsers.map((member) => member.userID);

  // Fetch the not banned users from the database, selecting specific attributes
  const users = await UserModel.find({ _id: { $in: userIDs } }).select('avatar username _id about createdAt');

  return { status: true, users };
}

/**
 * Edits the rules of a community.
 *
 * @param subreddit - The name of the subreddit to edit the rules for.
 * @param rules - An array of CommunityRule objects representing the new rules for the subreddit.
 * @returns An object with a status indicating the success of the operation. If the operation was successful, the status will be true. If an error occurred, the status will be false and the error property will contain the error message.
 */
export async function editCommunityRules(subreddit: string, rules: CommunityRule[]) {
  const community = await findCommunityByName(subreddit);

  if (!community) {
    return {
      status: false,
      error: 'user not found',
    };
  }

  try {
    const updatedCommunity = await CommunityModel.findByIdAndUpdate(
      community._id,
      { communityRules: rules },
      { new: true }
    );
  } catch (error) {
    return {
      status: false,
      error: error,
    };
  }
  return {
    status: true,
  };
}

/**
 * Edits the removal reasons of a community.
 *
 * @param subreddit - The name of the subreddit.
 * @param reasons - An array of removal reasons.
 * @returns An object with the status of the operation.
 *          - If the community is not found, the status will be false and the error will be 'user not found'.
 *          - If an error occurs during the update, the status will be false and the error will be the error object.
 *          - If the update is successful, the status will be true.
 */
export async function editCommunityRemovalReasons(subreddit: string, reasons: removalReason[]) {
  const community = await findCommunityByName(subreddit);

  if (!community) {
    return {
      status: false,
      error: 'user not found',
    };
  }

  try {
    const updatedCommunity = await CommunityModel.findByIdAndUpdate(
      community._id,
      { removalReasons: reasons },
      { new: true }
    );
  } catch (error) {
    return {
      status: false,
      error: error,
    };
  }
  return {
    status: true,
  };
}

/**
 * Edits the categories of a community.
 *
 * @param subreddit - The name of the subreddit to edit.
 * @param cats - An array of CommunityRule objects representing the new categories.
 * @returns An object with a status indicating the success of the operation. If the operation was successful, the status will be true. If an error occurred, the status will be false and the error field will contain the error message.
 */
export async function editCommunityCategories(subreddit: string, cats: CommunityRule[]) {
  const community = await findCommunityByName(subreddit);

  if (!community) {
    return {
      status: false,
      error: 'user not found',
    };
  }

  try {
    const updatedCommunity = await CommunityModel.findByIdAndUpdate(community._id, { categories: cats }, { new: true });
  } catch (error) {
    return {
      status: false,
      error: error,
    };
  }
  return {
    status: true,
  };
}

/**
 * Edits the image widgets of a community.
 *
 * @param subreddit - The name of the subreddit (community) to edit.
 * @param widgets - An array of ImageWidget objects representing the new image widgets.
 * @returns An object with a status indicating the success of the operation. If the operation is successful, the status will be true. If there is an error, the status will be false and the error property will contain the error message.
 */
export async function editCommunityImageWidgets(subreddit: string, widgets: ImageWidget[]) {
  const community = await findCommunityByName(subreddit);

  if (!community) {
    return {
      status: false,
      error: 'user not found',
    };
  }

  try {
    const updatedCommunity = await CommunityModel.findByIdAndUpdate(
      community._id,
      { ImageWidget: widgets },
      { new: true }
    );
  } catch (error) {
    return {
      status: false,
      error: error,
    };
  }
  return {
    status: true,
  };
}

/**
 * Edits the text widgets of a community.
 *
 * @param subreddit - The name of the subreddit (community) to edit.
 * @param widgets - An array of TextWidget objects representing the new text widgets.
 * @returns An object with a status indicating the success of the operation. If the operation is successful, the status will be true. If an error occurs, the status will be false and an error message will be provided.
 */
export async function editCommunityTextWidgets(subreddit: string, widgets: TextWidget[]) {
  const community = await findCommunityByName(subreddit);

  if (!community) {
    return {
      status: false,
      error: 'user not found',
    };
  }

  try {
    const updatedCommunity = await CommunityModel.findByIdAndUpdate(
      community._id,
      { TextWidget: widgets },
      { new: true }
    );
  } catch (error) {
    return {
      status: false,
      error: error,
    };
  }
  return {
    status: true,
  };
}

/**
 * Edits the button widgets of a community.
 *
 * @param subreddit - The name of the subreddit/community.
 * @param widgets - An array of button widgets to be updated.
 * @returns An object with the status of the operation. If the operation is successful, the status will be true. If there is an error, the status will be false and the error message will be provided.
 */
export async function editCommunityButtonWidgets(subreddit: string, widgets: ButtonWidget[]) {
  const community = await findCommunityByName(subreddit);

  if (!community) {
    return {
      status: false,
      error: 'user not found',
    };
  }

  try {
    const updatedCommunity = await CommunityModel.findByIdAndUpdate(
      community._id,
      { ButtonWidget: widgets },
      { new: true }
    );
  } catch (error) {
    return {
      status: false,
      error: error,
    };
  }
  return {
    status: true,
  };
}

/**
 * Edits the post settings of a community.
 *
 * @param subreddit - The name of the community.
 * @param settings - The new post settings to be applied.
 * @returns An object with the status of the operation. If the community is not found, the status will be false and an error message will be provided. If an error occurs during the update, the status will be false and the error will be included in the response. Otherwise, the status will be true.
 */
export async function editCommunityPostSettings(subreddit: string, settings: PostSettings) {
  const community = await findCommunityByName(subreddit);

  if (!community) {
    return {
      status: false,
      error: 'user not found',
    };
  }

  try {
    const updatedCommunity = await CommunityModel.findByIdAndUpdate(
      community._id,
      { PostSettings: settings },
      { new: true }
    );
  } catch (error) {
    return {
      status: false,
      error: error,
    };
  }
  return {
    status: true,
  };
}

/**
 * Edits the content controls of a community.
 *
 * @param subreddit - The name of the subreddit/community.
 * @param controls - The new content controls to be applied.
 * @returns An object with the status of the operation. If the operation is successful, the status will be true. If there is an error, the status will be false and the error message will be provided.
 */
export async function editCommunityContentControls(subreddit: string, controls: ContentControls) {
  const community = await findCommunityByName(subreddit);

  if (!community) {
    return {
      status: false,
      error: 'user not found',
    };
  }

  try {
    const updatedCommunity = await CommunityModel.findByIdAndUpdate(
      community._id,
      { ContentControls: controls },
      { new: true }
    );
  } catch (error) {
    return {
      status: false,
      error: error,
    };
  }
  return {
    status: true,
  };
}

/**
 * Edits the details of a community.
 *
 * @param {string} subreddit - The name of the subreddit to edit.
 * @param {Details} details - The new details for the subreddit.
 * @returns {Object} - An object indicating the status of the operation.
 *   - status: A boolean indicating whether the operation was successful.
 *   - error: If status is false, this will contain the error message.
 */
export async function editCommunitydetails(subreddit: string, details: Details) {
  const community = await findCommunityByName(subreddit);

  if (!community) {
    return {
      status: false,
      error: 'user not found',
    };
  }

  try {
    const updatedCommunity = await CommunityModel.findByIdAndUpdate(community._id, { Details: details }, { new: true });
  } catch (error) {
    return {
      status: false,
      error: error,
    };
  }
  return {
    status: true,
  };
}

/**
 *  mark Spam Post
 * @param {string} body contain rules details
 * @param {string} user user information
 * @return {Object} state
 * @function
 */
export async function markSpamPost(userID: string, subreddit: string, postID: string, type: string) {
  const community = await findCommunityByName(subreddit);
  const post = await findPostById(postID);

  if (!community) {
    return {
      status: false,
      error: 'user not found',
    };
  }

  if (!post) {
    return {
      status: false,
      error: 'post not found',
    };
  }

  const spamPost = {
    spammerID: post.userID,
    postID: post._id,
    spamType: type,
    spamText: post.textHTML,
  };

  try {
    const updatedCommunity = await CommunityModel.findByIdAndUpdate(
      community._id,
      { $addToSet: { spamPosts: spamPost } },
      { upsert: true, new: true }
    );
  } catch (error) {
    return {
      status: false,
      error: error,
    };
  }
  return {
    status: true,
  };
}

/**
 *  mark Spam Comment
 * @param {string} body contain rules details
 * @param {string} user user information
 * @return {Object} state
 * @function
 */
export async function markSpamComment(userID: string, subreddit: string, commentID: string, type: string) {
  const community = await findCommunityByName(subreddit);
  const comment = await findCommentById(commentID);

  if (!community) {
    return {
      status: false,
      error: 'user not found',
    };
  }

  if (!comment) {
    return {
      status: false,
      error: 'comment not found',
    };
  }

  const spamComment = {
    spammerID: comment.authorId,
    postID: comment.postID,
    commentID: comment._id,
    spamType: type,
    spamText: comment.textHTML,
  };

  try {
    const updatedCommunity = await CommunityModel.findByIdAndUpdate(
      community._id,
      { $addToSet: { spamComments: spamComment } },
      { upsert: true, new: true }
    );
  } catch (error) {
    return {
      status: false,
      error: error,
    };
  }
  return {
    status: true,
  };
}
/**
 * Approves a spam post in a subreddit.
 *
 * @param {string} postID - The ID of the post to be approved.
 * @param {string} subreddit - The name of the subreddit where the post belongs.
 * @returns {Object} - An object indicating the status of the approval.
 *   - status: A boolean indicating whether the approval was successful.
 *   - error: An error message if the approval failed.
 */
export async function approveSpamPost(postID: string, subreddit: string) {
  const community = await findCommunityByName(subreddit);
  const post = await findPostById(postID);

  if (!community) {
    return {
      status: false,
      error: 'community not found',
    };
  }

  if (!post) {
    return {
      status: false,
      error: 'post not found',
    };
  }

  try {
    const updatedCommunity = await CommunityModel.findByIdAndUpdate(
      community._id,
      { $pull: { spamPosts: { postID: post._id } } },
      { new: true }
    );
  } catch (error) {
    return {
      status: false,
      error: error,
    };
  }
  return {
    status: true,
  };
}

/**
 * Approves a spam comment in a subreddit.
 *
 * @param {string} commentID - The ID of the comment to be approved.
 * @param {string} subreddit - The name of the subreddit where the comment belongs.
 * @returns {Object} - An object with the status of the operation and an optional error message.
 *   - status: A boolean indicating whether the operation was successful.
 *   - error: An optional error message if an error occurred during the operation.
 */
export async function approveSpamComment(commentID: string, subreddit: string) {
  const community = await findCommunityByName(subreddit);
  const comment = await findCommentById(commentID);

  if (!community) {
    return {
      status: false,
      error: 'community not found',
    };
  }

  if (!comment) {
    return {
      status: false,
      error: 'comment not found',
    };
  }

  try {
    const updatedCommunity = await CommunityModel.findByIdAndUpdate(
      community._id,
      { $pull: { spamComments: { commentID: comment._id } } },
      { new: true }
    );
  } catch (error) {
    return {
      status: false,
      error: error,
    };
  }
  return {
    status: true,
  };
}

/**
 *  mark Spam Post
 * @param {string} body contain rules details
 * @param {string} user user information
 * @return {Object} state
 * @function
 */
export async function addUserToPending(userID: string, subreddit: string) {
  const community = await findCommunityByName(subreddit);
  const user = await UserModel.findById(userID);

  if (!user) {
    return {
      status: false,
      error: 'user not found',
    };
  }

  if (!community) {
    return {
      status: false,
      error: 'user not found',
    };
  }

  try {
    const updatedCommunity = await CommunityModel.findByIdAndUpdate(
      community._id,
      { $addToSet: { pendingMembers: user._id } },
      { upsert: true, new: true }
    );
  } catch (error) {
    return {
      status: false,
      error: error,
    };
  }
  return {
    status: true,
  };
}

/**
 * Retrieves search results for subreddits when the user is not authenticated.
 *
 * @param query - The search query string.
 * @param page - The page number of the search results.
 * @param limit - The maximum number of search results to retrieve per page.
 * @returns An array of community results matching the search query.
 * @throws An error if there was an issue retrieving the search results.
 */
export async function getSrSearchResultNotAuth(query: string, page: number, limit: number) {
  //user not logged in
  try {
    const communityResults = await CommunityModel.find({
      $or: [{ name: { $regex: query, $options: 'i' } }, { description: { $regex: query, $options: 'i' } }],
      privacyType: 'Public',
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .select('icon name membersCnt description');
    return communityResults;
  } catch (error) {
    return error;
  }
}

/**
 * Retrieves search results for a user's communities based on a query.
 *
 * @param {string} query - The search query.
 * @param {number} page - The page number of the search results.
 * @param {number} limit - The maximum number of search results per page.
 * @param {string} userID - The ID of the user.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of community search results.
 * @throws {Error} - If an error occurs while retrieving the search results.
 */
export async function getSrSearchResultAuth(query: string, page: number, limit: number, userID: string) {
  try {
    const skip = (page - 1) * limit;
    const userCommunitiesSearchRes = await CommunityModel.aggregate([
      {
        $match: {
          $or: [
            { privacyType: 'Public' }, // Match public communities
            { 'members.userID': userID }, // Match communities where the user is a member
            { 'moderators.userID': userID }, // Match communities where the user is a moderator
          ],
        },
      },
      {
        $match: {
          $or: [
            { name: { $regex: query, $options: 'i' } }, // Match communities by name
            { description: { $regex: query, $options: 'i' } }, // Match communities by description
          ],
        },
      },
      {
        $project: {
          name: 1,
          description: 1,
          icon: 1,
          membersCnt: 1,
        },
      },
      { $skip: skip },
      { $limit: limit },
    ]);
    return userCommunitiesSearchRes;
  } catch (error) {
    return error;
  }
}
/**
 * Retrieves search results for posts for non-authenticated users.
 *
 * @param {number} page - The page number of the search results.
 * @param {number} limit - The maximum number of search results to return per page.
 * @param {string} query - The search query.
 * @param {string | undefined} sort - The sorting criteria for the search results.
 * @param {string | undefined} topBy - The additional criteria for sorting the search results by top.
 * @returns {Promise<Array<Object>>} - An array of search results for posts.
 * @throws {appError} - If there is an error retrieving the search results.
 */
export async function getPostsSearchResultsNotAuth(
  page: number,
  limit: number,
  query: string,
  sort: string | undefined,
  topBy: string | undefined
) {
  try {
    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    let sortCriteria: Record<string, 1 | -1>;
    let additionalCriteria: Record<string, unknown> = {};

    switch (sort) {
      case 'hot':
        sortCriteria = { 'posts.insightCnt': -1 };
        break;
      case 'top':
        sortCriteria = { 'posts.votesCount': -1 };
        switch (topBy) {
          case 'hour':
            additionalCriteria = { 'posts.createdAt': { $gte: new Date(Date.now() - 60 * 60 * 1000) } };
            break;
          case 'day':
            additionalCriteria = { 'posts.createdAt': { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } };
            break;
          case 'week':
            additionalCriteria = { 'posts.createdAt': { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
            break;
          case 'month':
            additionalCriteria = { 'posts.createdAt': { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
            break;
          case 'year':
            additionalCriteria = { 'posts.createdAt': { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } };
            break;
          default:
            additionalCriteria = {};
            break;
        }
        break;
      case 'new':
        sortCriteria = { 'posts.createdAt': -1 };
        break;
      case 'comments':
        sortCriteria = { 'posts.commentsNum': -1 };
        break;
      default:
        sortCriteria = { 'posts.randomSort': -1 };
        break;
    }
    const userSearchPostsNotAuth = await CommunityModel.aggregate([
      {
        $match: {
          $or: [
            { privacyType: 'Public' }, // Match public communities
          ],
        },
      },
      {
        $lookup: {
          from: 'posts', // Posts collection
          localField: 'communityPosts', // Field containing post IDs in the community model
          foreignField: '_id', // Field in the posts model
          as: 'posts', // Name of the field to store posts in the result
        },
      },
      { $unwind: '$posts' }, // Unwind the posts array
      {
        $match: {
          $or: [
            { 'posts.title': { $regex: query, $options: 'i' } }, // Match posts by title
            { 'posts.textHTML': { $regex: query, $options: 'i' } }, // Match posts by body
          ],
          'posts.isHidden': { $ne: true }, // Exclude posts with isHidden set to true
          'posts.isDeleted': { $ne: true }, // Exclude posts with isDeleted set to true
          'posts.createdAt': { $lte: new Date() },
          ...additionalCriteria, // Apply additional criteria
        },
      },
      { $sort: sortCriteria }, // Apply sorting criteria
      { $skip: skip }, // Skip documents based on page and limit
      { $limit: limit }, // Limit the number of documents returned
      {
        $project: {
          communityIcon: '$icon', // Project community icon
          communityName: '$name', // Project community name
          communityDescription: '$description', // Project community description
          memberCount: '$membersCnt', // Project member count
          postId: '$posts._id', // Project post ID
          userId: '$posts.userID', // Project user ID
          username: '$posts.username', // Project username
          title: '$posts.title', // Project post title
          textHTML: '$posts.textHTML', // Project post textHTML
          textJSON: '$posts.textJSON', // Project post textJSON
          isDeleted: '$posts.isDeleted', // Project post isDeleted
          attachments: '$posts.attachments', // Project post attachments
          poll: '$posts.poll', // Project post poll
          spoiler: '$posts.spoiler', // Project post spoiler
          isLocked: '$posts.isLocked', // Project post isLocked
          type: '$posts.type', // Project post type
          nsfw: '$posts.nsfw', // Project post nsfw
          isHidden: '$posts.isHidden', // Project post isHidden
          insightCnt: '$posts.insightCnt', // Project post insightCnt
          spamCount: '$posts.spamCount', // Project post spamCount
          votesCount: '$posts.votesCount', // Project post votesCount
          createdAt: '$posts.createdAt', // Project post createdAt
          editedAt: '$posts.editedAt', // Project post editedAt
          followers: '$posts.followers', // Project post followers
          CommunityID: '$posts.CommunityID', // Project post CommunityID
          commentsNum: '$posts.commentsNum', // Project post commentsNum
        },
      },
    ]);
    return userSearchPostsNotAuth;
  } catch (error) {
    throw new appError('homepage posts not auth', 400);
  }
}

/**
 * Retrieves search results for posts with authentication.
 *
 * @param {number} page - The page number of the search results.
 * @param {number} limit - The maximum number of search results to return per page.
 * @param {string} userID - The ID of the user performing the search.
 * @param {string} query - The search query.
 * @param {string | undefined} sort - The sorting criteria for the search results.
 * @param {string | undefined} topBy - The additional criteria for sorting the search results by top.
 * @param {Ref<Post>[] | undefined} hiddenPosts - An array of hidden post IDs.
 * @returns {Promise<any>} - The search results for posts.
 * @throws {appError} - If an error occurs during the search.
 */
export async function getPostsSearchResultsAuth(
  page: number,
  limit: number,
  userID: string,
  query: string,
  sort: string | undefined,
  topBy: string | undefined,
  hiddenPosts: Ref<Post>[] | undefined
) {
  try {
    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    let sortCriteria: Record<string, 1 | -1>;
    let additionalCriteria: Record<string, unknown> = {};

    switch (sort) {
      case 'hot':
        sortCriteria = { 'posts.insightCnt': -1 };
        break;
      case 'top':
        sortCriteria = { 'posts.votesCount': -1 };
        switch (topBy) {
          case 'hour':
            additionalCriteria = { 'posts.createdAt': { $gte: new Date(Date.now() - 60 * 60 * 1000) } };
            break;
          case 'day':
            additionalCriteria = { 'posts.createdAt': { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } };
            break;
          case 'week':
            additionalCriteria = { 'posts.createdAt': { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
            break;
          case 'month':
            additionalCriteria = { 'posts.createdAt': { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
            break;
          case 'year':
            additionalCriteria = { 'posts.createdAt': { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } };
            break;
          default:
            additionalCriteria = {};
            break;
        }
        break;
      case 'new':
        sortCriteria = { 'posts.createdAt': -1 };
        break;
      case 'comments':
        sortCriteria = { 'posts.commentsNum': -1 };
        break;
      default:
        sortCriteria = { 'posts.randomSort': -1 };
        break;
    }
    const userPostsSearchAuthRes = await CommunityModel.aggregate([
      {
        $match: {
          $or: [
            { privacyType: 'Public' }, // Match public communities
            { 'members.userID': userID }, // Match communities where the user is a member
            { 'moderators.userID': userID }, // Match communities where the user is a moderator
          ],
        },
      },
      {
        $lookup: {
          from: 'posts', // Posts collection
          localField: 'communityPosts', // Field containing post IDs in the community model
          foreignField: '_id', // Field in the posts model
          as: 'posts', // Name of the field to store posts in the result
        },
      },
      { $unwind: '$posts' }, // Unwind the posts array
      {
        $match: {
          $or: [
            { 'posts.title': { $regex: query, $options: 'i' } }, // Match posts by title
            { 'posts.textHTML': { $regex: query, $options: 'i' } }, // Match posts by body
          ],
          'posts.isDeleted': { $ne: true }, // Exclude posts with isDeleted set to true
          'posts.createdAt': { $lte: new Date() },
          'posts._id': { $nin: hiddenPosts ?? [] }, // Check if post ID is not in hiddenPosts array
          ...additionalCriteria, // Apply additional criteria
        },
      },
      { $sort: sortCriteria }, // Apply sorting criteria
      { $skip: skip }, // Skip documents based on page and limit
      { $limit: limit }, // Limit the number of documents returned
      {
        $project: {
          communityIcon: '$icon', // Project community icon
          communityName: '$name', // Project community name
          communityDescription: '$description', // Project community description
          memberCount: '$membersCnt', // Project member count
          postId: '$posts._id', // Project post ID
          userId: '$posts.userID', // Project user ID
          username: '$posts.username', // Project username
          title: '$posts.title', // Project post title
          textHTML: '$posts.textHTML', // Project post textHTML
          textJSON: '$posts.textJSON', // Project post textJSON
          isDeleted: '$posts.isDeleted', // Project post isDeleted
          attachments: '$posts.attachments', // Project post attachments
          poll: '$posts.poll', // Project post poll
          spoiler: '$posts.spoiler', // Project post spoiler
          isLocked: '$posts.isLocked', // Project post isLocked
          type: '$posts.type', // Project post type
          nsfw: '$posts.nsfw', // Project post nsfw
          isHidden: '$posts.isHidden', // Project post isHidden
          insightCnt: '$posts.insightCnt', // Project post insightCnt
          spamCount: '$posts.spamCount', // Project post spamCount
          votesCount: '$posts.votesCount', // Project post votesCount
          createdAt: '$posts.createdAt', // Project post createdAt
          editedAt: '$posts.editedAt', // Project post editedAt
          followers: '$posts.followers', // Project post followers
          CommunityID: '$posts.CommunityID', // Project post CommunityID
          commentsNum: '$posts.commentsNum', // Project post commentsNum
        },
      },
    ]);
    return userPostsSearchAuthRes;
  } catch (error) {
    throw new appError('Something went wrong in search posts auth', 500);
  }
}
/**
 * banMemberToCom
 * @param {string} body contain rules details
 * @param {string} user user information
 * @return {Object} state
 * @function
 */
export async function banUserInCommunity(
  userID: string,
  subreddit: string,
  reason: string,
  note: string,
  period: number
) {
  const community = await findCommunityByName(subreddit);

  if (!community) {
    return {
      status: false,
      error: 'user not found',
    };
  }

  const memInComm = {
    userID: userID,
    isMuted: {
      value: false,
      date: new Date(),
      reason: 'member is not muted',
    },
    isBanned: {
      value: true,
      date: new Date(),
      reason: reason,
      note: note,
      period: period,
    },
  };

  try {
    const updatedCommunity = await CommunityModel.findByIdAndUpdate(
      community._id,
      { $pull: { members: { userID: userID } } },
      { new: true }
    );
    const updatedCommunity2 = await CommunityModel.findByIdAndUpdate(
      community._id,
      { $addToSet: { members: memInComm } },
      { upsert: true, new: true }
    );
  } catch (error) {
    return {
      status: false,
      error: error,
    };
  }
  return {
    status: true,
  };
}

/**
 * unbanMemberToCom
 * @param {string} body contain rules details
 * @param {string} user user information
 * @return {Object} state
 * @function
 */
export async function unbanUserInCommunity(userID: string, subreddit: string) {
  const community = await findCommunityByName(subreddit);

  if (!community) {
    return {
      status: false,
      error: 'user not found',
    };
  }
  const memInComm = {
    userID: userID,
    isMuted: {
      value: false,
      date: new Date(),
      reason: 'member is not muted',
    },
    isBanned: {
      value: false,
      date: new Date(),
      reason: 'member not banned',
      note: 'member not banned',
      period: 'member not banned',
    },
  };
  try {
    const updatedCommunity = await CommunityModel.findByIdAndUpdate(
      community._id,
      { $pull: { members: { userID: userID } } },
      { new: true }
    );
    const updatedCommunity2 = await CommunityModel.findByIdAndUpdate(
      community._id,
      { $addToSet: { members: memInComm } },
      { upsert: true, new: true }
    );
  } catch (error) {
    return {
      status: false,
      error: error,
    };
  }
  return {
    status: true,
  };
}

/**
 * banMemberToCom
 * @param {string} body contain rules details
 * @param {string} user user information
 * @return {Object} state
 * @function
 */
export async function muteUserInCommunity(userID: string, subreddit: string, reason: string) {
  const community = await findCommunityByName(subreddit);

  if (!community) {
    return {
      status: false,
      error: 'user not found',
    };
  }

  const memInComm = {
    userID: userID,
    isMuted: {
      value: true,
      date: new Date(),
      reason: reason,
    },
    isBanned: {
      value: false,
      date: new Date(),
      reason: 'member not banned',
      note: 'member not banned',
      period: 'member not banned',
    },
  };

  try {
    const updatedCommunity = await CommunityModel.findByIdAndUpdate(
      community._id,
      { $pull: { members: { userID: userID } } },
      { new: true }
    );
    const updatedCommunity2 = await CommunityModel.findByIdAndUpdate(
      community._id,
      { $addToSet: { members: memInComm } },
      { upsert: true, new: true }
    );
  } catch (error) {
    return {
      status: false,
      error: error,
    };
  }
  return {
    status: true,
  };
}

/**
 * unbanMemberToCom
 * @param {string} body contain rules details
 * @param {string} user user information
 * @return {Object} state
 * @function
 */
export async function unmuteUserInCommunity(userID: string, subreddit: string) {
  const community = await findCommunityByName(subreddit);

  if (!community) {
    return {
      status: false,
      error: 'user not found',
    };
  }
  const memInComm = {
    userID: userID,
    isMuted: {
      value: false,
      date: new Date(),
      reason: 'member is not muted',
    },
    isBanned: {
      value: false,
      date: new Date(),
      reason: 'member not banned',
      note: 'member not banned',
      period: 'member not banned',
    },
  };
  try {
    const updatedCommunity = await CommunityModel.findByIdAndUpdate(
      community._id,
      { $pull: { members: { userID: userID } } },
      { new: true }
    );
    const updatedCommunity2 = await CommunityModel.findByIdAndUpdate(
      community._id,
      { $addToSet: { members: memInComm } },
      { upsert: true, new: true }
    );
  } catch (error) {
    return {
      status: false,
      error: error,
    };
  }
  return {
    status: true,
  };
}

/**
 * Retrieves home posts for an authenticated user.
 *
 * @param {number} page - The page number of the posts to retrieve.
 * @param {number} limit - The maximum number of posts to retrieve per page.
 * @param {string} userID - The ID of the authenticated user.
 * @param {string | undefined} sort - The sorting criteria for the posts. Possible values are 'hot', 'top', 'best', 'new', or undefined.
 * @param {string | undefined} topBy - The time frame for sorting 'top' posts. Possible values are 'hour', 'day', 'week', 'month', 'year', or undefined.
 * @param {Ref<Post>[] | undefined} hiddenPosts - An array of hidden post IDs for the authenticated user.
 * @returns {Promise<any>} - A promise that resolves to an array of home posts for the authenticated user.
 * @throws {appError} - Throws an appError with a status code of 404 if there is an error retrieving the posts.
 */
export async function getHomePostsAuth(
  page: number,
  limit: number,
  userID: string,
  sort: string | undefined,
  topBy: string | undefined,
  hiddenPosts: Ref<Post>[] | undefined
) {
  //   What is the difference between the different sort options?
  // "Hot" posts are sorted by number of views.
  // "Top" posts are sorted by upvotes but they have an option of sorting by time where you can choose to view within a specific time frame.
  // "Best" is just a normal feed with random sorting.
  // "New" should be sorted according to time (by the most recent) not an option like in "Top".

  try {
    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    let sortCriteria: Record<string, 1 | -1>;
    let additionalCriteria: Record<string, unknown> = {};
    switch (sort) {
      case 'hot':
        sortCriteria = { 'posts.insightCnt': -1 };
        break;
      case 'top':
        sortCriteria = { 'posts.votesCount': -1 };
        switch (topBy) {
          case 'hour':
            console.log('top by hour');
            additionalCriteria = { 'posts.createdAt': { $gte: new Date(Date.now() - 60 * 60 * 1000) } };
            break;
          case 'day':
            additionalCriteria = { 'posts.createdAt': { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } };
            break;
          case 'week':
            additionalCriteria = { 'posts.createdAt': { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
            break;
          case 'month':
            additionalCriteria = { 'posts.createdAt': { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
            break;
          case 'year':
            additionalCriteria = { 'posts.createdAt': { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } };
            break;
          default:
            additionalCriteria = {};
            break;
        }
        break;
      case 'best':
        //sort randomly
        sortCriteria = { 'posts.randomSort': -1 };
        break;
      case 'new':
        sortCriteria = { 'posts.createdAt': -1 };
        break;
      default:
        sortCriteria = { 'posts.randomSort': -1 };
        break;
    }
    const userHomePosts = await CommunityModel.aggregate([
      {
        $match: {
          $or: [
            { privacyType: 'Public' }, // Match public communities
            { 'members.userID': userID }, // Match communities where the user is a member
            { 'moderators.userID': userID }, // Match communities where the user is a moderator
          ],
        },
      },
      {
        $lookup: {
          from: 'posts', // Posts collection
          localField: 'communityPosts', // Field containing post IDs in the community model
          foreignField: '_id', // Field in the posts model
          as: 'posts', // Name of the field to store posts in the result
        },
      },
      { $unwind: '$posts' }, // Unwind the posts array
      {
        $match: {
          'posts.title': { $exists: true }, // Filter out posts without titles (optional)
          'posts.isDeleted': { $ne: true }, // Exclude posts with isDeleted set to true
          'posts.createdAt': { $lte: new Date() },
          'posts._id': { $nin: hiddenPosts ?? [] }, // Check if post ID is not in hiddenPosts array
          ...additionalCriteria, // Apply additional criteria
        },
      },
      { $sort: sortCriteria }, // Apply sorting criteria
      { $skip: skip }, // Skip documents based on page and limit
      { $limit: limit }, // Limit the number of documents returned
      {
        $project: {
          communityIcon: '$icon', // Project community icon
          communityName: '$name', // Project community name
          communityDescription: '$description', // Project community description
          memberCount: '$membersCnt', // Project member count
          postId: '$posts._id', // Project post ID
          userID: { _id: '$posts.userID' }, // Project user ID
          username: '$posts.username', // Project username
          title: '$posts.title', // Project post title
          textHTML: '$posts.textHTML', // Project post textHTML
          textJSON: '$posts.textJSON', // Project post textJSON
          isDeleted: '$posts.isDeleted', // Project post isDeleted
          attachments: '$posts.attachments', // Project post attachments
          poll: '$posts.poll', // Project post poll
          spoiler: '$posts.spoiler', // Project post spoiler
          isLocked: '$posts.isLocked', // Project post isLocked
          type: '$posts.type', // Project post type
          nsfw: '$posts.nsfw', // Project post nsfw
          isHidden: '$posts.isHidden', // Project post isHidden
          insightCnt: '$posts.insightCnt', // Project post insightCnt
          spamCount: '$posts.spamCount', // Project post spamCount
          votesCount: '$posts.votesCount', // Project post votesCount
          createdAt: '$posts.createdAt', // Project post createdAt
          editedAt: '$posts.editedAt', // Project post editedAt
          followers: '$posts.followers', // Project post followers
          CommunityID: '$posts.CommunityID', // Project post CommunityID
          commentsNum: '$posts.commentsNum', // Project post commentsNum
        },
      },
    ]);
    return userHomePosts;
  } catch (error) {
    console.log(error);
    throw new appError('Post error for auth user', 404);
  }
}

/**
 * Retrieves a random set of posts from public communities for the home page of a not authenticated user.
 *
 * @param {number} page - The page number of the results.
 * @param {number} limit - The maximum number of posts to return per page.
 * @return {Promise<Array<Object>>} A promise that resolves to an array of post objects with properties:
 *   - communityIcon: The icon of the community where the post was made.
 *   - postTitle: The title of the post.
 *   - postTextHTML: The HTML content of the post.
 *   - votesCount: The number of votes the post has received.
 *   - commentsNum: The number of comments the post has.
 *   - attachments: The attachments associated with the post.
 */
export async function getHomePostsNotAuth(page: number, limit: number) {
  const skip = (page - 1) * limit; // Calculate the number of documents to skip

  const randomPosts = await CommunityModel.aggregate([
    {
      $match: {
        privacyType: 'Public',
      },
    },
    {
      //left outer join with posts collection
      $lookup: {
        from: 'posts', //  posts collection
        localField: 'communityPosts', //name of the posts field in the community model
        foreignField: '_id', //name of the _id field in the posts model
        as: 'posts', //name of the posts field in the result
      },
    },
    { $unwind: '$posts' }, // Unwind the posts array
    {
      $match: {
        'posts.title': { $exists: true }, // Filter out posts without title
        'posts.isHidden': { $ne: true }, // Exclude posts with isHidden set to true
        'posts.isDeleted': { $ne: true }, // Exclude posts with isDeleted set to true
        'posts.createdAt': { $lte: new Date() },
      },
    },
    { $sample: { size: limit } }, // Limit the number of posts per community
    { $skip: skip }, // Skip documents based on page and limit
    {
      $project: {
        communityIcon: '$icon', // Project community icon
        communityName: '$name', // Project community name
        communityDescription: '$description', // Project community description
        memberCount: '$membersCnt', // Project member count
        postId: '$posts._id', // Project post ID
        userID: { _id: '$posts.userID' }, // Project user ID
        username: '$posts.username', // Project username
        title: '$posts.title', // Project post title
        textHTML: '$posts.textHTML', // Project post textHTML
        textJSON: '$posts.textJSON', // Project post textJSON
        isDeleted: '$posts.isDeleted', // Project post isDeleted
        attachments: '$posts.attachments', // Project post attachments
        poll: '$posts.poll', // Project post poll
        spoiler: '$posts.spoiler', // Project post spoiler
        isLocked: '$posts.isLocked', // Project post isLocked
        type: '$posts.type', // Project post type
        nsfw: '$posts.nsfw', // Project post nsfw
        isHidden: '$posts.isHidden', // Project post isHidden
        insightCnt: '$posts.insightCnt', // Project post insightCnt
        spamCount: '$posts.spamCount', // Project post spamCount
        votesCount: '$posts.votesCount', // Project post votesCount
        createdAt: '$posts.createdAt', // Project post createdAt
        editedAt: '$posts.editedAt', // Project post editedAt
        followers: '$posts.followers', // Project post followers
        CommunityID: '$posts.CommunityID', // Project post CommunityID
        commentsNum: '$posts.commentsNum', // Project post commentsNum
      },
    },
  ]);
  return randomPosts;
}

/**
 * Finds user posts by username with pagination support.
 *
 * @param name - The username of the user to find posts for.
 * @param page - The page number for pagination.
 * @param count - The number of posts per page.
 * @returns post ids of the user by username for the specified page.
 */
export async function communityPostIDs(name: string, page: number, count: number) {
  // Calculate skip based on page and count
  const skip = (page - 1) * count;

  // Find the user by username and retrieve their user submitted posts with pagination
  const community = await CommunityModel.findOne({ name: name }, 'communityPosts')
    .lean()
    .populate({
      path: 'communityPosts',
      options: { skip: skip, limit: count },
    });

  // If user is not found, throw an error
  if (!community) {
    throw new appError("This community doesn't exist!", 404);
  }

  // Extract the post IDs from the user's submitted posts if it exists
  const postIDs = community.communityPosts ? community.communityPosts.map((post) => post._id.toString()) : [];

  // Return the post IDs
  return postIDs;
}

/**
 * Retrieves the moderator of a community based on the community name and moderator username.
 *
 * @param {string} communityName - The name of the community.
 * @param {string} username - The username of the moderator.
 * @returns {Object} - An object containing the status and moderator information.
 *                    - If the moderator is found, the status will be true and the moderator information will be included.
 *                    - If the moderator is not found or the community is not found, the status will be false.
 */
export async function getCommunityModerator(communityName: string, username: string) {
  // Find the community by name
  const community = await findCommunityByName(communityName);

  const moderatorr = await findUserByUsername(username);

  if (!moderatorr) {
    return { status: false };
  }
  // If community is not found, return status false
  if (!community || !community.moderators) {
    return { status: false };
  }
  const userID = moderatorr._id.toString();

  // Find the moderator with the given username in the community moderators array
  const mode = community.moderators.find((mod) => mod.userID?.toString() == userID);

  // If moderator not found, return status false
  if (!mode) {
    return { status: false };
  }

  return { status: true, moderator: mode };
}

/**
 * Retrieves subreddit search posts based on the provided parameters.
 *
 * @param {string} communityName - The name of the community to search in.
 * @param {number} page - The page number of the search results.
 * @param {number} limit - The maximum number of search results to return per page.
 * @param {string} query - The search query to match against post titles and bodies.
 * @param {string | undefined} sort - The sorting criteria for the search results. Possible values are 'hot', 'top', 'new', 'comments', or undefined for default sorting.
 * @param {string | undefined} topBy - The time period to filter the search results. Possible values are 'hour', 'day', 'week', 'month', 'year', or undefined for all time.
 * @param {Ref<Post>[] | undefined} hiddenPosts - An array of post IDs to exclude from the search results.
 * @returns {Promise<any>} - A promise that resolves to an array of subreddit search posts.
 * @throws {appError} - If an error occurs during the search posts operation.
 */
export async function getSubredditSearchPosts(
  communityName: string,
  page: number,
  limit: number,
  query: string,
  sort: string | undefined,
  topBy: string | undefined,
  hiddenPosts: Ref<Post>[] | undefined
) {
  try {
    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    let sortCriteria: Record<string, 1 | -1>;
    let additionalCriteria: Record<string, unknown> = {};

    switch (sort) {
      case 'hot':
        sortCriteria = { 'posts.insightCnt': -1 };
        break;
      case 'top':
        sortCriteria = { 'posts.votesCount': -1 };

        break;
      case 'new':
        sortCriteria = { 'posts.createdAt': -1 };
        break;
      case 'comments':
        sortCriteria = { 'posts.commentsNum': -1 };
        break;
      default:
        sortCriteria = { 'posts.randomSort': -1 };
        break;
    }
    switch (topBy) {
      case 'hour':
        additionalCriteria = { 'posts.createdAt': { $gte: new Date(Date.now() - 60 * 60 * 1000) } };
        break;
      case 'day':
        additionalCriteria = { 'posts.createdAt': { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } };
        break;
      case 'week':
        additionalCriteria = { 'posts.createdAt': { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
        break;
      case 'month':
        additionalCriteria = { 'posts.createdAt': { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
        break;
      case 'year':
        additionalCriteria = { 'posts.createdAt': { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } };
        break;
      default:
        //all time
        additionalCriteria = { 'posts.createdAt': { $gte: new Date(0) } };
        break;
    }
    const subredditSearchPosts = await CommunityModel.aggregate([
      {
        $match: {
          $or: [
            { name: communityName }, // Match public communities
          ],
        },
      },
      {
        $lookup: {
          from: 'posts', // Posts collection
          localField: 'communityPosts', // Field containing post IDs in the community model
          foreignField: '_id', // Field in the posts model
          as: 'posts', // Name of the field to store posts in the result
        },
      },
      { $unwind: '$posts' }, // Unwind the posts array
      {
        $match: {
          $or: [
            { 'posts.title': { $regex: query, $options: 'i' } }, // Match posts by title
            { 'posts.textHTML': { $regex: query, $options: 'i' } }, // Match posts by body
          ],
          'posts._id': { $nin: hiddenPosts ?? [] }, // Check if post ID is not in hiddenPosts array
          'posts.isDeleted': { $ne: true }, // Exclude posts with isDeleted set to true
          'posts.createdAt': { $lte: new Date() },
          ...additionalCriteria, // Apply additional criteria
        },
      },
      { $sort: sortCriteria }, // Apply sorting criteria
      { $skip: skip }, // Skip documents based on page and limit
      { $limit: limit }, // Limit the number of documents returned
      {
        $project: {
          CommunityID: '$posts.CommunityID', // Project post CommunityID
          communityIcon: '$icon', // Project community icon
          communityName: '$name', // Project community name
          communityDescription: '$description', // Project community description
          memberCount: '$membersCnt', // Project member count
          postId: '$posts._id', // Project post ID
          userId: '$posts.userID', // Project user ID
          username: '$posts.username', // Project username
          title: '$posts.title', // Project post title
          textHTML: '$posts.textHTML', // Project post textHTML
          textJSON: '$posts.textJSON', // Project post textJSON
          isDeleted: '$posts.isDeleted', // Project post isDeleted
          attachments: '$posts.attachments', // Project post attachments
          poll: '$posts.poll', // Project post poll
          spoiler: '$posts.spoiler', // Project post spoiler
          isLocked: '$posts.isLocked', // Project post isLocked
          type: '$posts.type', // Project post type
          nsfw: '$posts.nsfw', // Project post nsfw
          spamCount: '$posts.spamCount', // Project post spamCount
          votesCount: '$posts.votesCount', // Project post votesCount
          createdAt: '$posts.createdAt', // Project post createdAt
          editedAt: '$posts.editedAt', // Project post editedAt
          followers: '$posts.followers', // Project post followers
          commentsNum: '$posts.commentsNum', // Project post commentsNum
        },
      },
    ]);
    return subredditSearchPosts;
  } catch (error) {
    throw new appError('Something went wrong in search posts auth', 500);
  }
}

/**
 * Retrieves the trending searches based on the specified page and limit.
 *
 * @param {number} page - The page number to retrieve.
 * @param {number} limit - The maximum number of trending searches to return.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of trending searches.
 * @throws {appError} - If something goes wrong while retrieving the trending searches.
 */
export async function getTrendingSearches(page: number, limit: number) {
  try {
    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    const trendingSearches = await CommunityModel.aggregate([
      {
        $match: {
          $or: [
            { privacyType: 'Public' }, // Match public communities
          ],
        },
      },
      {
        $lookup: {
          from: 'posts', // Posts collection
          localField: 'communityPosts', // Field containing post IDs in the community model
          foreignField: '_id', // Field in the posts model
          as: 'posts', // Name of the field to store posts in the result
        },
      },
      { $unwind: '$posts' }, // Unwind the posts array
      {
        $match: {
          'posts.isDeleted': { $ne: true }, // Exclude posts with isDeleted set to true
          $and: [
            { 'posts.createdAt': { $lte: new Date() } }, // Posts created before or at the current date
            { 'posts.createdAt': { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }, // Posts created within the last 24 hours, TOP 24H
          ],
        },
      },
      { $sort: { 'posts.votesCount': -1 } }, // Apply sorting criteria
      { $skip: skip }, // Skip documents based on page and limit
      { $limit: limit }, // Limit the number of documents returned
      {
        $project: {
          CommunityID: '$posts.CommunityID', // Project post CommunityID
          communityIcon: '$icon', // Project community icon
          communityName: '$name', // Project community name
          postId: '$posts._id', // Project post ID
          userId: '$posts.userID', // Project user ID
          username: '$posts.username', // Project username
          title: '$posts.title', // Project post title
          textHTML: '$posts.textHTML', // Project post textHTML
          textJSON: '$posts.textJSON', // Project post textJSON
          attachments: '$posts.attachments', // Project post attachments
          poll: '$posts.poll', // Project post poll
          spoiler: '$posts.spoiler', // Project post spoiler
          isLocked: '$posts.isLocked', // Project post isLocked
          type: '$posts.type', // Project post type
          nsfw: '$posts.nsfw', // Project post nsfw
          spamCount: '$posts.spamCount', // Project post spamCount
          votesCount: '$posts.votesCount', // Project post votesCount
          createdAt: '$posts.createdAt', // Project post createdAt
          editedAt: '$posts.editedAt', // Project post editedAt
          followers: '$posts.followers', // Project post followers
          commentsNum: '$posts.commentsNum', // Project post commentsNum
        },
      },
    ]);
    return trendingSearches;
  } catch (error) {
    throw new appError('Something went wrong in trending searches', 500);
  }
}

/**
 * Retrieves popular posts based on specified criteria.
 *
 * @param {number} page - The page number of the results.
 * @param {number} limit - The maximum number of posts to retrieve per page.
 * @param {string | undefined} sort - The sorting criteria for the posts. Possible values are 'hot', 'top', 'best', 'new', or undefined.
 * @param {string | undefined} topBy - The time period to consider when sorting by 'top'. Possible values are 'hour', 'day', 'week', 'month', 'year', or undefined.
 * @param {Ref<Post>[] | undefined} hiddenPosts - An array of post IDs to exclude from the results.
 * @returns {Promise<any>} - A promise that resolves to an array of popular posts.
 * @throws {appError} - If an error occurs while retrieving the popular posts.
 */
export async function getPopular(
  page: number,
  limit: number,
  sort: string | undefined,
  topBy: string | undefined,
  hiddenPosts: Ref<Post>[] | undefined
) {
  try {
    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    console.log(hiddenPosts);
    let sortCriteria: Record<string, 1 | -1>;
    let additionalCriteria: Record<string, unknown> = {};
    switch (sort) {
      case 'hot':
        sortCriteria = { 'posts.insightCnt': -1 };
        break;
      case 'top':
        sortCriteria = { 'posts.votesCount': -1 };
        switch (topBy) {
          case 'hour':
            additionalCriteria = { 'posts.createdAt': { $gte: new Date(Date.now() - 60 * 60 * 1000) } };
            break;
          case 'day':
            additionalCriteria = { 'posts.createdAt': { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } };
            break;
          case 'week':
            additionalCriteria = { 'posts.createdAt': { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
            break;
          case 'month':
            additionalCriteria = { 'posts.createdAt': { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } };
            break;
          case 'year':
            additionalCriteria = { 'posts.createdAt': { $gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) } };
            break;
          default:
            additionalCriteria = {};
            break;
        }
        break;
      case 'best':
        //sort randomly
        sortCriteria = { 'posts.randomSort': -1 };
        break;
      case 'new':
        sortCriteria = { 'posts.createdAt': -1 };
        break;
      default:
        sortCriteria = { 'posts.randomSort': -1 };
        break;
    }
    const popularPosts = await CommunityModel.aggregate([
      {
        $match: {
          $or: [
            { privacyType: 'Public' }, // Match public communities
          ],
        },
      },
      {
        $lookup: {
          from: 'posts', // Posts collection
          localField: 'communityPosts', // Field containing post IDs in the community model
          foreignField: '_id', // Field in the posts model
          as: 'posts', // Name of the field to store posts in the result
        },
      },
      { $unwind: '$posts' }, // Unwind the posts array
      {
        $match: {
          'posts.title': { $exists: true }, // Filter out posts without titles (optional)
          'posts.isDeleted': { $ne: true }, // Exclude posts with isDeleted set to true
          'posts.createdAt': { $lte: new Date() },
          'posts.nsfw': { $ne: true }, //popular page should not contain nsfw posts
          //handle posts that are hidden
          'posts._id': { $nin: hiddenPosts ?? [] }, // Check if post ID is not in hiddenPosts array
          ...additionalCriteria, // Apply additional criteria
        },
      },
      { $sort: sortCriteria }, // Apply sorting criteria
      { $skip: skip }, // Skip documents based on page and limit
      { $limit: limit }, // Limit the number of documents returned
      {
        $project: {
          CommunityID: '$posts.CommunityID', // Project post CommunityID
          communityIcon: '$icon', // Project community icon
          communityName: '$name', // Project community name
          communityDescription: '$description', // Project community description
          memberCount: '$membersCnt', // Project member count
          postId: '$posts._id', // Project post ID
          userId: '$posts.userID', // Project user ID
          username: '$posts.username', // Project username
          title: '$posts.title', // Project post title
          textHTML: '$posts.textHTML', // Project post textHTML
          textJSON: '$posts.textJSON', // Project post textJSON
          isDeleted: '$posts.isDeleted', // Project post isDeleted
          attachments: '$posts.attachments', // Project post attachments
          poll: '$posts.poll', // Project post poll
          spoiler: '$posts.spoiler', // Project post spoiler
          isLocked: '$posts.isLocked', // Project post isLocked
          type: '$posts.type', // Project post type
          nsfw: '$posts.nsfw', // Project post nsfw
          spamCount: '$posts.spamCount', // Project post spamCount
          votesCount: '$posts.votesCount', // Project post votesCount
          createdAt: '$posts.createdAt', // Project post createdAt
          editedAt: '$posts.editedAt', // Project post editedAt
          followers: '$posts.followers', // Project post followers
          commentsNum: '$posts.commentsNum', // Project post commentsNum
        },
      },
    ]);
    return popularPosts;
  } catch (error) {
    throw new appError('Something went wrong in popular page', 500);
  }
}
