import React, { useState, useContext, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TextInput,
    TouchableOpacity, ActivityIndicator, Alert, Image, StatusBar, Platform
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { User, Mail, Phone, MapPin, Edit3, LogOut, ChevronRight, ShieldCheck } from 'lucide-react-native';

export default function ProfileScreen() {
    const { user, logout, setUser } = useContext(AuthContext);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || ''
            });
        }
    }, [user]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const res = await api.put('/auth/profile', formData);
            if (setUser) setUser(res.data);
            Alert.alert('Success', 'Profile updated successfully!');
            setEditing(false);
        } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Logout', style: 'destructive', onPress: logout }
        ]);
    };

    if (!user) return <View style={styles.center}><ActivityIndicator color={COLORS.primary} /></View>;

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <StatusBar barStyle="light-content" />

            {/* Profile Header */}
            <View style={styles.header}>
                <View style={styles.avatarWrapper}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{user.name?.charAt(0)?.toUpperCase() || 'U'}</Text>
                    </View>
                    <TouchableOpacity style={styles.editBadge} onPress={() => setEditing(true)}>
                        <Edit3 color={COLORS.secondary} size={14} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.name}>{user.name}</Text>
                <View style={styles.roleBadge}>
                    <ShieldCheck color={COLORS.primary} size={14} />
                    <Text style={styles.role}>{user.role?.replace('_', ' ')}</Text>
                </View>
            </View>

            {/* Profile Content */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>ACCOUNT DETAILS</Text>
                    {!editing && (
                        <TouchableOpacity onPress={() => setEditing(true)}>
                            <Text style={styles.editLink}>Edit Profile</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {editing ? (
                    <View style={styles.form}>
                        {[
                            { key: 'name', label: 'FULL NAME', icon: User },
                            { key: 'email', label: 'EMAIL ADDRESS', icon: Mail, type: 'email-address' },
                            { key: 'phone', label: 'PHONE NUMBER', icon: Phone, type: 'phone-pad' },
                            { key: 'address', label: 'PHYSICAL ADDRESS', icon: MapPin }
                        ].map(field => (
                            <View key={field.key} style={styles.inputGroup}>
                                <Text style={styles.label}>{field.label}</Text>
                                <View style={styles.inputWrapper}>
                                    <field.icon color={COLORS.primary} size={18} />
                                    <TextInput
                                        style={styles.input}
                                        value={formData[field.key]}
                                        onChangeText={val => setFormData(prev => ({ ...prev, [field.key]: val }))}
                                        placeholder={`Enter ${field.label.toLowerCase()}`}
                                        placeholderTextColor={COLORS.textMuted}
                                        keyboardType={field.type || 'default'}
                                        autoCapitalize={field.key === 'email' ? 'none' : 'words'}
                                    />
                                </View>
                            </View>
                        ))}
                        <View style={styles.actions}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditing(false)}>
                                <Text style={styles.cancelText}>CANCEL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
                                {loading ? <ActivityIndicator color={COLORS.secondary} /> : <Text style={styles.saveText}>SAVE CHANGES</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={styles.detailsList}>
                        {[
                            { label: 'Email', value: user.email, icon: Mail },
                            { label: 'Phone', value: user.phone || 'Not set', icon: Phone },
                            { label: 'Address', value: user.address || 'Not set', icon: MapPin }
                        ].map(row => (
                            <View key={row.label} style={styles.detailRow}>
                                <View style={styles.detailLeft}>
                                    <View style={styles.iconCircle}>
                                        <row.icon color={COLORS.primary} size={16} />
                                    </View>
                                    <View>
                                        <Text style={styles.detailLabel}>{row.label.toUpperCase()}</Text>
                                        <Text style={styles.detailValue}>{row.value}</Text>
                                    </View>
                                </View>
                                <ChevronRight color={COLORS.glassBorder} size={20} />
                            </View>
                        ))}
                    </View>
                )}
            </View>

            {/* Account Settings */}
            {!editing && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>SETTINGS</Text>
                    <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                        <LogOut color={COLORS.error} size={20} />
                        <Text style={styles.logoutText}>Sign Out</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bgBody },
    scrollContent: { paddingBottom: 40 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bgBody },

    header: { alignItems: 'center', paddingVertical: 40, backgroundColor: COLORS.secondary, borderBottomWidth: 1, borderBottomColor: COLORS.glassBorder },
    avatarWrapper: { position: 'relative', marginBottom: 15 },
    avatar: {
        width: 100, height: 100, borderRadius: 50,
        backgroundColor: COLORS.bgCard,
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 2, borderColor: COLORS.primary,
        shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10
    },
    avatarText: { color: COLORS.primary, fontSize: 40, fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
    editBadge: {
        position: 'absolute', bottom: 5, right: 5,
        backgroundColor: COLORS.primary, width: 28, height: 28,
        borderRadius: 14, justifyContent: 'center', alignItems: 'center',
        borderWidth: 2, borderColor: COLORS.secondary
    },
    name: { fontSize: 24, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 8 },
    roleBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(212, 175, 55, 0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
    role: { fontSize: 11, color: COLORS.primary, fontWeight: 'bold', letterSpacing: 1 },

    section: { marginTop: 30, paddingHorizontal: 20 },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    sectionTitle: { fontSize: 12, fontWeight: '900', color: COLORS.primary, letterSpacing: 2 },
    editLink: { color: COLORS.primary, fontSize: 13, fontWeight: 'bold', textDecorationLine: 'underline' },

    detailsList: { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.glassBorder },
    detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: COLORS.glassBorder },
    detailLeft: { flexDirection: 'row', alignItems: 'center', gap: 15 },
    iconCircle: { width: 34, height: 34, borderRadius: 17, backgroundColor: COLORS.secondary, justifyContent: 'center', alignItems: 'center' },
    detailLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '900', letterSpacing: 1, marginBottom: 2 },
    detailValue: { fontSize: 15, color: COLORS.textMain, fontWeight: '500' },

    form: { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg, padding: 20, borderWidth: 1, borderColor: COLORS.glassBorder },
    inputGroup: { marginBottom: 18 },
    label: { color: COLORS.primary, fontSize: 10, fontWeight: 'bold', marginBottom: 8, letterSpacing: 1 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: COLORS.glassBorder, paddingBottom: 10 },
    input: { flex: 1, color: COLORS.textMain, fontSize: 15, padding: 0 },

    actions: { flexDirection: 'row', gap: 10, marginTop: 25 },
    cancelBtn: { flex: 1, paddingVertical: 15, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.glassBorder, alignItems: 'center' },
    cancelText: { color: COLORS.textMuted, fontWeight: 'bold', fontSize: 13 },
    saveBtn: { flex: 2, paddingVertical: 15, borderRadius: RADIUS.md, backgroundColor: COLORS.primary, alignItems: 'center' },
    saveText: { color: COLORS.secondary, fontWeight: 'bold', fontSize: 13 },

    logoutBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 15,
        backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md,
        padding: 20, borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.2)'
    },
    logoutText: { color: COLORS.error, fontWeight: 'bold', fontSize: 16 }
});

