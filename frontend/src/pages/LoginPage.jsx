import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import '../index.css';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            sessionStorage.setItem('user', JSON.stringify(response.data));
            sessionStorage.setItem('token', response.data.token);

            if (response.data.role === 'SUPER_ADMIN') {
                navigate('/admin/super');
            } else if (response.data.role === 'HOTEL_ADMIN') {
                navigate('/admin/hotel');
            } else {
                navigate('/hotels');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url("https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Navbar />

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
                <div className="card" style={{ width: '100%', maxWidth: '400px', backdropFilter: 'blur(10px)', background: 'rgba(30, 30, 24, 0.85)', border: '1px solid var(--glass-border)' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>Welcome Back</h2>

                    {error && (
                        <div style={{ background: 'rgba(244, 67, 54, 0.1)', color: '#ff6b6b', padding: '0.75rem', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} /> Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="admin@example.com"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}
                            />
                        </div>
                        <div className="form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Lock size={16} /> Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', width: '100%' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-muted)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                            <Link to="/forgot-password" style={{ color: 'var(--primary)', fontSize: '0.85rem', textDecoration: 'none' }}>Forgot Password?</Link>
                        </div>

                        <button type="submit" className="btn btn-primary login-btn" style={{ width: '100%', marginTop: '1rem', transition: 'all 0.3s ease' }} disabled={loading}>
                            {loading ? 'Authenticating...' : 'Login'}
                        </button>
                    </form>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Sign Up</Link>
                    </div>
                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>← Back to Home</Link>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .login-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(196, 164, 132, 0.4);
                }
                .login-btn:active {
                    transform: translateY(0);
                }
            `}</style>
        </div>
    );
};

export default LoginPage;
