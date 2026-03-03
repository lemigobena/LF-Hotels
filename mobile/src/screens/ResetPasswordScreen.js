import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, StatusBar, Platform } from 'react-native';
import api from '../services/api';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react-native';

export default function ResetPasswordScreen({ navigation, route }) {
    const { token } = route.params || {};
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReset = async () => {
        if (!token) {
            Alert.alert('LINK EXPIRED', 'Security token is invalid or has timed out.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('VALIDATION ERROR', 'Credentials do not match.');
            return;
        }
        if (password.length < 6) {
            Alert.alert('STRENGTH ERROR', 'Access protocol requires at least 6 characters.');
            return;
        }
        setLoading(true);
        try {
            await api.put(`/auth/reset-password/${token}`, { password });
            Alert.alert('HANDSHAKE SUCCESS', 'New credentials prioritized and active. Please authenticate.', [
                { text: 'CONTINUE TO LOGIN', onPress: () => navigation.navigate('Login') }
            ]);
        } catch (err) {
            Alert.alert('SYSTEM ERROR', err.response?.data?.message || 'Handshake rejected by primary node.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <ShieldCheck size={40} color={COLORS.primary} style={{ marginBottom: 20 }} />
                <Text style={styles.title}>Secure Reset</Text>
                <Text style={styles.subtitle}>Provision new access credentials for your secure account.</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>NEW PASSWORD</Text>
                    <View style={styles.inputWrapper}>
                        <Lock color={COLORS.primary} size={18} />
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor={COLORS.textMuted}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>CONFIRM NEW PASSWORD</Text>
                    <View style={styles.inputWrapper}>
                        <CheckCircle2 color={COLORS.primary} size={18} />
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor={COLORS.textMuted}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleReset} disabled={loading}>
                    {loading ? <ActivityIndicator color={COLORS.secondary} /> : <Text style={styles.buttonText}>ESTABLISH CREDENTIALS</Text>}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bgBody, padding: 25, justifyContent: 'center' },
    header: { alignItems: 'center', marginBottom: 40 },
    title: { fontSize: 28, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 10, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
    subtitle: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', lineHeight: 22 },
    form: { width: '100%' },
    inputGroup: { marginBottom: 25 },
    label: { color: COLORS.primary, fontSize: 10, fontWeight: 'bold', marginBottom: 12, letterSpacing: 1.5 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: COLORS.glassBorder, paddingBottom: 10 },
    input: { flex: 1, color: COLORS.textMain, fontSize: 16 },
    button: { backgroundColor: COLORS.primary, paddingVertical: 18, borderRadius: RADIUS.md, alignItems: 'center', marginTop: 10, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
    buttonText: { color: COLORS.secondary, fontWeight: '900', fontSize: 12, letterSpacing: 2 }
});
