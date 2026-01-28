// This file has paths for products

import * as productController from '../controllers/productController.js';
import { protect, hotelAdminOnly } from '../middleware/authMiddleware.js';

export const handleProductRoutes = async (req, res, pathname, method, runMiddleware) => {
    // add a product
    if (pathname === '/api/products' && method === 'POST') {
        if (await runMiddleware(req, res, protect)) {
            if (await runMiddleware(req, res, hotelAdminOnly)) {
                return productController.createProduct(req, res);
            }
        }
        return true;
    }

    // get products for a hotel
    const productsByHotelMatch = pathname.match(/^\/api\/products\/hotel\/([a-zA-Z0-9-]+)$/);
    if (productsByHotelMatch && method === 'GET') {
        req.params = { hotelId: productsByHotelMatch[1] };
        return productController.getProductsByHotel(req, res);
    }

    // specific product actions
    const productIdMatch = pathname.match(/^\/api\/products\/([a-zA-Z0-9-]+)$/);
    if (productIdMatch) {
        req.params = { id: productIdMatch[1] };
        if (method === 'PUT') {
            if (await runMiddleware(req, res, protect)) {
                if (await runMiddleware(req, res, hotelAdminOnly)) {
                    return productController.updateProduct(req, res);
                }
            }
            return true;
        }
        if (method === 'DELETE') {
            if (await runMiddleware(req, res, protect)) {
                if (await runMiddleware(req, res, hotelAdminOnly)) {
                    return productController.deleteProduct(req, res);
                }
            }
            return true;
        }
    }

    return false;
};
