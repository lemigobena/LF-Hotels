import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Edit } from 'lucide-react';
import '../index.css';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const navigate = useNavigate(); // Initialize useNavigate

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = sessionStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                // Initial load from session for immediate render
                const storedUser = JSON.parse(sessionStorage.getItem('user'));
                if (storedUser) {
                    setUser(storedUser);
                    setFormData(storedUser);
                }

                // Fetch fresh data from API
                const response = await fetch('http://localhost:5000/api/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                    setFormData(data);
                    // Update session storage to keep it fresh
                    sessionStorage.setItem('user', JSON.stringify(data));


                } else {
                    if (response.status === 401) {
                        sessionStorage.removeItem('token');
                        sessionStorage.removeItem('user');
                        navigate('/login');
                    }
                }
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
            }
        };

        fetchUser();
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = sessionStorage.getItem('token');
            const res = await fetch('http://localhost:5000/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (res.ok) {
                setUser(data);
                sessionStorage.setItem('user', JSON.stringify(data));
                setIsEditing(false);
            } else {
                alert(data.message || 'Update failed');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Something went wrong');
        }
    };

    if (!user) return <div style={{ minHeight: '100vh', background: 'var(--bg-body)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Profile...</div>;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-body)' }}>
            <Navbar />

            <div className="container" style={{ padding: '4rem 2rem', flex: 1, display: 'flex', justifyContent: 'center' }}>
                <div className="card" style={{ width: '100%', maxWidth: '800px', padding: '0', overflow: 'hidden' }}>

                    {/* Header */}
                    <div style={{
                        background: 'linear-gradient(to right, var(--primary), #3a2a1a)',
                        padding: '3rem 2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2rem',
                        position: 'relative'
                    }}>
                        <div style={{
                            width: '120px', height: '120px',
                            borderRadius: '50%',
                            background: 'white',
                            color: 'var(--primary)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '3rem', fontWeight: 'bold',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                            overflow: 'hidden',
                            border: '4px solid rgba(255,255,255,0.2)'
                        }}>
                            {user.image ? (
                                <img src={user.image} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                user.name ? user.name.charAt(0).toUpperCase() : 'U'
                            )}
                        </div>
                        <div style={{ flex: 1 }}>
                            <h2 style={{ color: 'white', margin: 0, fontSize: '2.5rem' }}>{user.name}</h2>
                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>{user.role}</p>
                        </div>

                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="btn btn-outline"
                            style={{
                                borderColor: 'white', color: 'white',
                                background: isEditing ? 'rgba(255,255,255,0.1)' : 'transparent'
                            }}
                        >
                            <Edit size={18} style={{ marginRight: '0.5rem' }} /> {isEditing ? 'Cancel Editing' : 'Edit Profile'}
                        </button>
                    </div>

                    {/* Form / View Mode */}
                    <div style={{ padding: '3rem 2rem' }}>

                        {isEditing ? (
                            <form onSubmit={handleSubmit}>
                                <h3 style={{ marginBottom: '2rem', color: 'var(--primary)' }}>Edit Your Details</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

                                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                                        <label>Profile Image URL</label>
                                        <input type="text" name="image" value={formData.image || ''} onChange={handleChange} placeholder="https://example.com/photo.jpg"
                                            style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '4px' }}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <input type="text" name="name" value={formData.name || ''} onChange={handleChange} required
                                            style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '4px' }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email (Cannot change)</label>
                                        <input type="email" value={formData.email || ''} disabled
                                            style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)', borderRadius: '4px', cursor: 'not-allowed' }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone</label>
                                        <input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange}
                                            style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '4px' }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Address</label>
                                        <input type="text" name="address" value={formData.address || ''} onChange={handleChange}
                                            style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '4px' }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Age</label>
                                        <input type="number" name="age" value={formData.age || ''} onChange={handleChange}
                                            style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '4px' }}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Gender</label>
                                        <select name="gender" value={formData.gender || ''} onChange={handleChange}
                                            style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '4px' }}
                                        >
                                            <option value="" style={{ color: 'black' }}>Select</option>
                                            <option value="Male" style={{ color: 'black' }}>Male</option>
                                            <option value="Female" style={{ color: 'black' }}>Female</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Occupation</label>
                                        <input type="text" name="job" value={formData.job || ''} onChange={handleChange}
                                            style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '4px' }}
                                        />
                                    </div>
                                </div>
                                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                                    <button type="submit" className="btn btn-primary">Save Changes</button>
                                    <button type="button" className="btn btn-outline" onClick={() => setIsEditing(false)}>Cancel</button>
                                </div>
                            </form>
                        ) : (
                            <div>
                                <h3 style={{ marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>Personal Information</h3>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                                    {/* Keep existing view logic, just ensure it uses `user` state */}
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                                            <Mail size={24} color="var(--primary)" />
                                        </div>
                                        <div>
                                            <h5 style={{ margin: 0, color: 'var(--text-muted)' }}>Email Address</h5>
                                            <p style={{ margin: '0.2rem 0 0', fontSize: '1.1rem' }}>{user.email}</p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                                            <Phone size={24} color="var(--primary)" />
                                        </div>
                                        <div>
                                            <h5 style={{ margin: 0, color: 'var(--text-muted)' }}>Phone Number</h5>
                                            <p style={{ margin: '0.2rem 0 0', fontSize: '1.1rem' }}>{user.phone || 'Not provided'}</p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                                            <MapPin size={24} color="var(--primary)" />
                                        </div>
                                        <div>
                                            <h5 style={{ margin: 0, color: 'var(--text-muted)' }}>Address</h5>
                                            <p style={{ margin: '0.2rem 0 0', fontSize: '1.1rem' }}>{user.address || 'Not provided'}</p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                                            <User size={24} color="var(--primary)" />
                                        </div>
                                        <div>
                                            <h5 style={{ margin: 0, color: 'var(--text-muted)' }}>Gender & Age</h5>
                                            <p style={{ margin: '0.2rem 0 0', fontSize: '1.1rem' }}>
                                                {user.gender || 'N/A'} {user.age ? `• ${user.age} years old` : ''}
                                            </p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px' }}>
                                            <Briefcase size={24} color="var(--primary)" />
                                        </div>
                                        <div>
                                            <h5 style={{ margin: 0, color: 'var(--text-muted)' }}>Occupation</h5>
                                            <p style={{ margin: '0.2rem 0 0', fontSize: '1.1rem' }}>{user.job || 'Not provided'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>

                </div>
            </div>



        </div>
    );
};

export default UserProfile;
