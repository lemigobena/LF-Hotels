import React from 'react';

/**
 * Footer Component
 * 
 * Standard footer for all pages in the LF Collection.
 */
const Footer = ({ hotelName }) => {
    const displayName = hotelName || 'LF Restaurant Collection';
    const year = new Date().getFullYear();

    return (
        <footer style={{ background: 'var(--bg-card)', padding: '2rem 0', marginTop: 'auto', borderTop: '1px solid var(--glass-border)' }}>
            <div className="container" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                <p>&copy; {year} {displayName}. {hotelName ? 'Powered by LF Collection.' : 'All rights reserved.'}</p>
            </div>
        </footer>
    );
};

export default Footer;
