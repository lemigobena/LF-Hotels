import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Plus, Trash2, Calendar, Star, Utensils, Bed, List, Settings } from 'lucide-react';
import Navbar from '../components/Navbar';
import CalendarComponent from '../components/CalendarComponent'; // Can reuse for reservation view?
import Hero from '../components/Hero';
import Footer from '../components/Footer';

import { useLocation } from 'react-router-dom';

const HotelAdminDashboard = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialSection = queryParams.get('section') || 'services';

    const [products, setProducts] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [showProductForm, setShowProductForm] = useState(false);
    const [hotelDetails, setHotelDetails] = useState(null);
    const [activeSection, setActiveSection] = useState(initialSection); // services, menu, rooms, specials, activities, settings
    const [activeActivityTab, setActiveActivityTab] = useState('orders'); // orders, bookings, reservations
    const user = JSON.parse(sessionStorage.getItem('user'));
    const hotelId = user?.hotelId;

    // Update active section if URL changes
    useEffect(() => {
        const section = new URLSearchParams(location.search).get('section');
        if (section) {
            setActiveSection(section);
        }
    }, [location.search]);

    const [productForm, setProductForm] = useState({
        type: 'MEAL',
        name: '',
        description: '',
        price: '',
        image: '',
        isAvailable: true,
        isSpecial: false
    });

    useEffect(() => {
        if (hotelId) {
            fetchProducts();
            fetchReservations();
            fetchHotelDetails();
        }
    }, [hotelId]);

    const fetchHotelDetails = async () => {
        try {
            const res = await api.get(`/hotels/${hotelId}`);
            setHotelDetails(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchProducts = async () => {
        try {
            const res = await api.get(`/products/hotel/${hotelId}`);
            setProducts(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchReservations = async () => {
        try {
            const res = await api.get(`/reservations/hotel/${hotelId}`);
            setReservations(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateSettings = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/hotels/${hotelId}`, hotelDetails);
            alert('Settings updated successfully');
        } catch (err) {
            alert('Failed to update settings');
        }
    };

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        try {
            // Force type based on activeSection if needed
            let type = productForm.type;
            let isSpecial = productForm.isSpecial;

            if (activeSection === 'menu' && !['MEAL', 'DRINK'].includes(type)) type = 'MEAL';
            if (activeSection === 'rooms') type = 'ROOM';
            if (activeSection === 'specials') isSpecial = true;

            await api.post('/products', { ...productForm, type, isSpecial });
            setShowProductForm(false);
            setProductForm({ type: 'MEAL', name: '', description: '', price: '', image: '', isAvailable: true, isSpecial: false });
            fetchProducts();
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to create product');
        }
    };

    const handleDeleteProduct = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            await api.delete(`/products/${id}`);
            fetchProducts();
        } catch (err) {
            alert('Failed to delete');
        }
    };

    const handleToggleAvailability = async (product) => {
        try {
            await api.put(`/products/${product.id}`, { isAvailable: !product.isAvailable });
            fetchProducts();
        } catch (err) {
            alert('Failed to update availability');
        }
    };

    // --- Helpers for Filtering ---
    const getFilteredProducts = () => {
        if (activeSection === 'menu') return products.filter(p => ['MEAL', 'DRINK'].includes(p.type));
        if (activeSection === 'rooms') return products.filter(p => p.type === 'ROOM');
        // Services: Everything else (Spa, Meeting Hall, Table Reservation, Other, Massage, Entertainment, Park, Pool)
        if (activeSection === 'services') return products.filter(p => ['SPA', 'MEETING_HALL', 'RESERVATION_TABLE', 'OTHER', 'MASSAGE', 'ENTERTAINMENT', 'PARK', 'SWIMMING_POOL'].includes(p.type));
        return [];
    };

    const getFilteredReservations = () => {
        if (activeActivityTab === 'orders') return reservations.filter(r => ['MEAL', 'DRINK'].includes(r.product?.type));
        if (activeActivityTab === 'bookings') return reservations.filter(r => r.product?.type === 'ROOM');
        if (activeActivityTab === 'reservations') return reservations.filter(r => !['MEAL', 'DRINK', 'ROOM'].includes(r.product?.type));
        return [];
    };

    if (!hotelId) return <div style={{ minHeight: '100vh', background: 'var(--bg-body)', color: 'white', padding: '2rem' }}>Loading hotel info...</div>;

    const tabs = [
        { id: 'services', label: 'Services', icon: <Star size={18} /> },
        { id: 'menu', label: 'Menu', icon: <Utensils size={18} /> },
        { id: 'rooms', label: 'Rooms', icon: <Bed size={18} /> },
        { id: 'reservations', label: 'Orders & Bookings', icon: <Calendar size={18} /> },
    ];

    const productTypeOptions = () => {
        if (activeSection === 'menu') return (
            <>
                <option value="MEAL">Meal</option>
                <option value="DRINK">Drink</option>
            </>
        );
        if (activeSection === 'rooms') return <option value="ROOM">Room</option>;
        // Services
        return (
            <>
                <option value="SPA">Spa</option>
                <option value="MEETING_HALL">Meeting Hall</option>
                <option value="SWIMMING_POOL">Swimming Pool</option>
                <option value="RESERVATION_TABLE">Table Reservation</option>
                <option value="OTHER">Other</option>
            </>
        );
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <Hero title={hotelDetails?.name || 'Hotel Admin'} subtitle="Admin Dashboard" height="25vh" />

            <div className="container" style={{ marginTop: '-2rem', display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveSection(tab.id); setShowProductForm(false); }}
                        className={`btn ${activeSection === tab.id ? 'btn-primary' : 'btn-outline'}`}
                        style={{
                            background: activeSection === tab.id ? 'var(--primary)' : 'rgba(0,0,0,0.5)',
                            color: activeSection === tab.id ? 'black' : 'var(--primary)', // Fix contrast
                            backdropFilter: 'blur(10px)',
                            border: activeSection === tab.id ? 'none' : '1px solid var(--glass-border)'
                        }}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            <main className="container" style={{ padding: '2rem 0', flex: 1 }}>

                {/* PRODUCTS VIEWS (Services, Menu, Rooms) */}
                {['services', 'menu', 'rooms'].includes(activeSection) && (
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
                            <button className="btn btn-primary" onClick={() => {
                                setShowProductForm(!showProductForm);
                                // Set default type based on section
                                let defaultType = 'MEAL';
                                if (activeSection === 'rooms') defaultType = 'ROOM';
                                if (activeSection === 'services') defaultType = 'SPA';
                                setProductForm(prev => ({ ...prev, type: defaultType, isSpecial: activeSection === 'specials' }));
                            }}>
                                <Plus size={16} style={{ marginRight: '0.5rem' }} /> Add {activeSection.slice(0, -1)}
                            </button>
                        </div>

                        {showProductForm && (
                            <div className="card animate-fade-in" style={{ marginBottom: '2rem', border: '1px solid var(--primary)' }}>
                                <h3 style={{ marginBottom: '1rem' }}>Add New {activeSection.slice(0, -1)}</h3>
                                <form onSubmit={handleCreateProduct}>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        <div className="form-group">
                                            <label>Name</label>
                                            <input value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} required />
                                        </div>
                                        <div className="form-group">
                                            <label>Price (ETB)</label>
                                            <input type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} required />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Type</label>
                                        <select value={productForm.type} onChange={e => setProductForm({ ...productForm, type: e.target.value })}>
                                            {productTypeOptions()}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Description</label>
                                        <textarea rows="3" value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} />
                                    </div>

                                    <div className="form-group">
                                        <label>Image URL</label>
                                        <input value={productForm.image} onChange={e => setProductForm({ ...productForm, image: e.target.value })} placeholder="https://..." />
                                    </div>

                                    <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                            <input type="checkbox" checked={productForm.isAvailable} onChange={e => setProductForm({ ...productForm, isAvailable: e.target.checked })} />
                                            Available
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'var(--primary)' }}>
                                            <input type="checkbox" checked={productForm.isSpecial} onChange={e => setProductForm({ ...productForm, isSpecial: e.target.checked })} />
                                            House Special
                                        </label>
                                    </div>

                                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>Save Product</button>
                                </form>
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            {getFilteredProducts().map(p => (
                                <div key={p.id} className="card" style={{ display: 'flex', flexDirection: 'row', padding: 0, overflow: 'hidden', opacity: p.isAvailable ? 1 : 0.6, height: '180px' }}>
                                    <div style={{ width: '220px', flexShrink: 0, background: `url(${p.image || 'https://via.placeholder.com/300'}) center/cover` }} />
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ padding: '1rem', flex: 1, overflowY: 'auto' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                                <h4 style={{ margin: 0, fontSize: '1.1rem' }}>
                                                    {p.name}
                                                    {p.isSpecial && <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', color: 'black', background: 'var(--primary)', padding: '0.2rem 0.5rem', borderRadius: '4px', verticalAlign: 'middle' }}>SPECIAL</span>}
                                                </h4>
                                                <span style={{ fontWeight: 'bold', color: 'var(--primary)', fontSize: '1.1rem' }}>{p.price} ETB</span>
                                            </div>
                                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0, lineHeight: '1.4' }}>{p.description}</p>
                                        </div>
                                        <div style={{ padding: '0.75rem 1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '1rem', background: 'rgba(0,0,0,0.2)' }}>
                                            <button
                                                onClick={() => handleToggleAvailability(p)}
                                                className="btn btn-outline"
                                                style={{ flex: 1, fontSize: '0.8rem', padding: '0.4rem', borderColor: p.isAvailable ? 'orange' : 'green', color: p.isAvailable ? 'orange' : 'green' }}
                                            >
                                                {p.isAvailable ? 'Suspend' : 'Activate'}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(p.id)}
                                                className="btn btn-outline"
                                                style={{ flex: 1, fontSize: '0.8rem', padding: '0.4rem', borderColor: 'red', color: 'red' }}
                                            >
                                                <Trash2 size={14} style={{ marginRight: '0.25rem' }} /> Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {getFilteredProducts().length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No items found in this section.</p>}
                    </div>
                )}

                {/* RESERVATIONS & BOOKINGS VIEW */}
                {activeSection === 'reservations' && (
                    <div>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                            {['orders', 'bookings', 'reservations'].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveActivityTab(tab)}
                                    style={{
                                        background: 'none', border: 'none',
                                        color: activeActivityTab === tab ? 'var(--primary)' : 'var(--text-muted)',
                                        fontWeight: activeActivityTab === tab ? 'bold' : 'normal',
                                        fontSize: '1.1rem', cursor: 'pointer',
                                        textTransform: 'capitalize'
                                    }}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {getFilteredReservations().length === 0 ? (
                                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No {activeActivityTab} found.</p>
                            ) : (
                                getFilteredReservations().map(r => (
                                    <div key={r.id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem' }}>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <div style={{ width: '50px', height: '50px', borderRadius: '8px', background: `url(${r.product?.image || 'https://via.placeholder.com/50'}) center/cover` }} />
                                            <div>
                                                <h4 style={{ margin: 0 }}>{r.product?.name}</h4>
                                                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                                    {new Date(r.date).toLocaleDateString()} | Customer: {r.customerPhone || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{
                                                display: 'inline-block', padding: '0.25rem 0.75rem', borderRadius: '20px',
                                                fontSize: '0.8rem', fontWeight: 'bold',
                                                background: r.status === 'CONFIRMED' || r.status === 'COMPLETED' ? 'rgba(0,255,0,0.1)' : 'rgba(255,165,0,0.1)',
                                                color: r.status === 'CONFIRMED' || r.status === 'CONFIRMED' ? 'green' : 'orange'
                                            }}>
                                                {r.status}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </main>
            <Footer hotelName={hotelDetails?.name} />
        </div>
    );
};

export default HotelAdminDashboard;
