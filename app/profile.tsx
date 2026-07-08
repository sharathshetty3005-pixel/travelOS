import React from 'react';
import { StyleSheet, View, ScrollView, Pressable, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import Svg, { Rect } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';

import { useAppTheme } from '@/theme';
import { CustomText } from '@/components/typography/CustomText';
import { GlassCard } from '@/components/layout/GlassCard';
import { Avatar } from '@/components/layout/Avatar';

// Store integrations
import { useThemeStore, ThemeMode } from '@/store/themeStore';
import { useAuthStore } from '@/store/authStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface StatItemProps {
  val: string;
  label: string;
}

export default function ProfileScreen() {
  const { colors, spacing, radii, isDark } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { themeMode, setThemeMode } = useThemeStore();
  const { user, logout } = useAuthStore();

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.back();
  };

  const handleThemeChange = (mode: ThemeMode) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setThemeMode(mode);
  };

  const handleLogout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    logout();
    router.replace('/auth');
  };

  const handleRowPress = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.push(route as any);
  };

  const userName = user?.name || 'Julian Laurent';
  const userEmail = user?.email || 'julian.laurent@nomad.com';

  return (
    <View style={[styles.root, { backgroundColor: colors.backgroundPrimary, paddingTop: insets.top }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Profile Page Header */}
      <View style={[styles.header, { borderBottomColor: colors.border, borderBottomWidth: 0.5, paddingHorizontal: spacing.xlarge }]}>
        <Pressable onPress={handleBack} style={styles.headerBack}>
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </Pressable>
        <CustomText variant="title" weight="600" color={colors.textPrimary}>
          Travel Passport
        </CustomText>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: spacing.xlarge, paddingBottom: insets.bottom + 48 }]}
      >
        {/* 1. Cinematic Digital Passport Card */}
        <GlassCard style={[styles.passportCard, { borderColor: colors.accentGold }]}>
          <View style={styles.passportHeader}>
            <View style={styles.passportIssuer}>
              <Ionicons name="globe-outline" size={14} color={colors.accentGold} />
              <CustomText variant="caption" weight="700" color={colors.accentGold} style={styles.issuerText}>
                NOMAD WORLD CITIZEN
              </CustomText>
            </View>
            <View style={[styles.tierBadge, { backgroundColor: 'rgba(212,175,55,0.1)', borderColor: colors.accentGold }]}>
              <CustomText variant="caption" weight="700" color={colors.accentGold} style={{ fontSize: 9 }}>
                PLATINUM
              </CustomText>
            </View>
          </View>

          {/* User Meta Row */}
          <View style={styles.passportBody}>
            <Avatar uri={user?.avatarUrl} size="lg" name={userName} />
            
            <View style={styles.passportDetails}>
              <CustomText variant="caption" color={colors.textSecondary}>
                PASSPORT HOLDER
              </CustomText>
              <CustomText variant="body" weight="700" color={colors.textPrimary}>
                {userName.toUpperCase()}
              </CustomText>
              
              <CustomText variant="caption" color={colors.textSecondary} style={{ marginTop: 6 }}>
                DOCUMENT NUMBER
              </CustomText>
              <CustomText variant="caption" weight="600" color={colors.textPrimary}>
                FR-882319-P
              </CustomText>
            </View>
          </View>

          {/* Barcode representation */}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <View style={styles.passportFooter}>
            <View style={styles.metaCol}>
              <CustomText variant="caption" color={colors.textSecondary}>
                EXPIRES
              </CustomText>
              <CustomText variant="caption" weight="600" color={colors.textPrimary}>
                JULY 2034
              </CustomText>
            </View>

            <View style={styles.barcodeWrapper}>
              <Svg width="120" height="24">
                {Array.from({ length: 18 }).map((_, idx) => (
                  <Rect
                    key={`bar-${idx}`}
                    x={idx * 7}
                    y="0"
                    width={idx % 3 === 0 ? '4' : '1.5'}
                    height="24"
                    fill={isDark ? 'rgba(255, 255, 255, 0.45)' : 'rgba(26, 28, 32, 0.35)'}
                  />
                ))}
              </Svg>
            </View>
          </View>
        </GlassCard>

        {/* 2. Travel Statistics Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatItem val="12" label="Countries" />
            <StatItem val="34" label="Cities" />
          </View>
          <View style={[styles.statsRow, { marginTop: spacing.small }]}>
            <StatItem val="18" label="Total Trips" />
            <StatItem val="42.5k" label="Km Traveled" />
          </View>
        </View>

        {/* 3. Settings Groups */}
        <CustomText variant="caption" weight="700" color={colors.accentGold} style={styles.sectionLabel}>
          TRAVEL DOCUMENTS & GENERAL
        </CustomText>

        <GlassCard style={styles.menuCard}>
          <MenuRow label="My Travel Ledger" icon="cash-outline" onPress={() => handleRowPress('/expenses')} />
          <MenuRow label="Saved Destinations" icon="bookmark-outline" onPress={() => handleRowPress('/(tabs)/explore')} />
          <MenuRow label="Travel Documents" icon="document-text-outline" onPress={() => handleRowPress('/documents')} />
          <MenuRow label="Notifications" icon="notifications-outline" onPress={() => handleRowPress('/notifications')} />
        </GlassCard>

        {/* 4. Independent Theme selector */}
        <CustomText variant="caption" weight="700" color={colors.accentGold} style={styles.sectionLabel}>
          VISUAL PREFERENCES
        </CustomText>

        <GlassCard style={styles.themeSelectorCard}>
          <CustomText variant="label" weight="600" color={colors.textPrimary}>
            Theme Settings
          </CustomText>
          <View style={[styles.themeBtnGroup, { marginTop: spacing.small }]}>
            {(['light', 'dark', 'system'] as const).map((mode) => {
              const isActive = themeMode === mode;
              return (
                <Pressable
                  key={mode}
                  onPress={() => handleThemeChange(mode)}
                  style={[
                    styles.themeBtn,
                    {
                      borderColor: isActive ? colors.accentGold : colors.border,
                      backgroundColor: isActive ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.02)',
                      borderRadius: radii.s,
                    },
                  ]}
                >
                  <CustomText
                    variant="caption"
                    weight="700"
                    color={isActive ? colors.accentGold : colors.textSecondary}
                    style={{ textTransform: 'uppercase' }}
                  >
                    {mode}
                  </CustomText>
                </Pressable>
              );
            })}
          </View>
        </GlassCard>

        {/* 5. Logout */}
        <Pressable
          onPress={handleLogout}
          style={[styles.logoutBtn, { borderColor: colors.error, borderRadius: radii.m }]}
        >
          <Ionicons name="log-out-outline" size={16} color={colors.error} />
          <CustomText variant="caption" weight="700" color={colors.error} style={{ marginLeft: 6 }}>
            LOGOUT PASSPORT
          </CustomText>
        </Pressable>
      </ScrollView>
    </View>
  );
}

