import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Haptics from 'expo-haptics';

import { useAppTheme } from '@/theme';
import { GlassCard } from '@/components/layout/GlassCard';
import { CustomText } from '@/components/typography/CustomText';
import { useTripStore } from '@/store/tripStore';
import { TripEntity } from '@/mocks/trips';

interface VerificationTogglesProps {
  trip: TripEntity;
}

export const VerificationToggles = React.memo(function VerificationToggles({
  trip,
}: VerificationTogglesProps) {
  const { colors, spacing, shadow } = useAppTheme();
  const toggleDocumentStatus = useTripStore((state) => state.toggleDocumentStatus);

  const status = trip.documentStatus;

  const handleToggle = (key: 'passportValid' | 'visaApproved' | 'insuranceUploaded') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    toggleDocumentStatus(trip.id, key);
  };

  return (
    <GlassCard style={[styles.card, shadow.sm]}>
      <CustomText variant="caption" weight="700" color={colors.accentGold} style={styles.titleText}>
        TRAVEL COMPLIANCE CHECKLIST
      </CustomText>

      <View style={[styles.list, { gap: spacing.small }]}>
        {/* Row 1: Passport Validity */}
        <ToggleRow
          label="Valid Passport Verification"
          desc="Passport expires post 6 months of return date"
          active={status.passportValid}
          onPress={() => handleToggle('passportValid')}
        />

        {/* Row 2: Visa Clearance */}
        <ToggleRow
          label="Visa Clearance Approved"
          desc="Target consulate tourist authorization"
          active={status.visaApproved}
          onPress={() => handleToggle('visaApproved')}
        />

        {/* Row 3: Medical Insurance */}
        <ToggleRow
          label="Travel Insurance Certificate"
          desc="Upload flight & health cover policies"
          active={status.insuranceUploaded}
          onPress={() => handleToggle('insuranceUploaded')}
        />
      </View>
    </GlassCard>
  );
});

// Single Toggle Row Helper
function ToggleRow({
  label,
  desc,
  active,
  onPress,
}: {
  label: string;
  desc: string;
  active: boolean;
  onPress: () => void;
}) {
  const { colors, radii } = useAppTheme();
  return (
    <Pressable onPress={onPress} style={[styles.row, { borderBottomColor: colors.border, borderBottomWidth: 0.5 }]}>
      <View style={styles.rowLeft}>
        <Ionicons
          name={active ? 'checkmark-circle' : 'alert-circle'}
          size={18}
          color={active ? colors.success : colors.error}
        />
        <View style={styles.textCol}>
          <CustomText variant="label" weight="600" color={colors.textPrimary}>
            {label}
          </CustomText>
          <CustomText variant="caption" color={colors.textSecondary} style={{ marginTop: 2 }}>
            {desc}
          </CustomText>
        </View>
      </View>

      <View style={[styles.switchTrack, { backgroundColor: active ? colors.success : 'rgba(255,255,255,0.06)', borderRadius: radii.capsule }]}>
        <View style={[styles.switchThumb, { backgroundColor: '#000000', alignSelf: active ? 'flex-end' : 'flex-start' }]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 0.5,
  },
  titleText: {
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  list: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  textCol: {
    marginLeft: 12,
  },
  switchTrack: {
    width: 38,
    height: 22,
    padding: 2,
    justifyContent: 'center',
  },
  switchThumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
});
