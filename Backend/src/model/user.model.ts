import {
  prop,
  getModelForClass,
  modelOptions,
  Severity,
  pre,
  DocumentType,
  index,
  queryMethod,
  Ref,
} from '@typegoose/typegoose';
import * as argon2 from 'argon2';
import { nanoid } from 'nanoid';
import { Post } from './posts.model';
import { Comment } from './comments.model';
import { Community } from './community.model';
import { Notifications } from './notification.model';
import { Types } from 'mongoose';
//import { Validator } from 'validator';

export const privateFields = [
  'password',
  'verificationCode',
  'passwordResetCode',
  'verified',
  'prefs',
  'upvotedPosts',
  'downvotedPosts',
  'contentVisibility',
  'canCreateSubreddit',
  'showActiveCommunities',
  'type',
  'friendRequestToMe',
  'friendRequestFromMe',
  'friend',
  'blocksFromMe',
  'blocksToMe',
  'hasPost',
  'hasComment',
  'hasReply',
  'followPost',
  'savedPosts',
  'mentionedInPosts',
  'mentionedInComments',
  'meReturn',
  'aboutReturn',
  'commMember',
  'hasVote',
  'updatedAt',
  '__v',
];

export class UserPrefs {
  @prop({ default: false })
  emailPrivateMessage?: boolean;

  @prop({ default: 'EG' })
  countryCode?: string;

  @prop()
  commentsNum?: number;

  @prop({ default: false })
  emailCommentReply?: boolean;

  @prop({ default: false })
  emailUpvoteComment?: boolean;

  @prop({ default: false })
  emailMessages?: boolean;

  @prop({ default: false })
  emailUnsubscribeAll?: boolean;

  @prop({ default: false })
  emailUpvote?: boolean;

  @prop({ default: false })
  emailUsernameMention?: boolean;

  @prop({ default: false })
  emailUserNewFollower?: boolean;

  @prop({ default: false })
  emailPostReply?: boolean;

  @prop({ default: false })
  over18?: boolean;

  @prop({ default: false })
  showPostInNewWindow?: boolean;

  @prop({ default: false })
  labelNSFW?: boolean;

  @prop({ default: true })
  liveOrangereds?: boolean;

  @prop({ default: false })
  markMessagesRead?: boolean;

  @prop({ default: true })
  enableFollowers?: boolean;

  @prop({ default: true })
  publicVotes?: boolean;

  @prop({ default: false })
  showLinkFlair?: boolean;

  @prop({ default: false })
  showLocationBasedRecommendation?: boolean;

  @prop({ default: false })
  searchIncludeOver18?: boolean;

  @prop({ default: 'new' })
  defaultCommentSort?: 'top' | 'new' | 'random' | 'best' | 'hot';

  @prop({ default: 'en' })
  language?: string;

  @prop({ default: false })
  threadedMessages?: boolean;

  @prop({ default: true })
  prefShowTrending?: boolean;

  @prop({ default: true })
  autoplayMedia: boolean;

  @prop({ default: true })
  blurMature: boolean;
}
export class notificationSettings {
  @prop({ default: true })
  privateMessages?: boolean;

  @prop({ default: true })
  chatMessages?: boolean;

  @prop({ default: true })
  chatRequests?: boolean;

  @prop({ default: true })
  mentionOfUsername?: boolean;

  @prop({ default: true })
  commentsOnYourPosts?: boolean;

  @prop({ default: true })
  upvotesOnYourPosts?: boolean;

  @prop({ default: true })
  upvotedOnYourComments?: boolean;

  @prop({ default: true })
  repliesToYourComments?: boolean;

  @prop({ default: true })
  activityOnYourComments?: boolean;

  @prop({ default: true })
  activityOnChatPostsYoureIn?: boolean;

  @prop({ default: true })
  newFollowers?: boolean;

  @prop({ default: true })
  awardsYouReceive?: boolean;

  @prop({ default: true })
  postsYouFollow?: boolean;

  @prop({ default: true })
  commentsYouFollow?: boolean;

  @prop({ default: true })
  trendingPosts?: boolean;

  @prop({ default: true })
  communityRecommendations?: boolean;

  @prop({ default: true })
  reReddit?: boolean;

  @prop({ default: true })
  featuredContent?: boolean;

