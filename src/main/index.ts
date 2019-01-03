'use strict';

import 'reflect-metadata';
import { UserManagerApplication } from './UserManagerApplication';

global['app-name'] = "user-manager";

export default new UserManagerApplication().init();