import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '@/theme';
import { GlassCard } from '@/components/layout/GlassCard';
import { CustomText } from '@/components/typography/CustomText';
import { Button } from '@/components/input/Button';
import { WizardData } from './PlannerWizard';
import { mockDestinations } from '@/mocks/destinations';

interface ItineraryViewerProps {
  wizardData: WizardData;
  onSave: () => void;
}

interface Activity {
  timeOfDay: 'Morning' | 'Afternoon' | 'Evening';
  title: string;
  desc: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  location: string;
  cost: string;
}

interface DailySchedule {
  dayNumber: number;
  theme: string;
  activities: Activity[];
}

// Rich pre-generated daily activities based on destinations
const CURATED_ITINERARIES: Record<string, DailySchedule[]> = {
  'dest-amalfi': [
    {
      dayNumber: 1,
      theme: 'Arrival & Cliffside Walks',
      activities: [
        { timeOfDay: 'Morning', title: 'Scenic Ridge Shuttle', desc: 'Transfer from Naples along the Amalfi cliffs to Positano.', icon: 'car-outline', location: 'Naples to Positano', cost: '$80' },
        { timeOfDay: 'Afternoon', title: 'Amalfi Lemon Orchard Walk', desc: 'Stroll ancient orchards and taste local lemon sorbet.', icon: 'leaf-outline', location: 'Lemon Trails', cost: '$25' },
        { timeOfDay: 'Evening', title: 'Sunset Terrace Dinner', desc: 'Fresh seafood overlooking Positano harbor lights.', icon: 'restaurant-outline', location: 'Chez Black', cost: '$120' },
      ],
    },
    {
      dayNumber: 2,
      theme: 'Coasts & Caves Exploration',
      activities: [
        { timeOfDay: 'Morning', title: 'Emerald Grotto Charter', desc: 'Private wooden boat ride to the luminescent marine cavern.', icon: 'boat-outline', location: 'Conca dei Marini', cost: '$150' },
        { timeOfDay: 'Afternoon', title: 'Atrani Beach Club Lounge', desc: 'Lounge chairs under the sun with local drinks.', icon: 'sunny-outline', location: 'Atrani Beach', cost: '$45' },
        { timeOfDay: 'Evening', title: 'Al Fresco Limoncello Class', desc: 'Learn how to distill Limoncello from orchard skin.', icon: 'wine-outline', location: 'Amalfi Town', cost: '$60' },
      ],
    },
    {
      dayNumber: 3,
      theme: 'Path of the Gods hike',
      activities: [
        { timeOfDay: 'Morning', title: 'Trail of the Sentiero', desc: 'Stunning high-elevation mountain hike above coastal cliffs.', icon: 'walk-outline', location: 'Bomerano to Nocelle', cost: 'Free' },
        { timeOfDay: 'Afternoon', title: 'Nocelle Shepherd Feast', desc: 'Organic lunch featuring homemade pastas and goat cheeses.', icon: 'restaurant-outline', location: 'La Tagliata', cost: '$55' },
        { timeOfDay: 'Evening', title: 'Positano Beachside Gelato', desc: 'Quiet twilight beach stroll tasting fresh local pistacchio.', icon: 'ice-cream-outline', location: 'Spiaggia Grande', cost: '$10' },
      ],
    },
  ],
  'dest-kyoto': [
    {
      dayNumber: 1,
      theme: 'Historical Pagodas & Gates',
      activities: [
        { timeOfDay: 'Morning', title: 'Fushimi Inari Torii Climb', desc: 'Ascend the mountain path lined with thousands of vermilion gates.', icon: 'trail-sign-outline', location: 'Fushimi Inari Shrine', cost: 'Free' },
        { timeOfDay: 'Afternoon', title: 'Nishiki Market Lunch crawl', desc: 'Sample baby octopus skewers, tempura, and macha skewers.', icon: 'restaurant-outline', location: 'Nishiki Market', cost: '$30' },
        { timeOfDay: 'Evening', title: 'Gisen Lantern Stroll', desc: 'Historic district walk looking out for traditional wooden teahouses.', icon: 'bulb-outline', location: 'Gion District', cost: 'Free' },
      ],
    },
    {
      dayNumber: 2,
      theme: 'Zen Groves & Golden Leaves',
      activities: [
        { timeOfDay: 'Morning', title: 'Arashiyama Bamboo Walk', desc: 'Walk under tall bamboo stalks echoing the morning winds.', icon: 'leaf-outline', location: 'Arashiyama Grove', cost: 'Free' },
        { timeOfDay: 'Afternoon', title: 'Kinkaku-ji Golden Pavilion', desc: 'Zen temple covered in gold leaf reflecting on the pond mirror.', icon: 'home-outline', location: 'Kinkaku-ji', cost: '$15' },
        { timeOfDay: 'Evening', title: 'Kaiseki Dinner Ceremony', desc: 'Multi-course culinary journey representing seasonal textures.', icon: 'wine-outline', location: 'Ryokan Kura', cost: '$180' },
      ],
    },
    {
      dayNumber: 3,
      theme: 'Tea & Philosophers Walk',
      activities: [
        { timeOfDay: 'Morning', title: 'Philosopher Path Stroll', desc: 'Walk alongside cherry trees lining the historic canal.', icon: 'walk-outline', location: 'Higashiyama', cost: 'Free' },
        { timeOfDay: 'Afternoon', title: 'Uji Matcha Whisk Session', desc: 'Learn the art of whisking grade-A matcha in tea huts.', icon: 'cafe-outline', location: 'Tea Pavillion', cost: '$40' },
        { timeOfDay: 'Evening', title: 'Pontocho Alley Izakaya', desc: 'Enjoy sake, yakitori, and gyoza inside cozy canalside bars.', icon: 'restaurant-outline', location: 'Pontocho Alley', cost: '$50' },
      ],
    },
  ],
};

