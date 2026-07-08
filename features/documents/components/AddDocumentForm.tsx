import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';

import { useAppTheme } from '@/theme';
import { GlassCard } from '@/components/layout/GlassCard';
import { CustomText } from '@/components/typography/CustomText';
import { TextField } from '@/components/input/TextField';
import { Button } from '@/components/input/Button';

interface AddDocumentFormProps {
  onUpload: (data: { title: string; docType: string }) => void;
}

const TYPES = ['Passport', 'Visa', 'Flight', 'Hotel', 'Insurance'] as const;

export const AddDocumentForm = React.memo(function AddDocumentForm({
  onUpload,
}: AddDocumentFormProps) {
  const { colors, spacing, radii } = useAppTheme();

  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState<string>('Passport');
  const [errorTitle, setErrorTitle] = useState('');

  const handleSubmit = () => {
    setErrorTitle('');

    if (!title.trim()) {
      setErrorTitle('Document title is required');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    
    onUpload({
      title: title.trim(),
      docType,
    });

    setTitle('');
  };

  return (
    <GlassCard style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
      <CustomText variant="caption" weight="700" color={colors.accentGold}>
        UPLOAD NEW RECORD COPY
      </CustomText>

      <View style={{ marginTop: spacing.medium }}>
        <TextField
          label="Document Label (e.g. Flight ticket)"
          value={title}
          onChangeText={setTitle}
          error={errorTitle}
          prefixIcon="document-text-outline"
        />

        {/* Doc type selectors */}
        <CustomText variant="caption" color={colors.textSecondary} style={styles.typeLabel}>
          DOCUMENT CLASSIFICATION
        </CustomText>
        <View style={styles.typeRow}>
          {TYPES.map((t) => {
            const isSelected = docType === t;
            return (
              <Pressable
                key={t}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
                  setDocType(t);
                }}
                style={[
                  styles.typeBtn,
                  {
                    borderColor: isSelected ? colors.accentGold : colors.border,
                    backgroundColor: isSelected
                      ? 'rgba(212,175,55,0.08)'
                      : 'rgba(255,255,255,0.02)',
                    borderRadius: radii.s,
                  },
                ]}
              >
                <CustomText
                  variant="caption"
                  weight="600"
                  color={isSelected ? colors.accentGold : colors.textSecondary}
                  style={{ fontSize: 10 }}
                >
                  {t}
                </CustomText>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={{ marginTop: spacing.medium }}>
        <Button label="UPLOAD ENCRYPTED RECORD" onPress={handleSubmit} />
      </View>
    </GlassCard>
  );
});

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 0.5,
  },
  typeLabel: {
    marginBottom: 8,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  typeBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
});
