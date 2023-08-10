import express from 'express';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import eformidable from 'express-formidable';
import manageUsersRouter from './manageusers.js';
import insertBookRouter from './insertbook.js';
import deleteBookRouter from './deletebook.js';

const adminRightsRouter = express.Router();

adminRightsRouter.use('/manageusers', manageUsersRouter);

const uploadDir = path.join(process.cwd(), 'public/uploadDir');

// creating uploadDir if it does not exist
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir);
}

adminRightsRouter.use('/insertbook', eformidable({ uploadDir, keepExtensions: true }));

adminRightsRouter.use('/insertbook', insertBookRouter);

adminRightsRouter.use('/deletebook', deleteBookRouter);

export default adminRightsRouter;
