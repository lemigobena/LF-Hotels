import React from 'react';

/**
 * ServiceCard Component
 * 
 * Used to display individual services or amenities with an image, title, and description.
 */
const ServiceCard = ({ title, description, iconUrl, img }) => {
    const displayImg = iconUrl || img;

    return (
        <div className="card" style={{ padding: '0', overflow: 'hidden', textAlign: 'center', transition: 'transform 0.3s ease', flex: '0 1 350px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: '200px', width: '100%', overflow: 'hidden' }}>
                <img src={displayImg} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>{title}</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{description}</p>
            </div>
        </div>
    );
};

export default ServiceCard;
