import express from 'express';

import { getCurrentUser, login, signUp, updatePassword, updateProfile } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/auth.js';

const userRouter = express.Router();

userRouter.post('/signup',signUp);
userRouter.post('/login',login);

// Protected Routes

userRouter.get('/me',authMiddleware,getCurrentUser);
userRouter.put('/profile',authMiddleware,updateProfile);
userRouter.put('/password',authMiddleware,updatePassword);


export default userRouter;