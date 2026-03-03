import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, StatusBar, Platform } from 'react-native';
import api from '../services/api';
import { COLORS, RADIUS, SPACING } from '../constants/theme';

export default function HomeScreen({ navigation }) {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHotels();
    }, []);

    const fetchHotels = async () => {
        try {
            setLoading(true);
            const res = await api.get('/hotels');
            setHotels(res.data);
            setError(null);
        } catch (err) {
            setError(err.message || 'Failed to fetch hotels');
        } finally {
            setLoading(false);
        }
    };

    const renderHotelCard = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('HotelDetails', { hotelId: item.id })}
            activeOpacity={0.9}
        >
            <Image
                source={{ uri: item.image || 'https://via.placeholder.com/400' }}
                style={styles.image}
            />
            <View style={styles.cardOverlay} />
            <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                    <Text style={styles.name}>{item.name}</Text>
                    <View style={styles.ratingBadge}>
                        <Text style={styles.ratingText}>⭐ {item.avgRating?.toFixed(1) || 'NEW'}</Text>
                    </View>
                </View>
                <Text style={styles.location}>📍 {item.location}</Text>
                <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryBtn} onPress={fetchHotels}>
                    <Text style={styles.retryText}>RETRY</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <Text style={styles.title}>Exclusive Collections</Text>
                <Text style={styles.subtitle}>Discover our world-class hotels and resorts</Text>
            </View>
            <FlatList
                data={hotels}
                keyExtractor={item => item.id}
                renderItem={renderHotelCard}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bgBody },
    header: { padding: 20, paddingTop: 10 },
    title: { fontSize: 24, fontWeight: 'bold', color: COLORS.textMain, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
    subtitle: { color: COLORS.textMuted, fontSize: 14, marginTop: 4 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bgBody },
    listContainer: { padding: 15, paddingBottom: 30 },
    card: {
        backgroundColor: COLORS.bgCard,
        borderRadius: RADIUS.lg,
        marginBottom: 25,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
        position: 'relative'
    },
    image: { width: '100%', height: 220 },
    cardOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        height: 220
    },
    cardContent: { padding: 20 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
    name: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary, flex: 1 },
    ratingBadge: { backgroundColor: 'rgba(212, 175, 55, 0.1)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, borderWidth: 1, borderColor: 'rgba(212, 175, 55, 0.3)' },
    ratingText: { color: COLORS.primary, fontSize: 12, fontWeight: 'bold' },
    location: { color: COLORS.textMuted, fontSize: 13, marginBottom: 12 },
    description: { color: COLORS.textMain, fontSize: 14, lineHeight: 22, opacity: 0.8 },
    errorText: { color: COLORS.error, fontSize: 16, marginBottom: 15 },
    retryBtn: { paddingHorizontal: 25, paddingVertical: 12, backgroundColor: COLORS.primary, borderRadius: RADIUS.md },
    retryText: { color: COLORS.secondary, fontWeight: 'bold', fontSize: 14, letterSpacing: 1 }
});

