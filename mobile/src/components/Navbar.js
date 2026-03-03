import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { ArrowLeft, User, LogOut, Settings, LayoutDashboard, ChevronDown } from 'lucide-react-native';
import { COLORS } from '../constants/theme';

export default function Navbar() {
    const navigation = useNavigation();
    const route = useRoute();
    const { user, logout } = useContext(AuthContext);
    const [menuVisible, setMenuVisible] = useState(false);

    // Hide back button on the main "root" screens
    const isRootScreen = ['Landing', 'SuperAdminDashboard', 'HotelAdminDashboard', 'Home'].includes(route.name);

    const handleLogout = () => {
        setMenuVisible(false);
        logout();
    };

    const handleMenuNavigation = (screenName) => {
        setMenuVisible(false);
        navigation.navigate(screenName);
    };

    return (
        <View style={styles.container}>
            {/* Left side: Back Button & Logo */}
            <View style={styles.leftSection}>
                {!isRootScreen && navigation.canGoBack() && (
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                        <ArrowLeft color={COLORS.primary} size={24} />
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => user ? navigation.navigate('Home') : navigation.navigate('Landing')}>
                    <Text style={styles.logo}>LF Collection</Text>
                </TouchableOpacity>
            </View>

            {/* Right side: User Menu or Auth Links */}
            <View style={styles.rightSection}>
                {user ? (
                    <>
                        <TouchableOpacity
                            style={styles.profileBtn}
                            onPress={() => setMenuVisible(true)}
                        >
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>
                                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                </Text>
                            </View>
                            <ChevronDown color={COLORS.primary} size={16} />
                        </TouchableOpacity>

                        {/* Dropdown Menu Modal */}
                        <Modal transparent visible={menuVisible} animationType="fade">
                            <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
                                <View style={styles.modalOverlay}>
                                    <View style={styles.dropdown}>
                                        <View style={styles.dropdownHeader}>
                                            <Text style={styles.userName}>{user.name}</Text>
                                            <Text style={styles.userRole}>{user.role?.replace('_', ' ')}</Text>
                                        </View>
                                        <View style={styles.divider} />

                                        {user.role === 'SUPER_ADMIN' && (
                                            <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuNavigation('SuperAdminDashboard')}>
                                                <LayoutDashboard color={COLORS.primary} size={20} />
                                                <Text style={styles.menuText}>Super Dashboard</Text>
                                            </TouchableOpacity>
                                        )}

                                        {user.role === 'HOTEL_ADMIN' ? (
                                            <>
                                                <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuNavigation('HotelAdminDashboard')}>
                                                    <LayoutDashboard color={COLORS.primary} size={20} />
                                                    <Text style={styles.menuText}>Hotel Dashboard</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuNavigation('HotelAdminProfile')}>
                                                    <Settings color={COLORS.primary} size={20} />
                                                    <Text style={styles.menuText}>Hotel Settings</Text>
                                                </TouchableOpacity>
                                            </>
                                        ) : (
                                            <>
                                                <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuNavigation('Profile')}>
                                                    <User color={COLORS.primary} size={20} />
                                                    <Text style={styles.menuText}>My Profile</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={styles.menuItem} onPress={() => handleMenuNavigation('Bookings')}>
                                                    <Settings color={COLORS.primary} size={20} />
                                                    <Text style={styles.menuText}>My Activity</Text>
                                                </TouchableOpacity>
                                            </>
                                        )}

                                        <View style={styles.divider} />

                                        <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handleLogout}>
                                            <LogOut color={COLORS.error} size={20} />
                                            <Text style={[styles.menuText, { color: COLORS.error }]}>Logout</Text>
                                        </TouchableOpacity>

                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </Modal>
                    </>
                ) : (
                    <View style={{ flexDirection: 'row', gap: 10 }}>
                        {route.name !== 'Login' && (
                            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginBtn}>
                                <Text style={styles.loginText}>Login</Text>
                            </TouchableOpacity>
                        )}
                        {route.name !== 'Signup' && (
                            <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={styles.signupBtn}>
                                <Text style={styles.signupText}>Sign Up</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'ios' ? 50 : 30,
        paddingBottom: 15,
        paddingHorizontal: 15,
        backgroundColor: COLORS.secondary,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.glassBorder
    },
    leftSection: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    iconBtn: { padding: 5 },
    logo: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif', letterSpacing: 1 },
    rightSection: { flexDirection: 'row', alignItems: 'center' },
    profileBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: COLORS.bgCard, padding: 4, borderRadius: 20, paddingRight: 8 },
    avatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
    avatarText: { color: COLORS.secondary, fontWeight: 'bold', fontSize: 14 },
    loginBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1, borderColor: COLORS.primary },
    loginText: { color: COLORS.primary, fontWeight: 'bold', fontSize: 13 },
    signupBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
    signupText: { color: COLORS.secondary, fontWeight: 'bold', fontSize: 13 },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
    dropdown: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 100 : 80,
        right: 15,
        backgroundColor: COLORS.bgCard,
        borderRadius: 12,
        width: 220,
        borderWidth: 1,
        borderColor: COLORS.glassBorder,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 10,
        overflow: 'hidden'
    },
    dropdownHeader: { padding: 15, backgroundColor: COLORS.secondary },
    userName: { color: COLORS.textMain, fontWeight: 'bold', fontSize: 16 },
    userRole: { color: COLORS.primary, fontSize: 12, marginTop: 2 },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
    },
    menuText: { marginLeft: 12, fontSize: 14, color: COLORS.textMain, fontWeight: '500' },
    divider: { height: 1, backgroundColor: COLORS.glassBorder }
});

