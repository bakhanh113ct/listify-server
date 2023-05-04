import { Router } from 'express';
import {
  registerController,
  loginController,
  logoutController,
  refreshTokenController,
} from '../controllers/auth.controller';
import { verifyAccessToken } from '../utils/jwt_service';

const router: Router = Router();

// [POST] /auth/register -> Create new user
router.post('/register', registerController);

// [POST] /auth/login -> User login
router.post('/login', loginController);

// [DELETE] /auth/logout -> User logout
router.delete('/logout', verifyAccessToken, logoutController);

// [POST] /auth/refresh-token -> Create new access token and refresh token
router.post('/refresh-token', refreshTokenController);

export default router;
