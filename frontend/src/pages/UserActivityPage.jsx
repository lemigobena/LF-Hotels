
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import Navbar from '../components/Navbar';
import { Bed, Utensils, Calendar, CheckCircle } from 'lucide-react';
import '../index.css';

const UserActivityPage = () => {
    const [reservations, setReservations] = useState([]);
    const [activeTab, setActiveTab] = useState('bookings');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchActivity = async () => {
            const token = sessionStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await api.get('/reservations/my-reservations');
                setReservations(response.data);
            } catch (error) {
                console.error('Failed to fetch activity:', error);
                if (error.response?.status === 401) {
                    sessionStorage.removeItem('token');
                    sessionStorage.removeItem('user');
                    navigate('/login');
                }
            }
        };

        fetchActivity();
    }, [navigate]);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-body)' }}>
            <Navbar />

            <div className="container" style={{ padding: '4rem 2rem', flex: 1, maxWidth: '1000px', margin: '0 auto' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>My Activity</h2>

                <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)' }}>
                    {[
                        { id: 'bookings', label: 'My Bookings', icon: <Bed size={18} /> },
                        { id: 'orders', label: 'My Orders', icon: <Utensils size={18} /> },
                        { id: 'reservations', label: 'My Reservations', icon: <Calendar size={18} /> }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                background: 'none',
                                border: 'none',
                                padding: '1rem 0',
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-muted)',
                                borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                transition: 'all 0.3s'
                            }}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                <div className="animate-fade-in">
                    {reservations.filter(res => {
                        const type = res.product?.type;
                        if (activeTab === 'bookings') return type === 'ROOM';
                        if (activeTab === 'orders') return type === 'MEAL' || type === 'DRINK';
                        return type !== 'ROOM' && type !== 'MEAL' && type !== 'DRINK';
                    }).length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                            <p>No items found in this category.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                            {reservations.filter(res => {
                                const type = res.product?.type;
                                if (activeTab === 'bookings') return type === 'ROOM';
                                if (activeTab === 'orders') return type === 'MEAL' || type === 'DRINK';
                                return type !== 'ROOM' && type !== 'MEAL' && type !== 'DRINK';
                            }).map(res => (
                                <div key={res.id} className="card" style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                                }}>
                                    {/* Card Image */}
                                    <div style={{ position: 'relative', height: '220px', width: '100%' }}>
                                        <img
                                            src={res.product?.image || 'https://via.placeholder.com/300x200'}
                                            alt={res.product?.name}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            top: '1rem',
                                            right: '1rem',
                                            background: (res.status === 'CONFIRMED' || res.status === 'COMPLETED') ? 'rgba(76, 175, 80, 0.9)' :
                                                (res.status === 'CANCELLED') ? 'rgba(244, 67, 54, 0.9)' : 'rgba(255, 193, 7, 0.9)',
                                            color: 'white',
                                            padding: '0.4rem 1rem',
                                            borderRadius: '50px',
                                            fontSize: '0.75rem',
                                            fontWeight: '800',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px',
                                            backdropFilter: 'blur(10px)',
                                            boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                                        }}>
                                            {res.status}
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                            <h4 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--primary)', fontFamily: 'var(--font-heading)', lineHeight: '1.2' }}>
                                                {res.product?.name}
                                            </h4>
                                            <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-light)', whiteSpace: 'nowrap' }}>
                                                {res.product?.price} ETB
                                            </span>
                                        </div>

                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                            <Calendar size={16} color="var(--primary)" />
                                            <span>{new Date(res.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                        </div>

                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                            <Utensils size={16} color="var(--primary)" />
                                            <span>{res.hotel?.name || 'Unknown Hotel'}</span>
                                        </div>

                                        {activeTab === 'bookings' && (
                                            <div style={{ marginTop: '-1rem', marginBottom: '1.5rem' }}>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>Nightly Rate</span>
                                            </div>
                                        )}

                                        {res.status !== 'COMPLETED' && res.status !== 'CANCELLED' && (
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        const response = await api.put(`/reservations/${res.id}/status`, { status: 'COMPLETED' });
                                                        setReservations(reservations.map(r =>
                                                            r.id === res.id ? { ...r, status: 'COMPLETED' } : r
                                                        ));
                                                    } catch (error) {
                                                        alert('Failed to update status: ' + (error.response?.data?.message || error.message));
                                                    }
                                                }}
                                                className="btn"
                                                style={{
                                                    marginTop: 'auto',
                                                    padding: '0.8rem',
                                                    background: 'transparent',
                                                    color: 'var(--primary)',
                                                    border: '1px solid var(--primary)',
                                                    borderRadius: '8px',
                                                    fontWeight: 'bold',
                                                    cursor: 'pointer',
                                                    width: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem',
                                                    transition: 'all 0.3s'
                                                }}
                                                onMouseOver={(e) => {
                                                    e.currentTarget.style.background = 'var(--primary)';
                                                    e.currentTarget.style.color = 'black';
                                                }}
                                                onMouseOut={(e) => {
                                                    e.currentTarget.style.background = 'transparent';
                                                    e.currentTarget.style.color = 'var(--primary)';
                                                }}
                                            >
                                                {activeTab === 'bookings' && <CheckCircle size={18} />}
                                                {activeTab === 'bookings' ? 'Mark Checked In' :
                                                    activeTab === 'orders' ? 'Mark Received' : 'Mark Attended'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserActivityPage;
