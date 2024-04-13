import express from 'express';
import {
  deleteHandler,
  hidePostHandler,
  unhidePostHandler,
  addCommentHandler,
  saveHandler,
  unsaveHandler,
} from '../controller/listing.controller';
import validateResource from '../middleware/validateResource';
import { deleteCommentOrPostSchema, hidePostSchema, addCommentSchema } from '../schema/listing.schema';

const router = express.Router();

router.post('/api/del', validateResource(deleteCommentOrPostSchema), deleteHandler);
//router.post('/api/hide', validateResource(hidePostSchema), hidePostHandler);
//router.post('/api/hide', validateResource(hidePostSchema), unhidePostHandler);
router.post('/api/hide', hidePostHandler);
router.post('/api/unhide', unhidePostHandler);
router.post('/api/del', deleteHandler);

router.post('/api/comment', addCommentHandler);
router.post('/api/save', saveHandler);
router.post('/api/unsave', unsaveHandler);

export default router;
