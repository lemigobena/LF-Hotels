import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Mail } from 'lucide-react';
import '../index.css';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setMessage('Password reset link has been logged to the server console (since email is not set up).');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset link.');
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
                    <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>Reset Password</h2>
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>Enter your email to receive a reset link</p>

                    {error && (
                        <div style={{ background: 'rgba(244, 67, 54, 0.1)', color: '#ff6b6b', padding: '0.75rem', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    {message && (
                        <div style={{ background: 'rgba(76, 175, 80, 0.1)', color: '#4caf50', padding: '0.75rem', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
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

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', transition: 'all 0.3s ease' }} disabled={loading}>
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
                        <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>← Back to Login</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
