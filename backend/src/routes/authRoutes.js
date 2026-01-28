// This file has the paths for auth like login and signup

import * as authController from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

export const handleAuthRoutes = async (req, res, pathname, method, runMiddleware) => {
    // login
    if (pathname === '/api/auth/login' && method === 'POST') {
        return authController.login(req, res);
    }

    // signup
    if (pathname === '/api/auth/signup' && method === 'POST') {
        return authController.signup(req, res);
    }

    // update my profile
    if (pathname === '/api/auth/profile' && method === 'PUT') {
        if (await runMiddleware(req, res, protect)) {
            return authController.updateProfile(req, res);
        }
        return true;
    }

    // get my data
    if (pathname === '/api/auth/me' && method === 'GET') {
        if (await runMiddleware(req, res, protect)) {
            return authController.getMe(req, res);
        }
        return true;
    }

    // forgot password
    if (pathname === '/api/auth/forgot-password' && method === 'POST') {
        return authController.forgotPassword(req, res);
    }

    // reset password
    const resetPwdMatch = pathname.match(/^\/api\/auth\/reset-password\/([\w-]+)$/);
    if (resetPwdMatch && method === 'POST') {
        req.params = { token: resetPwdMatch[1] };
        return authController.resetPassword(req, res);
    }

    return false; // not handled here
};
