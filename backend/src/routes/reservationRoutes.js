// This file has paths for reservations

import * as reservationController from '../controllers/reservationController.js';
import { protect, hotelAdminOnly } from '../middleware/authMiddleware.js';

export const handleReservationRoutes = async (req, res, pathname, method, runMiddleware) => {
    // make a reservation
    if (pathname === '/api/reservations' && method === 'POST') {
        if (await runMiddleware(req, res, protect)) {
            return reservationController.createReservation(req, res);
        }
        return true;
    }

    // get my own reservations
    if (pathname === '/api/reservations/my-reservations' && method === 'GET') {
        if (await runMiddleware(req, res, protect)) {
            return reservationController.getUserReservations(req, res);
        }
        return true;
    }

    // get reservations for a hotel
    const reservationsHotelMatch = pathname.match(/^\/api\/reservations\/hotel\/([a-zA-Z0-9-]+)$/);
    if (reservationsHotelMatch && method === 'GET') {
        req.params = { hotelId: reservationsHotelMatch[1] };
        if (await runMiddleware(req, res, protect)) {
            if (await runMiddleware(req, res, hotelAdminOnly)) {
                return reservationController.getReservations(req, res);
            }
        }
        return true;
    }

    // change reservation status
    const reservationStatusMatch = pathname.match(/^\/api\/reservations\/([a-zA-Z0-9-]+)\/status$/);
    if (reservationStatusMatch && method === 'PUT') {
        req.params = { id: reservationStatusMatch[1] };
        if (await runMiddleware(req, res, protect)) {
            return reservationController.updateReservationStatus(req, res);
        }
        return true;
    }

    return false;
};
