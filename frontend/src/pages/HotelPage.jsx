import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import Navbar from '../components/Navbar';
import CalendarComponent from '../components/CalendarComponent';
import Hero from '../components/Hero';
import ServiceCard from '../components/ServiceCard';
import Footer from '../components/Footer';
import { Star, MapPin, CheckCircle, X, Coffee, Bed, Utensils, Calendar as CalendarIcon, Activity, Info, Bell, Phone } from 'lucide-react';
import '../index.css';

const HotelPage = () => {
    const { id } = useParams();
    const [hotel, setHotel] = useState(null);
    const [products, setProducts] = useState([]);
    const [specials, setSpecials] = useState([]);
    const [groupedProducts, setGroupedProducts] = useState({});

    const [activeTab, setActiveTab] = useState('landing'); // landing, menu, reserve, booking, contact
    const [showModal, setShowModal] = useState(false);

    // Reservation State
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [reservationDate, setReservationDate] = useState(new Date());
    const [customerPhone, setCustomerPhone] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });

    // Rating State
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const handleRateHotel = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                alert('Please login to rate');
                window.location.href = '/login'; // Simple redirect
                return;
            }

            await api.post('/reviews', { hotelId: id, rating, comment });

            // Refund/Reload logic? For now simple reload or toast
            alert('Rating submitted!');
            setShowRatingModal(false);
            // Ideally trigger refresh of hotel data to show new avg
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert('Failed to submit rating');
        }
    };

    // User Data for Auto-fill
    const userData = JSON.parse(sessionStorage.getItem('user'));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const hotelRes = await api.get(`/hotels/${id}`);
                setHotel(hotelRes.data);

                const prodRes = await api.get(`/products/hotel/${id}`);
                const allProducts = prodRes.data;
                setProducts(allProducts);

                setSpecials(allProducts.filter(p => p.isSpecial));

                const groups = allProducts.reduce((acc, product) => {
                    const type = product.type || 'OTHER';
                    if (!acc[type]) acc[type] = [];
                    acc[type].push(product);
                    return acc;
                }, {});
                setGroupedProducts(groups);

            } catch (error) {
                console.error(error);
            }
        };
        fetchData();

        if (userData && userData.phone) {
            setCustomerPhone(userData.phone);
        }
    }, [id]);

    const handleReserve = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        if (!selectedProduct) return;

        try {
            await api.post('/reservations', {
                hotelId: id,
                productId: selectedProduct.id,
                customerPhone,
                date: reservationDate,
                userId: userData?.id // Link to user if logged in
            });
            setMessage({ type: 'success', text: 'Reservation Confirmed Successfully!' });
            // Don't clear phone if it's from user profile
            if (!userData?.phone) setCustomerPhone('');

            setTimeout(() => {
                setShowModal(false);
                setMessage({ type: '', text: '' });
            }, 2000);
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Reservation failed. Please try again.' });
        }
    };

    const openReservation = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
        setReservationDate(new Date());
    };

    if (!hotel) return <div style={{ minHeight: '100vh', background: 'var(--bg-body)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Experience...</div>;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            {/* Hotel Banner */}
            <Hero
                image={hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'}
                height="50vh"
            >
                <div style={{ width: '100%', textAlign: 'left', paddingBottom: '2rem', marginTop: 'auto' }}>
                    <div className="animate-fade-up">
                        <h1 style={{ fontSize: '3.5rem', marginBottom: '0.5rem', color: 'white', textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>{hotel.name}</h1>
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', color: 'rgba(255,255,255,0.9)', marginBottom: '1rem', fontSize: '1.1rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={20} color="var(--primary)" /> {hotel.location}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Star size={20} fill="gold" stroke="none" /> {hotel.rating} Stars
                                <button onClick={() => setShowRatingModal(true)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '4px', padding: '0.2rem 0.5rem', color: 'white', cursor: 'pointer', fontSize: '0.8rem', marginLeft: '0.5rem' }}>Rate Us</button>
                            </span>
                        </div>
                    </div>
                </div>
            </Hero>

            {/* Rating Modal */}
            {showRatingModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)',
                    zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '1rem'
                }}>
                    <div className="card" style={{ width: '100%', maxWidth: '500px', position: 'relative', border: '1px solid var(--primary)' }}>
                        <button onClick={() => setShowRatingModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                            <X size={24} />
                        </button>

                        <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Rate {hotel.name}</h3>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <button key={star} onClick={() => setRating(star)} style={{ background: 'none', border: 'none', cursor: 'pointer', transition: 'transform 0.2s' }}>
                                    <Star size={32} fill={star <= rating ? 'gold' : 'none'} color={star <= rating ? 'gold' : 'var(--text-muted)'} />
                                </button>
                            ))}
                        </div>

                        <textarea
                            value={comment}
                            onChange={e => setComment(e.target.value)}
                            placeholder="Share your experience..."
                            style={{ width: '100%', height: '100px', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px', marginBottom: '1.5rem' }}
                        ></textarea>

                        <button onClick={handleRateHotel} className="btn btn-primary" style={{ width: '100%' }}>
                            Submit Review
                        </button>
                    </div>
                </div>
            )}

            {/* Navigation Tabs */}
            <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--glass-border)', position: 'sticky', top: '70px', zIndex: 90 }}>
                <div className="container" style={{ overflowX: 'auto' }}>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        {[
                            { id: 'landing', label: 'Overview' },
                            { id: 'menu', label: 'Menu' },
                            { id: 'reserve', label: 'Reserve Services' },
                            { id: 'booking', label: 'Book Room' },
                            { id: 'contact', label: 'Contact' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    padding: '1.5rem 0',
                                    color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                                    borderBottom: activeTab === tab.id ? '3px solid var(--primary)' : '3px solid transparent',
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    textTransform: 'uppercase',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <main className="container" style={{ padding: '3rem 2rem', flex: 1 }}>

                <div className="tab-content animate-fade-in">

                    {/* TAB: LANDING / OVERVIEW */}
                    {/* TAB: LANDING / OVERVIEW */}
                    {activeTab === 'landing' && (
                        <div>
                            {/* Description Section - Centered & Elegant */}
                            <section style={{ padding: '3rem 0', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
                                <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', fontFamily: 'var(--font-heading)' }}>
                                    {hotel.name}
                                    {hotel.isClosed && (
                                        <span style={{
                                            display: 'inline-block',
                                            marginLeft: '1rem',
                                            padding: '0.5rem 1rem',
                                            background: 'red',
                                            color: 'white',
                                            fontSize: '1rem',
                                            borderRadius: '5px',
                                            verticalAlign: 'middle',
                                            fontFamily: 'var(--font-body)'
                                        }}>
                                            TEMPORARILY CLOSED
                                        </span>
                                    )}
                                </h2>
                                <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>
                                    {hotel.description}
                                </p>
                                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-muted)', marginTop: '1rem' }}>
                                    Experience the epitome of Ethiopian hospitality. Whether you are here for business or leisure,
                                    {hotel.name} offers meticulous service and world-class amenities to make your stay unforgettable.
                                </p>
                            </section>

                            {/* Announcements as Cards - Centered Grid */}
                            {hotel.announcements && hotel.announcements.length > 0 && (
                                <section style={{ padding: '3rem 0' }}>
                                    <h3 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>Latest Announcements</h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
                                        {hotel.announcements.map(announcement => (
                                            <div key={announcement.id} className="card" style={{ flex: '0 1 350px', padding: '2rem', textAlign: 'center' }}>
                                                <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}><Bell size={32} /></div>
                                                <h4 style={{ marginBottom: '1rem', fontSize: '1.25rem' }}>{announcement.title}</h4>
                                                <p style={{ color: 'var(--text-muted)' }}>{announcement.content}</p>
                                                <small style={{ display: 'block', marginTop: '1.5rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                                                    {new Date(announcement.createdAt).toLocaleDateString()}
                                                </small>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Services Section - Matching LandingPage Style */}
                            <section style={{ padding: '3rem 0', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--radius)' }}>
                                <div className="container">
                                    <h3 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem' }}>Premium Amenities</h3>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
                                        {[
                                            { title: 'Luxury Accommodation', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', desc: 'Suites designed for ultimate comfort.' },
                                            { title: 'Fine Dining', img: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', desc: 'International and local culinary delights.' },
                                            { title: 'Wellness & Spa', img: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', desc: 'Rejuvenate with our exclusive treatments.' },
                                            { title: 'Concierge Service', img: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', desc: '24/7 dedicated service for all your needs.' },
                                            { title: 'High-Speed Wi-Fi', img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', desc: 'Stay connected seamlessly throughout.' }
                                        ].map((service, index) => (
                                            <ServiceCard
                                                key={index}
                                                title={service.title}
                                                img={service.img}
                                                description={service.desc}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* Specials Highlight */}
                            {specials.length > 0 && (
                                <section style={{ padding: '4rem 0' }}>
                                    <h3 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '2rem' }}>
                                        🔥 Today's Specials
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                                        {specials.slice(0, 3).map(product => (
                                            <div key={product.id} className="card" onClick={() => openReservation(product)} style={{ cursor: 'pointer' }}>
                                                <div style={{ height: '200px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem', background: '#333' }}>
                                                    {product.image && <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />}
                                                </div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                    <h4 style={{ fontSize: '1.2rem', margin: 0 }}>{product.name}</h4>
                                                    <span className="badge badge-special">{product.price} ETB</span>
                                                </div>
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{product.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    )}




                    {/* TAB: MENU - All Food & Drink */}
                    {activeTab === 'menu' && (
                        <div>
                            {['MEAL', 'DRINK'].map(type => groupedProducts[type] && (
                                <section key={type} style={{ marginBottom: '3rem' }}>
                                    <h3 style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--primary)', paddingLeft: '1rem' }}>{type === 'MEAL' ? 'Dining Menu' : 'Beverages'}</h3>
                                    <div className="hotel-grid">
                                        {groupedProducts[type].map(product => (
                                            <div key={product.id} className="card">
                                                <div style={{ height: '200px', marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden', background: product.image ? `url(${product.image}) center/cover` : 'var(--glass-border)' }}></div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <h4 style={{ margin: 0 }}>{product.name}</h4>
                                                    <span style={{ fontWeight: 'bold' }}>{product.price} ETB</span>
                                                </div>
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0' }}>{product.description}</p>
                                                <button className="btn btn-outline" style={{ width: '100%', marginTop: 'auto' }} onClick={() => openReservation(product)}>
                                                    Order Now
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    )}

                    {/* TAB: RESERVE - Table Reservations */}
                    {/* TAB: RESERVE - Table, Spa, Meeting */}
                    {activeTab === 'reserve' && (
                        <div>
                            {['RESERVATION_TABLE', 'SPA', 'MEETING_HALL', 'MASSAGE', 'ENTERTAINMENT', 'SWIMMING_POOL', 'PARK', 'OTHER'].map(type => groupedProducts[type] && groupedProducts[type].length > 0 && (
                                <section key={type} style={{ marginBottom: '3rem' }}>
                                    <h3 style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--primary)', paddingLeft: '1rem', textTransform: 'capitalize' }}>
                                        {type.replace('RESERVATION_', '').replace('_', ' ')}
                                    </h3>
                                    <div className="hotel-grid">
                                        {groupedProducts[type].map(product => (
                                            <div key={product.id} className="card">
                                                <div style={{ height: '200px', marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden', background: product.image ? `url(${product.image}) center/cover` : 'var(--glass-border)' }}></div>
                                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                    <h4 style={{ margin: 0 }}>{product.name}</h4>
                                                    <span style={{ fontWeight: 'bold' }}>{product.price} ETB</span>
                                                </div>
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.5rem 0' }}>{product.description}</p>
                                                <button className="btn btn-outline" style={{ width: '100%', marginTop: 'auto' }} onClick={() => openReservation(product)}>
                                                    Book Now
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            ))}

                            {!groupedProducts['RESERVATION_TABLE'] && !groupedProducts['SPA'] && !groupedProducts['MEETING_HALL'] && !groupedProducts['MASSAGE'] && !groupedProducts['ENTERTAINMENT'] && !groupedProducts['SWIMMING_POOL'] && !groupedProducts['PARK'] && (
                                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                    <Utensils size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                    <h3>No Reservation Options Available</h3>
                                    <p>Please contact the hotel directly for bookings.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* TAB: BOOKING - Rooms */}
                    {activeTab === 'booking' && (
                        <div>
                            <h3 style={{ marginBottom: '2rem' }}>Luxury Accommodation</h3>
                            <div className="hotel-grid">
                                {groupedProducts['ROOM']?.map(product => (
                                    <div key={product.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                                        <div style={{ height: '250px', background: product.image ? `url(${product.image}) center/cover` : '#333' }}></div>
                                        <div style={{ padding: '1.5rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                <h4 style={{ fontSize: '1.5rem', margin: 0 }}>{product.name}</h4>
                                                <span style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 'bold' }}>{product.price} ETB <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ night</span></span>
                                            </div>
                                            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{product.description}</p>
                                            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => openReservation(product)}>Book This Room</button>
                                        </div>
                                    </div>
                                )) || <p>No rooms currently available.</p>}
                            </div>
                        </div>
                    )}

                    {/* TAB: CONTACT */}
                    {/* TAB: CONTACT */}
                    {activeTab === 'contact' && (
                        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                            <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', minHeight: '500px' }}>
                                {/* Left Side: Map/Image */}
                                <div style={{ flex: '1 1 500px', background: `url(${hotel.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'}) center/cover`, minHeight: '300px' }}>
                                    <div style={{ width: '100%', height: '100%', background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <button
                                            className="btn btn-outline"
                                            style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)' }}
                                            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.name + ' ' + hotel.location)}`, '_blank')}
                                        >
                                            <MapPin size={24} style={{ marginRight: '0.5rem' }} /> View on Map
                                        </button>
                                    </div>
                                </div>

                                {/* Right Side: Contact Info */}
                                <div style={{ flex: '1 1 400px', padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <h3 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: 'var(--font-heading)' }}>Get in Touch</h3>

                                    <div style={{ display: 'grid', gap: '2rem' }}>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.8rem', borderRadius: '8px', height: 'fit-content' }}>
                                                <MapPin size={24} color="var(--primary)" />
                                            </div>
                                            <div>
                                                <h5 style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Visit Us</h5>
                                                <p style={{ fontSize: '1.1rem', lineHeight: '1.5' }}>{hotel.location}</p>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.8rem', borderRadius: '8px', height: 'fit-content' }}>
                                                <CalendarIcon size={24} color="var(--primary)" />
                                            </div>
                                            <div>
                                                <h5 style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Opening Hours</h5>
                                                <p style={{ fontSize: '1.1rem' }}>{hotel.openingTime} - {hotel.closingTime}</p>
                                                <p style={{ color: 'var(--success)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Open Now</p>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.8rem', borderRadius: '8px', height: 'fit-content' }}>
                                                <Phone size={24} color="var(--primary)" />
                                            </div>
                                            <div>
                                                <h5 style={{ color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Contact</h5>
                                                <p style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>+251 911 000 000</p>
                                                <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>info@{hotel.name.replace(/\s+/g, '').toLowerCase()}.com</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--glass-border)' }}>
                                        <h5 style={{ marginBottom: '1rem' }}>Connect With Us</h5>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            {['Facebook', 'Instagram', 'Twitter', 'LinkedIn'].map(social => (
                                                <button key={social} style={{ background: 'none', border: '1px solid var(--glass-border)', padding: '0.5rem 1rem', color: 'var(--text-muted)', borderRadius: '20px', cursor: 'pointer', transition: 'all 0.3s ease' }}
                                                    onMouseOver={e => { e.target.style.background = 'var(--primary)'; e.target.style.color = 'black' }}
                                                    onMouseOut={e => { e.target.style.background = 'none'; e.target.style.color = 'var(--text-muted)' }}
                                                >
                                                    {social}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                </div>
            </main >

            {/* Reservation Modal Overlay */}
            {
                showModal && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)',
                        zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        padding: '1rem'
                    }}>
                        <div className="card" style={{ width: '100%', maxWidth: '500px', position: 'relative', border: '1px solid var(--primary)' }}>
                            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>

                            <h3 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                                {selectedProduct?.type === 'RESERVATION_TABLE' ? 'Reserve a Table' : `Reserve ${selectedProduct?.name}`}
                            </h3>

                            {message.text && (
                                <div style={{
                                    padding: '1rem', marginBottom: '1rem', borderRadius: '8px',
                                    background: message.type === 'success' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                                    color: message.type === 'success' ? '#4CAF50' : '#F44336',
                                    display: 'flex', alignItems: 'center', gap: '0.5rem'
                                }}>
                                    <CheckCircle size={18} /> {message.text}
                                </div>
                            )}

                            <form onSubmit={handleReserve}>
                                <div className="form-group">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CalendarIcon size={16} color="var(--primary)" /> Select Date</label>
                                    <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
                                        <CalendarComponent
                                            onChange={setReservationDate}
                                            value={reservationDate}
                                        />
                                    </div>
                                    <p style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                        Selected: {reservationDate.toDateString()}
                                    </p>
                                </div>

                                <div className="form-group">
                                    <label>Your Phone Number</label>
                                    <input
                                        type="tel"
                                        placeholder="e.g., 0911234567"
                                        value={customerPhone}
                                        onChange={e => setCustomerPhone(e.target.value)}
                                        required
                                        style={{ fontSize: '1.1rem', textAlign: 'center', letterSpacing: '1px' }}
                                    />
                                    {userData?.phone && (
                                        <p style={{ fontSize: '0.8rem', color: 'var(--success)', marginTop: '0.5rem' }}>
                                            Auto-filled from your profile
                                        </p>
                                    )}
                                </div>

                                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                                    Confirm Reservation
                                </button>
                            </form>
                        </div>
                    </div>
                )
            }

            <Footer hotelName={hotel.name} />
        </div>
    );
};

export default HotelPage;
