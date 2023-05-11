import { DateTime } from './Datetime';
import * as PostTypes from './Post';
import * as CommentTypes from './Comment';
import * as UserTypes from './User';

export const types = {
  DateTime,
  ...PostTypes,
  ...CommentTypes,
  ...UserTypes,
};
