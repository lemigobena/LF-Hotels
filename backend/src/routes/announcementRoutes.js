// This file has paths for announcements

import * as announcementController from '../controllers/announcementController.js';
import { protect, hotelAdminOnly } from '../middleware/authMiddleware.js';

export const handleAnnouncementRoutes = async (req, res, pathname, method, runMiddleware) => {
    // add an announcement
    if (pathname === '/api/announcements' && method === 'POST') {
        if (await runMiddleware(req, res, protect)) {
            if (await runMiddleware(req, res, hotelAdminOnly)) {
                return announcementController.createAnnouncement(req, res);
            }
        }
        return true;
    }

    // get announcements for a hotel
    const announcementsHotelMatch = pathname.match(/^\/api\/announcements\/hotel\/([a-zA-Z0-9-]+)$/);
    if (announcementsHotelMatch && method === 'GET') {
        req.params = { hotelId: announcementsHotelMatch[1] };
        announcementController.getAnnouncementsByHotel(req, res);
        return true;
    }

    // specific announcement actions
    const announcementIdMatch = pathname.match(/^\/api\/announcements\/([a-zA-Z0-9-]+)$/);
    if (announcementIdMatch && method === 'DELETE') {
        req.params = { id: announcementIdMatch[1] };
        if (await runMiddleware(req, res, protect)) {
            if (await runMiddleware(req, res, hotelAdminOnly)) {
                return announcementController.deleteAnnouncement(req, res);
            }
        }
        return true;
    }

    return false;
};
