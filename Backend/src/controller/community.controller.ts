import {
  findCommunityByName,
  findCommunityByID,
  getUserCommunities,
  createSubreddit,
  addMemberToCom,
  addModeratorToCom,
  updateModeratorToCom,
  addUserToPending,
  removeMemberFromCom,
  removeModeratorFromCom,
  getUsersAsBannedInCommunity,
  getUsersAsMutedInCommunity,
  getCommunityModerators,
  getCommunityMembers,
  editCommunityRules,
  editCommunityRemovalReasons,
  editCommunityCategories,
  markSpamPost,
  markSpamComment,
  approveSpamPost,
  approveSpamComment,
  banUserInCommunity,
  unbanUserInCommunity,
  muteUserInCommunity,
  unmuteUserInCommunity,
  getBannedUserInCommunity,
  getMutedUserInCommunity,
  editCommunityButtonWidgets,
  editCommunityContentControls,
  editCommunityImageWidgets,
  editCommunityPostSettings,
  editCommunityTextWidgets,
  editCommunitydetails,
  communityPostIDs,
  getCommunityModerator,
} from '../service/community.service';
import {
  getCommunitiesIdOfUserAsMemeber,
  getCommunitiesIdOfUserAsModerator,
  getCommunitiesIdOfUserAsCreator,
  getFavoriteCommunitiesOfUser,
  addMemberToUser,
  addCreatorToUser,
  addModeratorToUser,
  updateModeratorToUser,
  addFavoriteToUser,
  removeMemberFromUser,
  removeModeratorFromUser,
  removeFavoriteFromUser,
  findUserById,
  findUserByUsername,
  banUserInUser,
  unbanUserInUser,
  muteUserInUser,
  unmuteUserInUser,
} from '../service/user.service';

import { Community, CommunityModel } from '../model/community.model';
import { Moderator, UserModel } from '../model/user.model';
import { NextFunction, Request, Response } from 'express';
import { findPostById, communityPosts } from '../service/post.service';
import { findCommentById } from '../service/comment.service';
import PostModel from '../model/posts.model';
import CommentModel from '../model/comments.model';
import appError from '../utils/appError';
import { omit, shuffle } from 'lodash';

/**
 * Retrieves the communities that a user is a member of.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} A promise that resolves when the communities are retrieved and sent in the response.
 */
export async function getCommunityOfUserAsMemeberHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const user = res.locals.user;
    // Check if user is missing or invalid
    if (!user) {
      return res.status(400).json({
        status: 'failed',
        message: 'Access token is missing or invalid',
      });
    }
    const communities = await getCommunitiesIdOfUserAsMemeber(user.username);

    res.status(200).json({ communities });
  } catch (error) {
    console.error('Error in getCommunityOfUserHandler:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
}

/**
 * Handles the request to get the communities of a user as a moderator.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise that resolves when the function is complete.
 */
export async function getCommunityOfUserAsModeratorHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const user = res.locals.user;
    // Check if user is missing or invalid
    if (!user) {
      return res.status(400).json({
        status: 'failed',
        message: 'Access token is missing or invalid',
      });
    }
    const communities = await getCommunitiesIdOfUserAsModerator(user.username);

    res.status(200).json({ communities });
  } catch (error) {
    console.error('Error in getCommunityOfUserHandler:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
}

/**
 * Handles the request to get the communities of a user as a creator.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise that resolves when the function is complete.
 */
export async function getCommunityOfUserAsCreatorHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const user = res.locals.user;
    // Check if user is missing or invalid
    if (!user) {
      return res.status(400).json({
        status: 'failed',
        message: 'Access token is missing or invalid',
      });
    }
    const communities = await getCommunitiesIdOfUserAsCreator(user.username);

    res.status(200).json({ communities });
  } catch (error) {
    console.error('Error in getCommunityOfUserAsCreatorHandler:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
}

/**
 * Retrieves the communities that a user is a member of.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} A promise that resolves when the communities are retrieved and sent in the response.
 */
export async function getCommunityOfOtherUserAsMemeberHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const user = res.locals.user;
    // Check if user is missing or invalid
    if (!user) {
      return res.status(400).json({
        status: 'failed',
        message: 'Access token is missing or invalid',
      });
    }
    const communities = await getCommunitiesIdOfUserAsMemeber(req.params.username);

    res.status(200).json({ communities });
  } catch (error) {
    console.error('Error in getCommunityOfUserHandler:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
}

/**
 * Handles the request to get the communities of a user as a moderator.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise that resolves when the function is complete.
 */
export async function getCommunityOfOtherUserAsModeratorHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const user = res.locals.user;
    // Check if user is missing or invalid
    if (!user) {
      return res.status(400).json({
        status: 'failed',
        message: 'Access token is missing or invalid',
      });
    }
    const communities = await getCommunitiesIdOfUserAsModerator(req.params.username);

    res.status(200).json({ communities });
  } catch (error) {
    console.error('Error in getCommunityOfUserHandler:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
}

/**
 * Handles the request to get the communities of a user as a creator.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise that resolves when the function is complete.
 */
export async function getCommunityOfOtherUserAsCreatorHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const user = res.locals.user;
    // Check if user is missing or invalid
    if (!user) {
      return res.status(400).json({
        status: 'failed',
        message: 'Access token is missing or invalid',
      });
    }
    const communities = await getCommunitiesIdOfUserAsCreator(req.params.username);

    res.status(200).json({ communities });
  } catch (error) {
    console.error('Error in getCommunityOfUserAsCreatorHandler:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
}

/**
 * Retrieves the moderator of a community.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns The moderator of the community.
 * @throws {Error} If there is an error retrieving the moderator.
 */
export async function getModeratorHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }

  try {
    const user = res.locals.user;
    // Check if user is missing or invalid
    if (!user) {
      return res.status(400).json({
        status: 'failed',
        message: 'Access token is missing or invalid',
      });
    }
    const subreddit = req.params.subreddit;
    const username = req.params.username;
    const community = await findCommunityByName(req.params.subreddit);
    const user2 = await findUserByUsername(req.params.username);

    // Check if subreddit is provided
    if (!community) {
      return res.status(402).json({
        error: 'Community not found',
      });
    }

    // Check if username is provided
    if (!user2) {
      return res.status(400).json({
        status: 'failed',
        message: 'Username is a required parameter',
      });
    }

    // Additional validation if necessary

    const moderator = await getCommunityModerator(subreddit, username);

    if (!moderator.status) {
      return res.status(500).json({});
    }
    res.status(200).json({ moderator });
  } catch (error) {
    console.error('Error in getCommunityOfUserHandler:', error);
    return res.status(501).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
}

/**
 * Handles the request to get the community name.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise that resolves when the function is complete.
 */
