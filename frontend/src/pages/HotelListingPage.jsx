import React, { useEffect, useState } from 'react';
import api from '../api/api';
import Navbar from '../components/Navbar';
import HotelCard from '../components/HotelCard';
import '../index.css';

const HotelListingPage = () => {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHotels = async () => {
            try {
                const response = await api.get('/hotels');
                setHotels(response.data);
            } catch (error) {
                console.error('Error fetching hotels:', error);
                setError('Unable to load hotels. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchHotels();
    }, []);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <div className="container" style={{ padding: '4rem 2rem', flex: 1 }}>
                <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2.5rem', position: 'relative' }}>
                    Our Destinations
                    <span style={{ display: 'block', width: '60px', height: '4px', background: 'var(--primary)', margin: '1rem auto 0' }}></span>
                </h2>

                {loading ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading collection...</div>
                ) : error ? (
                    <div style={{ textAlign: 'center', color: 'red' }}>{error}</div>
                ) : (
                    <div className="hotel-grid">
                        {hotels.map((hotel) => (
                            <HotelCard key={hotel.id} hotel={hotel} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HotelListingPage;