  @prop({ default: true })
  communityAlerts?: boolean;

  @prop({ default: true })
  redditAnnouncements?: boolean;

  @prop({ default: true })
  modNotifications?: boolean;
}

class About {
  @prop({ default: false })
  isBlocked?: boolean;

  @prop({ default: false })
  isModerator?: boolean;

  @prop({ default: true })
  acceptFollowers?: boolean;
}

class Me {
  @prop({ default: true })
  emailUserNewFollower?: boolean;

  @prop({ default: true })
  emailUsernameMention?: boolean;

  @prop({ default: true })
  emailUpVotePost?: boolean;
}

class IsBanned {
  @prop({ default: false })
  value?: boolean;

  @prop()
  date?: Date;

  @prop({ default: 'member not banned' })
  reason?: string;

  @prop({ default: 'member not banned' })
  note?: string;

  @prop({ default: 0 })
  period?: string;
}

class IsMuted {
  @prop({ default: false })
  value?: boolean;

  @prop()
  date?: Date;

  @prop({ default: 'member not muted' })
  reason?: string;
}

export class notificationInfo {
  @prop({ required: true, ref: () => 'Notifications' })
  notificationId?: Ref<Notifications>;

  @prop({ default: false })
  isRead!: boolean;

  @prop({ default: false })
  isHidden!: boolean;
}

class Member {
  @prop({ ref: 'Community' })
  communityId?: Ref<Community>;

  @prop({ type: IsMuted, default: () => new IsMuted() })
  isMuted?: IsMuted;

  @prop({ type: IsBanned, default: () => new IsBanned() })
  isBanned?: IsBanned;
}

export class VotePost {
  @prop({ ref: () => 'Post' })
  postID?: Ref<Post>;

  @prop({ enum: [1, -1] })
  type?: number;
}

class VoteComment {
  @prop({ ref: () => 'Comment' })
  commentID?: Ref<Comment>;

  @prop({ enum: [1, -1] })
  type?: number;
}

export class Moderator {
  @prop({ ref: () => 'Community' })
  communityId?: Ref<Community>;

  @prop({ enum: ['creator', 'moderator'] })
  role?: string;

  @prop({ default: false })
  manageUsers?: boolean;

  @prop({ default: false })
  createLiveChat?: boolean;

  @prop({ default: false })
  manageSettings?: boolean;

  @prop({ default: false })
  manageFlair?: boolean;

  @prop({ default: false })
  manageWikiPages?: boolean;

  @prop({ default: false })
  managePosts?: boolean;

  @prop({ default: false })
  manageModMail?: boolean;
}
class Mention {
  @prop({ ref: () => User })
  mentionerID!: Ref<User>;

  @prop({ ref: () => 'Post' })
  postID!: Ref<Post>;

  @prop({ ref: () => 'Comment' })
  commentID?: Ref<Comment>;

  @prop()
  createdAt?: Date;
}
class PostReply {
  @prop({ ref: () => User })
  replierID!: Ref<User>;

  @prop({ ref: () => 'Post' })
  postID!: Ref<Post>;

  @prop({ ref: () => 'Comment' })
  commentID?: Ref<Comment>;

