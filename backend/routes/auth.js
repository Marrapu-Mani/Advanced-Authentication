import express from 'express';

import { signUp, verifyEmail, logOut, logIn, forgotPassword, resetPassword, checkAuth } from '../controllers/auth.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// /auth/check-auth => get
router.get('/check-auth', verifyToken, checkAuth);

// /auth/signup => post
router.post('/signup', signUp);

// /auth/verify-email => post
router.post('/verify-email', verifyEmail);

// /auth/logout => post
router.post('/logout', logOut);

// /auth/login => post
router.post('/login', logIn);

// /auth/forgot-password => post
router.post('/forgot-password', forgotPassword);

// /auth/reset-password/:token => post
router.post('/reset-password/:token', resetPassword);

export default router;