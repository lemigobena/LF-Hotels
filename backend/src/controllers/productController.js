import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// @desc    Create a product
// @route   POST /api/products
// @access  Hotel Admin
export const createProduct = async (req, res) => {
    const { type, name, description, price, isAvailable, isSpecial, image } = req.body;
    const hotelId = req.user.hotelId; // From token
    console.log(`[ProductDebug] Creating Product. User: ${req.user.email}, HotelID: ${hotelId}`);

    if (!hotelId) {
        return res.status(400).json({ message: "User is not associated with a hotel" });
    }

    try {
        const product = await prisma.product.create({
            data: {
                hotelId,
                type,
                name,
                description,
                price: parseFloat(price),
                isAvailable: isAvailable ?? true,
                isSpecial: isSpecial ?? false,
                image,
            },
        });
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get products by hotel
// @route   GET /api/hotels/:hotelId/products
// @access  Public
export const getProductsByHotel = async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            where: { hotelId: req.params.hotelId },
            orderBy: {
                type: 'asc', // Group by type implicitly if sorted? Or distinct query?
            }
        });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Hotel Admin
export const updateProduct = async (req, res) => {
    const { type, name, description, price, isAvailable, isSpecial, image } = req.body;

    try {
        const product = await prisma.product.findUnique({
            where: { id: req.params.id }
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.hotelId !== req.user.hotelId && req.user.role !== 'SUPER_ADMIN') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const updatedProduct = await prisma.product.update({
            where: { id: req.params.id },
            data: {
                type: type || product.type,
                name: name || product.name,
                description: description || product.description,
                price: price ? parseFloat(price) : product.price,
                isAvailable: isAvailable !== undefined ? isAvailable : product.isAvailable,
                isSpecial: isSpecial !== undefined ? isSpecial : product.isSpecial,
                image: image || product.image,
            }
        });

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Hotel Admin
export const deleteProduct = async (req, res) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: req.params.id }
        });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Ensure the hotel admin owns this product
        if (product.hotelId !== req.user.hotelId && req.user.role !== 'SUPER_ADMIN') {
            return res.status(403).json({ message: 'Not authorized to delete this product' });
        }

        await prisma.product.delete({
            where: { id: req.params.id },
        });
        res.json({ message: 'Product removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
