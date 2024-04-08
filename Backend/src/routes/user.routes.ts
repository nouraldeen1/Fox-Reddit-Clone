import express from 'express';
import validateResource from '../middleware/validateResource';
import {
  createUserSchema,
  verifyUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  friendRequestSchema,
  unFriendRequestSchema,
  blockUserSchema,
  reportUserSchema,
} from '../schema/user.schema';
import {
  createUserHandler,
  verifyUserHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
  getCurrentUserHandler,
  getCurrentUserPrefs,
  editCurrentUserPrefs,
  username_availableHandler,
  aboutHandler,
  getUserCommentsHandler,
  getUserOverviewHandler,
  getUserSubmittedHandler,
  getFriendHandler,
  getALLFriendsHandler,
  unFriendRequestHandler,
  friendRequestHandler,
  blockUserHandler,
} from '../controller/user.controller';
import requireUser from '../middleware/requireUser';

const router = express.Router();

router.post('/api/users/signup', validateResource(createUserSchema), createUserHandler);

router.get('/api/users/signup/verify/:id/:verificationCode', validateResource(verifyUserSchema), verifyUserHandler);

router.post('/api/users/forgotpassword', validateResource(forgotPasswordSchema), forgotPasswordHandler);

router.get('/api/username_available', username_availableHandler);

router.get('/user/:username/about', aboutHandler);

router.get('/user/:username/submitted', getUserSubmittedHandler);

router.get('/user/:username/comments', getUserCommentsHandler);

router.get('/user/:username/overview', getUserOverviewHandler);

router.post(
  '/api/users/resetpassword/:id/:passwordResetCode',
  validateResource(resetPasswordSchema),
  resetPasswordHandler
);
router.get('/api/v1/me', requireUser, getCurrentUserHandler);

router.get('/api/v1/me/prefs/:id', getCurrentUserPrefs);

router.patch('/api/v1/me/prefs/:id', editCurrentUserPrefs);

/******************** BOUDY **************************/
router.get('/api/v1/me/friends', getALLFriendsHandler);

router.get('/api/v1/me/friends/:username', getFriendHandler);

router.post('/api/friend', validateResource(friendRequestSchema), friendRequestHandler);

router.post('/api/unfriend', validateResource(unFriendRequestSchema), unFriendRequestHandler);

router.post('/api/block_user', validateResource(blockUserSchema), blockUserHandler);

//router.post('/api/report_user', validateResource(reportUserSchema), reportUserHandler);

/********************************************************/

export default router;
