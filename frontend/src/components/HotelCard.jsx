import React from 'react';
import { MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const HotelCard = ({ hotel }) => {
    return (
        <Link to={`/hotel/${hotel.id}`} className="card" style={{ padding: 0, overflow: 'hidden', textDecoration: 'none' }}>
            <div style={{
                height: '200px',
                background: hotel.image ? `url(${hotel.image}) center/cover` : 'var(--secondary-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)'
            }}>
                {/* Placeholder for image - use name initial if no image */}
                {!hotel.image && <span style={{ fontSize: '3rem', fontFamily: 'var(--font-heading)' }}>{hotel.name.charAt(0)}</span>}
            </div>
            <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: 0 }}>{hotel.name}</h3>
                    <span className="badge" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Star size={12} fill="currentColor" /> {hotel.rating}
                    </span>
                </div>

                <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={14} /> {hotel.location}
                </div>

                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {hotel.description}
                </p>

                {(hotel.isSuspended || hotel.isClosed) && (
                    <div style={{ marginTop: '1rem', color: 'red', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {hotel.isSuspended ? 'SUSPENDED' : 'TEMPORARILY CLOSED'}
                    </div>
                )}
            </div>
        </Link>
    );
};

export default HotelCard;