export async function getCommunityNameHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const user = res.locals.user;
    const communityID = req.body.communityID;
    const community = await findCommunityByID(communityID);
    // Check if user is missing or invalid
    if (!user) {
      return res.status(400).json({
        status: 'failed',
        message: 'Access token is missing or invalid',
      });
    }

    // Check if subreddit is missing or invalid
    if (!community) {
      return res.status(402).json({
        error: 'Community not found',
      });
    }
    const communityName = community.name;
    res.status(200).json({ communityName });
  } catch (error) {
    console.error('Error in getCommunityOfUserAsCreatorHandler:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
}

/**
 * Create subreddit handler.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise of a void.
 */
export async function createSubredditHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  // Get user ID from request
  const userID = res.locals.user._id;
  const user = res.locals.user;

  // Check if user is missing or invalid
  if (!user) {
    return res.status(401).json({
      error: 'Access token is missing or invalid',
    });
  }
  const comm = await findCommunityByName(req.body.name);
  if (comm) {
    return res.status(403).json({
      error: 'Community name already taken',
    });
  }
  if (user.canCreateSubreddit === false) {
    return res.status(403).json({
      error: 'User can not create subreddit',
    });
  }
  // Create subreddit
  try {
    const result = await createSubreddit(req.body.name, req.body.type, req.body.over18, userID);

    // Handle creation failure
    if (!result.status) {
      return res.status(500).json({
        error: result.error,
      });
    }

    if (!result.createdCommunity) {
      return res.status(400).json({
        error: result.error,
      });
    }
    // Add user to subreddit
    const updateUser = await addCreatorToUser(user, result.createdCommunity._id.toString());

    // Handle user addition failure
    if (updateUser.status === false) {
      return res.status(500).json({
        error: updateUser.error,
      });
    }
    const community = result.createdCommunity;
    // Return success response
    return res.status(200).json({
      community,
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error creating subreddit:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}

/**
 * Subscribe subreddit handler.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise of a void.
 */
export async function subscribeCommunityHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  // Get user ID from request
  const userID = res.locals.user._id;
  const user = res.locals.user;
  const subreddit = req.params.subreddit;
  const community = await findCommunityByName(subreddit);

  // Check if subreddit is missing or invalid
  if (!community) {
    return res.status(402).json({
      error: 'Community not found',
    });
  }

  if (community.privacyType === 'Private') {
    const updateUser = await addUserToPending(userID, subreddit);
    if (updateUser.status === false) {
      return res.status(500).json({
        error: updateUser.error,
      });
    }
    // Return success response
    return res.status(200).json({
      status: 'succeeded',
    });
  }
  // Check if user is missing or invalid
  if (!user) {
    return res.status(401).json({
      error: 'Access token is missing or invalid',
    });
  }
  try {
    const updateUser = await addMemberToUser(userID, subreddit);
    const updateUser1 = await addMemberToCom(userID, subreddit);

    // Handle user addition failure
    if (updateUser.status === false || updateUser1.status === false) {
      return res.status(500).json({
        error: updateUser.error,
      });
    }
    // Return success response
    return res.status(200).json({
      status: 'succeeded',
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error adding member to subreddit:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}

/**
 * unsubscribe subreddit handler.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise of a void.
 */
export async function unsubscribeCommunityHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  // Get user ID from request
  const userID = res.locals.user._id;
  const user = res.locals.user;
  const subreddit = req.params.subreddit;
  const community = await findCommunityByName(subreddit);

  // Check if subreddit is missing or invalid
  if (!community) {
    return res.status(402).json({
      error: 'Community not found',
    });
  }

  // Check if user is missing or invalid
  if (!user) {
    return res.status(401).json({
      error: 'Access token is missing or invalid',
    });
  }
  try {
    const updateUser = await removeMemberFromUser(userID, subreddit);
    const updateUser1 = await removeMemberFromCom(userID, subreddit);

    // Handle user addition failure
    if (updateUser.status === false || updateUser1.status === false) {
      return res.status(500).json({
        error: updateUser.error,
      });
    }
    // Return success response
    return res.status(200).json({
      status: 'succeeded',
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error removing member from subreddit:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}

/**
 * Retrieves information about a community.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 * @throws {Error} - If there is an error retrieving the community information.
 */
export async function getCommunityHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const userID = res.locals.user._id;
    const user = res.locals.user;
    const subreddit = req.params.subreddit;
    const community = await findCommunityByName(subreddit);

    // Check if user is missing or invalid
    if (!user) {
      return res.status(401).json({
        error: 'Access token is missing or invalid',
      });
    }
    if (!community) {
      return res.status(402).json({
        error: 'Community not found',
      });
    }
    return res.status(200).json({
      community,
    });
  } catch (error) {
    console.error('Error in getCommunityInfoHandler:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
}

/**
 * Retrieves all communities and their information.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 * @throws {Error} - If there is an error retrieving the communities.
 */
export async function getAllCommunityHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const userID = res.locals.user._id;
    const user = res.locals.user;

    // Check if user is missing or invalid
    if (!user) {
      return res.status(401).json({
        error: 'Access token is missing or invalid',
      });
    }

    const communities = await CommunityModel.aggregate([
      {
        $project: {
          name: 1,
          categories: 1,
          count: { $size: '$members' },
          icon: 1,
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    return res.status(200).json({
      communities,
    });
  } catch (error) {
    console.error('Error in getCommunityInfoHandler:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
}

/**
 * ban handler.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise of a void.
 */
export async function banHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  // Get user ID from request
  const userID = res.locals.user._id;
  const user = res.locals.user;
  const subreddit = req.params.subreddit;
  const community = await findCommunityByName(subreddit);
  const username = req.params.username;
  const banned = await findUserByUsername(username);
  const reason = req.body.reason;
  const note = req.body.note;
  const period = req.body.period;

  // Check if subreddit is missing or invalid
  if (!community) {
    return res.status(402).json({
      error: 'Community not found',
    });
  }

  // Check if user is missing or invalid
  if (!user) {
    return res.status(401).json({
      error: 'Access token is missing or invalid',
    });
  }

  // Check if user is missing or invalid
  if (!banned) {
    return res.status(401).json({
      error: 'User not found',
    });
  }

  let isMod = false;

  if (community.moderators) {
    community.moderators.forEach((el) => {
      // Check if userID is defined and equal to commModerator
      if (el.userID?.toString() === user._id?.toString()) isMod = true;
    });
  }
  if (isMod === false) {
    return res.status(404).json({ status: 'error', message: 'Members can not ban other members' });
  }
  const bannedID = banned._id.toString();
  try {
    const updateUser = await banUserInCommunity(bannedID, subreddit, reason, note, period);
    const updateUser2 = await banUserInUser(bannedID, subreddit, reason, note, period);
    // Handle user addition failure
    if (updateUser.status === false || updateUser2.status === false) {
      return res.status(500).json({
        error: 'Error in banning user',
      });
    }
    // Return success response
    return res.status(200).json({
      status: 'succeeded',
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error banning member in subreddit:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}

/**
 * unban handler.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise of a void.
 */
export async function unbanHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  // Get user ID from request
  const userID = res.locals.user._id;
  const user = res.locals.user;
  const subreddit = req.params.subreddit;
  const community = await findCommunityByName(subreddit);
  const username = req.params.username;
  const banned = await findUserByUsername(username);

  // Check if subreddit is missing or invalid
  if (!community) {
    return res.status(402).json({
      error: 'Community not found',
    });
  }

  // Check if user is missing or invalid
  if (!user) {
    return res.status(401).json({
      error: 'Access token is missing or invalid',
    });
  }

  // Check if user is missing or invalid
  if (!banned) {
    return res.status(401).json({
      error: 'User not found',
    });
  }

  let isMod = false;

  if (community.moderators) {
    community.moderators.forEach((el) => {
      // Check if userID is defined and equal to commModerator
      if (el.userID?.toString() === user._id?.toString()) isMod = true;
    });
  }
  if (isMod === false) {
    return res.status(404).json({ status: 'error', message: 'Members can not ban other members' });
  }
  const bannedID = banned._id.toString();
  try {
    const updateUser = await unbanUserInCommunity(bannedID, subreddit);
    const updateUser2 = await unbanUserInUser(bannedID, subreddit);
    // Handle user addition failure
    if (updateUser.status === false || updateUser2.status === false) {
      return res.status(500).json({
        error: 'Error in banning user',
      });
    }
    // Return success response
    return res.status(200).json({
      status: 'succeeded',
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error banning member in subreddit:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}

/**
 * mute handler.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise of a void.
 */
export async function muteHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  // Get user ID from request
  const userID = res.locals.user._id;
  const user = res.locals.user;
  const subreddit = req.params.subreddit;
  const community = await findCommunityByName(subreddit);
  const username = req.params.username;
  const banned = await findUserByUsername(username);
  const reason = req.body.reason;

  // Check if subreddit is missing or invalid
  if (!community) {
    return res.status(402).json({
      error: 'Community not found',
    });
  }

  // Check if user is missing or invalid
  if (!user) {
    return res.status(401).json({
      error: 'Access token is missing or invalid',
    });
  }

  // Check if user is missing or invalid
  if (!banned) {
    return res.status(401).json({
      error: 'User not found',
    });
  }

  let isMod = false;

  if (community.moderators) {
    community.moderators.forEach((el) => {
      // Check if userID is defined and equal to commModerator
      if (el.userID?.toString() === user._id?.toString()) isMod = true;
    });
  }
  if (isMod === false) {
    return res.status(404).json({ status: 'error', message: 'Members can not mute other members' });
  }
  const bannedID = banned._id.toString();
  try {
    const updateUser = await muteUserInCommunity(bannedID, subreddit, reason);
    const updateUser2 = await muteUserInUser(bannedID, subreddit, reason);
    // Handle user addition failure
    if (updateUser.status === false || updateUser2.status === false) {
      return res.status(500).json({
        error: 'Error in muting user',
      });
    }
    // Return success response
    return res.status(200).json({
      status: 'succeeded',
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error muting member in subreddit:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}

/**
 * unban handler.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise of a void.
 */
export async function unmuteHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  // Get user ID from request
  const userID = res.locals.user._id;
  const user = res.locals.user;
  const subreddit = req.params.subreddit;
  const community = await findCommunityByName(subreddit);
  const username = req.params.username;
  const banned = await findUserByUsername(username);

  // Check if subreddit is missing or invalid
  if (!community) {
    return res.status(402).json({
      error: 'Community not found',
    });
  }

  // Check if user is missing or invalid
  if (!user) {
    return res.status(401).json({
      error: 'Access token is missing or invalid',
    });
  }

  // Check if user is missing or invalid
  if (!banned) {
    return res.status(401).json({
      error: 'User not found',
    });
  }

  let isMod = false;

  if (community.moderators) {
    community.moderators.forEach((el) => {
      // Check if userID is defined and equal to commModerator
      if (el.userID?.toString() === user._id?.toString()) isMod = true;
    });
  }
  if (isMod === false) {
    return res.status(404).json({ status: 'error', message: 'Members can not mute other members' });
  }
  const bannedID = banned._id.toString();
  try {
    const updateUser = await unmuteUserInCommunity(bannedID, subreddit);
    const updateUser2 = await unmuteUserInUser(bannedID, subreddit);
    // Handle user addition failure
    if (updateUser.status === false || updateUser2.status === false) {
      return res.status(500).json({
        error: 'Error in unmuting user',
      });
    }
    // Return success response
    return res.status(200).json({
      status: 'succeeded',
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error unmuting member in subreddit:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}

/**
 * Join Moderaor handler.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise of a void.
 */
export async function joinModeratorHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  // Get user ID from request
  const userID = res.locals.user._id;
  const user = res.locals.user;
  const subreddit = req.params.subreddit;
  const community = await findCommunityByName(subreddit);

  // Check if user is missing or invalid
  if (!user) {
    return res.status(401).json({
      error: 'Access token is missing or invalid',
    });
  }

  // Check if subreddit is missing or invalid
  if (!community) {
    return res.status(402).json({
      error: 'Community not found',
    });
  }

  try {
    const updateUser = await addModeratorToUser(userID, subreddit);
    const updateUser1 = await addModeratorToCom(userID, subreddit);

    // Handle user addition failure
    if (updateUser.status === false || updateUser1.status === false) {
      return res.status(500).json({
        error: updateUser.error,
      });
    }
    // Return success response
    return res.status(200).json({
      status: 'succeeded',
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error member joining moderation:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}

/**
 * edit Moderaor handler.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise of a void.
 */
export async function editModeratorHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  // Get user ID from request
  const userID = res.locals.user._id;
  const user = res.locals.user;
  const subreddit = req.params.subreddit;
  const community = await findCommunityByName(subreddit);
  const info = req.body;

  // Check if user is missing or invalid
  if (!user) {
    return res.status(401).json({
      error: 'Access token is missing or invalid',
    });
  }

  // Check if subreddit is missing or invalid
  if (!community) {
    return res.status(402).json({
      error: 'Community not found',
    });
  }

  let isMod = false;

  if (community.moderators) {
    community.moderators.forEach((el) => {
      // Check if userID is defined and equal to commModerator
      if (el.userID?.toString() === user._id?.toString()) isMod = true;
    });
  }
  if (isMod === false) {
    return res.status(404).json({ status: 'error', message: 'Members can not change widgets' });
  }

  try {
    const updateUser = await updateModeratorToUser(userID, subreddit, info);
    const updateUser1 = await updateModeratorToCom(userID, subreddit, info);

    // Handle user addition failure
    if (updateUser.status === false || updateUser1.status === false) {
      return res.status(500).json({
        error: updateUser.error,
      });
    }
    // Return success response
    return res.status(200).json({
      status: 'succeeded',
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error editing moderation:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}

/**
 * leave Moderaor handler.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise of a void.
 */
export async function leaveModeratorHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  // Get user ID from request
  const userID = res.locals.user._id;
  const user = res.locals.user;
  const subreddit = req.params.subreddit;
  const community = await findCommunityByName(subreddit);

  // Check if user is missing or invalid
  if (!user) {
    return res.status(401).json({
      error: 'Access token is missing or invalid',
    });
  }

  // Check if subreddit is missing or invalid
  if (!community) {
    return res.status(402).json({
      error: 'Community not found',
    });
  }

  try {
    const updateUser = await removeModeratorFromUser(userID, subreddit);
    const updateUser1 = await removeModeratorFromCom(userID, subreddit);

    // Handle user addition failure
    if (updateUser.status === false || updateUser1.status === false) {
      return res.status(500).json({
        error: updateUser.error,
      });
    }
    // Return success response
    return res.status(200).json({
      status: 'succeeded',
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error member joining moderation:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}

/**
 * Retrieves the list of users who are banned in a community.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} A promise that resolves when the function is complete.
 */
export async function getUsersIsbannedIncommunityHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const user = res.locals.user;
    const commName = req.params.subreddit;
    if (!commName) {
      return res.status(400).json({
        status: 'failed',
        message: 'Community not found',
      });
    }

    // Check if user is missing or invalid
    if (!user) {
      return res.status(400).json({
        status: 'failed',
        message: 'Access token is missing or invalid',
      });
    }

    const usersResult = await getUsersAsBannedInCommunity(commName);
    if (usersResult.status === true) {
      return res.status(200).json({ status: 'success', users: usersResult.users });
    } else {
      return res.status(404).json({
        status: 'error',
        message: 'error in get banned users',
      });
    }
  } catch (error) {
    console.error('Error in getUsersIsbannedIncommunityHandler:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
}

/**
 * Retrieves the list of users who are banned in a community.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} A promise that resolves when the function is complete.
 */
export async function getBannedMemberHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const user = res.locals.user;
    const subreddit = req.params.subreddit;
    const username = req.params.username;
    const banned = await findUserByUsername(username);

    if (!subreddit) {
      return res.status(400).json({
        status: 'failed',
        message: 'Community not found',
      });
    }

    // Check if user is missing or invalid
    if (!user) {
      return res.status(400).json({
        status: 'failed',
        message: 'Access token is missing or invalid',
      });
    }

    // Check if user is missing or invalid
    if (!banned) {
      return res.status(400).json({
        status: 'failed',
        message: 'user not found',
      });
    }
    const bannedID = banned._id.toString();
    const userResult = await getBannedUserInCommunity(bannedID, subreddit);
    if (userResult.status === true) {
      const user = userResult.userr;
      return res.status(200).json({ user });
    } else {
      return res.status(404).json({
        status: 'error',
        message: 'error in get banned users',
      });
    }
  } catch (error) {
    console.error('Error in getBannedUserInCommunity:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
}

/**
 * Retrieves the list of users who are banned in a community.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} A promise that resolves when the function is complete.
 */
export async function getUsersIsmutedIncommunityHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const user = res.locals.user;
    const commName = req.params.subreddit;
    if (!commName) {
      return res.status(400).json({
        status: 'failed',
        message: 'Community not found',
      });
    }

    // Check if user is missing or invalid
    if (!user) {
      return res.status(400).json({
        status: 'failed',
        message: 'Access token is missing or invalid',
      });
    }

    const usersResult = await getUsersAsMutedInCommunity(commName);
    if (usersResult.status === true) {
      return res.status(200).json({ status: 'success', users: usersResult.users });
    } else {
      return res.status(404).json({
        status: 'error',
        message: 'error in get muted users',
      });
    }
  } catch (error) {
    console.error('Error in getUsersIsmutedIncommunityHandler:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
}

/**
 * Retrieves the list of users who are banned in a community.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} A promise that resolves when the function is complete.
 */
export async function getMutedMemberHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const user = res.locals.user;
    const subreddit = req.params.subreddit;
    const username = req.params.username;
    const banned = await findUserByUsername(username);

    if (!subreddit) {
      return res.status(400).json({
        status: 'failed',
        message: 'Community not found',
      });
    }

    // Check if user is missing or invalid
    if (!user) {
      return res.status(400).json({
        status: 'failed',
        message: 'Access token is missing or invalid',
      });
    }

    // Check if user is missing or invalid
    if (!banned) {
      return res.status(400).json({
        status: 'failed',
        message: 'user not found',
      });
    }
    const bannedID = banned._id.toString();
    const userResult = await getMutedUserInCommunity(bannedID, subreddit);
    if (userResult.status === true) {
      const user = userResult.userr;
      return res.status(200).json({ user });
    } else {
      return res.status(404).json({
        status: 'error',
        message: 'error in get Muted user',
      });
    }
  } catch (error) {
    console.error('Error in getMutedUserInCommunity:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
}

/**
 * Retrieves the list of moderators for a given community.
 *
 * @param {Request} req - The request object containing the user's access token.
 * @param {Response} res - The response object used to send the list of moderators.
 * @return {Promise<void>} A promise that resolves when the list of moderators is sent.
 *                         If the access token is missing or invalid, a 400 error is returned.
 *                         If the community is not found, a 400 error is returned.
 *                         If there is an error retrieving the moderators, a 500 error is returned.
 */
export async function getModeratorsHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const user = res.locals.user;
    if (!user) {
      return res.status(400).json({
        status: 'failed',
        message: 'Access token is missing or invalid',
      });
    }
    const commName = req.params.subreddit;
    if (!commName) {
      return res.status(401).json({
        status: 'failed',
        message: 'Community not found',
      });
    }
    const Moderators = await getCommunityModerators(commName);
    if (Moderators.status === true) {
      return res.status(200).json({ status: 'success', Moderators });
    } else {
      return res.status(404).json({ status: 'error', message: 'error in get Moderators' });
    }
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

/**
 * Handles the request to get the members of a community.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise that resolves when the function is complete.
 */
export async function getMembersHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const user = res.locals.user;
    if (!user) {
      return res.status(400).json({
        status: 'failed',
        message: 'Access token is missing or invalid',
      });
    }
    const commName = req.params.subreddit;
    const community = await findCommunityByName(commName);

    if (!community) {
      return res.status(404).json({
        status: 'failed',
        message: 'Community not found',
      });
    }
    const users = await getCommunityMembers(commName);
    const membersCount = community.membersCnt;
    if (users.status === true) {
      const members = users.users;
      return res.status(200).json({ status: 'success', membersCount: membersCount, members });
    } else {
      return res.status(404).json({ status: 'error', message: 'error in get Members' });
    }
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

/**
 * Handles the request to edit the rules of a community.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise that resolves when the function is complete.
 */
export async function editCommunityRulesHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const user = res.locals.user;
    const rules = req.body.rules;
    const commName = req.params.subreddit;

    if (!user) {
      return res.status(400).json({
        status: 'failed',
        message: 'Access token is missing or invalid',
      });
    }

    const community = await findCommunityByName(commName);

    if (!community) {
      return res.status(404).json({
        status: 'failed',
        message: 'Community not found',
      });
    }

    let isMod = false;

    if (community.moderators) {
      community.moderators.forEach((el) => {
        // Check if userID is defined and equal to commModerator
        if (el.userID?.toString() === user._id?.toString()) isMod = true;
      });
    }
    if (isMod === false) {
      return res.status(404).json({ status: 'error', message: 'Members can not change rules' });
    }

    const result = await editCommunityRules(commName, rules);

    if (result.status === true) {
      return res.status(200).json({ status: 'succeeded' });
    } else {
      return res.status(404).json({ status: 'error', message: 'Error in changing rules' });
    }
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

/**
 * Handles the request to edit the text widget of a community.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise that resolves when the function is complete.
 */
export async function editTextWidgetsHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const user = res.locals.user;
    const widgets = req.body.widgets;
    const commName = req.params.subreddit;

    if (!user) {
      return res.status(400).json({
        status: 'failed',
        message: 'Access token is missing or invalid',
      });
    }

    const community = await findCommunityByName(commName);

    if (!community) {
      return res.status(404).json({
        status: 'failed',
        message: 'Community not found',
      });
    }

    let isMod = false;

    if (community.moderators) {
      community.moderators.forEach((el) => {
        // Check if userID is defined and equal to commModerator
        if (el.userID?.toString() === user._id?.toString()) isMod = true;
      });
    }
    if (isMod === false) {
      return res.status(404).json({ status: 'error', message: 'Members can not change widgets' });
    }

    const result = await editCommunityTextWidgets(commName, widgets);

    if (result.status === true) {
      return res.status(200).json({ status: 'succeeded' });
    } else {
      return res.status(404).json({ status: 'error', message: 'Error in changing widgets' });
    }
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

/**
 * Handles the request to edit the button widget of a community.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise that resolves when the function is complete.
 */
export async function editButtonWidgetsHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const user = res.locals.user;
    const widgets = req.body.widgets;
    const commName = req.params.subreddit;

    if (!user) {
      return res.status(400).json({
        status: 'failed',
        message: 'Access token is missing or invalid',
      });
    }

    const community = await findCommunityByName(commName);

    if (!community) {
      return res.status(404).json({
        status: 'failed',
        message: 'Community not found',
      });
    }

    let isMod = false;

    if (community.moderators) {
      community.moderators.forEach((el) => {
        // Check if userID is defined and equal to commModerator
        if (el.userID?.toString() === user._id?.toString()) isMod = true;
      });
    }
    if (isMod === false) {
      return res.status(404).json({ status: 'error', message: 'Members can not change widgets' });
    }

    const result = await editCommunityButtonWidgets(commName, widgets);

    if (result.status === true) {
      return res.status(200).json({ status: 'succeeded' });
    } else {
      return res.status(404).json({ status: 'error', message: 'Error in changing widgets' });
    }
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

/**
 * Handles the request to edit the post settings of a community.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise that resolves when the function is complete.
 */
export async function editPostSettingsHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const user = res.locals.user;
    const settings = req.body;
    const commName = req.params.subreddit;

    if (!user) {
      return res.status(400).json({
        status: 'failed',
        message: 'Access token is missing or invalid',
      });
    }

    const community = await findCommunityByName(commName);

    if (!community) {
      return res.status(404).json({
        status: 'failed',
        message: 'Community not found',
      });
    }

    let isMod = false;

    if (community.moderators) {
      community.moderators.forEach((el) => {
        // Check if userID is defined and equal to commModerator
        if (el.userID?.toString() === user._id?.toString()) isMod = true;
      });
    }
    if (isMod === false) {
      return res.status(404).json({ status: 'error', message: 'Members can not change post settings' });
    }

    const result = await editCommunityPostSettings(commName, settings);

    if (result.status === true) {
      return res.status(200).json({ status: 'succeeded' });
    } else {
      return res.status(404).json({ status: 'error', message: 'Error in changing post settings' });
    }
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

/**
 * Handles the request to edit the post settings of a community.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise that resolves when the function is complete.
 */
export async function editCommunityDetailsHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const user = res.locals.user;
    const details = req.body;
    const commName = req.params.subreddit;

    if (!user) {
      return res.status(400).json({
        status: 'failed',
        message: 'Access token is missing or invalid',
      });
    }

    const community = await findCommunityByName(commName);

    if (!community) {
      return res.status(404).json({
        status: 'failed',
        message: 'Community not found',
      });
    }

    let isMod = false;

    if (community.moderators) {
      community.moderators.forEach((el) => {
        // Check if userID is defined and equal to commModerator
        if (el.userID?.toString() === user._id?.toString()) isMod = true;
      });
    }
    if (isMod === false) {
      return res.status(404).json({ status: 'error', message: 'Members can not change details' });
    }

    const result = await editCommunitydetails(commName, details);

    if (result.status === true) {
      return res.status(200).json({ status: 'succeeded' });
    } else {
      return res.status(404).json({ status: 'error', message: 'Error in changing details' });
    }
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

/**
 * Handles the request to edit the content control of a community.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise that resolves when the function is complete.
 */
export async function editContentControlsHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const user = res.locals.user;
    const controls = req.body;
    const commName = req.params.subreddit;

    if (!user) {
      return res.status(400).json({
        status: 'failed',
        message: 'Access token is missing or invalid',
      });
    }

    const community = await findCommunityByName(commName);

    if (!community) {
      return res.status(404).json({
        status: 'failed',
        message: 'Community not found',
      });
    }

    let isMod = false;

    if (community.moderators) {
      community.moderators.forEach((el) => {
        // Check if userID is defined and equal to commModerator
        if (el.userID?.toString() === user._id?.toString()) isMod = true;
      });
    }
    if (isMod === false) {
      return res.status(404).json({ status: 'error', message: 'Members can not change content controls' });
    }

    const result = await editCommunityContentControls(commName, controls);

    if (result.status === true) {
      return res.status(200).json({ status: 'succeeded' });
    } else {
      return res.status(404).json({ status: 'error', message: 'Error in changing content controls' });
    }
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

/**
 * Handles the request to edit the image widget of a community.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise that resolves when the function is complete.
 */
export async function editImageWidgetsHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const user = res.locals.user;
    const widgets = req.body.widgets;
    const commName = req.params.subreddit;

    if (!user) {
      return res.status(400).json({
        status: 'failed',
        message: 'Access token is missing or invalid',
      });
    }

    const community = await findCommunityByName(commName);

    if (!community) {
      return res.status(404).json({
        status: 'failed',
        message: 'Community not found',
      });
    }

    let isMod = false;

    if (community.moderators) {
      community.moderators.forEach((el) => {
        // Check if userID is defined and equal to commModerator
        if (el.userID?.toString() === user._id?.toString()) isMod = true;
      });
    }
    if (isMod === false) {
      return res.status(404).json({ status: 'error', message: 'Members can not change widgets' });
    }

    const result = await editCommunityImageWidgets(commName, widgets);

    if (result.status === true) {
      return res.status(200).json({ status: 'succeeded' });
    } else {
      return res.status(404).json({ status: 'error', message: 'Error in changing rules' });
    }
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

/**
 * Handles the request to edit the removal rules of a community.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise that resolves when the function is complete.
 */
export async function editCommunityRemovalResonsHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const user = res.locals.user;
    const reasons = req.body.reasons;
    const commName = req.params.subreddit;

    if (!user) {
      return res.status(400).json({
        status: 'failed',
        message: 'Access token is missing or invalid',
      });
    }

    const community = await findCommunityByName(commName);

    if (!community) {
      return res.status(404).json({
        status: 'failed',
        message: 'Community not found',
      });
    }

    let isMod = false;

    if (community.moderators) {
      community.moderators.forEach((el) => {
        // Check if userID is defined and equal to commModerator
        if (el.userID?.toString() === user._id?.toString()) isMod = true;
      });
    }
    if (isMod === false) {
      return res.status(404).json({ status: 'error', message: 'Members can not change removal reasons' });
    }

    const result = await editCommunityRemovalReasons(commName, reasons);

    if (result.status === true) {
      return res.status(200).json({ status: 'succeeded' });
    } else {
      return res.status(404).json({ status: 'error', message: 'Error in changing removal reasons' });
    }
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

/**
 * Handles the request to edit the categories of a community.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise that resolves when the function is complete.
 */
export async function editCommunityCategoriesHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const user = res.locals.user;
    const categories = req.body.categories;
    const commName = req.params.subreddit;

    if (!user) {
      return res.status(400).json({
        status: 'failed',
        message: 'Access token is missing or invalid',
      });
    }

    const community = await findCommunityByName(commName);

    if (!community) {
      return res.status(404).json({
        status: 'failed',
        message: 'Community not found',
      });
    }

    let isMod = false;

    if (community.moderators) {
      community.moderators.forEach((el) => {
        // Check if userID is defined and equal to commModerator
        if (el.userID?.toString() === user._id?.toString()) isMod = true;
      });
    }
    if (isMod === false) {
      return res.status(404).json({ status: 'error', message: 'Members can not change rules' });
    }

    const result = await editCommunityCategories(commName, categories);

    if (result.status === true) {
      return res.status(200).json({ status: 'succeeded' });
    } else {
      return res.status(404).json({ status: 'error', message: 'Error in changing categories' });
    }
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

/**
 * favorite subreddit handler.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise of a void.
 */
export async function favoriteCommunityHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  // Get user ID from request
  const userID = res.locals.user._id;
  const user = res.locals.user;
  const subreddit = req.params.subreddit;
  const community = await findCommunityByName(subreddit);

  // Check if subreddit is missing or invalid
  if (!community) {
    return res.status(402).json({
      error: 'Community not found',
    });
  }

  // Check if user is missing or invalid
  if (!user) {
    return res.status(401).json({
      error: 'Access token is missing or invalid',
    });
  }
  try {
    const updateUser = await addFavoriteToUser(userID, subreddit);

    // Handle user addition failure
    if (updateUser.status === false) {
      return res.status(402).json({
        error: updateUser.error,
      });
    }
    // Return success response
    return res.status(200).json({
      status: 'succeeded',
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error adding subreddit to favorite:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}

/**
 * unfavorite subreddit handler.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise of a void.
 */
export async function unfavoriteCommunityHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  // Get user ID from request
  const userID = res.locals.user._id;
  const user = res.locals.user;
  const subreddit = req.params.subreddit;
  const community = await findCommunityByName(subreddit);

  // Check if subreddit is missing or invalid
  if (!community) {
    return res.status(402).json({
      error: 'Community not found',
    });
  }

  // Check if user is missing or invalid
  if (!user) {
    return res.status(401).json({
      error: 'Access token is missing or invalid',
    });
  }
  try {
    const updateUser = await removeFavoriteFromUser(userID, subreddit);

    // Handle user addition failure
    if (updateUser.status === false) {
      return res.status(402).json({
        error: updateUser.error,
      });
    }
    // Return success response
    return res.status(200).json({
      status: 'succeeded',
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error adding subreddit to favorite:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}

/**
 * Handles the request to get the favorite communities of a user.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise that resolves when the function is complete.
 */
export async function getFavoriteCommunitiesOfUserHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const userID = res.locals.user._id;
    const user = await findUserById(userID);
    // Check if user is missing or invalid
    if (!user) {
      return res.status(400).json({
        status: 'failed',
        message: 'Access token is missing or invalid',
      });
    }
    const communties = await getFavoriteCommunitiesOfUser(user.username);

    res.status(200).json({ communties });
  } catch (error) {
    console.error('Error in getCommunityOfUserHandler:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
}
/**
 * Handles the request to get the favorite communities of a user.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise that resolves when the function is complete.
 */
export async function getFavoriteCommunitiesOfOtherUserHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const userID = res.locals.user._id;
    const user = await findUserById(userID);
    // Check if user is missing or invalid
    if (!user) {
      return res.status(400).json({
        status: 'failed',
        message: 'Access token is missing or invalid',
      });
    }
    const communties = await getFavoriteCommunitiesOfUser(req.params.username);

    res.status(200).json({ communties });
  } catch (error) {
    console.error('Error in getCommunityOfUserHandler:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
}
/**
 * Handles the request to get spam posts of a community.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise that resolves when the function is complete.
 */
export async function getSpamPostsHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const user = res.locals.user;
    const subreddit = req.params.subreddit;
    const community = await findCommunityByName(subreddit);

    if (!user) {
      return res.status(400).json({
        status: 'failed',
        message: 'Access token is missing or invalid',
      });
    }

    if (!community) {
      return res.status(401).json({
        status: 'failed',
        message: 'Community not found',
      });
    }

    let isMod = false;
    if (community.moderators) {
      community.moderators.forEach((el) => {
        if (el.userID?.toString() === user._id?.toString()) isMod = true;
      });
    }
    if (isMod === false) {
      return res.status(404).json({ status: 'error', message: 'Members can not check spam' });
    }

    const posts = community.spamPosts;
    return res.status(200).json({ status: 'success', posts });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

/**
 * Handles the request to get spam comments of a community.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise that resolves when the function is complete.
 */
export async function getSpamCommentsHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const user = res.locals.user;
    const subreddit = req.params.subreddit;
    const community = await findCommunityByName(subreddit);

    if (!user) {
      return res.status(400).json({
        status: 'failed',
        message: 'Access token is missing or invalid',
      });
    }

    if (!community) {
      return res.status(401).json({
        status: 'failed',
        message: 'Community not found',
      });
    }

    let isMod = false;
    if (community.moderators) {
      community.moderators.forEach((el) => {
        if (el.userID?.toString() === user._id?.toString()) isMod = true;
      });
    }
    if (isMod === false) {
      return res.status(404).json({ status: 'error', message: 'Members can not check spam' });
    }

    const comments = community.spamComments;
    return res.status(200).json({ status: 'success', comments });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

/**
 * mark Spam Post Handler.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise of a void.
 */
export async function markSpamPostHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  // Get user ID from request
  const userID = res.locals.user._id;
  const user = res.locals.user;
  const subreddit = req.params.subreddit;
  const community = await findCommunityByName(subreddit);
  const postID = req.body.postID;
  const post = await findPostById(postID);
  const type = req.body.spamType;

  // Check if user is missing or invalid
  if (!user) {
    return res.status(401).json({
      error: 'Access token is missing or invalid',
    });
  }

  // Check if subreddit is missing or invalid
  if (!community) {
    return res.status(402).json({
      error: 'Community not found',
    });
  }

  // Check if post is missing or invalid
  if (!post) {
    return res.status(402).json({
      error: 'post not found',
    });
  }

  try {
    const result = await markSpamPost(userID, subreddit, postID, type);
    await PostModel.findByIdAndUpdate(post._id, { isHidden: true }, { upsert: true, new: true });

    // Handle user addition failure
    if (result.status === false) {
      return res.status(500).json({
        error: result.error,
      });
    }
    // Return success response
    return res.status(200).json({
      status: 'succeeded',
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error adding spam post to subreddit:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}

/**
 * mark Spam Comment Handler.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise of a void.
 */
export async function markSpamCommentHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  // Get user ID from request
  const userID = res.locals.user._id;
  const user = res.locals.user;
  const subreddit = req.params.subreddit;
  const community = await findCommunityByName(subreddit);
  const commentID = req.body.commentID;
  const comment = await findCommentById(commentID);
  const type = req.body.spamType;

  // Check if user is missing or invalid
  if (!user) {
    return res.status(401).json({
      error: 'Access token is missing or invalid',
    });
  }

  // Check if subreddit is missing or invalid
  if (!community) {
    return res.status(402).json({
      error: 'Community not found',
    });
  }

  // Check if comment is missing or invalid
  if (!comment) {
    return res.status(402).json({
      error: 'Comment not found',
    });
  }

  try {
    const result = await markSpamComment(userID, subreddit, commentID, type);
    await CommentModel.findByIdAndUpdate(comment._id, { isHidden: true }, { upsert: true, new: true });

    // Handle user addition failure
    if (result.status === false) {
      return res.status(500).json({
        error: result.error,
      });
    }
    // Return success response
    return res.status(200).json({
      status: 'succeeded',
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error adding spam comment to subreddit:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}

/**
 *  approve Spam Post Handler.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise of a void.
 */
export async function approveSpamPostHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  // Get user ID from request
  const userID = res.locals.user._id;
  const user = res.locals.user;
  const subreddit = req.params.subreddit;
  const postID = req.body.postID;
  const community = await findCommunityByName(subreddit);
  const post = await findPostById(postID);

  // Check if user is missing or invalid
  if (!user) {
    return res.status(401).json({
      error: 'Access token is missing or invalid',
    });
  }

  // Check if subreddit is missing or invalid
  if (!community) {
    return res.status(402).json({
      error: 'Community not found',
    });
  }

  // Check if post is missing or invalid
  if (!post) {
    return res.status(403).json({
      error: 'post not found',
    });
  }

  let isMod = false;
  if (community.moderators) {
    community.moderators.forEach((el) => {
      if (el.userID?.toString() === user._id?.toString()) isMod = true;
    });
  }
  if (isMod === false) {
    return res.status(404).json({ status: 'error', message: 'Members can not approve spam posts' });
  }

  try {
    const updateUser = await approveSpamPost(postID, subreddit);
    await PostModel.findByIdAndUpdate(post._id, { isHidden: false }, { upsert: true, new: true });

    // Handle user addition failure
    if (updateUser.status === false) {
      return res.status(500).json({
        error: updateUser.error,
      });
    }
    // Return success response
    return res.status(200).json({
      status: 'succeeded',
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error approving spam post:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}

/**
 *  approve Spam Comment Handler.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise of a void.
 */
export async function approveSpamCommentHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  // Get user ID from request
  const userID = res.locals.user._id;
  const user = res.locals.user;
  const subreddit = req.params.subreddit;
  const commentID = req.body.commentID;
  const community = await findCommunityByName(subreddit);
  const comment = await findCommentById(commentID);

  // Check if user is missing or invalid
  if (!user) {
    return res.status(401).json({
      error: 'Access token is missing or invalid',
    });
  }

  // Check if subreddit is missing or invalid
  if (!community) {
    return res.status(402).json({
      error: 'Community not found',
    });
  }

  // Check if post is missing or invalid
  if (!comment) {
    return res.status(402).json({
      error: 'Comment not found',
    });
  }

  let isMod = false;
  if (community.moderators) {
    community.moderators.forEach((el) => {
      if (el.userID?.toString() === user._id?.toString()) isMod = true;
    });
  }
  if (isMod === false) {
    return res.status(404).json({ status: 'error', message: 'Members can not approve spam posts' });
  }

  try {
    const updateUser = await approveSpamComment(commentID, subreddit);
    await CommentModel.findByIdAndUpdate(comment._id, { isHidden: false }, { upsert: true, new: true });

    // Handle user addition failure
    if (updateUser.status === false) {
      return res.status(500).json({
        error: updateUser.error,
      });
    }
    // Return success response
    return res.status(200).json({
      status: 'succeeded',
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error approving spam comment:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}

/**
 *  remove Spam Post Handler.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise of a void.
 */
export async function removeSpamPostHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  // Get user ID from request
  const userID = res.locals.user._id;
  const user = res.locals.user;
  const subreddit = req.params.subreddit;
  const postID = req.body.postID;
  const community = await findCommunityByName(subreddit);
  const post = await findPostById(postID);

  // Check if user is missing or invalid
  if (!user) {
    return res.status(401).json({
      error: 'Access token is missing or invalid',
    });
  }

  // Check if subreddit is missing or invalid
  if (!community) {
    return res.status(402).json({
      error: 'Community not found',
    });
  }

  // Check if post is missing or invalid
  if (!post) {
    return res.status(402).json({
      error: 'Post not found',
    });
  }

  let isMod = false;
  if (community.moderators) {
    community.moderators.forEach((el) => {
      if (el.userID?.toString() === user._id?.toString()) isMod = true;
    });
  }
  if (isMod === false) {
    return res.status(404).json({ status: 'error', message: 'Members can not remove spam posts' });
  }

  try {
    const updateUser = await approveSpamPost(postID, subreddit);
    await PostModel.findByIdAndUpdate(post._id, { isDeleted: true }, { upsert: true, new: true });

    // Handle user addition failure
    if (updateUser.status === false) {
      return res.status(500).json({
        error: updateUser.error,
      });
    }
    // Return success response
    return res.status(200).json({
      status: 'succeeded',
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error removing spam post:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}

/**
 * Removes a spam comment from a subreddit.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Response} The response object with the status and message.
 * @throws {Error} If there is an unexpected error.
 */
export async function removeSpamCommentHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  // Get user ID from request
  const userID = res.locals.user._id;
  const user = res.locals.user;
  const subreddit = req.params.subreddit;
  const commentID = req.body.commentID;
  const community = await findCommunityByName(subreddit);
  const comment = await findCommentById(commentID);

  // Check if user is missing or invalid
  if (!user) {
    return res.status(401).json({
      error: 'Access token is missing or invalid',
    });
  }

  // Check if subreddit is missing or invalid
  if (!community) {
    return res.status(402).json({
      error: 'Community not found',
    });
  }

  // Check if post is missing or invalid
  if (!comment) {
    return res.status(402).json({
      error: 'Comment not found',
    });
  }

  let isMod = false;
  if (community.moderators) {
    community.moderators.forEach((el) => {
      if (el.userID?.toString() === user._id?.toString()) isMod = true;
    });
  }
  if (isMod === false) {
    return res.status(404).json({ status: 'error', message: 'Members can not remove spam posts' });
  }

  try {
    const updateUser = await approveSpamComment(commentID, subreddit);
    await CommentModel.findByIdAndUpdate(comment._id, { isDeleted: true }, { upsert: true, new: true });

    // Handle user addition failure
    if (updateUser.status === false) {
      return res.status(500).json({
        error: updateUser.error,
      });
    }
    // Return success response
    return res.status(200).json({
      status: 'succeeded',
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error removing spam comment:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}

/**
 * lock Comment Handler.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise of a void.
 */
export async function lockCommentHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  // Get user ID from request
  const userID = res.locals.user._id;
  const user = res.locals.user;
  const subreddit = req.params.subreddit;
  const community = await findCommunityByName(subreddit);
  const commentID = req.body.commentID;
  const comment = await findCommentById(commentID);

  // Check if user is missing or invalid
  if (!user) {
    return res.status(401).json({
      error: 'Access token is missing or invalid',
    });
  }

  // Check if subreddit is missing or invalid
  if (!community) {
    return res.status(402).json({
      error: 'Community not found',
    });
  }

  // Check if comment is missing or invalid
  if (!comment) {
    return res.status(402).json({
      error: 'Comment not found',
    });
  }

  try {
    await CommentModel.findByIdAndUpdate(comment._id, { isLocked: true }, { upsert: true, new: true });

    // Return success response
    return res.status(200).json({
      status: 'succeeded',
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error locking a comment in a subreddit:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}

/**
 * unlock Comment Handler.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise of a void.
 */
export async function unlockCommentHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  // Get user ID from request
  const userID = res.locals.user._id;
  const user = res.locals.user;
  const subreddit = req.params.subreddit;
  const community = await findCommunityByName(subreddit);
  const commentID = req.body.commentID;
  const comment = await findCommentById(commentID);

  // Check if user is missing or invalid
  if (!user) {
    return res.status(401).json({
      error: 'Access token is missing or invalid',
    });
  }

  // Check if subreddit is missing or invalid
  if (!community) {
    return res.status(402).json({
      error: 'Community not found',
    });
  }

  // Check if comment is missing or invalid
  if (!comment) {
    return res.status(402).json({
      error: 'Comment not found',
    });
  }

  try {
    await CommentModel.findByIdAndUpdate(comment._id, { isLocked: false }, { upsert: true, new: true });

    // Return success response
    return res.status(200).json({
      status: 'succeeded',
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error unlocking a comment in a subreddit:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}

/**
 * lock Post Handler.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise of a void.
 */
export async function lockPostHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  // Get user ID from request
  const userID = res.locals.user._id;
  const user = res.locals.user;
  const subreddit = req.params.subreddit;
  const community = await findCommunityByName(subreddit);
  const postID = req.body.postID;
  const post = await findPostById(postID);

  // Check if user is missing or invalid
  if (!user) {
    return res.status(401).json({
      error: 'Access token is missing or invalid',
    });
  }

  // Check if subreddit is missing or invalid
  if (!community) {
    return res.status(402).json({
      error: 'Community not found',
    });
  }

  // Check if post is missing or invalid
  if (!post) {
    return res.status(402).json({
      error: 'post not found',
    });
  }

  try {
    await PostModel.findByIdAndUpdate(post._id, { isLocked: true }, { upsert: true, new: true });

    // Return success response
    return res.status(200).json({
      status: 'succeeded',
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error locking a post in a subreddit:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}

/**
 * unlock Post Handler.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise of a void.
 */
export async function unlockPostHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  // Get user ID from request
  const userID = res.locals.user._id;
  const user = res.locals.user;
  const subreddit = req.params.subreddit;
  const community = await findCommunityByName(subreddit);
  const postID = req.body.postID;
  const post = await findPostById(postID);

  // Check if user is missing or invalid
  if (!user) {
    return res.status(401).json({
      error: 'Access token is missing or invalid',
    });
  }

  // Check if subreddit is missing or invalid
  if (!community) {
    return res.status(402).json({
      error: 'Community not found',
    });
  }

  // Check if post is missing or invalid
  if (!post) {
    return res.status(402).json({
      error: 'post not found',
    });
  }

  try {
    await PostModel.findByIdAndUpdate(post._id, { isLocked: false }, { upsert: true, new: true });

    // Return success response
    return res.status(200).json({
      status: 'succeeded',
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error('Error unlocking a post in a subreddit:', error);
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}

/**
 * Uploads a community icon.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the icon is uploaded successfully.
 * @throws {appError} - If the access token is missing or if there is no image provided.
 * @throws {appError} - If the community is not found or if the user is not a moderator.
 * @throws {appError} - If there is an internal server error in image upload.
 */
export async function uploadCommunityIcon(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    if (!res.locals.image) {
      throw new appError('No image', 400);
    }

    const image = res.locals.image;
    const user = res.locals.user;

    const community = await findCommunityByName(req.params.subreddit);

    if (!community) {
      return res.status(404).json({
        error: 'Community not found',
      });
    }

    const communityId = community._id;
    let isMod = false;
    if (community.moderators) {
      community.moderators.forEach((el) => {
        if (el.userID?.toString() === user._id?.toString()) {
          isMod = true;
        }
      });
    }
    if (isMod === false) {
      return res.status(404).json({ status: 'error', message: 'Only moderators can upload community icons' });
    }
    await CommunityModel.findByIdAndUpdate(communityId, { icon: image });

    res.status(200).json({
      msg: 'Icon uploaded successfully',
      Icon: image,
    });
  } catch (error) {
    if (error instanceof appError) {
      return res.status(error.statusCode).json({
        msg: error.message,
      });
    }
    return res.status(500).json({
      msg: 'Internal server error in image upload',
    });
  }
}

/**
 * Uploads a community banner image.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the banner is uploaded successfully.
 * @throws {Error} - If the access token is missing or there is no image.
 * @throws {Error} - If the community is not found.
 * @throws {Error} - If the user is not a moderator of the community.
 * @throws {Error} - If there is an internal server error.
 */
export async function uploadCommunityBanner(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    if (!res.locals.image) {
      throw new Error('No image');
    }

    const image = res.locals.image;
    const user = res.locals.user;
    const userId = user._id;
    const community = await findCommunityByName(req.params.subreddit);
    if (!community) {
      return res.status(402).json({
        error: 'Community not found',
      });
    }

    const communityId = community._id;
    let isMod = false;
    if (community.moderators) {
      community.moderators.forEach((el) => {
        if (el.userID?.toString() === user._id?.toString()) {
          isMod = true;
        }
      });
    }
    if (isMod === false) {
      return res.status(404).json({ status: 'error', message: 'Only moderators can upload community icons' });
    }

    console.log('before save to model');
    await CommunityModel.findByIdAndUpdate(communityId, { banner: image });
    console.log('after save to model');

    res.status(200).json({
      msg: 'Banner uploaded successfully',
      Icon: image,
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}

/**
 * Retrieves the community rules for a given subreddit.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 * @throws {Error} - If there is an error retrieving the community rules.
 */
export async function getCommunityRulesHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const userID = res.locals.user._id;
    const user = res.locals.user;
    const subreddit = req.params.subreddit;
    const community = await findCommunityByName(subreddit);

    // Check if user is missing or invalid
    if (!user) {
      return res.status(401).json({
        error: 'Access token is missing or invalid',
      });
    }
    if (!community) {
      return res.status(402).json({
        error: 'Community not found',
      });
    }
    const rules = community.communityRules;
    return res.status(200).json({
      rules,
    });
  } catch (error) {
    console.error('Error in getCommunityRulesHandler:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
}

/**
 * Retrieves the removal reasons for a community.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 * @throws {Error} - If there is an error retrieving the removal reasons.
 */
export async function getCommunityRemovalResonsHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const userID = res.locals.user._id;
    const user = res.locals.user;
    const subreddit = req.params.subreddit;
    const community = await findCommunityByName(subreddit);

    // Check if user is missing or invalid
    if (!user) {
      return res.status(401).json({
        error: 'Access token is missing or invalid',
      });
    }
    if (!community) {
      return res.status(402).json({
        error: 'Community not found',
      });
    }
    const rules = community.removalReasons;
    return res.status(200).json({
      rules,
    });
  } catch (error) {
    console.error('Error in getCommunityRemovalResonsHandler:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
}

/**
 * Retrieves the categories of a community.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 * @throws {Error} - If there is an error retrieving the categories or if the access token is missing or invalid.
 */
export async function getCommunityCategoriesHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const userID = res.locals.user._id;
    const user = res.locals.user;
    const subreddit = req.params.subreddit;
    const community = await findCommunityByName(subreddit);

    // Check if user is missing or invalid
    if (!user) {
      return res.status(401).json({
        error: 'Access token is missing or invalid',
      });
    }
    if (!community) {
      return res.status(402).json({
        error: 'Community not found',
      });
    }
    const categories = community.categories;
    return res.status(200).json({
      categories,
    });
  } catch (error) {
    console.error('Error in getCommunityCategoriesHandler:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
}

/**
 * Retrieves the image widgets for a given subreddit.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 * @throws {Error} - If there is an error retrieving the image widgets.
 */
export async function getImageWidgetsHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const userID = res.locals.user._id;
    const user = res.locals.user;
    const subreddit = req.params.subreddit;
    const community = await findCommunityByName(subreddit);

    // Check if user is missing or invalid
    if (!user) {
      return res.status(401).json({
        error: 'Access token is missing or invalid',
      });
    }
    if (!community) {
      return res.status(402).json({
        error: 'Community not found',
      });
    }
    const rules = community.ImageWidget;
    return res.status(200).json({
      rules,
    });
  } catch (error) {
    console.error('Error in getImageWidgetsHandler:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
}

/**
 * Retrieves the text widgets for a given subreddit.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 * @throws {Error} - If there is an error retrieving the text widgets.
 */
export async function getTextWidgetsHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const userID = res.locals.user._id;
    const user = res.locals.user;
    const subreddit = req.params.subreddit;
    const community = await findCommunityByName(subreddit);

    // Check if user is missing or invalid
    if (!user) {
      return res.status(401).json({
        error: 'Access token is missing or invalid',
      });
    }
    if (!community) {
      return res.status(402).json({
        error: 'Community not found',
      });
    }
    const rules = community.TextWidget;
    return res.status(200).json({
      rules,
    });
  } catch (error) {
    console.error('Error in getTextWidgetsHandler:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
}

/**
 * Retrieves the button widgets for a given subreddit.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 * @throws {Error} - If there is an error retrieving the button widgets.
 */
export async function getButtonWidgetsHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const userID = res.locals.user._id;
    const user = res.locals.user;
    const subreddit = req.params.subreddit;
    const community = await findCommunityByName(subreddit);

    // Check if user is missing or invalid
    if (!user) {
      return res.status(401).json({
        error: 'Access token is missing or invalid',
      });
    }
    if (!community) {
      return res.status(402).json({
        error: 'Community not found',
      });
    }
    const rules = community.ButtonWidget;
    return res.status(200).json({
      rules,
    });
  } catch (error) {
    console.error('Error in getButtonWidgetsHandler:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
}

/**
 * Retrieves the post settings for a given subreddit.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 * @throws {Error} - If there is an error retrieving the post settings.
 */
export async function getPostSettingsHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const userID = res.locals.user._id;
    const user = res.locals.user;
    const subreddit = req.params.subreddit;
    const community = await findCommunityByName(subreddit);

    // Check if user is missing or invalid
    if (!user) {
      return res.status(401).json({
        error: 'Access token is missing or invalid',
      });
    }
    if (!community) {
      return res.status(402).json({
        error: 'Community not found',
      });
    }
    const rules = community.PostSettings;
    return res.status(200).json({
      rules,
    });
  } catch (error) {
    console.error('Error in getPostSettingsHandler:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
}

/**
 * Retrieves the content controls for a community.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves to void.
 * @throws {Error} - If there is an error retrieving the content controls.
 */
export async function getContentControlsHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const userID = res.locals.user._id;
    const user = res.locals.user;
    const subreddit = req.params.subreddit;
    const community = await findCommunityByName(subreddit);

    // Check if user is missing or invalid
    if (!user) {
      return res.status(401).json({
        error: 'Access token is missing or invalid',
      });
    }
    if (!community) {
      return res.status(402).json({
        error: 'Community not found',
      });
    }
    const rules = community.ContentControls;
    return res.status(200).json({
      rules,
    });
  } catch (error) {
    console.error('Error in getContentControlsHandler:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
}

/**
 * Retrieves the details of a community.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @returns The details of the community.
 * @throws {Error} If there is an error retrieving the community details.
 */
export async function getCommunityDetailsHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const userID = res.locals.user._id;
    const user = res.locals.user;
    const subreddit = req.params.subreddit;
    const community = await findCommunityByName(subreddit);

    // Check if user is missing or invalid
    if (!user) {
      return res.status(401).json({
        error: 'Access token is missing or invalid',
      });
    }
    if (!community) {
      return res.status(402).json({
        error: 'Community not found',
      });
    }
    const details = community.Details;
    return res.status(200).json({
      details,
    });
  } catch (error) {
    console.error('Error in getContentControlsHandler:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
}

/**
 * Handles the request to get pending members of a community.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @return {Promise<void>} The promise that resolves when the function is complete.
 */
export async function getPendingMembersHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const user = res.locals.user;
    const subreddit = req.params.subreddit;
    const community = await findCommunityByName(subreddit);

    if (!user) {
      return res.status(400).json({
        status: 'failed',
        message: 'Access token is missing or invalid',
      });
    }

    if (!community) {
      return res.status(401).json({
        status: 'failed',
        message: 'Community not found',
      });
    }

    let isMod = false;
    if (community.moderators) {
      community.moderators.forEach((el) => {
        if (el.userID?.toString() === user._id?.toString()) isMod = true;
      });
    }
    if (isMod === false) {
      return res.status(404).json({ status: 'error', message: 'Members can not check pending members' });
    }

    const users = community.pendingMembers;
    return res.status(200).json({ status: 'success', users });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

/**
 * Deletes the icon of a community.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Response} The response object with the result of the operation.
 * @throws {Error} If there is an error during the operation.
 */
export async function deleteCommunityIcon(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const user = res.locals.user;
    const userId = user._id;
    const community = await findCommunityByName(req.params.subreddit);
    if (!community) {
      return res.status(402).json({
        error: 'Community not found',
      });
    }
    const communityId = community._id;
    let isMod = false;
    if (community.moderators) {
      community.moderators.forEach((el) => {
        if (el.userID?.toString() === user._id?.toString()) {
          isMod = true;
        }
      });
    }
    if (isMod === false) {
      return res.status(404).json({ status: 'error', message: 'Only moderators can upload community icons' });
    }

    await CommunityModel.findByIdAndUpdate(
      community._id,
      { icon: 'https://res.cloudinary.com/dvnf8yvsg/image/upload/v1714594934/vjhqqv4imw26krszm7hr.png' },
      { runValidators: true }
    );
    res.status(200).json({
      msg: 'Icon deletd  successfully',
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}

/**
 * Deletes the banner of a community.
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {Response} The response object with the result of the operation.
 * @throws {Error} If there is an error during the operation.
 */
export async function deleteCommunityBanner(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    const user = res.locals.user;
    const userId = user._id;
    const community = await findCommunityByName(req.params.subreddit);
    if (!community) {
      return res.status(402).json({
        error: 'Community not found',
      });
    }
    const communityId = community._id;
    let isMod = false;
    if (community.moderators) {
      community.moderators.forEach((el) => {
        if (el.userID?.toString() === user._id?.toString()) {
          isMod = true;
        }
      });
    }
    if (isMod === false) {
      return res.status(404).json({ status: 'error', message: 'Only moderators can upload community icons' });
    }

    await CommunityModel.findByIdAndUpdate(
      community._id,
      { banner: 'https://res.cloudinary.com/dvnf8yvsg/image/upload/v1714595299/gcnool3ibj3zfyoa1emq.jpg' },
      { runValidators: true }
    );
    res.status(200).json({
      msg: 'Banner deletd  successfully',
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error',
    });
  }
}

/**
 * Retrieves user submitted posts with pagination and sorting.
 *
 * @param {Request} req - The request object
 * @param {Response} res - The response object
 * @param {NextFunction} next - The next function to call
 * @returns {Promise<void>} A Promise that resolves when the function completes
 */
export async function getCommunityPostHandler(req: Request, res: Response) {
  if (!res.locals.user) {
    return res.status(401).json({
      status: 'failed',
      message: 'Access token is missing',
    });
  }
  try {
    // Extract params
    const comm = req.params.subreddit;
    const community = await findCommunityByName(comm);
    if (!community) {
      return res.status(402).json({
        error: 'Community not found',
      });
    }

    const page: number = parseInt(req.query.page as string, 10) || 1; // Default to page 1 if not provided
    const count: number = parseInt(req.query.count as string, 10) || 10; // Default to 10 if not provided
    const limit: number = parseInt(req.query.limit as string, 10) || 10; // Default to 10 if not provided
    const sort: string = req.query.sort as string; // Sort parameter

    // Validate parameters
    if (!community || isNaN(page) || isNaN(count) || isNaN(limit)) {
      return res.status(400).json({ error: 'Invalid request parameters.' });
    }

    // Fetch post IDs submitted by the user
    const postIDs = await communityPostIDs(comm, page, count);

    // Fetch posts
    let posts = await communityPosts(postIDs, limit);

    // Apply sorting
    if (sort) {
      switch (sort) {
        case 'best':
          posts = posts.sort((a, b) => b.bestFactor - a.bestFactor);
          break;
        case 'hot':
          posts = posts.sort((a, b) => b.hotnessFactor - a.hotnessFactor);
          break;
        case 'top':
          posts = posts.sort((a, b) => b.votesCount - a.votesCount);
          break;
        case 'new':
          posts = posts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          break;
        case 'random':
          posts = shuffle(posts);
          break;
        default:
          posts = shuffle(posts);
          break;
      }
    } else {
      posts = shuffle(posts);
    }

    res.status(200).json({ posts });
  } catch (error) {
    console.error('Error getUserSubmittedHandler:', error);
    return res.status(500).send('Internal server error');
  }
}
