import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// @desc    Create a new hotel and its admin
// @route   POST /api/hotels
// @access  Super Admin
export const createHotel = async (req, res) => {
    const { name, location, description, adminEmail, adminPassword, image, openingTime, closingTime } = req.body;

    try {
        // Check if admin email already exists
        const userExists = await prisma.user.findUnique({
            where: { email: adminEmail },
        });

        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        // Transaction to create user and hotel
        const result = await prisma.$transaction(async (prisma) => {
            const user = await prisma.user.create({
                data: {
                    email: adminEmail,
                    password: hashedPassword,
                    role: 'HOTEL_ADMIN',
                },
            });

            const hotel = await prisma.hotel.create({
                data: {
                    name,
                    location,
                    description,
                    image,
                    openingTime: openingTime || "08:00",
                    closingTime: closingTime || "22:00",
                    adminId: user.id,
                },
            });

            return { hotel, user };
        });

        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all hotels
// @route   GET /api/hotels
// @access  Public
export const getHotels = async (req, res) => {
    try {
        const { showSuspended } = req.query;

        const where = {};
        if (showSuspended !== 'true') {
            where.isSuspended = false;
        }

        const hotels = await prisma.hotel.findMany({
            where,
            include: {
                admin: {
                    select: {
                        id: true,
                        email: true
                    }
                }
            }
        });
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get hotel by ID
// @route   GET /api/hotels/:id
// @access  Public
export const getHotelById = async (req, res) => {
    try {
        const hotel = await prisma.hotel.findUnique({
            where: { id: req.params.id },
            include: {
                products: true,
                reviews: true,
                announcements: true,
            },
        });

        if (hotel) {

            // Calculate Average Rating
            let averageRating = hotel.rating; // Default to Admin assigned rating
            if (hotel.reviews && hotel.reviews.length > 0) {
                const sum = hotel.reviews.reduce((acc, review) => acc + review.rating, 0);
                averageRating = (sum / hotel.reviews.length).toFixed(1);
            }

            // Override rating in response object
            const hotelResponse = { ...hotel, rating: averageRating };
            res.json(hotelResponse);
        } else {
            res.status(404).json({ message: 'Hotel not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete hotel
// @route   DELETE /api/hotels/:id
// @access  Super Admin
export const deleteHotel = async (req, res) => {
    try {
        const hotel = await prisma.hotel.findUnique({
            where: { id: req.params.id }
        });

        if (!hotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        await prisma.$transaction([
            prisma.hotel.delete({ where: { id: req.params.id } }),
            prisma.user.delete({ where: { id: hotel.adminId } })
        ]);

        res.json({ message: 'Hotel and Admin removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Suspend/Unsuspend hotel
// @route   PUT /api/hotels/:id/suspend
// @access  Super Admin
export const suspendHotel = async (req, res) => {
    try {
        const { id } = req.params;
        const { isSuspended } = req.body; // true or false

        const hotel = await prisma.hotel.update({
            where: { id },
            data: { isSuspended },
        });

        res.json(hotel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update hotel details (Hours, Status, Image)
// @route   PUT /api/hotels/:id
// @access  Hotel Admin
export const updateHotel = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, location, image, openingTime, closingTime, isClosed } = req.body;

        // Security check: Ensure the requester is the admin of this hotel or Super Admin
        if (req.user.role !== 'SUPER_ADMIN' && req.user.hotelId !== id) {
            return res.status(403).json({ message: 'Not authorized to update this hotel' });
        }

        const hotel = await prisma.hotel.update({
            where: { id },
            data: {
                name,
                description,
                location,
                image,
                openingTime,
                closingTime,
                isClosed // Manual open/close toggle
            },
        });

        res.json(hotel);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


