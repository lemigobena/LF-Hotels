import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Lock, Eye, EyeOff } from 'lucide-react';
import '../index.css';

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            return setError("Passwords don't match");
        }
        setLoading(true);
        try {
            await api.post(`/auth/reset-password/${token}`, { password });
            setMessage('Password successfully reset! Redirecting to login...');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. Link may be invalid or expired.');
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
                    <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>Set New Password</h2>

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

                    {!message && (
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Lock size={16} /> New Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="Min 6 characters"
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
                            <div className="form-group">
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Lock size={16} /> Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    placeholder="Confirm new password"
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', width: '100%' }}
                                />
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', transition: 'all 0.3s ease' }} disabled={loading}>
                                {loading ? 'Updating...' : 'Set Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
