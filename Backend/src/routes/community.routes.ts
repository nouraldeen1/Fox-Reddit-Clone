import express from 'express';
import {
  getCommunityOfUserAsMemeberHandler,
  getCommunityOfUserAsModeratorHandler,
  createSubredditHandler,
  getCommunityHandler,
  subscribeCommunityHandler,
  unsubscribeCommunityHandler,
  joinModeratorHandler,
  leaveModeratorHandler,
  getUsersIsbannedIncommunityHandler,
  getUsersIsmutedIncommunityHandler,
  getModeratorsHandler,
  getMembersHandler,
  editCommunityRulesHandler,
  favoriteCommunityHandler,
  unfavoriteCommunityHandler,
  getFavoriteCommunitiesOfUserHandler,
  getSpamPostsHandler,
  getSpamCommentsHandler,
  markSpamPostHandler,
  markSpamCommentHandler,
  approveSpamPostHandler,
  approveSpamCommentHandler,
  removeSpamPostHandler,
  removeSpamCommentHandler,
  lockPostHandler,
  lockCommentHandler,
  unlockPostHandler,
  unlockCommentHandler,
  getCommunityRulesHandler,
  getPendingMembersHandler,
  editCommunityRemovalResonsHandler,
  getCommunityRemovalResonsHandler,
  getCommunityOfUserAsCreatorHandler,
  uploadCommunityIcon,
  uploadCommunityBanner,
  deleteCommunityIcon,
  deleteCommunityBanner,
  getCommunityNameHandler,
  getCommunityCategoriesHandler,
  editCommunityCategoriesHandler,
  getBannedMemberHandler,
  banHandler,
  unbanHandler,
  getMutedMemberHandler,
  muteHandler,
  unmuteHandler,
  getAllCommunityHandler,
  getImageWidgetsHandler,
  editImageWidgetsHandler,
  getTextWidgetsHandler,
  editTextWidgetsHandler,
  getButtonWidgetsHandler,
  editButtonWidgetsHandler,
  getPostSettingsHandler,
  editPostSettingsHandler,
  getContentControlsHandler,
  editContentControlsHandler,
  editCommunityDetailsHandler,
  getCommunityDetailsHandler,
  getCommunityPostHandler,
  getCommunityOfOtherUserAsCreatorHandler,
  getCommunityOfOtherUserAsMemeberHandler,
  getFavoriteCommunitiesOfOtherUserHandler,
  getCommunityOfOtherUserAsModeratorHandler,
  editModeratorHandler,
  getModeratorHandler,
} from '../controller/community.controller';
import validateResource from '../middleware/validateResource';
import {
  createCommunitySchema,
  subscribeCommunitySchema,
  getCommunitySchema,
  editCommunityRulesSchema,
  spamPostSchema,
  spamCommentSchema,
  approveSpamPostSchema,
  approveSpamCommentSchema,
  lockPostSchema,
  lockCommentSchema,
  editCommunityRemovalResonsSchema,
  CommunityNameSchema,
  editCommunityCategoriesSchema,
  banSchema,
  unbanSchema,
  muteSchema,
  unmuteSchema,
  EditImageWidgetArraySchema,
  EditTextWidgetArraySchema,
  EditButtonWidgetArraySchema,
  editCommunityDetailsSchema,
} from '../schema/community.schema';
import uploadSingleMulter from '../middleware/multer/singleImage';
import { uploadSingleCloudinary } from '../middleware/cloudinary/uploadMultiple';
import { resizeCommunityIcon, resizeCommunityBanner } from '../middleware/resizeCommunityPhoto';

const router = express.Router();

router.get('/api/all_subreddits', getAllCommunityHandler);

router.get('/api/communityName', validateResource(CommunityNameSchema), getCommunityNameHandler);

router.get('/subreddits/mine/member', getCommunityOfUserAsMemeberHandler);
router.get('/subreddits/mine/moderator', getCommunityOfUserAsModeratorHandler);
router.get('/subreddits/mine/creator', getCommunityOfUserAsCreatorHandler);
router.get('/subreddits/mine/favorite', getFavoriteCommunitiesOfUserHandler);

router.get('/:subreddit/moderator/:username', validateResource(unmuteSchema), getModeratorHandler);

router.get('/subreddits/:username/member', getCommunityOfOtherUserAsMemeberHandler);
router.get('/subreddits/:username/moderator', getCommunityOfOtherUserAsModeratorHandler);
router.get('/subreddits/:username/creator', getCommunityOfOtherUserAsCreatorHandler);
router.get('/subreddits/:username/favorite', getFavoriteCommunitiesOfOtherUserHandler);

router.get('/:subreddit', validateResource(getCommunitySchema), getCommunityHandler);

router.post('/create_subreddit', validateResource(createCommunitySchema), createSubredditHandler);

router.post('/:subreddit/api/subscribe', validateResource(subscribeCommunitySchema), subscribeCommunityHandler);
router.post('/:subreddit/api/unsubscribe', validateResource(subscribeCommunitySchema), unsubscribeCommunityHandler);

router.post('/:subreddit/api/favorite', validateResource(subscribeCommunitySchema), favoriteCommunityHandler);
router.post('/:subreddit/api/unfavorite', validateResource(subscribeCommunitySchema), unfavoriteCommunityHandler);

router.post('/:subreddit/api/join_moderator', validateResource(subscribeCommunitySchema), joinModeratorHandler);
router.post('/:subreddit/api/leave_moderator', validateResource(subscribeCommunitySchema), leaveModeratorHandler);
router.patch('/:subreddit/api/edit_moderator', validateResource(subscribeCommunitySchema), editModeratorHandler);

