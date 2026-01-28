/**
 * Super Admin Dashboard
 * 
 * Central hub for presiding over the LF Collection network.
 * Allows managing hotels, adding new locations, and suspending/removing existing ones.
 */

import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { Trash2, Plus, Ban, CheckCircle } from 'lucide-react';
import Navbar from '../components/Navbar';

const SuperAdminDashboard = () => {
    const [hotels, setHotels] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        description: '',
        adminEmail: '',
        adminPassword: '',
        image: ''
    });

    const fetchHotels = async () => {
        try {
            // As Super Admin, show all including suspended
            const response = await api.get('/hotels?showSuspended=true');
            setHotels(response.data);
        } catch (error) {
            console.error('Error fetching hotels', error);
        }
    };

    useEffect(() => {
        fetchHotels();
    }, []);

    const [confirmModal, setConfirmModal] = useState({ show: false, title: '', message: '', onConfirm: null });

    const handleDelete = (id) => {
        setConfirmModal({
            show: true,
            title: 'Delete Hotel',
            message: 'Are you sure you want to delete this hotel? This action cannot be undone and will remove the associated admin.',
            onConfirm: async () => {
                try {
                    await api.delete(`/hotels/${id}`);
                    fetchHotels();
                    setConfirmModal({ ...confirmModal, show: false });
                } catch (error) {
                    alert('Failed to delete hotel');
                }
            }
        });
    };

    const handleSuspend = (hotel) => {
        const action = hotel.isSuspended ? 'unsuspend' : 'suspend';
        setConfirmModal({
            show: true,
            title: `${action.charAt(0).toUpperCase() + action.slice(1)} Hotel`,
            message: `Are you sure you want to ${action} ${hotel.name}?`,
            onConfirm: async () => {
                try {
                    await api.put(`/hotels/${hotel.id}/suspend`, { isSuspended: !hotel.isSuspended });
                    fetchHotels();
                    setConfirmModal({ ...confirmModal, show: false });
                } catch (error) {
                    console.error(error);
                    alert(`Failed to ${action} hotel`);
                }
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/hotels', formData);
            setShowForm(false);
            setFormData({ name: '', location: '', description: '', adminEmail: '', adminPassword: '', image: '' });
            fetchHotels();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create hotel');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <header className="hero" style={{ height: '30vh', alignItems: 'center' }}>
                <div className="container">
                    <h1>Super Admin Dashboard</h1>
                    <p>Oversee the entire LF Collection network.</p>
                </div>
            </header>

            <main className="container" style={{ padding: '4rem 2rem', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2>Manage Hotels</h2>
                    <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
                        <Plus size={16} style={{ marginRight: '0.5rem' }} /> Add New Hotel
                    </button>
                </div>

                {showForm && (
                    <div className="card" style={{ maxWidth: '600px', margin: '0 auto 3rem auto', border: '1px solid var(--primary)' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Add New Hotel</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Hotel Name</label>
                                <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <input value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea rows="3" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Image URL</label>
                                <input value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} placeholder="https://..." />
                            </div>

                            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
                                <h4 style={{ marginBottom: '1rem', color: 'var(--text-main)' }}>Assign Hotel Admin</h4>
                                <div className="form-group">
                                    <label>Admin Email</label>
                                    <input type="email" value={formData.adminEmail} onChange={e => setFormData({ ...formData, adminEmail: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Admin Password</label>
                                    <input type="password" value={formData.adminPassword} onChange={e => setFormData({ ...formData, adminPassword: e.target.value })} required />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem' }}>Create Hotel</button>
                        </form>
                    </div>
                )}

                <div className="hotel-grid">
                    {hotels.map(hotel => (
                        <div key={hotel.id} className="card" style={{ opacity: hotel.isSuspended ? 0.7 : 1 }}>
                            <div className="hotel-info">
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <h3>{hotel.name}</h3>
                                    {hotel.isSuspended && <span style={{ color: 'red', fontWeight: 'bold', border: '1px solid red', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>SUSPENDED</span>}
                                </div>
                                <p className="location">{hotel.location}</p>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Admin: {hotel.admin?.email}</p>

                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                                    <button
                                        className="btn btn-outline"
                                        onClick={() => handleSuspend(hotel)}
                                        style={{ fontSize: '0.8rem', padding: '0.5rem', flex: 1, borderColor: hotel.isSuspended ? 'green' : 'orange', color: hotel.isSuspended ? 'green' : 'orange' }}
                                    >
                                        {hotel.isSuspended ? <><CheckCircle size={14} /> Unsuspend</> : <><Ban size={14} /> Suspend</>}
                                    </button>

                                    <button
                                        className="btn btn-outline"
                                        onClick={() => handleDelete(hotel.id)}
                                        style={{ fontSize: '0.8rem', padding: '0.5rem', flex: 1, borderColor: 'red', color: 'red' }}
                                    >
                                        <Trash2 size={14} /> Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            {/* Confirmation Modal */}
            {confirmModal.show && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(5px)'
                }}>
                    <div className="card" style={{ maxWidth: '400px', width: '90%', animation: 'fadeIn 0.2s ease-out' }}>
                        <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>{confirmModal.title}</h3>
                        <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>{confirmModal.message}</p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button
                                className="btn btn-outline"
                                onClick={() => setConfirmModal({ ...confirmModal, show: false })}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn"
                                onClick={confirmModal.onConfirm}
                                style={{
                                    background: 'transparent',
                                    color: confirmModal.title.includes('Delete') ? 'red' : 'var(--primary)',
                                    border: `1px solid ${confirmModal.title.includes('Delete') ? 'red' : 'var(--primary)'}`,
                                    transition: 'all 0.3s'
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.background = confirmModal.title.includes('Delete') ? 'red' : 'var(--primary)';
                                    e.currentTarget.style.color = confirmModal.title.includes('Delete') ? 'white' : 'black';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = confirmModal.title.includes('Delete') ? 'red' : 'var(--primary)';
                                }}
                            >
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminDashboard;
