import React, { useState } from 'react';
import { StyleSheet, View, Pressable, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import Animated, { FadeIn, SlideOutLeft, Layout } from 'react-native-reanimated';

import { useAppTheme } from '@/theme';
import { CustomText } from '@/components/typography/CustomText';
import { GlassCard } from '@/components/layout/GlassCard';

// Component Imports
import { BiometricBanner } from '@/features/documents/components/BiometricBanner';
import { VerificationToggles } from '@/features/documents/components/VerificationToggles';
import { AddDocumentForm } from '@/features/documents/components/AddDocumentForm';

// State Imports
import { useTripStore } from '@/store/tripStore';

interface VaultItem {
  id: string;
  title: string;
  docType: string;
  fileSize: string;
  dateUploaded: string;
}

const TYPE_ICONS: Record<string, string> = {
  Passport: 'globe-outline',
  Visa: 'ribbon-outline',
  Flight: 'airplane-outline',
  Hotel: 'bed-outline',
  Insurance: 'shield-checkmark-outline',
  Default: 'document-attach-outline',
};

const INITIAL_DOCS: VaultItem[] = [
  { id: 'doc-init-01', title: 'Julian Passport Scan (Copy)', docType: 'Passport', fileSize: '1.4 MB', dateUploaded: '2026-07-01' },
  { id: 'doc-init-02', title: 'ITA Airways Boarding Pass', docType: 'Flight', fileSize: '450 KB', dateUploaded: '2026-07-06' },
  { id: 'doc-init-03', title: 'Le Sirenuse Booking Receipt', docType: 'Hotel', fileSize: '820 KB', dateUploaded: '2026-07-06' },
];

export default function DocumentsScreen() {
  const { colors, spacing, radii, isDark, shadow } = useAppTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const activeTrip = useTripStore((state) =>
    state.trips.find((t) => t.status === 'active')
  );

  const [docs, setDocs] = useState<VaultItem[]>(INITIAL_DOCS);

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    router.back();
  };

  const handleUpload = (data: { title: string; docType: string }) => {
    const newDoc: VaultItem = {
      id: `doc-gen-${Date.now()}`,
      title: data.title,
      docType: data.docType,
      fileSize: `${(Math.random() * 2 + 0.2).toFixed(1)} MB`,
      dateUploaded: new Date().toISOString().split('T')[0],
    };

    setDocs((prev) => [newDoc, ...prev]);
  };

  const handleDeleteDoc = (id: string) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    setDocs((prev) => prev.filter((d) => d.id !== id));
  };

  const handleViewDoc = (item: VaultItem) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    Alert.alert(
      'Encrypted Decryption',
      `Opening secure preview for: ${item.title} (${item.fileSize}). Credentials validated via Face ID.`
    );
  };

  if (!activeTrip) {
    return (
      <View style={[styles.root, { backgroundColor: colors.backgroundPrimary, paddingTop: insets.top, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }]}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <GlassCard style={styles.errorCard}>
          <Ionicons name="document-text-outline" size={40} color={colors.accentGold} />
          <CustomText variant="body" weight="600" color={colors.textPrimary} style={{ marginTop: 12 }}>
            No Document Vault Active
          </CustomText>
          <CustomText variant="caption" color={colors.textSecondary} style={styles.errorSubtitle}>
            Activate a trip from your Home dashboard or generate an itinerary to begin uploading travel passes.
          </CustomText>
          <Pressable
            onPress={handleBack}
            style={[styles.backButton, { backgroundColor: colors.accentGold, borderRadius: radii.s }]}
          >
            <CustomText variant="caption" weight="700" color="#000000">
              GO BACK
            </CustomText>
          </Pressable>
        </GlassCard>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: colors.backgroundPrimary, paddingTop: insets.top }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      {/* Navigation Header */}
      <View style={[styles.header, { borderBottomColor: colors.border, borderBottomWidth: 0.5, paddingHorizontal: spacing.xlarge }]}>
        <Pressable onPress={handleBack} style={styles.headerBack}>
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </Pressable>
        <CustomText variant="title" weight="600" color={colors.textPrimary}>
          Documents Vault
        </CustomText>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: spacing.xlarge, paddingBottom: insets.bottom + 48 }]}
      >
        {/* Biometric Safe Indicator Badge */}
        <View style={{ marginTop: spacing.medium }}>
          <BiometricBanner />
        </View>

        {/* Verification Check switches (linked to Zustand Active trip) */}
        <View style={{ marginTop: spacing.medium }}>
          <VerificationToggles trip={activeTrip} />
        </View>

        {/* Mock custom file upload form */}
        <View style={{ marginTop: spacing.medium }}>
          <AddDocumentForm onUpload={handleUpload} />
        </View>

        {/* Stored document cards directory */}
        <View style={[styles.listHeader, { marginTop: spacing.large }]}>
          <CustomText variant="caption" weight="700" color={colors.accentGold}>
            SECURED DIGITAL DIRECTORY
          </CustomText>
        </View>

        {docs.length === 0 ? (
          <GlassCard style={styles.emptyCard}>
            <Ionicons name="folder-open-outline" size={24} color={colors.textSecondary} />
            <CustomText variant="caption" color={colors.textSecondary} style={{ marginTop: 6 }}>
              No document records saved. Use the form above to add files.
            </CustomText>
          </GlassCard>
        ) : (
          <View style={styles.directoryGrid}>
            {docs.map((item) => {
              const iconName = TYPE_ICONS[item.docType] || TYPE_ICONS.Default;
              return (
                <Animated.View
                  key={item.id}
                  entering={FadeIn}
                  exiting={SlideOutLeft}
                  layout={Layout.springify()}
                >
                  <Pressable onPress={() => handleViewDoc(item)}>
                    <GlassCard style={[styles.rowItem, shadow.sm]}>
                      <View style={styles.rowLeft}>
                        <View style={[styles.iconWrapper, { backgroundColor: 'rgba(212,175,55,0.08)', borderRadius: radii.s }]}>
                          <Ionicons name={iconName as any} size={14} color={colors.accentGold} />
                        </View>
                        
                        <View style={styles.rowDetails}>
                          <CustomText variant="label" weight="600" color="#FFFFFF">
                            {item.title}
                          </CustomText>
                          <CustomText variant="caption" color={colors.textSecondary}>
                            {item.docType} • {item.fileSize}
                          </CustomText>
                        </View>
                      </View>

                      <View style={styles.rowRight}>
                        <CustomText variant="caption" color={colors.textSecondary} style={{ fontSize: 10 }}>
                          {item.dateUploaded}
                        </CustomText>
                        
                        <Pressable
                          onPress={(e) => {
                            e.stopPropagation();
                            handleDeleteDoc(item.id);
                          }}
                          style={styles.trashBtn}
                        >
                          <Ionicons name="trash-outline" size={13} color={colors.error} />
                        </Pressable>
                      </View>
                    </GlassCard>
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
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
  listHeader: {
    marginBottom: 10,
    width: '100%',
  },
  directoryGrid: {
    width: '100%',
    gap: 8,
  },
  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconWrapper: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rowDetails: {
    flex: 1,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trashBtn: {
    padding: 8,
    marginLeft: 8,
  },
  errorCard: {
    padding: 24,
    width: '100%',
    alignItems: 'center',
  },
  errorSubtitle: {
    marginTop: 6,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  emptyCard: {
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
});
