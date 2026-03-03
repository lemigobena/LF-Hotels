import React, { useState, useEffect, useContext } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput,
    TouchableOpacity, ActivityIndicator, Alert, Image, StatusBar, Platform
} from 'react-native';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { Building2, MapPin, Globe, LayoutDashboard, Save, Image as ImageIcon } from 'lucide-react-native';

export default function HotelAdminProfileScreen() {
    const { user } = useContext(AuthContext);
    const hotelId = user?.hotelId;
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '', location: '', description: '', image: ''
    });

    useEffect(() => {
        if (hotelId) fetchHotelProfile();
    }, [hotelId]);

    const fetchHotelProfile = async () => {
        try {
            const res = await api.get(`/hotels/${hotelId}`);
            setHotel(res.data);
            setFormData({
                name: res.data.name || '',
                location: res.data.location || '',
                description: res.data.description || '',
                image: res.data.image || ''
            });
        } catch {
            Alert.alert('Protocol Error', 'Failed to retrieve hotel brand data.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put(`/hotels/${hotelId}`, formData);
            Alert.alert('DATABASE UPDATED', 'Hotel brand identity successfully modified.');
            fetchHotelProfile();
        } catch (err) {
            Alert.alert('CORE FAILURE', err.response?.data?.message || 'Failed to persist brand changes.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <StatusBar barStyle="light-content" />
            <Text style={styles.header}>Hotel Profile</Text>
            <Text style={styles.subHeader}>Configure your brand identity and presence</Text>

            <View style={styles.previewContainer}>
                {formData.image ? (
                    <Image source={{ uri: formData.image }} style={styles.previewImage} />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <ImageIcon color={COLORS.textMuted} size={40} />
                        <Text style={styles.placeholderText}>NO ASSET CONFIGURED</Text>
                    </View>
                )}
                <View style={styles.previewOverlay}>
                    <Text style={styles.overlayText}>ASSET PREVIEW</Text>
                </View>
            </View>

            <View style={styles.form}>
                {[
                    { key: 'name', label: 'HOTEL DESIGNATION', icon: Building2 },
                    { key: 'location', label: 'ADDRESS / COORDINATES', icon: MapPin },
                    { key: 'image', label: 'BRAND ASSET URL', icon: Globe },
                    { key: 'description', label: 'BRAND NARRATIVE', multiline: true, icon: LayoutDashboard }
                ].map(field => (
                    <View key={field.key} style={styles.fieldGroup}>
                        <View style={styles.labelRow}>
                            <field.icon size={10} color={COLORS.primary} />
                            <Text style={styles.label}>{field.label}</Text>
                        </View>
                        <TextInput
                            style={[styles.input, field.multiline && { height: 120, textAlignVertical: 'top' }]}
                            value={formData[field.key]}
                            onChangeText={val => setFormData(prev => ({ ...prev, [field.key]: val }))}
                            multiline={field.multiline}
                            autoCapitalize="none"
                            placeholderTextColor={COLORS.textMuted}
                        />
                    </View>
                ))}

                <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving}>
                    {saving ? (
                        <ActivityIndicator color={COLORS.secondary} />
                    ) : (
                        <>
                            <Save size={18} color={COLORS.secondary} />
                            <Text style={styles.saveText}>PERSIST CHANGES</Text>
                        </>
                    )}
                </TouchableOpacity>

                <View style={{ height: 40 }} />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { backgroundColor: COLORS.bgBody, minHeight: '100%' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bgBody },
    header: { fontSize: 28, fontWeight: 'bold', padding: 25, paddingBottom: 5, color: COLORS.textMain, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
    subHeader: { color: COLORS.textMuted, fontSize: 13, paddingHorizontal: 25, marginBottom: 25 },

    previewContainer: { marginHorizontal: 25, marginBottom: 30, borderRadius: RADIUS.lg, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.glassBorder },
    previewImage: { width: '100%', height: 200, resizeMode: 'cover' },
    imagePlaceholder: { width: '100%', height: 200, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bgCard },
    placeholderText: { color: COLORS.textMuted, fontSize: 10, fontWeight: 'bold', marginTop: 10, letterSpacing: 1 },
    previewOverlay: { position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
    overlayText: { color: COLORS.primary, fontSize: 8, fontWeight: 'bold', letterSpacing: 1 },

    form: { paddingHorizontal: 25 },
    fieldGroup: { marginBottom: 20 },
    labelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    label: { color: COLORS.primary, fontSize: 10, fontWeight: 'bold', letterSpacing: 1.5 },
    input: { backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.glassBorder, borderRadius: RADIUS.md, padding: 15, color: COLORS.textMain, fontSize: 15 },

    saveBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: COLORS.primary, paddingVertical: 18, borderRadius: RADIUS.md, marginTop: 15 },
    saveText: { color: COLORS.secondary, fontWeight: '900', fontSize: 13, letterSpacing: 2 }
});
