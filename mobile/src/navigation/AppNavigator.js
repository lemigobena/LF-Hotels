import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';

// Public Screens
import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';

// Core Screens
import HomeScreen from '../screens/HomeScreen';
import HotelDetailsScreen from '../screens/HotelDetailsScreen';

// User Screens
import BookingsScreen from '../screens/BookingsScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Hotel Admin Screens
import HotelAdminDashboardScreen from '../screens/HotelAdminDashboardScreen';
import HotelAdminProfileScreen from '../screens/HotelAdminProfileScreen';

// Super Admin Screens
import SuperAdminDashboardScreen from '../screens/SuperAdminDashboardScreen';

import { COLORS } from '../constants/theme';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
    const { user, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return null;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    header: () => <Navbar />,
                    contentStyle: { backgroundColor: COLORS.bgBody }
                }}
            >
                {/* 
                  App Routing Architecture:
                  If logged in, land on the appropriate home screen based on role.
                  If not logged in, land on the public Landing Screen.
                  
                  By using a single stack and a custom Navbar, we replicate the web's 
                  behavior where the Navbar persists at the top and the body changes.
                 */}

                {!user ? (
                    // --- Unauthenticated Stack ---
                    <>
                        <Stack.Screen name="Landing" component={LandingScreen} />
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Signup" component={SignupScreen} />
                        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
                        {/* Users can browse hotels without logging in */}
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="HotelDetails" component={HotelDetailsScreen} />
                    </>
                ) : (
                    // --- Authenticated Stack ---
                    <>
                        {user.role === 'SUPER_ADMIN' ? (
                            <Stack.Screen name="SuperAdminDashboard" component={SuperAdminDashboardScreen} />
                        ) : user.role === 'HOTEL_ADMIN' ? (
                            <>
                                <Stack.Screen name="HotelAdminDashboard" component={HotelAdminDashboardScreen} />
                                <Stack.Screen name="HotelAdminProfile" component={HotelAdminProfileScreen} />
                            </>
                        ) : (
                            // Default USER routing
                            <Stack.Screen name="Home" component={HomeScreen} />
                        )}

                        {/* Screens accessible by everyone authenticated (if needed) or specific roles below */}
                        {user.role !== 'HOTEL_ADMIN' && user.role !== 'SUPER_ADMIN' && (
                            <>
                                <Stack.Screen name="HotelDetails" component={HotelDetailsScreen} />
                                <Stack.Screen name="Bookings" component={BookingsScreen} />
                                <Stack.Screen name="Profile" component={ProfileScreen} />
                            </>
                        )}

                        {/* If a Super Admin or Hotel Admin wants to edit their profile */}
                        {(user.role === 'SUPER_ADMIN' || user.role === 'HOTEL_ADMIN') && (
                            <Stack.Screen name="Profile" component={ProfileScreen} />
                        )}
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
