import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// @desc    Create a reservation
// @route   POST /api/reservations
// @access  Public
import fs from 'fs';

export const createReservation = async (req, res) => {
    const { hotelId, productId, customerPhone, date } = req.body;
    const userId = req.user ? req.user.id : null;

    // fs.appendFileSync('backend_debug.log', `\n[Reservation] Creating for userId: ${userId}`);
    console.log(`[Reservation] Creating for userId: ${userId}`);

    try {
        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (!product.isAvailable) {
            return res.status(400).json({ message: 'Product is not available' });
        }

        // Check for existing reservation for this product on this date
        // Assuming date is significant (e.g., booking a room/table for a day)
        // Ensure date comparison ignores time component if needed, or precise match
        // For simplicity, comparing exact ISO string or Date object range if needed.
        // Prisma Compare:
        const requestDate = new Date(date);

        // Define start and end of the requested day to check overlap
        const startOfDay = new Date(requestDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(requestDate.setHours(23, 59, 59, 999));

        const existingReservation = await prisma.reservation.findFirst({
            where: {
                productId,
                date: {
                    gte: startOfDay,
                    lte: endOfDay
                },
                status: {
                    not: 'CANCELLED'
                }
            }
        });

        if (existingReservation) {
            return res.status(409).json({ message: 'This item is already reserved for the selected date.' });
        }

        const reservation = await prisma.reservation.create({
            data: {
                hotelId,
                productId,
                customerPhone,
                date: requestDate,
                userId,
            },
        });

        res.status(201).json(reservation);
    } catch (error) {
        if (error.code === 'P2003') {
            const field = error.meta?.field_name || error.message;
            if (field.includes('userId')) {
                return res.status(400).json({ message: 'User identity mismatch. Please log out and log in again.' });
            }
            if (field.includes('productId')) {
                return res.status(400).json({ message: 'The selected item is no longer available. Please refresh the page.' });
            }
            if (field.includes('hotelId')) {
                return res.status(400).json({ message: 'Hotel not found. Please refresh the page.' });
            }
            return res.status(400).json({ message: 'Invalid data reference (Foreign Key Failed).' });
        }
        console.error('Reservation Error:', error);
        res.status(500).json({ message: error.message || 'Reservation failed' });
    }
};

// @desc    Get reservations for a hotel
// @route   GET /api/reservations/hotel/:hotelId
// @access  Hotel Admin
export const getReservations = async (req, res) => {
    const hotelId = req.params.hotelId;

    // Security check: Ensure the requester is the admin of this hotel
    if (req.user.role !== 'SUPER_ADMIN' && req.user.hotelId !== hotelId) {
        return res.status(403).json({ message: 'Not authorized to view these reservations' });
    }

    try {
        const reservations = await prisma.reservation.findMany({
            where: { hotelId },
            include: {
                product: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's own reservations
// @route   GET /api/reservations/my-reservations
// @access  Private (User)
export const getUserReservations = async (req, res) => {
    try {
        const reservations = await prisma.reservation.findMany({
            where: { userId: req.user.id },
            include: {
                product: true,
                hotel: { select: { name: true, location: true } }
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update reservation status (User can mark as attended/received, Admin can do all)
export const updateReservationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const userId = req.user.id;

        const reservation = await prisma.reservation.findUnique({
            where: { id },
            // Include product to check type if needed - but we trust frontend mostly for specific buttons
        });

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        // Authorization: Owner OR Admin OR Hotel Admin
        const isOwner = reservation.userId === userId;
        const isAdmin = req.user.role === 'SUPER_ADMIN' || req.user.role === 'HOTEL_ADMIN';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to update this reservation' });
        }

        const updatedReservation = await prisma.reservation.update({
            where: { id },
            data: { status }
        });

        res.json(updatedReservation);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update reservation status', error: error.message });
    }
};
