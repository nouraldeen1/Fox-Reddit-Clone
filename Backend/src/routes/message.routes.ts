import express from 'express';
import validateResource from '../middleware/validateResource';
import {
  composeMessageHandler,
  deleteMessageHandler,
  inboxMessagesHandler,
  sentMessagesHandler,
  allMessagesHandler,
  getUnreadMessagesHandler,
  markReadAllMessagesHandler,
  markReadMessageHandler,
  markUnreadMessageHandler,
  chatMessagesHandler,
  getAllMessagesUsernamesAndSubjectsHandler,
  mentionUserHandler,
  getPostAndCommentUserMentionedHandler,
  addPostReplyHandler,
  getuserPostreplisHandler,
} from '../controller/message.controller';
import {
  chatMessagesSchema,
  composeMessageSchema,
  deleteMessageSchema,
  mentionUserSchema,
  replyOnpostSchema,
} from '../schema/message.schema';

const router = express.Router();

router.post('/message/compose/', validateResource(composeMessageSchema), composeMessageHandler);

router.post('/api/del_msg', validateResource(deleteMessageSchema), deleteMessageHandler);

router.get('/message/sent/', sentMessagesHandler);

router.get('/message/inbox/', inboxMessagesHandler);

router.get('/message/allmessages/', allMessagesHandler);

router.post('/message/markReadAllMessages/', markReadAllMessagesHandler);

router.post('/message/markReadMessage/', markReadMessageHandler);

router.get('/message/unreadMessages/', getUnreadMessagesHandler);

router.post('/message/markUnreadMessage/', markUnreadMessageHandler);

router.get('/message/chatMessages/', validateResource(chatMessagesSchema), chatMessagesHandler);

router.get('/message/getAllMessagesUsernamesAndSubjects/', getAllMessagesUsernamesAndSubjectsHandler);

router.post('/api/mention', validateResource(mentionUserSchema), mentionUserHandler);

router.get('/api/get_user_mentions', getPostAndCommentUserMentionedHandler);

router.post('/api/addPosstreply', validateResource(replyOnpostSchema), addPostReplyHandler);

router.get('/api/get_post_replies', getuserPostreplisHandler);

export default router;
