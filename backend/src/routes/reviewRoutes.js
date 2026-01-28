// This file has paths for reviews

import * as reviewController from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

export const handleReviewRoutes = async (req, res, pathname, method, runMiddleware) => {
    // add a review
    if (pathname === '/api/reviews' && method === 'POST') {
        if (await runMiddleware(req, res, protect)) {
            return reviewController.createReview(req, res);
        }
        return true;
    }

    // get reviews for a hotel
    const reviewsHotelMatch = pathname.match(/^\/api\/reviews\/([a-zA-Z0-9-]+)$/);
    if (reviewsHotelMatch && method === 'GET') {
        req.params = { hotelId: reviewsHotelMatch[1] };
        return reviewController.getReviewsByHotel(req, res);
    }

    return false;
};
