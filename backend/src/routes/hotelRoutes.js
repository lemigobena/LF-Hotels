// This file has paths for hotel stuff

import * as hotelController from '../controllers/hotelController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

export const handleHotelRoutes = async (req, res, pathname, method, runMiddleware) => {
    // get all hotels
    if (pathname === '/api/hotels' && method === 'GET') {
        return hotelController.getHotels(req, res);
    }

    // add a new hotel (admin only)
    if (pathname === '/api/hotels' && method === 'POST') {
        if (await runMiddleware(req, res, protect)) {
            if (await runMiddleware(req, res, adminOnly)) {
                return hotelController.createHotel(req, res);
            }
        }
        return true;
    }

    // hotel ID paths
    const hotelIdMatch = pathname.match(/^\/api\/hotels\/([a-zA-Z0-9-]+)$/);
    const hotelSuspendMatch = pathname.match(/^\/api\/hotels\/([a-zA-Z0-9-]+)\/suspend$/);

    // suspend hotel
    if (hotelSuspendMatch && method === 'PUT') {
        if (await runMiddleware(req, res, protect)) {
            if (await runMiddleware(req, res, adminOnly)) {
                req.params = { id: hotelSuspendMatch[1] };
                return hotelController.suspendHotel(req, res);
            }
        }
        return true;
    }

    // specific hotel actions
    if (hotelIdMatch) {
        req.params = { id: hotelIdMatch[1] };
        if (method === 'GET') {
            return hotelController.getHotelById(req, res);
        }
        if (method === 'DELETE') {
            if (await runMiddleware(req, res, protect)) {
                if (await runMiddleware(req, res, adminOnly)) {
                    return hotelController.deleteHotel(req, res);
                }
            }
            return true;
        }
        if (method === 'PUT') {
            if (await runMiddleware(req, res, protect)) {
                return hotelController.updateHotel(req, res);
            }
            return true;
        }
    }

    return false;
};