// Stats item
function StatItem({ val, label }: StatItemProps) {
  const { colors } = useAppTheme();
  return (
    <GlassCard style={styles.statBox}>
      <CustomText variant="heading" weight="700" color={colors.textPrimary}>
        {val}
      </CustomText>
      <CustomText variant="caption" color={colors.textSecondary}>
        {label}
      </CustomText>
    </GlassCard>
  );
}

// Menu row item
function MenuRow({ label, icon, onPress }: { label: string; icon: any; onPress: () => void }) {
  const { colors } = useAppTheme();
  return (
    <Pressable onPress={onPress} style={[styles.menuRow, { borderBottomColor: colors.border }]}>
      <View style={styles.menuRowLeft}>
        <Ionicons name={icon} size={16} color={colors.accentGold} />
        <CustomText variant="label" color={colors.textPrimary} style={{ marginLeft: 12 }}>
          {label}
        </CustomText>
      </View>
      <Ionicons name="chevron-forward" size={14} color={colors.textSecondary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBack: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingVertical: 16,
  },
  passportCard: {
    padding: 20,
    borderWidth: 1.5,
  },
  passportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passportIssuer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  issuerText: {
    marginLeft: 6,
    letterSpacing: 1,
  },
  tierBadge: {
    borderWidth: 0.5,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  passportBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  passportDetails: {
    marginLeft: 20,
    flex: 1,
  },
  divider: {
    height: 0.5,
    marginVertical: 16,
  },
  passportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaCol: {
    justifyContent: 'center',
  },
  barcodeWrapper: {
    opacity: 0.8,
  },
  statsGrid: {
    marginTop: 20,
    width: '100%',
  },
  statsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  statBox: {
    flex: 1,
    padding: 14,
    alignItems: 'center',
  },
  sectionLabel: {
    marginTop: 24,
    marginBottom: 8,
    letterSpacing: 1.5,
  },
  menuCard: {
    paddingHorizontal: 16,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 0.5,
  },
  menuRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeSelectorCard: {
    padding: 16,
  },
  themeBtnGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  themeBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
  },
  logoutBtn: {
    marginTop: 32,
    borderWidth: 1.5,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.05)',
  },
});