  @prop()
  createdAt?: Date;
}
@pre<User>('save', async function (this: DocumentType<User>) {
  if (!this.isModified('password')) {
    return;
  }

  const hashedPassword = await argon2.hash(this.password);
  this.password = hashedPassword;
  return;
})
//@index({ email: 1 })
@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: Severity.ALLOW,
  },
})
export class User {
  @prop({
    lowercase: true,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => /^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(value),
      message: 'Invalid email format',
    },
  })
  email: string;

  @prop({ required: true, unique: true, validator: (value: string) => value.length >= 3 && value.length <= 20 })
  username: string;

  @prop({ required: true, validator: (value: string) => value.length >= 8 && value.length <= 200 })
  password: string;

  @prop()
  birthdate?: string;

  @prop()
  phoneNumber?: string;

  @prop({ required: true, default: () => new Date() })
  createdAt!: Date;

  @prop({ default: 'https://res.cloudinary.com/dvnf8yvsg/image/upload/v1714908975/gduxbj1bsk7xnaqtqnc1.png' })
  avatar?: string;

  @prop({ enum: ['male', 'female'] })
  gender?: string;

  @prop()
  about?: string;

  @prop({ default: true })
  contentVisibility?: boolean;

  @prop({ default: 0 })
  postKarma?: number;

  @prop({ default: 0 })
  commentKarma?: number;

  @prop({ default: 0 })
  karma?: number;

  @prop()
  inboxCount?: number;

  @prop({ default: true })
  canCreateSubreddit?: boolean;

  @prop()
  friendsCount?: number;

  @prop({ default: false, select: false })
  isDeleted?: boolean;

  @prop({ required: true, default: () => nanoid() })
  verificationCode: string;

  @prop()
  passwordResetCode: string | null;

  @prop({ default: false })
  verified: boolean;

  @prop({ default: true })
  showActiveCommunities?: boolean;

  @prop({ default: () => new UserPrefs() })
  prefs?: UserPrefs;

  @prop({ default: () => new notificationSettings() })
  notificationPrefs?: notificationSettings;

  @prop({ default: () => new Me() })
  meReturn?: Me;

  @prop({ default: () => new About() })
  aboutReturn?: About;

  @prop({ enum: ['bare email', 'facebook', 'gmail'], default: 'bare email' })
  type?: string;

  @prop({
    required: false,
    default:
      'dLOGE0M9SFi2nuO207BXrT:APA91bHDz9zuFWgx7FnmS4N6AxecBF0bQ00h6owg8IEj39izvGOwDCeTzXxyUY6uzFN6nvJ8wKRTZEO_3wE4cdPN02yrygKLoLu6O4uG4YavYow1uF-xT3L4mZyuLGAsFwtD3dPKvFfc',
  })
  fcmtoken: string;
  /***************************************
   recursive relations
   ***************************************/
  @prop({ ref: 'User' })
  followers?: User[]; // Array of user references
  @prop({ ref: 'User' })
  userFollows?: User[]; // Array of user references

  @prop({ ref: User })
  friendRequestToMe?: User[]; // Array of user references

  @prop({ ref: User })
  friendRequestFromMe?: User[]; // Array of user references

  @prop({ ref: User })
  friend?: User[]; // Array of user references

  @prop({ ref: User })
  blocksFromMe?: User[]; // Array of user

  @prop({ ref: User })
  blocksToMe?: User[]; // Array of user references

  /***************************************
             relations
   ***************************************/

  //sharif suggestion
  @prop()
  notifArray?: notificationInfo[];

  @prop({ ref: () => 'Post' })
  hasPost?: Ref<Post>[];

  @prop({ ref: () => 'Post' })
  historyPosts?: Ref<Post>[];

  @prop({ ref: () => 'Comment' })
  hasComment?: Ref<Comment>[];

  @prop({ ref: () => 'Comment' })
  hasReply?: Ref<Comment>[];

  @prop()
  postVotes?: VotePost[];

  @prop()
  commentVotes?: VoteComment[];

  @prop({ ref: 'Post' })
  followPost?: Ref<Post>[];

  @prop({ ref: () => 'Post' })
  hiddenPosts?: Ref<Post>[];

  @prop({ ref: () => 'Post' })
  savedPosts?: Ref<Post>[];

  @prop()
  mentionedIn?: Mention[];

  @prop()
  repliedInPost?: PostReply[];

  @prop()
  member?: Member[];

  @prop()
  moderators?: Moderator[];

  @prop({ ref: () => 'Community' })
  favorites?: Ref<Community>[];

  //////////////////////////////////////////////
  // @prop({ type: () => [String] })
  // messages?: string[];
  // @prop({ type: () => [String] })
  // follows?: string[];
  // @prop({ type: () => [String] })
  // categories?: string[];
  //////////////////////////////////////////////////////
  async validatePassword(this: DocumentType<User>, candidatePassword: string) {
    try {
      return await argon2.verify(this.password, candidatePassword);
    } catch (e) {
      //  log.error(e, 'Error validating password');
      return false;
    }
  }
  //check this function, why saveUser?
  async saveUser(): Promise<User> {
    const UserModel = getModelForClass(User); // Retrieve the Mongoose model for User class
    const user = new UserModel(this); // Create a new instance of User model
    return await user.save(); // Save the user to the database and return the saved user object
  }
}

export const UserModel = getModelForClass(User);
export default UserModel;
