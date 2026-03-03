import React, { useState, useEffect, useContext } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    TextInput, ActivityIndicator, Alert, FlatList, Modal, Switch, StatusBar, Platform
} from 'react-native';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import {
    LayoutDashboard, Package, BedSingle, Coffee, Megaphone,
    Star, Plus, Trash2, CheckCircle, XCircle, Clock, ChevronRight,
    Settings, Eye, EyeOff, Star as StarIcon
} from 'lucide-react-native';

const TABS = [
    { id: 'Bookings', label: 'RESERVATIONS', icon: Clock },
    { id: 'Menu', label: 'MENU', icon: Coffee },
    { id: 'Rooms', label: 'ROOMS', icon: BedSingle },
    { id: 'Services', label: 'SERVICES', icon: Package },
    { id: 'Announcements', label: 'NEWS', icon: Megaphone },
    { id: 'Reviews', label: 'FEEDBACK', icon: StarIcon }
];

export default function HotelAdminDashboardScreen() {
    const { user } = useContext(AuthContext);
    const [tab, setTab] = useState('Bookings');
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);
    const hotelId = user?.hotelId;

    // Product form
    const [showProductForm, setShowProductForm] = useState(false);
    const [productForm, setProductForm] = useState({
        name: '', description: '', price: '', image: '',
        type: 'MEAL', isAvailable: true, isSpecial: false
    });
    const [savingProduct, setSavingProduct] = useState(false);

    // Announcement form
    const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
    const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '' });
    const [savingAnnouncement, setSavingAnnouncement] = useState(false);

    useEffect(() => {
        if (hotelId) fetchTabData(tab);
    }, [tab, hotelId]);

    const fetchTabData = async (activeTab) => {
        setLoading(true);
        setData([]);
        try {
            let res;
            if (activeTab === 'Bookings') res = await api.get(`/reservations/hotel/${hotelId}`);
            else if (['Menu', 'Rooms', 'Services'].includes(activeTab)) res = await api.get(`/products/hotel/${hotelId}`);
            else if (activeTab === 'Announcements') res = await api.get(`/announcements/hotel/${hotelId}`);
            else if (activeTab === 'Reviews') res = await api.get(`/reviews/${hotelId}`);
            setData(res?.data || []);
        } catch (err) {
            console.log('Error fetching tab data', err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateBookingStatus = async (id, status) => {
        try {
            await api.put(`/reservations/${id}/status`, { status });
            fetchTabData('Bookings');
        } catch { Alert.alert('Error', 'Failed to update status.'); }
    };

    const handleDeleteItem = async (endpoint, id) => {
        Alert.alert('Request Deletion', 'This action cannot be undone. Proceed?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete Permanently', style: 'destructive', onPress: async () => {
                    try { await api.delete(`/${endpoint}/${id}`); fetchTabData(tab); }
                    catch { Alert.alert('Error', 'Failed to delete.'); }
                }
            }
        ]);
    };

    const handleToggleAvailability = async (product) => {
        try {
            await api.put(`/products/${product.id}`, { isAvailable: !product.isAvailable });
            fetchTabData(tab);
        } catch { Alert.alert('Error', 'Failed to toggle status.'); }
    };

    const handleCreateProduct = async () => {
        if (!productForm.name || !productForm.price) {
            return Alert.alert('Fields Required', 'Please provide a name and price for the item.');
        }
        setSavingProduct(true);
        try {
            await api.post('/products', {
                ...productForm,
                price: parseFloat(productForm.price),
                hotelId
            });
            fetchTabData(tab);
            setShowProductForm(false);
            setProductForm({ name: '', description: '', price: '', image: '', type: 'MEAL', isAvailable: true, isSpecial: false });
        } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to create item.');
        } finally {
            setSavingProduct(false);
        }
    };

    const handleCreateAnnouncement = async () => {
        if (!announcementForm.title || !announcementForm.content) {
            return Alert.alert('Fields Required', 'Title and content are required.');
        }
        setSavingAnnouncement(true);
        try {
            await api.post('/announcements', { ...announcementForm, hotelId });
            fetchTabData('Announcements');
            setShowAnnouncementForm(false);
            setAnnouncementForm({ title: '', content: '' });
        } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to post announcement.');
        } finally {
            setSavingAnnouncement(false);
        }
    };

    const getFilteredProducts = () => {
        if (tab === 'Menu') return data.filter(p => p.type === 'MEAL' || p.type === 'DRINK');
        if (tab === 'Rooms') return data.filter(p => p.type === 'ROOM');
        if (tab === 'Services') return data.filter(p => p.type === 'SERVICE');
        return [];
    };

    const STATUS_COLORS = { PENDING: '#f59e0b', COMPLETED: COLORS.primary, CANCELLED: COLORS.error };

    const renderContent = () => {
        if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
        const items = tab === 'Bookings' ? data : tab === 'Announcements' ? data : tab === 'Reviews' ? data : getFilteredProducts();

        if (items.length === 0) {
            return (
                <View style={styles.emptyBox}>
                    <LayoutDashboard color={COLORS.textMuted} size={40} />
                    <Text style={styles.emptyText}>No records found for {tab.toLowerCase()}.</Text>
                </View>
            );
        }

        if (tab === 'Bookings') {
            return items.map(item => (
                <View key={item.id} style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.cardTitle}>{item.product?.name || 'Exclusive Booking'}</Text>
                            <Text style={styles.refCode}>#{item.id.slice(-6).toUpperCase()}</Text>
                        </View>
                        <View style={[styles.statusBadge, { backgroundColor: STATUS_COLORS[item.status] + '20' }]}>
                            <Text style={[styles.statusText, { color: STATUS_COLORS[item.status] || COLORS.textMuted }]}>{item.status}</Text>
                        </View>
                    </View>

                    <View style={styles.cardInfo}>
                        <View style={styles.infoLine}>
                            <Clock size={12} color={COLORS.primary} />
                            <Text style={styles.infoText}>{new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
                        </View>
                        <View style={styles.infoLine}>
                            <Plus size={12} color={COLORS.primary} />
                            <Text style={styles.infoText}>{item.customerName || item.user?.name || 'Guest User'}</Text>
                        </View>
                    </View>

                    <View style={styles.cardActions}>
                        {['PENDING', 'COMPLETED', 'CANCELLED'].filter(s => s !== item.status).map(s => (
                            <TouchableOpacity key={s}
                                style={[styles.actionBtn, { borderColor: STATUS_COLORS[s] + '60' }]}
                                onPress={() => handleUpdateBookingStatus(item.id, s)}>
                                <Text style={[styles.actionBtnText, { color: STATUS_COLORS[s] }]}>{s}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            ));
        }

        if (tab === 'Announcements') {
            return items.map(item => (
                <View key={item.id} style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>{item.title}</Text>
                        <TouchableOpacity onPress={() => handleDeleteItem('announcements', item.id)}>
                            <Trash2 size={18} color={COLORS.error} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.cardDesc}>{item.content}</Text>
                    <Text style={styles.refCode}>Posted on {new Date(item.createdAt || Date.now()).toLocaleDateString()}</Text>
                </View>
            ));
        }

        if (tab === 'Reviews') {
            return items.map(item => (
                <View key={item.id} style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.reviewerName}>{item.user?.name || 'Anonymous'}</Text>
                        <Text style={styles.starRating}>{'★'.repeat(item.rating)}</Text>
                    </View>
                    <Text style={styles.cardDesc}>{item.comment}</Text>
                </View>
            ));
        }

        return items.map(item => (
            <View key={item.id} style={styles.card}>
                <View style={[styles.cardHeader, { marginBottom: 10 }]}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>{item.name}</Text>
                        <Text style={styles.itemTag}>{item.type} · ${item.price?.toFixed(2)}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleToggleAvailability(item)}>
                        {item.isAvailable ? <Eye size={20} color={COLORS.primary} /> : <EyeOff size={20} color={COLORS.textMuted} />}
                    </TouchableOpacity>
                </View>

                <Text style={styles.cardDesc} numberOfLines={2}>{item.description}</Text>

                <View style={[styles.cardActions, { marginTop: 15 }]}>
                    <TouchableOpacity
                        style={[styles.actionBtn, { flex: 1, borderColor: COLORS.glassBorder }]}
                        onPress={() => handleDeleteItem('products', item.id)}
                    >
                        <Trash2 size={14} color={COLORS.error} />
                        <Text style={[styles.actionBtnText, { color: COLORS.error, marginLeft: 6 }]}>DELETE</Text>
                    </TouchableOpacity>
                </View>
            </View>
        ));
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Text style={styles.header}>Hotel Admin</Text>

            <View style={styles.tabsContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsList}>
                    {TABS.map(t => (
                        <TouchableOpacity key={t.id} style={[styles.tab, tab === t.id && styles.activeTab]} onPress={() => setTab(t.id)}>
                            <t.icon size={13} color={tab === t.id ? COLORS.secondary : COLORS.textMuted} />
                            <Text style={[styles.tabText, tab === t.id && styles.activeTabText]}>{t.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Quick Actions Bar */}
            <View style={styles.actionBar}>
                <Text style={styles.tabCount}>{data.length} Total Records</Text>
                {['Menu', 'Rooms', 'Services'].includes(tab) && (
                    <TouchableOpacity style={styles.addBtn} onPress={() => setShowProductForm(true)}>
                        <Plus size={14} color={COLORS.secondary} />
                        <Text style={styles.addBtnText}>ADD ITEM</Text>
                    </TouchableOpacity>
                )}
                {tab === 'Announcements' && (
                    <TouchableOpacity style={styles.addBtn} onPress={() => setShowAnnouncementForm(true)}>
                        <Plus size={14} color={COLORS.secondary} />
                        <Text style={styles.addBtnText}>NEW POST</Text>
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {renderContent()}
            </ScrollView>

            {/* Product Form Modal */}
            <Modal visible={showProductForm} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Manage {tab}</Text>
                            <Text style={styles.modalSub}>{user?.hotel?.name}</Text>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {[
                                { key: 'name', label: 'NAME', icon: Plus },
                                { key: 'description', label: 'DESCRIPTION', icon: LayoutDashboard },
                                { key: 'price', label: 'PRICE ($)', icon: Plus, keyboard: 'numeric' },
                                { key: 'image', label: 'IMAGE URL', icon: Eye }
                            ].map(f => (
                                <View key={f.key} style={styles.inputGroup}>
                                    <Text style={styles.label}>{f.label}</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={productForm[f.key]}
                                        onChangeText={v => setProductForm(p => ({ ...p, [f.key]: v }))}
                                        placeholderTextColor={COLORS.textMuted}
                                        keyboardType={f.keyboard || 'default'}
                                    />
                                </View>
                            ))}

                            {tab === 'Menu' && (
                                <View style={styles.inputGroup}>
                                    <Text style={styles.label}>CATEGORY</Text>
                                    <View style={styles.typeRow}>
                                        {['MEAL', 'DRINK'].map(t => (
                                            <TouchableOpacity key={t} style={[styles.typeChip, productForm.type === t && styles.typeChipActive]} onPress={() => setProductForm(p => ({ ...p, type: t }))}>
                                                <Text style={[styles.chipText, productForm.type === t && { color: COLORS.secondary }]}>{t}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            )}

                            <View style={styles.switchRow}>
                                <Text style={styles.label}>MARK AS PROMOTED / SPECIAL</Text>
                                <Switch
                                    value={productForm.isSpecial}
                                    onValueChange={v => setProductForm(p => ({ ...p, isSpecial: v }))}
                                    trackColor={{ false: COLORS.glassBorder, true: COLORS.primary }}
                                    thumbColor={COLORS.secondary}
                                />
                            </View>

                            <View style={styles.modalActions}>
                                <TouchableOpacity style={styles.modalCancel} onPress={() => setShowProductForm(false)}>
                                    <Text style={styles.modalCancelText}>CANCEL</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalSave} onPress={handleCreateProduct} disabled={savingProduct}>
                                    {savingProduct ? <ActivityIndicator color={COLORS.secondary} /> : <Text style={styles.modalSaveText}>CREATE ITEM</Text>}
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Announcement Form Modal */}
            <Modal visible={showAnnouncementForm} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Broadcast Message</Text>
                            <Text style={styles.modalSub}>Post to profile announcements</Text>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>TITLE</Text>
                            <TextInput style={styles.input} value={announcementForm.title} onChangeText={v => setAnnouncementForm(p => ({ ...p, title: v }))} placeholderTextColor={COLORS.textMuted} />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>MESSAGE CONTENT</Text>
                            <TextInput
                                style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
                                value={announcementForm.content}
                                onChangeText={v => setAnnouncementForm(p => ({ ...p, content: v }))}
                                multiline
                                placeholderTextColor={COLORS.textMuted}
                            />
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.modalCancel} onPress={() => setShowAnnouncementForm(false)}>
                                <Text style={styles.modalCancelText}>DISCARD</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalSave} onPress={handleCreateAnnouncement} disabled={savingAnnouncement}>
                                {savingAnnouncement ? <ActivityIndicator color={COLORS.secondary} /> : <Text style={styles.modalSaveText}>POST NOW</Text>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bgBody },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { fontSize: 28, fontWeight: 'bold', padding: 25, paddingBottom: 15, color: COLORS.textMain, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },

    tabsContainer: { borderBottomWidth: 1, borderBottomColor: COLORS.glassBorder },
    tabsList: { paddingHorizontal: 20, paddingBottom: 15, gap: 10 },
    tab: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 16, borderRadius: RADIUS.full, backgroundColor: COLORS.secondary, borderWidth: 1, borderColor: COLORS.glassBorder },
    activeTab: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    tabText: { fontWeight: '900', color: COLORS.textMuted, fontSize: 10, letterSpacing: 1 },
    activeTabText: { color: COLORS.secondary },

    actionBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingVertical: 15 },
    tabCount: { color: COLORS.textMuted, fontSize: 12, fontWeight: 'bold' },
    addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.sm },
    addBtnText: { color: COLORS.secondary, fontWeight: 'bold', fontSize: 11 },

    content: { padding: 20, paddingBottom: 40 },
    card: { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: COLORS.glassBorder },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 4 },
    refCode: { fontSize: 11, color: COLORS.textMuted, fontWeight: 'bold', letterSpacing: 1 },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
    statusText: { fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },

    cardInfo: { marginVertical: 15, gap: 8 },
    infoLine: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    infoText: { color: COLORS.textMain, fontSize: 14, opacity: 0.8 },

    cardActions: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
    actionBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 8, borderRadius: RADIUS.sm, borderWidth: 1 },
    actionBtnText: { fontWeight: '900', fontSize: 10, letterSpacing: 1 },

    cardDesc: { color: COLORS.textMuted, fontSize: 14, lineHeight: 22, marginTop: 10 },
    itemTag: { color: COLORS.primary, fontWeight: 'bold', fontSize: 12 },
    reviewerName: { fontWeight: 'bold', color: COLORS.textMain, fontSize: 16 },
    starRating: { color: COLORS.primary, fontSize: 14 },

    emptyBox: { alignItems: 'center', marginTop: 80, opacity: 0.5 },
    emptyText: { color: COLORS.textMuted, marginTop: 15, fontSize: 14 },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
    modalBox: { backgroundColor: COLORS.bgBody, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 30, maxHeight: '90%', borderTopWidth: 1, borderTopColor: COLORS.glassBorder },
    modalHeader: { marginBottom: 25 },
    modalTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.textMain },
    modalSub: { color: COLORS.primary, fontSize: 12, fontWeight: 'bold', marginTop: 4, letterSpacing: 1 },
    inputGroup: { marginBottom: 20 },
    label: { color: COLORS.primary, fontSize: 10, fontWeight: 'bold', marginBottom: 8, letterSpacing: 1 },
    input: { backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.glassBorder, borderRadius: RADIUS.md, padding: 15, color: COLORS.textMain },
    typeRow: { flexDirection: 'row', gap: 10 },
    typeChip: { flex: 1, paddingVertical: 10, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.glassBorder, alignItems: 'center' },
    typeChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    chipText: { color: COLORS.textMuted, fontWeight: 'bold', fontSize: 12 },
    switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 },
    modalActions: { flexDirection: 'row', gap: 15, marginTop: 10 },
    modalCancel: { flex: 1, paddingVertical: 18, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.glassBorder, alignItems: 'center' },
    modalCancelText: { color: COLORS.textMuted, fontWeight: 'bold' },
    modalSave: { flex: 2, paddingVertical: 18, borderRadius: RADIUS.md, backgroundColor: COLORS.primary, alignItems: 'center' },
    modalSaveText: { color: COLORS.secondary, fontWeight: '900' }
});