router.post('/:subreddit/api/ban/:username', validateResource(banSchema), banHandler);
router.post('/:subreddit/api/unban/:username', validateResource(unbanSchema), unbanHandler);
router.get('/:subreddit/about/banned', validateResource(subscribeCommunitySchema), getUsersIsbannedIncommunityHandler);
router.get('/:subreddit/about/banned/:username', validateResource(unbanSchema), getBannedMemberHandler);

router.post('/:subreddit/api/mute/:username', validateResource(muteSchema), muteHandler);
router.post('/:subreddit/api/unmute/:username', validateResource(unmuteSchema), unmuteHandler);
router.get('/:subreddit/about/muted', validateResource(subscribeCommunitySchema), getUsersIsmutedIncommunityHandler);
router.get('/:subreddit/about/muted/:username', validateResource(unmuteSchema), getMutedMemberHandler);

router.get('/:subreddit/about/moderators', validateResource(subscribeCommunitySchema), getModeratorsHandler);
router.get('/:subreddit/about/members', validateResource(subscribeCommunitySchema), getMembersHandler);

router.get('/:subreddit/about/spam_posts', validateResource(subscribeCommunitySchema), getSpamPostsHandler);
router.get('/:subreddit/about/spam_comments', validateResource(subscribeCommunitySchema), getSpamCommentsHandler);

router.patch('/:subreddit/api/edit_rules', validateResource(editCommunityRulesSchema), editCommunityRulesHandler);
router.get('/:subreddit/api/rules', validateResource(getCommunitySchema), getCommunityRulesHandler);

router.patch('/:subreddit/api/edit_details', validateResource(editCommunityDetailsSchema), editCommunityDetailsHandler);
router.get('/:subreddit/api/details', validateResource(getCommunitySchema), getCommunityDetailsHandler);

router.patch(
  '/:subreddit/api/edit_categories',
  validateResource(editCommunityCategoriesSchema),
  editCommunityCategoriesHandler
);
router.get('/:subreddit/api/categories', validateResource(getCommunitySchema), getCommunityCategoriesHandler);

router.patch(
  '/:subreddit/api/edit_removal_reasons',
  validateResource(editCommunityRemovalResonsSchema),
  editCommunityRemovalResonsHandler
);
router.get('/:subreddit/api/removal_reasons', validateResource(getCommunitySchema), getCommunityRemovalResonsHandler);

router.get('/:subreddit/api/image_widgets', validateResource(getCommunitySchema), getImageWidgetsHandler);
router.patch(
  '/:subreddit/api/edit_image_widgets',
  validateResource(EditImageWidgetArraySchema),
  editImageWidgetsHandler
);

router.get('/:subreddit/api/text_widgets', validateResource(getCommunitySchema), getTextWidgetsHandler);
router.patch('/:subreddit/api/edit_text_widgets', validateResource(EditTextWidgetArraySchema), editTextWidgetsHandler);

router.get('/:subreddit/api/button_widgets', validateResource(getCommunitySchema), getButtonWidgetsHandler);
router.patch(
  '/:subreddit/api/edit_button_widgets',
  validateResource(EditButtonWidgetArraySchema),
  editButtonWidgetsHandler
);

router.get('/:subreddit/api/post_settings', validateResource(getCommunitySchema), getPostSettingsHandler);
router.patch('/:subreddit/api/edit_post_settings', editPostSettingsHandler);

router.get('/:subreddit/api/content_controls', validateResource(getCommunitySchema), getContentControlsHandler);
router.patch(
  '/:subreddit/api/edit_content_controls',

  editContentControlsHandler
);

router.post('/:subreddit/api/mark_spam_post', validateResource(spamPostSchema), markSpamPostHandler);
router.post('/:subreddit/api/mark_spam_comment', validateResource(spamCommentSchema), markSpamCommentHandler);
router.post('/:subreddit/api/approve_spam_post', validateResource(approveSpamPostSchema), approveSpamPostHandler);
router.post(
  '/:subreddit/api/approve_spam_comment',
  validateResource(approveSpamCommentSchema),
  approveSpamCommentHandler
);
router.post('/:subreddit/api/remove_spam_post', validateResource(approveSpamPostSchema), removeSpamPostHandler);
router.post(
  '/:subreddit/api/remove_spam_comment',
  validateResource(approveSpamCommentSchema),
  removeSpamCommentHandler
);

router.post('/:subreddit/api/lock_post', validateResource(lockPostSchema), lockPostHandler);
router.post('/:subreddit/api/lock_comment', validateResource(lockCommentSchema), lockCommentHandler);
router.post('/:subreddit/api/unlock_post', validateResource(lockPostSchema), unlockPostHandler);
router.post('/:subreddit/api/unlock_comment', validateResource(lockCommentSchema), unlockCommentHandler);

router.get('/:subreddit/about/pending_members', validateResource(subscribeCommunitySchema), getPendingMembersHandler);

router.post(
  '/:subreddit/api/upload_sr_icon',
  // uploadSingleMulter.single('image'),
  //resizeCommunityIcon,
  uploadSingleCloudinary,
  uploadCommunityIcon
);
router.post(
  '/:subreddit/api/upload_sr_banner',
  //uploadSingleMulter.single('image'),
  // resizeCommunityBanner,
  uploadSingleCloudinary,
  uploadCommunityBanner
);
router.delete('/:subreddit/api/delete_sr_icon', validateResource(subscribeCommunitySchema), deleteCommunityIcon);
router.delete('/:subreddit/api/delete_sr_banner', validateResource(subscribeCommunitySchema), deleteCommunityBanner);

router.get('/api/:subreddit/posts', getCommunityPostHandler);

export default router;
