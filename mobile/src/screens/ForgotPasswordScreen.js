import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, StatusBar, Platform } from 'react-native';
import api from '../services/api';
import { COLORS, RADIUS, SPACING } from '../constants/theme';
import { ShieldAlert, Mail, ArrowLeft } from 'lucide-react-native';

export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email) {
            Alert.alert('Protocol Required', 'A destination email must be provided.');
            return;
        }
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            Alert.alert('SIGNAL TRANSMITTED', 'If a valid account exists, recovery instructions have been dispatched.', [
                { text: 'CONTINUE', onPress: () => navigation.navigate('Login') }
            ]);
        } catch (err) {
            Alert.alert('HANDSHAKE FAILED', err.response?.data?.message || 'Transmission error over secure channel.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <View style={styles.header}>
                <ShieldAlert size={40} color={COLORS.primary} style={{ marginBottom: 20 }} />
                <Text style={styles.title}>Account Recovery</Text>
                <Text style={styles.subtitle}>Execute protocol to reset your administrative or personal credentials.</Text>
            </View>

            <View style={styles.form}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>EMAIL ADDRESS</Text>
                    <View style={styles.inputWrapper}>
                        <Mail color={COLORS.primary} size={18} />
                        <TextInput
                            style={styles.input}
                            placeholder="registry@example.com"
                            placeholderTextColor={COLORS.textMuted}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
                    {loading ? <ActivityIndicator color={COLORS.secondary} /> : <Text style={styles.buttonText}>REQUEST RESET LINK</Text>}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.backBtn}>
                    <ArrowLeft color={COLORS.textMuted} size={16} />
                    <Text style={styles.backText}>ABORT & RETURN</Text>
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
    inputGroup: { marginBottom: 30 },
    label: { color: COLORS.primary, fontSize: 10, fontWeight: 'bold', marginBottom: 12, letterSpacing: 1.5 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderBottomColor: COLORS.glassBorder, paddingBottom: 10 },
    input: { flex: 1, color: COLORS.textMain, fontSize: 16 },
    button: { backgroundColor: COLORS.primary, paddingVertical: 18, borderRadius: RADIUS.md, alignItems: 'center', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
    buttonText: { color: COLORS.secondary, fontWeight: '900', fontSize: 12, letterSpacing: 2 },
    backBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'center', marginTop: 30 },
    backText: { color: COLORS.textMuted, fontWeight: 'bold', fontSize: 11, letterSpacing: 1 }
});
