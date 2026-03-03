import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, Platform } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

export default function LandingScreen({ navigation }) {
    return (
        <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1542314831-c6a4d27ce669?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80' }}
            style={styles.background}
        >
            <View style={styles.overlay}>
                <View style={styles.content}>
                    <Text style={styles.brand}>LF COLLECTION</Text>
                    <Text style={styles.title}>Luxury Stays &{"\n"}Fine Dining</Text>
                    <Text style={styles.subtitle}>
                        Experience world-class hospitality across our exclusive collection of hotels.
                    </Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.exploreBtn} onPress={() => navigation.navigate('Home')}>
                            <Text style={styles.exploreText}>EXPLORE HOTELS</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.loginText}>ADMIN/USER LOGIN</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: { flex: 1, resizeMode: 'cover', justifyContent: 'center' },
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 },
    content: { alignItems: 'center' },
    brand: { color: COLORS.primary, fontWeight: '900', letterSpacing: 3, fontSize: 14, marginBottom: 10 },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: COLORS.textMain,
        textAlign: 'center',
        marginBottom: 20,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
        lineHeight: 48
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textMuted,
        textAlign: 'center',
        marginBottom: 40,
        paddingHorizontal: 20,
        lineHeight: 24
    },
    buttonContainer: { width: '100%', gap: 15, alignItems: 'center' },
    exploreBtn: {
        backgroundColor: COLORS.primary,
        width: '80%',
        paddingVertical: 18,
        borderRadius: RADIUS.md,
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5
    },
    exploreText: { color: COLORS.secondary, fontWeight: 'bold', fontSize: 14, letterSpacing: 1 },
    loginBtn: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.primary,
        width: '80%',
        paddingVertical: 18,
        borderRadius: RADIUS.md,
        alignItems: 'center'
    },
    loginText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 14, letterSpacing: 1 }
});

