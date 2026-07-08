import React from 'react';
import { StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '@/theme';
import { GlassCard } from '@/components/layout/GlassCard';
import { CustomText } from '@/components/typography/CustomText';
import { TripEntity } from '@/mocks/trips';

interface AISmartBriefProps {
  trip: TripEntity | null;
}

export const AISmartBrief = React.memo(function AISmartBrief({
  trip,
}: AISmartBriefProps) {
  const { colors, spacing } = useAppTheme();

  // Generate a flowing, conversational briefing paragraph
  const getConversationalBrief = (): string => {
    if (!trip) {
      return "Welcome back. You currently have no active travel itineraries scheduled. Ready to escape? Explore our curated visual destinations below or ask the AI travel planner to structure a custom route.";
    }

    const name = "Julian"; // Mocked user name
    let briefText = `Good day, ${name}. Your next escape is ${trip.title} in ${trip.location}. `;

    if (trip.flight) {
      briefText += `Your flight ${trip.flight.flightNumber} departs in ${trip.countdownDays} days. `;
    }

    if (trip.packingProgress < 100) {
      const remainingItems = trip.totalRequiredItems - trip.totalPackedItems;
      briefText += `You still have ${remainingItems} items left to pack. `;
    }

    if (trip.documentStatus.passportValid) {
      briefText += "Your passport is verified and secure. ";
    } else {
      briefText += "Please note: your travel documents require validation. ";
    }

    briefText += "Rain is expected on Day 2 of your trip, so packing a windproof shell jacket is recommended.";

    return briefText;
  };

  const briefParagraph = getConversationalBrief();

  return (
    <GlassCard style={styles.card}>
      <View style={[styles.titleRow, { marginBottom: spacing.small }]}>
        <Ionicons name="sparkles" size={15} color={colors.accentGold} style={styles.sparkleIcon} />
        <CustomText variant="caption" weight="700" color={colors.accentGold} style={styles.title}>
          AI TRAVEL BRIEFING
        </CustomText>
      </View>

      <CustomText variant="body" color={colors.textPrimary} style={styles.paragraph}>
        {briefParagraph}
      </CustomText>
    </GlassCard>
  );
});

const styles = StyleSheet.create({
  card: {
    padding: 18,
    width: '100%',
    borderWidth: 0.5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sparkleIcon: {
    marginRight: 6,
  },
  title: {
    letterSpacing: 1.5,
  },
  paragraph: {
    lineHeight: 22,
    letterSpacing: 0.2,
  },
});
