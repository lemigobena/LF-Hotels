
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; // Import ArrowLeft icon

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(sessionStorage.getItem('user'));
    const [showProfileMenu, setShowProfileMenu] = useState(false); // Changed from React.useState to useState

    const handleLogout = () => {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        window.location.href = '/'; // Changed from navigate('/login') to window.location.href = '/'
    };

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav style={{
            background: 'rgba(26, 26, 26, 0.95)', // Changed background color
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--glass-border)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            padding: '1rem 0' // Added padding
        }}>
            <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}> {/* Removed height: '80px' */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}> {/* New wrapper div for back button and logo */}
                    {location.pathname !== '/' && (
                        <button
                            onClick={() => navigate(-1)}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: 'var(--text-muted)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                padding: '0.5rem',
                                borderRadius: '50%',
                                transition: 'color 0.2s, background 0.2s'
                            }}
                            onMouseOver={e => { e.currentTarget.style.color = 'var(--primary)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                            onMouseOut={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none' }}
                            title="Go Back"
                        >
                            <ArrowLeft size={24} />
                        </button>
                    )}
                    <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', textDecoration: 'none', fontFamily: 'var(--font-heading)' }}> {/* Changed logo styling */}
                        LF Collection
                    </Link>
                </div>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>



                    {user ? (
                        <>
                            {user.role === 'SUPER_ADMIN' && <Link to="/admin/super" className="nav-link">Dashboard</Link>}
                            {/* Removed Dashboard link for Hotel Admin as per request */}

                            <div style={{ position: 'relative' }}>
                                <button
                                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                                    style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                >
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                </button>

                                {showProfileMenu && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '100%',
                                        right: 0,
                                        marginTop: '0.5rem',
                                        background: '#1a1a1a',
                                        border: '1px solid var(--glass-border)',
                                        borderRadius: '8px',
                                        padding: '0.5rem',
                                        minWidth: '150px',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                                    }}>
                                        {user.role === 'HOTEL_ADMIN' ? (
                                            <Link to="/admin/hotel/profile" className="nav-link" style={{ display: 'block', padding: '0.5rem 1rem' }} onClick={() => setShowProfileMenu(false)}>Hotel Profile</Link>
                                        ) : (
                                            <Link to="/profile" className="nav-link" style={{ display: 'block', padding: '0.5rem 1rem' }} onClick={() => setShowProfileMenu(false)}>My Profile</Link>
                                        )}

                                        {user.role !== 'HOTEL_ADMIN' && (
                                            <Link to="/my-activity" className="nav-link" style={{ display: 'block', padding: '0.5rem 1rem' }} onClick={() => setShowProfileMenu(false)}>My Activity</Link>
                                        )}

                                        <button
                                            onClick={handleLogout}
                                            className="nav-link"
                                            style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.5rem 1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className={`btn btn - outline ${isActive('/login')} `} style={{ marginRight: '1rem' }}>Login</Link>
                            <Link to="/signup" className={`btn btn - primary ${isActive('/signup')} `}>Sign Up</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
