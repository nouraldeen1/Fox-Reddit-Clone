import express from 'express';
import validateResource from '../middleware/validateResource';
import { searchSubredditSchema, searchNormalSchema } from '../schema/search.schema';
import {
  searchHomeHandler,
  searchSubredditHandler,
  getTrendingSearchesHandller,
} from '../controller/search.controller';
const router = express.Router();

router.route('/r/:subreddit/search').get(validateResource(searchSubredditSchema), searchSubredditHandler);

router.route('/r/search').get(validateResource(searchNormalSchema), searchHomeHandler);

router.route('/r/trendingSearch').get(getTrendingSearchesHandller);
export default router;
