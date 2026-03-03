import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { COLORS, SPACING, RADIUS } from '../constants/theme';

export default function SignupScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useContext(AuthContext);

    const handleSignup = async () => {
        if (!name || !email || !password) {
            setError('Please fill in all required fields');
            return;
        }
        setError('');
        setLoading(true);
        try {
            const result = await signup({ name, email, password, phone });
            if (!result.success) {
                setError(result.error);
            }
        } catch (err) {
            setError('Signup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.brand}>LF COLLECTION</Text>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join our exclusive hospitality circle</Text>
                </View>

                {error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                ) : null}

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>FULL NAME *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your full name"
                            placeholderTextColor={COLORS.textMuted}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>EMAIL ADDRESS *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your email"
                            placeholderTextColor={COLORS.textMuted}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>PHONE NUMBER</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Optional"
                            placeholderTextColor={COLORS.textMuted}
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>PASSWORD *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Create a strong password"
                            placeholderTextColor={COLORS.textMuted}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleSignup}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color={COLORS.secondary} />
                        ) : (
                            <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.link}>LOG IN</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.bgBody },
    scrollContent: { flexGrow: 1, padding: 25, paddingBottom: 50 },
    header: { alignItems: 'center', marginBottom: 35, marginTop: 20 },
    brand: { color: COLORS.primary, fontWeight: '900', letterSpacing: 2, fontSize: 12, marginBottom: 8 },
    title: { fontSize: 28, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 10 },
    subtitle: { color: COLORS.textMuted, fontSize: 14 },
    form: { width: '100%' },
    inputGroup: { marginBottom: 18 },
    label: { color: COLORS.primary, fontSize: 10, fontWeight: 'bold', marginBottom: 8, letterSpacing: 1 },
    input: {
        backgroundColor: COLORS.bgCard,
        padding: 15,
        borderRadius: RADIUS.md,
        color: COLORS.textMain,
        borderWidth: 1,
        borderColor: COLORS.glassBorder
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: 18,
        borderRadius: RADIUS.md,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3
    },
    buttonDisabled: { opacity: 0.7 },
    buttonText: { color: COLORS.secondary, fontWeight: 'bold', fontSize: 14, letterSpacing: 1 },
    errorContainer: { backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: 12, borderRadius: RADIUS.sm, marginBottom: 20, borderLeftWidth: 4, borderLeftColor: COLORS.error },
    errorText: { color: COLORS.error, fontSize: 13, fontWeight: '500' },
    footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
    footerText: { color: COLORS.textMuted, fontSize: 14 },
    link: { color: COLORS.primary, fontWeight: 'bold', fontSize: 14 }
});

