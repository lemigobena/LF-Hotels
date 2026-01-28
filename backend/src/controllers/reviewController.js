import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// @desc    Create a review
// @route   POST /api/reviews
// @access  Protected
export const createReview = async (req, res) => {
    const { hotelId, rating, comment } = req.body;
    // userId is injected by protect middleware
    const userId = req.user.id;

    try {
        const review = await prisma.review.create({
            data: {
                hotelId,
                rating: parseInt(rating),
                comment,
                // If Review model has userId, add it here. Based on existing code, it does not seem to linked to user in schema? 
                // But the requirement might want it. For now, we stick to existing logic.
            }
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ message: 'Could not submit review', error: error.message });
    }
};

// @desc    Get reviews for a hotel
// @route   GET /api/reviews/:hotelId
// @access  Public
export const getReviewsByHotel = async (req, res) => {
    // req.params.hotelId will be populated by our manual router
    try {
        const reviews = await prisma.review.findMany({
            where: { hotelId: req.params.hotelId },
            orderBy: { createdAt: 'desc' },
            take: 10
        });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
