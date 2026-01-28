import React from 'react';

/**
 * Hero Component
 * 
 * A reusable banner section for pages, featuring a background image and text content.
 */
/**
 * This is the hero part at the top of pages
 */
const Hero = ({ title, subtitle, image, height = '70vh', children }) => {
    return (
        <header className="hero" style={{
            height,
            background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("${image}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
        }}>
            <div className="container" style={{ textAlign: 'center', color: 'white' }}>
                {title && (
                    <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.5)', fontFamily: 'var(--font-heading)' }}>
                        {title}
                    </h1>
                )}
                {subtitle && (
                    <p style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto', opacity: 0.9 }}>
                        {subtitle}
                    </p>
                )}
                {children}
            </div>
        </header>
    );
};

export default Hero;
