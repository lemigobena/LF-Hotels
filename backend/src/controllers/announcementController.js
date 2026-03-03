import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// @desc    Create an announcement
// @route   POST /api/announcements
// @access  Hotel Admin
export const createAnnouncement = async (req, res) => {
    const { title, content } = req.body;
    const hotelId = req.user.hotelId; // Injected by protect auth middleware

    try {
        const announcement = await prisma.announcement.create({
            data: {
                title,
                content,
                hotelId
            }
        });
        res.status(201).json(announcement);
    } catch (error) {
        res.status(400).json({ message: 'Could not create announcement', error: error.message });
    }
};

// @desc    Get announcements for a hotel
// @route   GET /api/announcements/hotel/:hotelId
// @access  Public
export const getAnnouncementsByHotel = async (req, res) => {
    try {
        const announcements = await prisma.announcement.findMany({
            where: { hotelId: req.params.hotelId },
            orderBy: { createdAt: 'desc' }
        });
        res.json(announcements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete an announcement
// @route   DELETE /api/announcements/:id
// @access  Hotel Admin
export const deleteAnnouncement = async (req, res) => {
    try {
        const announcement = await prisma.announcement.findUnique({
            where: { id: req.params.id }
        });

        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' });
        }

        if (announcement.hotelId !== req.user.hotelId && req.user.role !== 'SUPER_ADMIN') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await prisma.announcement.delete({
            where: { id: req.params.id }
        });

        res.json({ message: 'Announcement removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
