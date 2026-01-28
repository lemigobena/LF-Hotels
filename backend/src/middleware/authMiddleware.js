// This is for authentication work
// It checks the tokens and roles

import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// This protects the routes
export const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token from 'Bearer <token>'
            token = req.headers.authorization.split(' ')[1];

            // Verify the token using the secret key
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch the user from the database and include related hotel if it exists
            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
                include: { hotel: true }
            });

            if (!user) {
                return res.status(401).json({ message: 'Not authorized, user not found' });
            }

            // Map hotelId for convenience in subsequent controller logic
            if (user.hotel) {
                user.hotelId = user.hotel.id;
            }

            console.log(`[AuthDebug] User: ${user.email}, Role: ${user.role}, Hotel: ${user.hotel ? user.hotel.name : 'NULL'}, HotelID: ${user.hotelId}`);

            // Attach user to req object for use in controllers
            req.user = user;
            next();
        } catch (error) {
            console.error('Auth Error:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

/**
 * Middleware to restrict access to Super Admins only.
 */
export const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'SUPER_ADMIN') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as super admin' });
    }
};

/**
 * Middleware to restrict access to Hotel Admins or Super Admins.
 */
export const hotelAdminOnly = (req, res, next) => {
    if (req.user && (req.user.role === 'HOTEL_ADMIN' || req.user.role === 'SUPER_ADMIN')) {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as hotel admin' });
    }
};
