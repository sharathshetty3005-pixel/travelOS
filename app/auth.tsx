import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  FadeInRight,
  FadeOutLeft,
  Layout,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useAppTheme } from '@/theme';
import { useAuthStore } from '@/store/authStore';
import { CustomText } from '@/components/typography/CustomText';
import { Button } from '@/components/input/Button';
import { TextField } from '@/components/input/TextField';
import { GlassCard } from '@/components/layout/GlassCard';
import { IMAGES } from '@/constants/imageRegistry';
import { userRepository } from '@/repositories/UserRepository';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

type AuthStep =
  | 'welcome'
  | 'sign-in'
  | 'create-account'
  | 'forgot-password'
  | 'verify'
  | 'success';

export default function AuthScreen() {
  const router = useRouter();
  const { colors, spacing, radii, animation } = useAppTheme();
  const login = useAuthStore((state) => state.login);

  // Authentication Flow Steps
  const [step, setStep] = useState<AuthStep>('welcome');

  // Input Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetCode, setResetCode] = useState('');

  // UI Processing States
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Password strength score: 0 (empty), 1 (weak), 2 (medium), 3 (strong)
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Background Parallax Zoom shared value
  const bgScale = useSharedValue(1.1);

  useEffect(() => {
    // Cinematic slow scale background
    bgScale.value = withTiming(1.0, {
      duration: 10000,
      easing: animation.easing.smooth,
    });
  }, []);

  // Update password strength indicator based on complexity
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    if (password.length < 6) {
      setPasswordStrength(1);
    } else if (password.length < 9) {
      setPasswordStrength(2);
    } else {
      setPasswordStrength(3);
    }
  }, [password]);

  const animatedBgStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: bgScale.value }],
    };
  });

  // Reset error notifications on screen switches
  const navigateToStep = (nextStep: AuthStep) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setFormError(null);
    setLoading(false);
    setStep(nextStep);
  };

  // Validation Form Checks
  const isEmailValid = (text: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text.trim());
  const isPasswordValid = (text: string) => text.length >= 6;

  // Sign In submit handler
  const handleSignIn = async () => {
    if (!isEmailValid(email)) {
      setFormError('Please enter a valid email address.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      return;
    }
    if (!isPasswordValid(password)) {
      setFormError('Password must contain at least 6 characters.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      return;
    }

    setFormError(null);
    setLoading(true);

    try {
      const response = await userRepository.authenticateUser(email, password);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      
      // Store session and transition
      login(response.user, response.accessToken);
      navigateToStep('success');
    } catch (err: any) {
      setFormError(err.message || 'Verification failed. Please check entries.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    } finally {
      setLoading(false);
    }
  };

  // Register submit handler
  const handleRegister = async () => {
    if (!name.trim()) {
      setFormError('Name is required.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      return;
    }
    if (!isEmailValid(email)) {
      setFormError('Please enter a valid email address.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      return;
    }
    if (!isPasswordValid(password)) {
      setFormError('Password must contain at least 6 characters.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      return;
    }

    setFormError(null);
    setLoading(true);

    try {
      const response = await userRepository.authenticateUser(email, password);
      // Update name inside user entity
      response.user.name = name.trim();
      login(response.user, response.accessToken);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      navigateToStep('success');
    } catch (err: any) {
      setFormError(err.message || 'Registration failed. Try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
    } finally {
      setLoading(false);
    }
  };

  // Password reset submit handler
  const handleForgotPassword = async () => {
    if (!isEmailValid(email)) {
      setFormError('A valid email address is required.');
      return;
    }

    setFormError(null);
    setLoading(true);

    try {
      await userRepository.requestPasswordReset(email);
      navigateToStep('verify');
    } catch (err: any) {
      setFormError(err.message || 'Password reset request failed.');
    } finally {
      setLoading(false);
    }
  };

  // Verification submit handler
  const handleVerifyCode = async () => {
    if (!resetCode) {
      setFormError('Please enter the 6-digit code.');
      return;
    }

    setFormError(null);
    setLoading(true);

    try {
      await userRepository.verifyResetOTP(resetCode);
      navigateToStep('success');
    } catch (err: any) {
      setFormError(err.message || 'Invalid code.');
    } finally {
      setLoading(false);
    }
  };

  // Skip Login / Guest Access Mode
  const handleGuestAccess = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    router.replace('/(tabs)');
  };

  // Resolve password strength colors
  const getStrengthMeta = () => {
    switch (passwordStrength) {
      case 3:
        return { label: 'Strong', color: colors.success, flex: 1.0 };
      case 2:
        return { label: 'Medium', color: colors.accentGold, flex: 0.66 };
      case 1:
        return { label: 'Weak', color: colors.error, flex: 0.33 };
      case 0:
      default:
        return { label: '', color: colors.border, flex: 0 };
    }
  };

  const strengthMeta = getStrengthMeta();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.root}
    >
      <StatusBar style="light" />

      {/* Parallax Background */}
      <Animated.View style={[StyleSheet.absoluteFillObject, animatedBgStyle]}>
        <Image
          source={IMAGES.backgrounds.auth}
          style={styles.bgImage}
          contentFit="cover"
          priority="high"
        />
        <View style={styles.gradientOverlay} />
      </Animated.View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardWrapper}>
          {/* Main shifting glass card layout container */}
          <GlassCard style={styles.card}>
            {step === 'welcome' && (
              <Animated.View
                entering={FadeInRight.duration(300)}
                exiting={FadeOutLeft.duration(250)}
                style={styles.slideContainer}
              >
                <CustomText variant="heading" weight="700" color="#FFFFFF" style={styles.cardTitle}>
                  Welcome to TravelOS
                </CustomText>
                <CustomText variant="body" color="rgba(255, 255, 255, 0.70)" style={styles.cardSubtitle}>
                  Register or login with email to synchronize flights, track expenses, and access your offline travel maps.
                </CustomText>

                {/* Primary form redirects CTAs */}
                <Button
                  label="Sign In with Email"
                  onPress={() => navigateToStep('sign-in')}
                  style={styles.submitBtn}
                />
                
                <Button
                  label="Create Premium Account"
                  variant="outline"
                  onPress={() => navigateToStep('create-account')}
                  style={styles.submitBtn}
                />

                {/* Social logins architecture placeholders */}
                <View style={styles.dividerRow}>
                  <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                  <CustomText variant="caption" color="rgba(255, 255, 255, 0.4)" style={styles.dividerText}>
                    OR
                  </CustomText>
                  <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                </View>

                {/* Apple & Google logins */}
                <View style={styles.socialRow}>
                  <Pressable
                    disabled
                    style={[styles.socialIconBtn, { borderColor: colors.border }]}
                    accessibilityLabel="Login with Apple"
                  >
                    <Ionicons name="logo-apple" size={20} color="#FFFFFF" />
                  </Pressable>
                  <Pressable
                    disabled
                    style={[styles.socialIconBtn, { borderColor: colors.border }]}
                    accessibilityLabel="Login with Google"
                  >
                    <Ionicons name="logo-google" size={18} color="#FFFFFF" />
                  </Pressable>
                  <Pressable
                    disabled
                    style={[styles.socialIconBtn, { borderColor: colors.border }]}
                    accessibilityLabel="Login with Passkey"
                  >
                    <Ionicons name="key-outline" size={20} color="#FFFFFF" />
                  </Pressable>
                </View>

                <Button
                  label="Continue as Guest"
                  variant="ghost"
                  onPress={handleGuestAccess}
                  accessibilityHint="Access the application in read-only guest mode"
                  style={styles.guestBtn}
                />
              </Animated.View>
            )}

            {step === 'sign-in' && (
              <Animated.View
                entering={FadeInRight.duration(300)}
                exiting={FadeOutLeft.duration(250)}
                style={styles.slideContainer}
              >
                <View style={styles.headerRow}>
                  <Pressable onPress={() => navigateToStep('welcome')} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                  </Pressable>
                  <CustomText variant="title" weight="600" color="#FFFFFF">
                    Sign In
                  </CustomText>
                  <View style={styles.backBtnPlaceholder} />
                </View>

                {formError && (
                  <View style={[styles.errorBox, { backgroundColor: 'rgba(255, 59, 48, 0.15)', borderColor: colors.error }]}>
                    <CustomText variant="caption" color={colors.error}>
                      {formError}
                    </CustomText>
                  </View>
                )}

                <TextField
                  label="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  prefixIcon="mail-outline"
                  disabled={loading}
                />

                <TextField
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                  secureTextEntry
                  prefixIcon="lock-closed-outline"
                  disabled={loading}
                />

                <Pressable onPress={() => navigateToStep('forgot-password')} style={styles.forgotBtn}>
                  <CustomText variant="caption" color={colors.accentGold}>
                    Forgot Password?
                  </CustomText>
                </Pressable>

                <Button
                  label="Access Dashboard"
                  loading={loading}
                  onPress={handleSignIn}
                  style={styles.submitBtn}
                />
              </Animated.View>
            )}

            {step === 'create-account' && (
              <Animated.View
                entering={FadeInRight.duration(300)}
                exiting={FadeOutLeft.duration(250)}
                style={styles.slideContainer}
              >
                <View style={styles.headerRow}>
                  <Pressable onPress={() => navigateToStep('welcome')} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                  </Pressable>
                  <CustomText variant="title" weight="600" color="#FFFFFF">
                    Create Account
                  </CustomText>
                  <View style={styles.backBtnPlaceholder} />
                </View>

                {formError && (
                  <View style={[styles.errorBox, { backgroundColor: 'rgba(255, 59, 48, 0.15)', borderColor: colors.error }]}>
                    <CustomText variant="caption" color={colors.error}>
                      {formError}
                    </CustomText>
                  </View>
                )}

                <TextField
                  label="Full Name"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  prefixIcon="person-outline"
                  disabled={loading}
                />

                <TextField
                  label="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  prefixIcon="mail-outline"
                  disabled={loading}
                />

                <TextField
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                  secureTextEntry
                  prefixIcon="lock-closed-outline"
                  disabled={loading}
                />

                {/* Password strength shimmers visual indicator */}
                {passwordStrength > 0 && (
                  <View style={styles.strengthWrapper}>
                    <View style={styles.strengthBarBg}>
                      <Animated.View
                        style={[
                          styles.strengthBarFill,
                          {
                            width: `${strengthMeta.flex * 100}%`,
                            backgroundColor: strengthMeta.color,
                          },
                        ]}
                      />
                    </View>
                    <CustomText variant="caption" color={strengthMeta.color} style={styles.strengthText}>
                      Password Strength: {strengthMeta.label}
                    </CustomText>
                  </View>
                )}

                <Button
                  label="Create Luxury Account"
                  loading={loading}
                  onPress={handleRegister}
                  style={styles.submitBtn}
                />
              </Animated.View>
            )}

            {step === 'forgot-password' && (
              <Animated.View
                entering={FadeInRight.duration(300)}
                exiting={FadeOutLeft.duration(250)}
                style={styles.slideContainer}
              >
                <View style={styles.headerRow}>
                  <Pressable onPress={() => navigateToStep('sign-in')} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                  </Pressable>
                  <CustomText variant="title" weight="600" color="#FFFFFF">
                    Reset Password
                  </CustomText>
                  <View style={styles.backBtnPlaceholder} />
                </View>

                {formError && (
                  <View style={[styles.errorBox, { backgroundColor: 'rgba(255, 59, 48, 0.15)', borderColor: colors.error }]}>
                    <CustomText variant="caption" color={colors.error}>
                      {formError}
                    </CustomText>
                  </View>
                )}

                <CustomText variant="body" color="rgba(255, 255, 255, 0.70)" style={styles.resetIntroText}>
                  Enter the email associated with your account and we will send a 6-digit recovery OTP code.
                </CustomText>

                <TextField
                  label="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  prefixIcon="mail-outline"
                  disabled={loading}
                />

                <Button
                  label="Send Recovery Code"
                  loading={loading}
                  onPress={handleForgotPassword}
                  style={styles.submitBtn}
                />
              </Animated.View>
            )}

            {step === 'verify' && (
              <Animated.View
                entering={FadeInRight.duration(300)}
                exiting={FadeOutLeft.duration(250)}
                style={styles.slideContainer}
              >
                <View style={styles.headerRow}>
                  <Pressable onPress={() => navigateToStep('forgot-password')} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
                  </Pressable>
                  <CustomText variant="title" weight="600" color="#FFFFFF">
                    Verify Code
                  </CustomText>
                  <View style={styles.backBtnPlaceholder} />
                </View>

                {formError && (
                  <View style={[styles.errorBox, { backgroundColor: 'rgba(255, 59, 48, 0.15)', borderColor: colors.error }]}>
                    <CustomText variant="caption" color={colors.error}>
                      {formError}
                    </CustomText>
                  </View>
                )}

                <CustomText variant="body" color="rgba(255, 255, 255, 0.70)" style={styles.resetIntroText}>
                  We have sent a verification code to {email}. Use test code: <CustomText variant="body" weight="700" color={colors.accentGold}>123456</CustomText>
                </CustomText>

                <TextField
                  label="6-Digit Code"
                  value={resetCode}
                  onChangeText={setResetCode}
                  keyboardType="number-pad"
                  maxLength={6}
                  prefixIcon="key-outline"
                  disabled={loading}
                />

                <Button
                  label="Verify OTP Code"
                  loading={loading}
                  onPress={handleVerifyCode}
                  style={styles.submitBtn}
                />
              </Animated.View>
            )}

            {step === 'success' && (
              <Animated.View
                entering={FadeInRight.duration(300)}
                style={styles.successContainer}
              >
                <View style={[styles.successIconWrapper, { borderColor: colors.accentGold }]}>
                  <Ionicons name="checkmark" size={40} color={colors.accentGold} />
                </View>
                
                <CustomText variant="heading" weight="700" color="#FFFFFF" style={styles.successTitle}>
                  Access Granted
                </CustomText>
                
                <CustomText variant="body" color="rgba(255, 255, 255, 0.70)" style={styles.successSubtitle}>
                  Preparing your customized travel operating console...
                </CustomText>

                {/* Trigger final navigation after success mount */}
                <SuccessRedirectTrigger onTrigger={() => router.replace('/(tabs)')} />
              </Animated.View>
            )}
          </GlassCard>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Small helper to execute redirect after a 1.2s mount on success view
function SuccessRedirectTrigger({ onTrigger }: { onTrigger: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onTrigger();
    }, 1200);
    return () => clearTimeout(timer);
  }, []);
  return null;
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0A0A0C',
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 10, 12, 0.45)',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  cardWrapper: {
    width: SCREEN_WIDTH - 32,
    maxWidth: 420,
    alignSelf: 'center',
  },
  card: {
    padding: 24,
  },
  slideContainer: {
    width: '100%',
  },
  cardTitle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  cardSubtitle: {
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  submitBtn: {
    width: '100%',
    marginTop: 8,
  },
  guestBtn: {
    width: '100%',
    marginTop: 12,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 12,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 8,
  },
  socialIconBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backBtn: {
    padding: 4,
  },
  backBtnPlaceholder: {
    width: 32,
  },
  errorBox: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    width: '100%',
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: -4,
  },
  resetIntroText: {
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  strengthWrapper: {
    width: '100%',
    marginBottom: 16,
    marginTop: -4,
  },
  strengthBarBg: {
    height: 4,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    marginTop: 6,
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    width: '100%',
  },
  successIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    textAlign: 'center',
    lineHeight: 20,
  },
});
