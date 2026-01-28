import React, { useEffect, useState } from 'react';
import api from '../api/api';
import Navbar from '../components/Navbar';
import { Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HotelAdminProfile = () => {
    const navigate = useNavigate();
    const [hotelDetails, setHotelDetails] = useState(null);
    const user = JSON.parse(sessionStorage.getItem('user'));
    const hotelId = user?.hotelId;

    useEffect(() => {
        if (hotelId) {
            fetchHotelDetails();
        }
    }, [hotelId]);

    const fetchHotelDetails = async () => {
        try {
            const res = await api.get(`/hotels/${hotelId}`);
            setHotelDetails(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateSettings = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/hotels/${hotelId}`, hotelDetails);
            alert('Settings updated successfully');
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to update settings');
        }
    };

    if (!hotelId) return <div style={{ minHeight: '100vh', background: 'var(--bg-body)', color: 'white', padding: '2rem' }}>Loading hotel info...</div>;
    if (!hotelDetails) return <div style={{ minHeight: '100vh', background: 'var(--bg-body)', color: 'white', padding: '2rem' }}>Loading details...</div>;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
                <button onClick={() => navigate('/admin/hotel')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', cursor: 'pointer' }}>
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>

                <h2 style={{ marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>Hotel Profile & Settings</h2>

                <form onSubmit={handleUpdateSettings}>
                    <div className="form-group">
                        <label>Hotel Name</label>
                        <input value={hotelDetails.name} onChange={e => setHotelDetails({ ...hotelDetails, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                        <label>Description</label>
                        <textarea value={hotelDetails.description} onChange={e => setHotelDetails({ ...hotelDetails, description: e.target.value })} rows="5" />
                    </div>
                    <div className="form-group">
                        <label>Image URL</label>
                        <input value={hotelDetails.image || ''} onChange={e => setHotelDetails({ ...hotelDetails, image: e.target.value })} placeholder="https://..." />
                        {hotelDetails.image && <img src={hotelDetails.image} alt="Preview" style={{ marginTop: '0.5rem', maxHeight: '200px', borderRadius: '8px' }} />}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="form-group">
                            <label>Opening Time</label>
                            <input type="time" value={hotelDetails.openingTime || ''} onChange={e => setHotelDetails({ ...hotelDetails, openingTime: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Closing Time</label>
                            <input type="time" value={hotelDetails.closingTime || ''} onChange={e => setHotelDetails({ ...hotelDetails, closingTime: e.target.value })} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Location / Address</label>
                        <input value={hotelDetails.location || ''} onChange={e => setHotelDetails({ ...hotelDetails, location: e.target.value })} />
                    </div>

                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,0,0,0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,0,0,0.2)' }}>
                        <input
                            type="checkbox"
                            id="isClosed"
                            checked={hotelDetails.isClosed || false}
                            onChange={e => setHotelDetails({ ...hotelDetails, isClosed: e.target.checked })}
                            style={{ width: '20px', height: '20px' }}
                        />
                        <div>
                            <label htmlFor="isClosed" style={{ marginBottom: '0', color: 'red', fontWeight: 'bold' }}>Temporarily Closed</label>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>Check this to mark the hotel as closed to customers.</p>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        <Save size={18} style={{ marginRight: '0.5rem' }} /> Update Profile
                    </button>
                </form>
            </div>
        </div>
    );
};

export default HotelAdminProfile;