export const ItineraryViewer = React.memo(function ItineraryViewer({
  wizardData,
  onSave,
}: ItineraryViewerProps) {
  const { colors, spacing, radii, shadow } = useAppTheme();

  const dest = mockDestinations.find((d) => d.id === wizardData.destinationId) || mockDestinations[0];
  
  // Resolve schedule list (truncate to requested duration days)
  const baseSchedule = CURATED_ITINERARIES[dest.id] || CURATED_ITINERARIES['dest-amalfi'];
  const activeSchedule = baseSchedule.slice(0, wizardData.durationDays);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      <GlassCard style={[styles.headerCard, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <CustomText variant="caption" weight="700" color={colors.accentGold}>
          AI GENERATED ITINERARY
        </CustomText>
        <CustomText variant="title" weight="600" color={colors.textPrimary} style={styles.title}>
          {dest.title} Escape
        </CustomText>
        <CustomText variant="caption" color={colors.textSecondary}>
          {wizardData.durationDays} Days • {wizardData.style} Style • {wizardData.interests.length} Interests
        </CustomText>
      </GlassCard>

      {/* Days Timeline Track */}
      <View style={[styles.timeline, { marginTop: spacing.medium }]}>
        {activeSchedule.map((day, idx) => (
          <View key={`day-${day.dayNumber}`} style={styles.dayBlock}>
            {/* Timeline Left Node indicator */}
            <View style={styles.leftNodeColumn}>
              <View style={[styles.circleNode, { backgroundColor: colors.accentGold }]} />
              {idx < activeSchedule.length - 1 && (
                <View style={[styles.verticalLine, { backgroundColor: colors.border }]} />
              )}
            </View>

            {/* Daily Schedule Box */}
            <View style={styles.rightContentColumn}>
              <CustomText variant="label" weight="700" color={colors.accentGold}>
                DAY {day.dayNumber}
              </CustomText>
              <CustomText variant="body" weight="600" color={colors.textPrimary} style={styles.themeName}>
                {day.theme}
              </CustomText>

              {/* Day Activities */}
              <View style={[styles.activitiesList, { gap: spacing.small, marginTop: spacing.small }]}>
                {day.activities.map((act, actIdx) => (
                  <GlassCard key={`act-${actIdx}`} style={[styles.activityCard, shadow.sm]}>
                    <View style={styles.actHeader}>
                      <View style={[styles.iconBox, { backgroundColor: 'rgba(212,175,55,0.08)', borderRadius: radii.s }]}>
                        <Ionicons name={act.icon} size={15} color={colors.accentGold} />
                      </View>
                      <View style={styles.actDetails}>
                        <CustomText variant="caption" weight="700" color={colors.textSecondary}>
                          {act.timeOfDay.toUpperCase()}
                        </CustomText>
                        <CustomText variant="label" weight="600" color={colors.textPrimary}>
                          {act.title}
                        </CustomText>
                      </View>
                    </View>
                    
                    <CustomText variant="caption" color={colors.textSecondary} style={styles.actDesc}>
                      {act.desc}
                    </CustomText>

                    <View style={styles.actFooter}>
                      <View style={styles.locItem}>
                        <Ionicons name="location-outline" size={10} color={colors.textSecondary} />
                        <CustomText variant="caption" color={colors.textSecondary} style={{ marginLeft: 3 }}>
                          {act.location}
                        </CustomText>
                      </View>
                      <View style={[styles.costItem, { backgroundColor: colors.backgroundTertiary, borderRadius: radii.s }]}>
                        <CustomText variant="caption" weight="600" color={colors.accentGold}>
                          {act.cost}
                        </CustomText>
                      </View>
                    </View>
                  </GlassCard>
                ))}
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* Saving / Finalization Actions */}
      <View style={{ marginTop: spacing.large, marginBottom: spacing.huge }}>
        <Button label="SAVE TO MY TRIPS" onPress={onSave} />
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  headerCard: {
    padding: 16,
    borderWidth: 0.5,
  },
  title: {
    marginTop: 2,
    marginBottom: 4,
  },
  timeline: {
    width: '100%',
  },
  dayBlock: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 20,
  },
  leftNodeColumn: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  circleNode: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  verticalLine: {
    flex: 1,
    width: 1,
    marginTop: 4,
    marginBottom: -16,
  },
  rightContentColumn: {
    flex: 1,
  },
  themeName: {
    marginTop: 2,
  },
  activitiesList: {
    width: '100%',
  },
  activityCard: {
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  actHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  actDetails: {
    flex: 1,
  },
  actDesc: {
    marginTop: 8,
    lineHeight: 16,
  },
  actFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  locItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  costItem: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
});
