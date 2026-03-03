import React, { useState, useEffect, useContext } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    TextInput, ActivityIndicator, Alert, FlatList, StatusBar, Platform
} from 'react-native';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import {
    ShieldAlert, PlusCircle, Building2, MapPin,
    Trash2, Ban, CheckCircle2, ChevronRight,
    Info, Search, Globe
} from 'lucide-react-native';

const TABS = [
    { id: 'Hotels', label: 'INFRASTRUCTURE', icon: Building2 },
    { id: 'Add Hotel', label: 'EXPANSION', icon: PlusCircle }
];

export default function SuperAdminDashboardScreen() {
    const { user } = useContext(AuthContext);
    const [tab, setTab] = useState('Hotels');
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '', location: '', description: '',
        adminEmail: '', adminPassword: '', image: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        setLoading(true);
        try {
            const res = await api.get('/hotels?showSuspended=true');
            setHotels(res.data);
        } catch {
            Alert.alert('Protocol Error', 'Critical failure loading infrastructure data.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        Alert.alert('System Purge', 'This will permanently remove the hotel and all associated data. Confirm?', [
            { text: 'Abstain', style: 'cancel' },
            {
                text: 'Proceed with Deletion', style: 'destructive', onPress: async () => {
                    try {
                        await api.delete(`/hotels/${id}`);
                        fetchHotels();
                    } catch {
                        Alert.alert('IO Failure', 'Failed to remove entity from database.');
                    }
                }
            }
        ]);
    };

    const handleSuspend = async (hotel) => {
        const action = hotel.isSuspended ? 'unsuspend' : 'suspend';
        Alert.alert(`${action.toUpperCase()} ACCESS`, `Modify operational status for ${hotel.name}?`, [
            { text: 'Abort', style: 'cancel' },
            {
                text: `Execute ${action}`, onPress: async () => {
                    try {
                        await api.put(`/hotels/${hotel.id}/suspend`, { isSuspended: !hotel.isSuspended });
                        fetchHotels();
                    } catch {
                        Alert.alert('MODIFICATION FAILED', `Status update rejected by core server.`);
                    }
                }
            }
        ]);
    };

    const handleAddHotel = async () => {
        if (!formData.name || !formData.location || !formData.adminEmail || !formData.adminPassword) {
            Alert.alert('INCOMPLETE DATA', 'Required parameters [NAME, LOCATION, AUTH_CREDENTIALS] are missing.');
            return;
        }
        setSubmitting(true);
        try {
            await api.post('/hotels', formData);
            Alert.alert('ENTITY REGISTERED', 'Hotel node and administrative credentials successfully provisioned.');
            setFormData({ name: '', location: '', description: '', adminEmail: '', adminPassword: '', image: '' });
            setTab('Hotels');
            fetchHotels();
        } catch (err) {
            Alert.alert('PROVISIONING ERROR', err.response?.data?.message || 'Handshake failed during entity creation.');
        } finally {
            setSubmitting(false);
        }
    };

    const renderHotel = ({ item }) => (
        <View style={[styles.card, item.isSuspended && styles.cardSuspended]}>
            <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                    <Text style={styles.hotelName}>{item.name}</Text>
                    <View style={styles.locationRow}>
                        <MapPin size={10} color={COLORS.primary} />
                        <Text style={styles.hotelLocation}>{item.location}</Text>
                    </View>
                </View>
                {item.isSuspended ? (
                    <View style={styles.suspendedTag}>
                        <ShieldAlert size={10} color={COLORS.error} />
                        <Text style={styles.suspendedText}>SUSPENDED</Text>
                    </View>
                ) : (
                    <View style={styles.activeTag}>
                        <CheckCircle2 size={10} color="#10b981" />
                        <Text style={styles.activeText}>OPERATIONAL</Text>
                    </View>
                )}
            </View>

            <View style={styles.cardActions}>
                <TouchableOpacity
                    style={[styles.actionBtn, { borderColor: item.isSuspended ? '#10b981' : COLORS.primary + '80' }]}
                    onPress={() => handleSuspend(item)}
                >
                    {item.isSuspended ? <CheckCircle2 size={12} color="#10b981" /> : <Ban size={12} color={COLORS.primary} />}
                    <Text style={[styles.actionBtnText, { color: item.isSuspended ? '#10b981' : COLORS.primary }]}>
                        {item.isSuspended ? 'RESTORE' : 'SUSPEND'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.actionBtn, { borderColor: COLORS.error + '80' }]}
                    onPress={() => handleDelete(item.id)}
                >
                    <Trash2 size={12} color={COLORS.error} />
                    <Text style={[styles.actionBtnText, { color: COLORS.error }]}>PURGE</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Text style={styles.header}>Super Admin</Text>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                {TABS.map(t => (
                    <TouchableOpacity key={t.id} style={[styles.tab, tab === t.id && styles.activeTab]} onPress={() => setTab(t.id)}>
                        <t.icon size={13} color={tab === t.id ? COLORS.secondary : COLORS.textMuted} />
                        <Text style={[styles.tabText, tab === t.id && styles.activeTabText]}>{t.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Hotels Tab */}
            {tab === 'Hotels' && (
                <View style={styles.tabContent}>
                    <View style={styles.statsBar}>
                        <Text style={styles.statsText}>{hotels.length} ENTITIES MONITORING</Text>
                        <TouchableOpacity onPress={fetchHotels}>
                            <Globe size={16} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>
                    {loading ? (
                        <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>
                    ) : (
                        <FlatList
                            data={hotels}
                            keyExtractor={item => item.id}
                            renderItem={renderHotel}
                            contentContainerStyle={styles.list}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <View style={styles.emptyBox}>
                                    <Info color={COLORS.textMuted} size={40} />
                                    <Text style={styles.emptyText}>No infrastructure nodes detected.</Text>
                                </View>
                            }
                        />
                    )}
                </View>
            )}

            {/* Add Hotel Tab */}
            {tab === 'Add Hotel' && (
                <ScrollView contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.formHeader}>
                        <Text style={styles.sectionTitle}>Provision New Entity</Text>
                        <Text style={styles.sectionSub}>Registers a new hotel node and master admin account.</Text>
                    </View>

                    {[
                        { key: 'name', label: 'HOTEL DESIGNATION', icon: Building2 },
                        { key: 'location', label: 'GEOGRAPHICAL COORDINATES', icon: MapPin },
                        { key: 'description', label: 'OVERVIEW', icon: Info },
                        { key: 'image', label: 'BRAND ASSET (URL)', icon: Globe },
                        { key: 'adminEmail', label: 'MASTER ADMIN EMAIL', icon: Search },
                        { key: 'adminPassword', label: 'ACCESS PROTOCOL (PASSWORD)', secure: true, icon: ShieldAlert }
                    ].map(field => (
                        <View key={field.key} style={styles.inputGroup}>
                            <Text style={styles.label}>{field.label}</Text>
                            <TextInput
                                style={styles.input}
                                value={formData[field.key]}
                                onChangeText={val => setFormData(prev => ({ ...prev, [field.key]: val }))}
                                secureTextEntry={field.secure}
                                autoCapitalize="none"
                                placeholderTextColor={COLORS.textMuted}
                            />
                        </View>
                    ))}

                    <TouchableOpacity style={styles.submitBtn} onPress={handleAddHotel} disabled={submitting}>
                        {submitting ? (
                            <ActivityIndicator color={COLORS.secondary} />
                        ) : (
                            <Text style={styles.submitText}>INITIALIZE NODE</Text>
                        )}
                    </TouchableOpacity>

                    <View style={{ height: 40 }} />
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bgBody },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { fontSize: 28, fontWeight: 'bold', padding: 25, paddingBottom: 15, color: COLORS.textMain, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },

    tabsContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 15, gap: 10 },
    tab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 16, borderRadius: RADIUS.full, backgroundColor: COLORS.secondary, borderWidth: 1, borderColor: COLORS.glassBorder },
    activeTab: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    tabText: { fontWeight: '900', color: COLORS.textMuted, fontSize: 10, letterSpacing: 1 },
    activeTabText: { color: COLORS.secondary },

    tabContent: { flex: 1 },
    statsBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, marginBottom: 10 },
    statsText: { fontSize: 10, fontWeight: 'bold', color: COLORS.textMuted, letterSpacing: 1.5 },

    list: { padding: 20, paddingBottom: 40 },
    card: { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: COLORS.glassBorder },
    cardSuspended: { opacity: 0.6, borderColor: COLORS.error + '40' },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
    hotelName: { fontSize: 18, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 4 },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    hotelLocation: { color: COLORS.textMuted, fontSize: 12 },

    suspendedTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.error + '20', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
    suspendedText: { color: COLORS.error, fontSize: 8, fontWeight: '900', letterSpacing: 1 },
    activeTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#10b98120', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
    activeText: { color: '#10b981', fontSize: 8, fontWeight: '900', letterSpacing: 1 },

    cardActions: { flexDirection: 'row', gap: 12 },
    actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 8, borderRadius: RADIUS.sm, borderWidth: 1 },
    actionBtnText: { fontWeight: '900', fontSize: 10, letterSpacing: 1 },

    formContent: { padding: 25 },
    formHeader: { marginBottom: 30 },
    sectionTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.textMain },
    sectionSub: { color: COLORS.textMuted, fontSize: 12, marginTop: 5 },

    inputGroup: { marginBottom: 20 },
    label: { color: COLORS.primary, fontSize: 9, fontWeight: 'bold', marginBottom: 8, letterSpacing: 1.5 },
    input: { backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.glassBorder, borderRadius: RADIUS.md, padding: 15, color: COLORS.textMain },

    submitBtn: { backgroundColor: COLORS.primary, paddingVertical: 18, borderRadius: RADIUS.md, alignItems: 'center', marginTop: 15 },
    submitText: { color: COLORS.secondary, fontWeight: '900', fontSize: 12, letterSpacing: 2 },
    emptyText: { textAlign: 'center', color: COLORS.textMuted, marginTop: 40, fontSize: 14 }
});
