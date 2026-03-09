// This file has the paths for auth like login and signup

import * as authController from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

export const handleAuthRoutes = async (req, res, pathname, method, runMiddleware) => {
    // login
    if (pathname === '/api/auth/login' && method === 'POST') {
        await authController.login(req, res);
        return true;
    }

    // signup
    if (pathname === '/api/auth/signup' && method === 'POST') {
        await authController.signup(req, res);
        return true;
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
        await authController.forgotPassword(req, res);
        return true;
    }

    // reset password
    const resetPwdMatch = pathname.match(/^\/api\/auth\/reset-password\/([\w-]+)$/);
    if (resetPwdMatch && method === 'POST') {
        req.params = { token: resetPwdMatch[1] };
        await authController.resetPassword(req, res);
        return true;
    }

    return false; // not handled here
};
