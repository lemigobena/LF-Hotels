import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert, StatusBar, ScrollView, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../services/api';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { Calendar, MapPin, Receipt, Clock, ChevronRight, XCircle, Info } from 'lucide-react-native';

const TABS = [
    { id: 'all', label: 'ALL ACTIVITY' },
    { id: 'ROOM', label: 'BOOKINGS' },
    { id: 'FOOD', label: 'ORDERS' },
    { id: 'SERVICE', label: 'SERVICES' }
];

export default function BookingsScreen() {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await api.get('/reservations/my-reservations');
            setReservations(res.data);
        } catch (err) {
            console.log('Error fetching bookings', err);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(useCallback(() => { fetchBookings(); }, []));

    const handleCancel = (id) => {
        Alert.alert('Cancel Reservation', 'Are you sure you want to cancel this reservation?', [
            { text: 'Keep', style: 'cancel' },
            {
                text: 'Cancel It', style: 'destructive', onPress: async () => {
                    try {
                        await api.put(`/reservations/${id}/status`, { status: 'CANCELLED' });
                        fetchBookings();
                    } catch {
                        Alert.alert('Error', 'Failed to cancel reservation.');
                    }
                }
            }
        ]);
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'COMPLETED': return { color: COLORS.primary, bg: 'rgba(212, 175, 55, 0.1)', icon: Clock };
            case 'CANCELLED': return { color: COLORS.error, bg: 'rgba(239, 68, 68, 0.1)', icon: XCircle };
            case 'CONFIRMED': return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', icon: Clock };
            default: return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)', icon: Info };
        }
    };

    const filteredReservations = reservations.filter(r => {
        if (activeTab === 'all') return true;
        if (activeTab === 'ROOM') return r.product?.type === 'ROOM';
        if (activeTab === 'FOOD') return r.product?.type === 'MEAL' || r.product?.type === 'DRINK';
        return r.product?.type === 'SERVICE';
    });

    const renderItem = ({ item }) => {
        const status = getStatusConfig(item.status);
        return (
            <View style={styles.card}>
                <View style={styles.cardTop}>
                    <View style={styles.hotelInfo}>
                        <Text style={styles.hotelName}>{item.hotel?.name || 'Grand Resort'}</Text>
                        <View style={styles.locationRow}>
                            <MapPin size={10} color={COLORS.textMuted} />
                            <Text style={styles.locationText}>{item.hotel?.location || 'General'}</Text>
                        </View>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
                        <Text style={[styles.statusText, { color: status.color }]}>{item.status}</Text>
                    </View>
                </View>

                <View style={styles.cardBody}>
                    <View style={styles.productRow}>
                        <Receipt size={16} color={COLORS.primary} />
                        <Text style={styles.productName}>{item.product?.name || 'Exclusive Service'}</Text>
                        <Text style={styles.priceText}>${item.product?.price?.toFixed(2) || '—'}</Text>
                    </View>

                    <View style={styles.dateRow}>
                        <Calendar size={16} color={COLORS.primary} />
                        <Text style={styles.dateText}>
                            {new Date(item.date).toLocaleDateString('en-US', {
                                weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                            })}
                        </Text>
                    </View>
                </View>

                {item.status === 'PENDING' && (
                    <TouchableOpacity style={styles.cancelAction} onPress={() => handleCancel(item.id)}>
                        <XCircle size={14} color={COLORS.error} />
                        <Text style={styles.cancelActionText}>Cancel this reservation</Text>
                    </TouchableOpacity>
                )}

                <View style={styles.cardFooter}>
                    <Text style={styles.refId}>REF: #{item.id.slice(-6).toUpperCase()}</Text>
                    <ChevronRight size={16} color={COLORS.glassBorder} />
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Text style={styles.screenTitle}>My Activity</Text>

            {/* Tab Bar */}
            <View style={styles.tabContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBar}>
                    {TABS.map(t => (
                        <TouchableOpacity
                            key={t.id}
                            style={[styles.tab, activeTab === t.id && styles.activeTab]}
                            onPress={() => setActiveTab(t.id)}
                        >
                            <Text style={[styles.tabText, activeTab === t.id && styles.activeTabText]}>{t.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={filteredReservations}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.emptyBox}>
                            <Info color={COLORS.textMuted} size={40} />
                            <Text style={styles.emptyText}>You haven't made any reservations in this category yet.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bgBody },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    screenTitle: { fontSize: 28, fontWeight: 'bold', padding: 25, paddingBottom: 15, color: COLORS.textMain, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },

    tabContainer: { borderBottomWidth: 1, borderBottomColor: COLORS.glassBorder },
    tabBar: { paddingHorizontal: 20, paddingBottom: 15, gap: 10 },
    tab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: RADIUS.full, backgroundColor: COLORS.secondary, borderWidth: 1, borderColor: COLORS.glassBorder },
    activeTab: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
    tabText: { color: COLORS.textMuted, fontWeight: '900', fontSize: 10, letterSpacing: 1 },
    activeTabText: { color: COLORS.secondary },

    list: { padding: 20, paddingBottom: 40 },
    card: { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: COLORS.glassBorder, overflow: 'hidden' },
    cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
    hotelInfo: { flex: 1 },
    hotelName: { fontSize: 18, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 4 },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    locationText: { fontSize: 12, color: COLORS.textMuted },
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 4 },
    statusText: { fontSize: 10, fontWeight: '900', letterSpacing: 1 },

    cardBody: { paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: COLORS.glassBorder },
    productRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
    productName: { flex: 1, fontSize: 15, fontWeight: '600', color: COLORS.textMain },
    priceText: { fontSize: 15, fontWeight: 'bold', color: COLORS.primary },
    dateRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    dateText: { fontSize: 14, color: COLORS.textMuted },

    cancelAction: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 15, alignSelf: 'flex-end' },
    cancelActionText: { color: COLORS.error, fontSize: 12, fontWeight: 'bold' },

    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15 },
    refId: { fontSize: 11, color: 'rgba(255,255,255,0.2)', fontWeight: 'bold' },

    emptyBox: { alignItems: 'center', marginTop: 100, padding: 40 },
    emptyText: { textAlign: 'center', color: COLORS.textMuted, marginTop: 20, lineHeight: 22, fontSize: 15 }
});

