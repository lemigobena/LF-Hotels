import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // 0. Clean up database
    console.log('🧹 Clearing old data...');
    await prisma.review.deleteMany();
    await prisma.announcement.deleteMany();
    await prisma.product.deleteMany();
    await prisma.hotel.deleteMany();
    await prisma.user.deleteMany();
    console.log('✨ Database cleared.');

    // 1. Create Super Admin
    const superAdminEmail = 'superadmin@lf.com';
    const hashedPassword = await bcrypt.hash('password123', 10);

    const superAdmin = await prisma.user.upsert({
        where: { email: superAdminEmail },
        update: {},
        create: {
            email: superAdminEmail,
            password: hashedPassword,
            role: 'SUPER_ADMIN',
        },
    });
    console.log(`✅ Super Admin created: ${superAdmin.email}`);

    // 2. Define 5 Hotels Data (Real Ethiopian Hotels)
    const hotelsData = [
        {
            name: 'Sheraton Addis',
            location: 'Taitu St, Addis Ababa',
            image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1024&q=80',
            description: 'A Sanctuary of Grandeur. The Sheraton Addis, a Luxury Collection Hotel, Addis Ababa, sits opposite the National Palace.',
            adminEmail: 'admin.sheraton@lf.com',
            products: [
                { name: 'Doro Wat', type: 'MEAL', price: 45.0, image: 'https://images.unsplash.com/photo-1594040226829-7f251ab46d80?auto=format&fit=crop&q=80&w=500' },
                { name: 'Kitfo Special', type: 'MEAL', price: 40.0, image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&q=80&w=500' },
                { name: 'Veggie Combo', type: 'MEAL', price: 30.0, image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&q=80&w=500' },
                { name: 'Tibs Platter', type: 'MEAL', price: 35.0, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=500' },
                { name: 'Shiro Tagamino', type: 'MEAL', price: 25.0, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=500' },

                { name: 'Executive Suite', type: 'ROOM', price: 450.0, image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=500' },
                { name: 'Club Room', type: 'ROOM', price: 350.0, image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=500' },
                { name: 'Classic Room', type: 'ROOM', price: 250.0, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=500' },
                { name: 'Junior Suite', type: 'ROOM', price: 300.0, image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=500' },
                { name: 'Presidential Villa', type: 'ROOM', price: 2500.0, image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=500' },

                { name: 'Swedish Massage', type: 'MASSAGE', price: 80.0, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3dlZGlzaCUyMG1hc3NhZ2V8ZW58MHx8MHx8fDA%3D' },
                { name: 'Deep Tissue', type: 'MASSAGE', price: 90.0, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=500' },
                { name: 'Aromatherapy', type: 'MASSAGE', price: 85.0, image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=500' },
                { name: 'Hot Stone', type: 'MASSAGE', price: 100.0, image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhvdCUyMHN0b25lJTIwbWFzc2FnZXxlbnwwfHwwfHx8MA%3D%3D' },
                { name: 'Reflexology', type: 'MASSAGE', price: 60.0, image: 'https://images.unsplash.com/photo-1542848284-8afa78a08ccb?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVmbGV4b2xvZ3l8ZW58MHx8MHx8fDA%3D' },

                { name: 'Live Jazz Night', type: 'ENTERTAINMENT', price: 20.0, image: 'https://images.unsplash.com/photo-1757439160077-dd5d62a4d851?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGl2ZSUyMGphenolMjBiYW5kfGVufDB8fDB8fHww' },
                { name: 'Cultural Dance', type: 'ENTERTAINMENT', price: 25.0, image: 'https://images.unsplash.com/photo-1508215885820-4585e56135c8?auto=format&fit=crop&q=80&w=500' },
                { name: 'Piano Bar', type: 'ENTERTAINMENT', price: 0.0, image: 'https://images.unsplash.com/photo-1648231838793-b7797b4ab4b4?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGlhbm8lMjBiYXJ8ZW58MHx8MHx8fDA%3D' },
                { name: 'Pool Party', type: 'ENTERTAINMENT', price: 30.0, image: 'https://images.unsplash.com/photo-1568145675395-66a2eda0c6d7?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBvb2wlMjBwYXJ0eXxlbnwwfHwwfHx8MA%3D%3D' },
                { name: 'Art Exhibition', type: 'ENTERTAINMENT', price: 10.0, image: 'https://images.unsplash.com/photo-1566954979172-eaba308acdf0?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXJ0JTIwZXhoaWJpdGlvbnxlbnwwfHwwfHx8MA%3D%3D' },
            ],
            announcements: [
                { title: 'New Year Gala', content: 'Join us for a spectacular New Year celebration with live music and fireworks.' },
                { title: 'Spa Discount', content: 'Get 20% off on all massage treatments this weekend.' },
                { title: 'Sunday Brunch', content: 'Enjoy our famous Sunday Brunch with unlimited champagne.' },
                { title: 'Pool Renovation', content: 'Our main pool will be closed for maintenance next Tuesday.' },
                { title: 'Guest Chef', content: 'Welcoming Chef Marcus for a special culinary week.' },
            ]
        },
        {
            name: 'Ethiopian Skylight Hotel',
            location: 'Bole International Airport',
            image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1024',
            description: 'The largest hotel in Ethiopia, offering world-class amenities and convenience.',
            adminEmail: 'admin.skylight@lf.com',
            products: [
                { name: 'Chinese Buffet', type: 'MEAL', price: 50.0, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=500' },
                { name: 'Ethiopian Platter', type: 'MEAL', price: 40.0, image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&q=80&w=500' },
                { name: 'Burger & Fries', type: 'MEAL', price: 20.0, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=500' },
                { name: 'Pasta Carbonara', type: 'MEAL', price: 25.0, image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&q=80&w=500' },
                { name: 'Grilled Fish', type: 'MEAL', price: 35.0, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=500' },

                { name: 'Standard King', type: 'ROOM', price: 180.0, image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=500' },
                { name: 'Twin Room', type: 'ROOM', price: 200.0, image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=500' },
                { name: 'Executive King', type: 'ROOM', price: 250.0, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=500' },
                { name: 'Diplomatic Suite', type: 'ROOM', price: 800.0, image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=500' },
                { name: 'Presidential Suite', type: 'ROOM', price: 2000.0, image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=500' },

                { name: 'Gym Day Pass', type: 'SPA', price: 15.0, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=500' },
                { name: 'Sauna Session', type: 'SPA', price: 20.0, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=500' },
                { name: 'Steam Bath', type: 'SPA', price: 20.0, image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&q=80&w=500' },
                { name: 'Jacuzzi', type: 'SPA', price: 25.0, image: 'https://images.unsplash.com/photo-1544843776-7c98a52e08a4?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8amFjdXp6aXxlbnwwfHwwfHx8MA%3D%3D' },
                { name: 'Yoga Class', type: 'SPA', price: 10.0, image: 'https://images.unsplash.com/photo-1651077837628-52b3247550ae?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8eW9nYSUyMGNsYXNzfGVufDB8fDB8fHww' },

                { name: 'Cinema Ticket', type: 'ENTERTAINMENT', price: 10.0, image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=500' },
                { name: 'Live Band', type: 'ENTERTAINMENT', price: 15.0, image: 'https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&q=80&w=500' },
                { name: 'Kids Zone', type: 'ENTERTAINMENT', price: 5.0, image: 'https://images.unsplash.com/photo-1579956731828-a523975c9dc1?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8a2lkcyUyMGluZG9vciUyMHBsYXlncm91bmR8ZW58MHx8MHx8fDA%3D' },
                { name: 'Bowling', type: 'ENTERTAINMENT', price: 12.0, image: 'https://images.unsplash.com/photo-1538511059256-46e76f13f071?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Ym93bGluZyUyMGFsbGV5fGVufDB8fDB8fHww' },
                { name: 'Karaoke', type: 'ENTERTAINMENT', price: 8.0, image: 'https://images.unsplash.com/photo-1738156684532-b79bfb589344?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8a2FyYW9rZSUyMG1pY3xlbnwwfHwwfHx8MA%3D%3D' },
            ],
            announcements: [
                { title: 'Airport Shuttle', content: 'Free shuttle service available every 30 minutes.' },
                { title: 'Grand Opening', content: 'Celebrating our new wing opening next month.' },
                { title: 'Happy Hour', content: 'Half price drinks at the lobby bar 5-7 PM.' },
                { title: 'Conference Discount', content: 'Book your conference now and get 15% off.' },
                { title: 'Kids Stay Free', content: 'Children under 12 stay free this summer.' },
            ]
        },
        {
            name: 'Haile Resort Hawassa',
            location: 'Hawassa, Lake View',
            image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=1024',
            description: 'A perfect getaway by the beautiful Lake Hawassa.',
            adminEmail: 'admin.haile@lf.com',
            products: [
                { name: 'Fresh Tilapia', type: 'MEAL', price: 20.0, image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&q=80&w=500' },
                { name: 'Pizza Margherita', type: 'MEAL', price: 15.0, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=500' },
                { name: 'Avocado Salad', type: 'MEAL', price: 10.0, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=500' },
                { name: 'Spaghetti Bolognese', type: 'MEAL', price: 18.0, image: 'https://images.unsplash.com/photo-1622973536968-3ead9e780960?auto=format&fit=crop&q=80&w=500' },
                { name: 'Club Sandwich', type: 'MEAL', price: 12.0, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=500' },

                { name: 'Lake View Room', type: 'ROOM', price: 120.0, image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=500' },
                { name: 'Garden View Room', type: 'ROOM', price: 100.0, image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=500' },
                { name: 'Family Suite', type: 'ROOM', price: 200.0, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=500' },
                { name: 'Executive Suite', type: 'ROOM', price: 180.0, image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=500' },
                { name: 'Bungalow', type: 'ROOM', price: 250.0, image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=500' },

                { name: 'Boat Trip', type: 'ENTERTAINMENT', price: 30.0, image: 'https://images.unsplash.com/photo-1677967062624-a77fd15edc0d?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bGFrZSUyMGJvYXQlMjB0cmlwfGVufDB8fDB8fHww' },
                { name: 'Fishing Gear', type: 'ENTERTAINMENT', price: 15.0, image: 'https://images.unsplash.com/photo-1535036997436-f088d7774803?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8ZmlzaGluZyUyMHJvZCUyMGxha2V8ZW58MHx8MHx8fDA%3D' },
                { name: 'Pool Table', type: 'ENTERTAINMENT', price: 5.0, image: 'https://images.unsplash.com/photo-1695575509472-9974356e6ae1?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fHBvb2wlMjB0YWJsZSUyMGJpbGxpYXJkc3xlbnwwfHwwfHx8MA%3D%3D' },
                { name: 'Bike Rental', type: 'ENTERTAINMENT', price: 10.0, image: 'https://images.unsplash.com/photo-1546010153-25e8168dd9d2?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bW91bnRhaW4lMjBiaWtlJTIwcmVudGFsfGVufDB8fDB8fHww' },
                { name: 'Tennis Court', type: 'ENTERTAINMENT', price: 12.0, image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=500' },

                { name: 'Full Body Massage', type: 'MASSAGE', price: 60.0, image: 'https://images.unsplash.com/photo-1745327883508-b6cd32e5dde5?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZnVsbCUyMGJvZHklMjBtYXNzYWdlJTIwc3BhfGVufDB8fDB8fHww' },
                { name: 'Face Treatment', type: 'MASSAGE', price: 40.0, image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=500' },
                { name: 'Manicure', type: 'MASSAGE', price: 20.0, image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&q=80&w=500' },
                { name: 'Pedicure', type: 'MASSAGE', price: 25.0, image: 'https://images.unsplash.com/photo-1664643411326-6c589531be3c?q=80&w=1080&auto=format&fit=crop' },
                { name: 'Hair Salon', type: 'MASSAGE', price: 30.0, image: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&q=80&w=500' },
            ],
            announcements: [
                { title: 'Lake Tour', content: 'Guided boat tours available every morning at 9 AM.' },
                { title: 'Weekend BBQ', content: 'Join us for a lakeside BBQ every Saturday.' },
                { title: 'Tennis Tournament', content: 'Annual amateur tennis tournament registration open.' },
                { title: 'Wedding Package', content: 'New all-inclusive wedding packages available.' },
                { title: 'Live Music', content: 'Enjoy traditional music every Friday night.' },
            ]
        },
        {
            name: 'Kuriftu Resort & Spa',
            location: 'Bishoftu',
            image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&q=80&w=1024',
            description: 'A luxurious spa resort offering peace and tranquility.',
            adminEmail: 'admin.kuriftu@lf.com',
            products: [
                { name: 'Grilled Lamb', type: 'MEAL', price: 35.0, image: 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?auto=format&fit=crop&q=80&w=500' },
                { name: 'Fish Goulash', type: 'MEAL', price: 30.0, image: 'https://images.unsplash.com/photo-1535914254981-b5012eebbd15?auto=format&fit=crop&q=80&w=500' },
                { name: 'Special Burger', type: 'MEAL', price: 22.0, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&q=80&w=500' },
                { name: 'Chicken Breast', type: 'MEAL', price: 28.0, image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=500' },
                { name: 'Caesar Salad', type: 'MEAL', price: 18.0, image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&q=80&w=500' },

                { name: 'Lake View Suite', type: 'ROOM', price: 250.0, image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=500' },
                { name: 'Garden Bungalow', type: 'ROOM', price: 220.0, image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=500' },
                { name: 'Standard Room', type: 'ROOM', price: 180.0, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=500' },
                { name: 'Deluxe Room', type: 'ROOM', price: 200.0, image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=500' },
                { name: 'Presidential Suite', type: 'ROOM', price: 500.0, image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=500' },

                { name: 'Couples Massage', type: 'SPA', price: 120.0, image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=500' },
                { name: 'Facial Scrub', type: 'SPA', price: 50.0, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=500' },
                { name: 'Manicure & Pedicure', type: 'SPA', price: 40.0, image: 'https://images.unsplash.com/photo-1664643411326-6c589531be3c?q=80&w=1080&auto=format&fit=crop' },
                { name: 'Hair Treatment', type: 'SPA', price: 60.0, image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=500' },
                { name: 'Steam & Sauna', type: 'SPA', price: 30.0, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=500' },

                { name: 'Kayaking', type: 'ENTERTAINMENT', price: 20.0, image: 'https://images.unsplash.com/photo-1677967062624-a77fd15edc0d?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bGFrZSUyMGJvYXQlMjB0cmlwfGVufDB8fDB8fHww' },
                { name: 'Water Park', type: 'ENTERTAINMENT', price: 25.0, image: 'https://images.unsplash.com/photo-1660510033022-d99da82f11a7?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHdhdGVyJTIwcGFyayUyMHNsaWRlc3xlbnwwfHwwfHx8MA%3D%3D' },
                { name: 'Cinema', type: 'ENTERTAINMENT', price: 10.0, image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=500' },
                { name: 'Bonfire Night', type: 'ENTERTAINMENT', price: 15.0, image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=500' },
                { name: 'Creative Corner', type: 'ENTERTAINMENT', price: 5.0, image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=500' },
            ],
            announcements: [
                { title: 'Water Park Open', content: 'Our new water park is now open for all guests.' },
                { title: 'Summer Sale', content: 'Book 3 nights, get 1 free this summer.' },
                { title: 'Spa Weekend', content: 'Special packages for weekend spa getaways.' },
                { title: 'Family Brunch', content: 'Every Sunday bring the whole family for brunch.' },
                { title: 'Movie Night', content: 'Free movie screening at the pool every Friday.' },
            ]
        },
        {
            name: 'Hilton Addis Ababa',
            location: 'Menelik II Ave, Addis Ababa',
            image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80&w=1024',
            description: 'A landmark hotel with thermal pools and distinct architecture.',
            adminEmail: 'admin.hilton@lf.com',
            products: [
                { name: 'Club Sandwich', type: 'MEAL', price: 28.0, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&q=80&w=500' },
                { name: 'Hilton Burger', type: 'MEAL', price: 32.0, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=500' },
                { name: 'Pizza Pepperoni', type: 'MEAL', price: 30.0, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&q=80&w=500' },
                { name: 'Lasagna', type: 'MEAL', price: 35.0, image: 'https://images.unsplash.com/photo-1767065583952-e932c354bca6?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGFzYWduYSUyMGRpc2h8ZW58MHx8MHx8fDA%3D' },
                { name: 'Steak Tartare', type: 'MEAL', price: 40.0, image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=500' },

                { name: 'Guest Room', type: 'ROOM', price: 220.0, image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=500' },
                { name: 'Suite', type: 'ROOM', price: 400.0, image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=500' },
                { name: 'Executive Room', type: 'ROOM', price: 300.0, image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=500' },
                { name: 'Duplex Suite', type: 'ROOM', price: 600.0, image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=500' },
                { name: 'Apartment', type: 'ROOM', price: 500.0, image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=500' },

                { name: 'Thermal Pool', type: 'SPA', price: 25.0, image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=500' },
                { name: 'Massage Therapy', type: 'SPA', price: 90.0, image: 'https://images.unsplash.com/photo-1745327883508-b6cd32e5dde5?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZnVsbCUyMGJvZHklMjBtYXNzYWdlJTIwc3BhfGVufDB8fDB8fHww' },
                { name: 'Sauna', type: 'SPA', price: 20.0, image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80&w=500' },
                { name: 'Squash Court', type: 'SPA', price: 15.0, image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=500' },
                { name: 'Gym Access', type: 'SPA', price: 20.0, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=500' },

                { name: 'Mini Golf', type: 'ENTERTAINMENT', price: 10.0, image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=500' },
                { name: 'Tennis', type: 'ENTERTAINMENT', price: 15.0, image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&q=80&w=500' },
                { name: 'Playground', type: 'ENTERTAINMENT', price: 0.0, image: 'https://images.unsplash.com/photo-1579956731828-a523975c9dc1?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8a2lkcyUyMGluZG9vciUyMHBsYXlncm91bmR8ZW58MHx8MHx8fDA%3D' },
                { name: 'Live Band', type: 'ENTERTAINMENT', price: 10.0, image: 'https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&q=80&w=500' },
                { name: 'Art Gallery', type: 'ENTERTAINMENT', price: 5.0, image: 'https://images.unsplash.com/photo-1566954979172-eaba308acdf0?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXJ0JTIwZXhoaWJpdGlvbnxlbnwwfHwwfHx8MA%3D%3D' },
            ],
            announcements: [
                { title: 'Thermal Pool Maintenance', content: 'Thermal pool will be closed on Monday morning for cleaning.' },
                { title: 'New Menu Launch', content: 'Try our new international menu starting next week.' },
                { title: 'Wedding Fair', content: 'Visit our annual wedding fair this Sunday.' },
                { title: 'Business Lunch', content: 'Express business lunch served daily 12-2 PM.' },
                { title: 'Charity Run', content: 'Sign up for the charity run starting at the hotel.' },
            ]
        },
    ];

    // 3. Create Hotels, Admins, Products, and Announcements
    for (const hotelData of hotelsData) {
        // a. Create Hotel Admin
        const adminPassword = await bcrypt.hash('password123', 10);
        const admin = await prisma.user.upsert({
            where: { email: hotelData.adminEmail },
            update: {},
            create: {
                email: hotelData.adminEmail,
                password: adminPassword,
                role: 'HOTEL_ADMIN',
            },
        });

        // b. Create Hotel, linking to Admin
        const hotel = await prisma.hotel.upsert({
            where: { adminId: admin.id },
            update: {
                name: hotelData.name,
                location: hotelData.location,
                image: hotelData.image,
                description: hotelData.description,
            },
            create: {
                name: hotelData.name,
                location: hotelData.location,
                image: hotelData.image,
                description: hotelData.description,
                adminId: admin.id,
                openingTime: ["06:00", "08:00", "09:00", "24 Hours"][Math.floor(Math.random() * 4)],
                closingTime: ["22:00", "23:00", "00:00", "24 Hours"][Math.floor(Math.random() * 4)],
                rating: (Math.random() * 2 + 3).toFixed(1) * 1, // Random rating 3.0 - 5.0
            },
        });
        console.log(`🏨 Created Hotel: ${hotel.name} (Admin: ${admin.email})`);

        // c. Seed Products for the Hotel
        for (const prod of hotelData.products) {
            await prisma.product.create({
                data: {
                    hotelId: hotel.id,
                    name: prod.name,
                    type: prod.type,
                    price: prod.price,
                    image: prod.image,
                    description: `Delicious ${prod.name} at ${hotel.name}`,
                    isAvailable: true,
                },
            });
        }
        console.log(`   - Seeded ${hotelData.products.length} products`);

        // d. Seed Announcements
        if (hotelData.announcements) {
            for (const announcement of hotelData.announcements) {
                await prisma.announcement.create({
                    data: {
                        hotelId: hotel.id,
                        title: announcement.title,
                        content: announcement.content,
                    },
                });
            }
            console.log(`   - Seeded ${hotelData.announcements.length} announcements`);
        }

        // e. Seed Reviews (Optional Mock Data)
        await prisma.review.create({
            data: {
                hotelId: hotel.id,
                rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
                comment: "Amazing experience! Highly recommended.",
            }
        });
    }

    console.log('✨ Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
