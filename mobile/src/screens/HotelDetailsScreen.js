import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, ScrollView, Image, ActivityIndicator,
    TouchableOpacity, Alert, TextInput, Modal, StatusBar, Platform
} from 'react-native';
import api from '../services/api';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { Calendar, Phone, Star, Info, Coffee, BedConfig, CheckCircle } from 'lucide-react-native';

const TABS = ['Info', 'Menu & Rooms', 'Book', 'Reviews'];
const STAR_LABELS = ['Terrible', 'Poor', 'Average', 'Good', 'Excellent'];

export default function HotelDetailsScreen({ route }) {
    const { hotelId } = route.params;
    const [hotel, setHotel] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Info');

    // Booking state
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [customerPhone, setCustomerPhone] = useState('');
    const [bookingDate, setBookingDate] = useState('');
    const [booking, setBooking] = useState(false);

    // Review state
    const [reviewModal, setReviewModal] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);

    useEffect(() => {
        fetchHotelData();
    }, [hotelId]);

    const fetchHotelData = async () => {
        try {
            setLoading(true);
            const [hotelRes, prodRes] = await Promise.all([
                api.get(`/hotels/${hotelId}`),
                api.get(`/products/hotel/${hotelId}`)
            ]);
            setHotel(hotelRes.data);
            setProducts(prodRes.data);
        } catch (err) {
            Alert.alert('Error', 'Failed to load hotel data.');
        } finally {
            setLoading(false);
        }
    };

    const handleBook = async () => {
        if (!selectedProduct) return Alert.alert('Select a service', 'Please pick something to book first.');
        if (!customerPhone) return Alert.alert('Required', 'Please enter your phone number.');
        if (!bookingDate) return Alert.alert('Required', 'Please enter a date (e.g. 2026-03-15).');
        setBooking(true);
        try {
            await api.post('/reservations', {
                hotelId,
                productId: selectedProduct.id,
                customerPhone,
                date: new Date(bookingDate).toISOString()
            });
            Alert.alert('Booked!', `${selectedProduct.name} has been reserved.`);
            setSelectedProduct(null);
            setBookingDate('');
        } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'Booking failed.');
        } finally {
            setBooking(false);
        }
    };

    const handleSubmitReview = async () => {
        setSubmittingReview(true);
        try {
            await api.post('/reviews', { hotelId, rating, comment });
            Alert.alert('Thanks!', 'Your review has been submitted.');
            setReviewModal(false);
            setComment('');
            setRating(5);
            fetchHotelData();
        } catch (err) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to submit review. You may have already reviewed this hotel.');
        } finally {
            setSubmittingReview(false);
        }
    };

    const getByType = (type) => products.filter(p => p.type === type && p.isAvailable);

    if (loading) return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
    if (!hotel) return <View style={styles.center}><Text style={{ color: COLORS.textMain }}>Hotel not found.</Text></View>;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            {/* Header Image */}
            <View style={styles.header}>
                <Image source={{ uri: hotel.image || 'https://via.placeholder.com/400' }} style={styles.headerImage} />
                <View style={styles.overlay} />
                <View style={styles.headerText}>
                    <Text style={styles.hotelName}>{hotel.name}</Text>
                    <Text style={styles.location}>📍 {hotel.location}</Text>
                </View>
            </View>

            {/* Tab Bar */}
            <View style={styles.tabBarContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 15 }}>
                    {TABS.map(t => (
                        <TouchableOpacity
                            key={t}
                            style={[styles.tab, activeTab === t && styles.activeTab]}
                            onPress={() => setActiveTab(t)}
                        >
                            <Text style={[styles.tabText, activeTab === t && styles.activeTabText]}>{t.toUpperCase()}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* ------ INFO TAB ------ */}
                {activeTab === 'Info' && (
                    <View>
                        <View style={styles.ratingRow}>
                            <View style={styles.ratingBadge}>
                                <Text style={styles.rating}>⭐ {hotel.avgRating ? hotel.avgRating.toFixed(1) : 'New'}</Text>
                                <Text style={styles.reviewCount}>({hotel.reviews?.length || 0} reviews)</Text>
                            </View>
                            <TouchableOpacity style={styles.rateBtn} onPress={() => setReviewModal(true)}>
                                <Text style={styles.rateBtnText}>RATE</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.sectionTitle}>Overview</Text>
                        <Text style={styles.description}>{hotel.description}</Text>

                        {/* Announcements */}
                        {hotel.announcements?.length > 0 && (
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>📢 Latest Announcements</Text>
                                {hotel.announcements.map(ann => (
                                    <View key={ann.id} style={styles.announcementCard}>
                                        <Text style={styles.annTitle}>{ann.title}</Text>
                                        <Text style={styles.annContent}>{ann.content}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                )}

                {/* ------ MENU & ROOMS TAB ------ */}
                {activeTab === 'Menu & Rooms' && (
                    <View>
                        {[['ROOM', '🛏 EXCLUSIVE ROOMS'], ['MEAL', '🍽 FINE DINING'], ['DRINK', '☕ SIGNATURE DRINKS'], ['SERVICE', '✨ LUXURY SERVICES']].map(([type, label]) => (
                            getByType(type).length > 0 && (
                                <View key={type} style={styles.section}>
                                    <Text style={styles.sectionTitle}>{label}</Text>
                                    {getByType(type).map(p => (
                                        <View key={p.id} style={styles.productCard}>
                                            {p.image ? <Image source={{ uri: p.image }} style={styles.productImage} /> : null}
                                            <View style={styles.productInfo}>
                                                <Text style={styles.productName}>{p.name}</Text>
                                                <Text style={styles.productPrice}>${p.price?.toFixed(2)}</Text>
                                                <Text style={styles.productDesc} numberOfLines={2}>{p.description}</Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            )
                        ))}
                    </View>
                )}

                {/* ------ BOOK TAB ------ */}
                {activeTab === 'Book' && (
                    <View style={styles.form}>
                        <Text style={styles.sectionTitle}>RESERVATION</Text>
                        <Text style={styles.label}>1. SELECT SERVICE</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 15 }}>
                            {products.filter(p => p.isAvailable).map(p => (
                                <TouchableOpacity
                                    key={p.id}
                                    style={[styles.productChip, selectedProduct?.id === p.id && styles.productChipSelected]}
                                    onPress={() => setSelectedProduct(p)}
                                >
                                    <Text style={[styles.chipText, selectedProduct?.id === p.id && styles.chipTextSelected]}>{p.name}</Text>
                                    <Text style={[styles.chipPrice, selectedProduct?.id === p.id && styles.chipTextSelected]}>${p.price?.toFixed(0)}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        <Text style={styles.label}>2. CONTACT NUMBER</Text>
                        <TextInput
                            style={styles.input}
                            value={customerPhone}
                            onChangeText={setCustomerPhone}
                            placeholder="e.g. +1 555 0100"
                            placeholderTextColor={COLORS.textMuted}
                            keyboardType="phone-pad"
                        />

                        <Text style={styles.label}>3. ARRIVAL DATE (YYYY-MM-DD)</Text>
                        <TextInput
                            style={styles.input}
                            value={bookingDate}
                            onChangeText={setBookingDate}
                            placeholder="e.g. 2026-03-15"
                            placeholderTextColor={COLORS.textMuted}
                        />

                        <TouchableOpacity style={styles.bookBtn} onPress={handleBook} disabled={booking}>
                            {booking ? <ActivityIndicator color={COLORS.secondary} /> : <Text style={styles.bookBtnText}>CONFIRM BOOKING</Text>}
                        </TouchableOpacity>
                    </View>
                )}

                {/* ------ REVIEWS TAB ------ */}
                {activeTab === 'Reviews' && (
                    <View>
                        <View style={styles.reviewHeader}>
                            <Text style={styles.sectionTitle}>GUEST REVIEWS</Text>
                            <TouchableOpacity style={styles.writeReviewBtn} onPress={() => setReviewModal(true)}>
                                <Text style={styles.writeReviewText}>+ ADD REVIEW</Text>
                            </TouchableOpacity>
                        </View>
                        {hotel.reviews?.length > 0 ? hotel.reviews.map(r => (
                            <View key={r.id} style={styles.reviewCard}>
                                <View style={styles.reviewTop}>
                                    <Text style={styles.reviewerName}>{r.user?.name || 'Anonymous'}</Text>
                                    <Text style={styles.stars}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</Text>
                                </View>
                                <Text style={styles.reviewComment}>{r.comment}</Text>
                                <Text style={styles.reviewDate}>{new Date(r.createdAt || Date.now()).toLocaleDateString()}</Text>
                            </View>
                        )) : (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No reviews yet. Be our first critic.</Text>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>

            {/* Review Modal */}
            <Modal visible={reviewModal} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Rate Your Experience</Text>
                            <Text style={styles.modalSubtitle}>{hotel.name}</Text>
                        </View>

                        <View style={styles.starRow}>
                            {[1, 2, 3, 4, 5].map(s => (
                                <TouchableOpacity key={s} onPress={() => setRating(s)}>
                                    <Text style={[styles.starIcon, s <= rating && styles.starFilled]}>★</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <Text style={styles.starLabel}>{STAR_LABELS[rating - 1].toUpperCase()}</Text>

                        <TextInput
                            style={[styles.input, { height: 120, textAlignVertical: 'top' }]}
                            placeholder="Share your feedback..."
                            placeholderTextColor={COLORS.textMuted}
                            value={comment}
                            onChangeText={setComment}
                            multiline
                        />

                        <View style={styles.modalBtns}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setReviewModal(false)}>
                                <Text style={styles.cancelText}>CANCEL</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmitReview} disabled={submittingReview}>
                                {submittingReview ? <ActivityIndicator color={COLORS.secondary} /> : <Text style={styles.submitText}>SUBMIT REVIEW</Text>}
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
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bgBody },
    header: { height: 260, position: 'relative' },
    headerImage: { width: '100%', height: '100%' },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
    headerText: { position: 'absolute', bottom: 20, left: 20 },
    hotelName: { fontSize: 32, fontWeight: 'bold', color: COLORS.textMain, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
    location: { color: COLORS.primary, fontSize: 16, marginTop: 4, fontWeight: '600' },

    tabBarContainer: { backgroundColor: COLORS.secondary, borderBottomWidth: 1, borderBottomColor: COLORS.glassBorder },
    tab: { paddingHorizontal: 20, paddingVertical: 15, marginRight: 10 },
    activeTab: { borderBottomWidth: 2, borderBottomColor: COLORS.primary },
    tabText: { color: COLORS.textMuted, fontWeight: '900', fontSize: 11, letterSpacing: 1.5 },
    activeTabText: { color: COLORS.primary },

    content: { padding: 20 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 25 },
    ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.bgCard, padding: 12, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.glassBorder },
    rating: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },
    reviewCount: { color: COLORS.textMuted, fontSize: 12 },
    rateBtn: { backgroundColor: 'transparent', borderWidth: 1, borderColor: COLORS.primary, paddingHorizontal: 15, paddingVertical: 8, borderRadius: RADIUS.sm },
    rateBtnText: { color: COLORS.primary, fontWeight: '900', fontSize: 12, letterSpacing: 1 },

    section: { marginTop: 30 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary, marginBottom: 15, letterSpacing: 1 },
    description: { fontSize: 15, lineHeight: 24, color: COLORS.textMain, opacity: 0.8 },

    announcementCard: { backgroundColor: 'rgba(212, 175, 55, 0.05)', borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.2)', borderRadius: RADIUS.md, padding: 18, marginBottom: 15 },
    annTitle: { fontWeight: 'bold', color: COLORS.primary, marginBottom: 5, fontSize: 15 },
    annContent: { color: COLORS.textMain, opacity: 0.9, fontSize: 14 },

    productCard: { flexDirection: 'row', backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md, marginBottom: 15, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.glassBorder },
    productImage: { width: 100, height: 100 },
    productInfo: { flex: 1, padding: 15 },
    productName: { fontWeight: 'bold', fontSize: 16, color: COLORS.textMain, marginBottom: 4 },
    productPrice: { color: COLORS.primary, fontWeight: 'bold', marginBottom: 6 },
    productDesc: { color: COLORS.textMuted, fontSize: 13, lineHeight: 18 },

    label: { fontWeight: 'bold', color: COLORS.primary, fontSize: 10, letterSpacing: 1, marginBottom: 8, marginTop: 15 },
    input: { backgroundColor: COLORS.bgCard, borderWidth: 1, borderColor: COLORS.glassBorder, borderRadius: RADIUS.md, padding: 15, color: COLORS.textMain, marginBottom: 5 },
    productChip: { borderWidth: 1, borderColor: COLORS.glassBorder, borderRadius: RADIUS.md, paddingHorizontal: 15, paddingVertical: 10, marginRight: 10, backgroundColor: COLORS.bgCard, alignItems: 'center' },
    productChipSelected: { borderColor: COLORS.primary, backgroundColor: 'rgba(212, 175, 55, 0.1)' },
    chipText: { color: COLORS.textMuted, fontWeight: 'bold', fontSize: 13 },
    chipPrice: { color: COLORS.primary, fontSize: 11, marginTop: 2 },
    chipTextSelected: { color: COLORS.primary },
    bookBtn: { backgroundColor: COLORS.primary, padding: 18, borderRadius: RADIUS.md, alignItems: 'center', marginTop: 30, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
    bookBtnText: { color: COLORS.secondary, fontWeight: '900', fontSize: 15, letterSpacing: 2 },

    reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    writeReviewBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: RADIUS.sm },
    writeReviewText: { color: COLORS.secondary, fontWeight: 'bold', fontSize: 11 },
    reviewCard: { backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md, padding: 20, marginBottom: 15, borderWidth: 1, borderColor: COLORS.glassBorder },
    reviewTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    reviewerName: { fontWeight: 'bold', color: COLORS.textMain, fontSize: 15 },
    stars: { color: COLORS.primary, fontSize: 12 },
    reviewComment: { color: COLORS.textMuted, lineHeight: 22, fontSize: 14 },
    reviewDate: { color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 12 },
    emptyContainer: { padding: 40, alignItems: 'center', backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md, borderStyle: 'dashed', borderWidth: 1, borderColor: COLORS.glassBorder },
    emptyText: { color: COLORS.textMuted, textAlign: 'center' },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
    modalBox: { backgroundColor: COLORS.bgBody, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 30, borderTopWidth: 1, borderTopColor: COLORS.glassBorder },
    modalHeader: { marginBottom: 25 },
    modalTitle: { fontSize: 24, fontWeight: 'bold', color: COLORS.textMain },
    modalSubtitle: { color: COLORS.primary, fontSize: 14, marginTop: 4 },
    starRow: { flexDirection: 'row', gap: 12, justifyContent: 'center', marginBottom: 10 },
    starIcon: { fontSize: 45, color: COLORS.glassBorder },
    starFilled: { color: COLORS.primary },
    starLabel: { color: COLORS.primary, marginBottom: 25, textAlign: 'center', fontWeight: 'bold', letterSpacing: 2, fontSize: 12 },
    modalBtns: { flexDirection: 'row', gap: 15, marginTop: 25 },
    cancelBtn: { flex: 1, paddingVertical: 18, borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.glassBorder, alignItems: 'center' },
    cancelText: { color: COLORS.textMuted, fontWeight: 'bold' },
    submitBtn: { flex: 2, paddingVertical: 18, borderRadius: RADIUS.md, backgroundColor: COLORS.primary, alignItems: 'center' },
    submitText: { color: COLORS.secondary, fontWeight: '900', letterSpacing: 1 }
});

