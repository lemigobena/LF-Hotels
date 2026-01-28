import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Lock, Mail, User, Phone, MapPin, Briefcase, Eye, EyeOff } from 'lucide-react';
import '../index.css';

const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [job, setJob] = useState('');
    const [image, setImage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await api.post('/auth/signup', {
                name, email, password, phone, address, gender, age, job, image
            });
            sessionStorage.setItem('user', JSON.stringify(response.data));
            sessionStorage.setItem('token', response.data.token);
            // Redirect to hotels page after successful signup
            navigate('/hotels');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url("https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column'
        }}>
            <Navbar />

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
                <div className="card" style={{ width: '100%', maxWidth: '500px', backdropFilter: 'blur(10px)', background: 'rgba(30, 30, 24, 0.85)', border: '1px solid var(--glass-border)' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem', fontFamily: 'var(--font-heading)' }}>Create Account</h2>

                    {error && (
                        <div style={{ background: 'rgba(244, 67, 54, 0.1)', color: '#ff6b6b', padding: '0.75rem', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignup} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={16} /> Profile Image URL (Optional)</label>
                            <input
                                type="text"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                placeholder="https://example.com/photo.jpg"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}
                            />
                        </div>
                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={16} /> Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="John Doe"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}
                            />
                        </div>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Mail size={16} /> Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="name@example.com"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={16} /> Phone</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="+251..."
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={16} /> Age</label>
                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                placeholder="25"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}
                            />
                        </div>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={16} /> Address</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Addis Ababa, Bole"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}
                            />
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><User size={16} /> Gender</label>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', width: '100%', padding: '0.75rem', borderRadius: '4px' }}
                            >
                                <option value="" style={{ color: 'black' }}>Select</option>
                                <option value="Male" style={{ color: 'black' }}>Male</option>
                                <option value="Female" style={{ color: 'black' }}>Female</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Briefcase size={16} /> Job</label>
                            <input
                                type="text"
                                value={job}
                                onChange={(e) => setJob(e.target.value)}
                                placeholder="Software Engineer"
                                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)' }}
                            />
                        </div>

                        <div className="form-group" style={{ gridColumn: '1 / -1' }}>
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

                        <button type="submit" className="btn btn-primary login-btn" style={{ gridColumn: '1 / -1', width: '100%', marginTop: '1rem', transition: 'all 0.3s ease' }} disabled={loading}>
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                    </form>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Login</Link>
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

export default SignupPage;
