import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable, ScrollView, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useAppTheme } from '@/theme';
import { GlassCard } from '@/components/layout/GlassCard';
import { CustomText } from '@/components/typography/CustomText';
import { TextField } from '@/components/input/TextField';
import { mockDestinations, DestinationEntity } from '@/mocks/destinations';
import { TripEntity, PackingItem } from '@/mocks/trips';
import { AnimatedSpinner } from '@/components/feedback/AnimatedSpinner';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface PlannerWizardProps {
  onCompleteGeneration: (trip: TripEntity) => void;
}

const STYLES = [
  { name: 'Nomad', icon: 'globe-outline', desc: 'Work-friendly spots, coffee shops, and local hideouts' },
  { name: 'Adventure', icon: 'compass-outline', desc: 'Hikes, wild trails, raw sightseeing, and action' },
  { name: 'Luxury', icon: 'ribbon-outline', desc: 'Premium hotels, Michelin dining, and yacht transfers' },
  { name: 'Relaxing', icon: 'umbrella-outline', desc: 'Slow beach lounges, spa centers, and scenic vistas' },
];

export const PlannerWizard = React.memo(function PlannerWizard({
  onCompleteGeneration,
}: PlannerWizardProps) {
  const { colors, spacing, radii, shadow } = useAppTheme();

  const [step, setStep] = useState(0);
  const [selectedDest, setSelectedDest] = useState<DestinationEntity>(mockDestinations[0]);
  const [style, setStyle] = useState('Nomad');
  const [budgetStr, setBudgetStr] = useState('3000');
  const [days, setDays] = useState(5);
  const [genStatusText, setGenStatusText] = useState('Booting TravelOS AI...');

  // Step 3 Loader transitions
  useEffect(() => {
    if (step !== 3) return;

    const statuses = [
      'Scanning local seasonal trends...',
      `Curating ${style} highlights in ${selectedDest.title}...`,
      'Generating seed packing checklists...',
      'Mapping offline GPS topological guides...',
      'Finalizing flight and ryokan coordinates...',
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < statuses.length - 1) {
        index++;
        setGenStatusText(statuses[index]);
      } else {
        clearInterval(interval);
        generateTripObject();
      }
    }, 800);

    return () => clearInterval(interval);
  }, [step]);

  const generateTripObject = () => {
    // 1. Compute Start & End Date
    const start = new Date();
    start.setDate(start.getDate() + 10); // Starts in 10 days
    const end = new Date(start);
    end.setDate(end.getDate() + days);

    const startDateStr = start.toISOString().split('T')[0];
    const endDateStr = end.toISOString().split('T')[0];

    // 2. Generate custom packing lists based on destination type & style
    const packing: PackingItem[] = [
      { id: 'pack-gen-01', name: 'Valid Passport & Visa', category: 'Documents', packed: false, quantity: 1, priority: 'high', spaceWeight: 1 },
      { id: 'pack-gen-02', name: `${selectedDest.currencyCode} Cash Reserve`, category: 'Essentials', packed: false, quantity: 1, priority: 'high', spaceWeight: 1 },
    ];

    if (selectedDest.id === 'dest-reykjavik') {
      packing.push(
        { id: 'pack-gen-03', name: 'Thermal Windbreaker Jacket', category: 'Clothing', packed: false, quantity: 1, priority: 'high', spaceWeight: 5 },
        { id: 'pack-gen-04', name: 'Hiking Boots', category: 'Clothing', packed: false, quantity: 1, priority: 'high', spaceWeight: 4 },
        { id: 'pack-gen-05', name: 'Geothermal Swimwear', category: 'Clothing', packed: false, quantity: 1, priority: 'medium', spaceWeight: 2 }
      );
    } else {
      packing.push(
        { id: 'pack-gen-03', name: 'Linen Vacation Outfits', category: 'Clothing', packed: false, quantity: 4, priority: 'medium', spaceWeight: 3 },
        { id: 'pack-gen-04', name: 'Sunglasses & Sun Hat', category: 'Clothing', packed: false, quantity: 1, priority: 'low', spaceWeight: 2 },
        { id: 'pack-gen-05', name: 'Sunscreen Gel SPF 50', category: 'Toiletries', packed: false, quantity: 1, priority: 'high', spaceWeight: 2 }
      );
    }

    if (style === 'Nomad') {
      packing.push({ id: 'pack-gen-06', name: 'MacBook Pro & Charger', category: 'Electronics', packed: false, quantity: 1, priority: 'high', spaceWeight: 5 });
    } else if (style === 'Adventure') {
      packing.push({ id: 'pack-gen-06', name: 'Action Cam / GoPro', category: 'Electronics', packed: false, quantity: 1, priority: 'medium', spaceWeight: 3 });
    } else {
      packing.push({ id: 'pack-gen-06', name: 'Noise Cancelling Headphones', category: 'Electronics', packed: false, quantity: 1, priority: 'medium', spaceWeight: 4 });
    }

    // 3. Generate dynamic Day-by-Day schedule
    const daysArray = Array.from({ length: days }).map((_, idx) => {
      const dayNum = idx + 1;
      if (dayNum === 1) {
        return `Day 1: Arrival in ${selectedDest.title}, airport private transfer, hotel check-in and evening brief stroll.`;
      }
      if (dayNum === days) {
        return `Day ${dayNum}: Final breakfast, checkout processing, souvenir shopping, and departure transfer.`;
      }
      // Middle days generated based on style
      if (style === 'Adventure') {
        return `Day ${dayNum}: Morning scenic trail hike, exploring ${selectedDest.highlights[idx % selectedDest.highlights.length]}, and outdoor camping dinner.`;
      }
      if (style === 'Luxury') {
        return `Day ${dayNum}: Michelin-star lunch, VIP private yacht rental, shopping in boutique districts, and harbor sunset cocktails.`;
      }
      return `Day ${dayNum}: Coffee shop deep-work session, visiting historical monuments, and quiet local culinary explorations.`;
    });

    const newTrip: TripEntity = {
      id: `trip-gen-${Date.now()}`,
      destinationId: selectedDest.id,
      title: `${selectedDest.title} ${style} Odyssey`,
      location: `${selectedDest.title}, ${selectedDest.country}`,
      startDate: startDateStr,
      endDate: endDateStr,
      status: 'active',
      countdownDays: 10,
      flight: {
        airline: 'Premium Air',
        flightNumber: `PA ${Math.floor(1000 + Math.random() * 9000)}`,
        departureTime: '2:15 PM',
        gate: 'B18',
        seat: style === 'Luxury' ? '02A (First)' : '14K (Business)',
        status: 'Scheduled',
      },
      hotel: {
        name: style === 'Luxury' ? `The Grand Palace, ${selectedDest.title}` : `Nomad Lodges, ${selectedDest.title}`,
        checkInDate: startDateStr,
        roomType: style === 'Luxury' ? 'Sea View Penthouse' : 'Premium Double Studio',
        confirmationCode: `CONF-${Math.floor(1000000 + Math.random() * 9000000)}`,
      },
      packingProgress: 0,
      totalPackedItems: 0,
      totalRequiredItems: packing.length,
      documentStatus: {
        passportValid: true,
        visaApproved: true,
        insuranceUploaded: false,
      },
      expenses: {
        totalSpentUSD: 0,
        budgetUSD: parseFloat(budgetStr) || 3000,
      },
      packingList: packing,
      expenseList: [],
      // Attached custom day-by-day plan so itinerary viewer can render it
      ...({ itineraryDays: daysArray } as any),
    };

    onCompleteGeneration(newTrip);
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    setStep((prev) => Math.max(prev - 1, 0));
  };

  // Step 0: Destination
  if (step === 0) {
    return (
      <Animated.View entering={FadeIn} style={styles.container}>
        <CustomText variant="caption" weight="700" color={colors.accentGold} style={styles.stepTitle}>
          STEP 1: SELECT DESTINATION
        </CustomText>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 16 }}>
          {mockDestinations.map((dest) => {
            const isSelected = selectedDest.id === dest.id;
            return (
              <Pressable
                key={dest.id}
                onPress={() => setSelectedDest(dest)}
                style={[
                  styles.destCard,
                  {
                    borderColor: isSelected ? colors.accentGold : colors.border,
                    backgroundColor: isSelected ? 'rgba(212,175,55,0.04)' : 'rgba(255,255,255,0.01)',
                    borderRadius: radii.m,
                  },
                ]}
              >
                <Image source={dest.coverImage} style={[styles.destImg, { borderRadius: radii.s }]} contentFit="cover" />
                <View style={styles.destMeta}>
                  <CustomText variant="body" weight="700" color={colors.textPrimary}>
                    {dest.title}
                  </CustomText>
                  <CustomText variant="caption" color={colors.textSecondary}>
                    {dest.country} • {dest.averageCost}
                  </CustomText>
                  <CustomText variant="caption" color={colors.accentGold} style={{ fontStyle: 'italic', fontSize: 9, marginTop: 4 }} numberOfLines={1}>
                    "{dest.tagline}"
                  </CustomText>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
        <Pressable onPress={handleNext} style={[styles.nextBtn, { backgroundColor: colors.accentGold, borderRadius: radii.s }]}>
          <CustomText variant="caption" weight="700" color="#000000">
            CONTINUE TO STYLE
          </CustomText>
        </Pressable>
      </Animated.View>
    );
  }

  // Step 1: Style & Budget
  if (step === 1) {
    return (
      <Animated.View entering={FadeIn} style={styles.container}>
        <CustomText variant="caption" weight="700" color={colors.accentGold} style={styles.stepTitle}>
          STEP 2: CHOOSE TRAVEL STYLE & BUDGET
        </CustomText>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingBottom: 16 }}>
          <TextField
            label="Trip Budget Limit (USD)"
            value={budgetStr}
            onChangeText={setBudgetStr}
            keyboardType="number-pad"
            prefixIcon="logo-usd"
          />

          <CustomText variant="caption" color={colors.textSecondary} style={{ fontSize: 9, letterSpacing: 0.5, marginTop: 10, marginBottom: 4 }}>
            TRAVEL STYLE CATEGORY
          </CustomText>
          {STYLES.map((st) => {
            const isSelected = style === st.name;
            return (
              <Pressable
                key={st.name}
                onPress={() => setStyle(st.name)}
                style={[
                  styles.styleCard,
                  {
                    borderColor: isSelected ? colors.accentGold : colors.border,
                    backgroundColor: isSelected ? 'rgba(212,175,55,0.04)' : 'rgba(255,255,255,0.01)',
                    borderRadius: radii.m,
                  },
                ]}
              >
                <View style={[styles.styleIconBox, { backgroundColor: colors.backgroundTertiary, borderRadius: radii.s }]}>
                  <Ionicons name={st.icon as any} size={18} color={isSelected ? colors.accentGold : colors.textSecondary} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <CustomText variant="body" weight="700" color={colors.textPrimary}>
                    {st.name}
                  </CustomText>
                  <CustomText variant="caption" color={colors.textSecondary} style={{ fontSize: 9, lineHeight: 12 }}>
                    {st.desc}
                  </CustomText>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
        <View style={styles.btnRow}>
          <Pressable onPress={handleBack} style={[styles.backBtn, { borderColor: colors.border, borderRadius: radii.s }]}>
            <CustomText variant="caption" weight="700" color={colors.textSecondary}>
              BACK
            </CustomText>
          </Pressable>
          <Pressable onPress={handleNext} style={[styles.nextBtn, { flex: 1, backgroundColor: colors.accentGold, borderRadius: radii.s }]}>
            <CustomText variant="caption" weight="700" color="#000000">
              CONTINUE TO DURATION
            </CustomText>
          </Pressable>
        </View>
      </Animated.View>
    );
  }

  // Step 2: Duration
  if (step === 2) {
    return (
      <Animated.View entering={FadeIn} style={styles.container}>
        <CustomText variant="caption" weight="700" color={colors.accentGold} style={styles.stepTitle}>
          STEP 3: SELECT TRIP DURATION
        </CustomText>
        <View style={styles.centerContainer}>
          <GlassCard style={[styles.daysCard, shadow.sm]}>
            <CustomText variant="caption" color={colors.textSecondary}>
              TOTAL DURATION
            </CustomText>
            <CustomText variant="display" weight="700" color={colors.textPrimary} style={{ marginVertical: 8 }}>
              {days} Days
            </CustomText>
            <View style={styles.counterRow}>
              <Pressable
                onPress={() => setDays((prev) => Math.max(prev - 1, 1))}
                style={[styles.counterBtn, { borderColor: colors.border, borderRadius: radii.capsule }]}
              >
                <Ionicons name="remove" size={20} color={colors.textPrimary} />
              </Pressable>
              <Pressable
                onPress={() => setDays((prev) => Math.min(prev + 1, 14))}
                style={[styles.counterBtn, { borderColor: colors.border, borderRadius: radii.capsule }]}
              >
                <Ionicons name="add" size={20} color={colors.textPrimary} />
              </Pressable>
            </View>
          </GlassCard>
        </View>
        <View style={styles.btnRow}>
          <Pressable onPress={handleBack} style={[styles.backBtn, { borderColor: colors.border, borderRadius: radii.s }]}>
            <CustomText variant="caption" weight="700" color={colors.textSecondary}>
              BACK
            </CustomText>
          </Pressable>
          <Pressable onPress={handleNext} style={[styles.nextBtn, { flex: 1, backgroundColor: colors.accentGold, borderRadius: radii.s }]}>
            <CustomText variant="caption" weight="700" color="#000000">
              GENERATE AI ITINERARY
            </CustomText>
          </Pressable>
        </View>
      </Animated.View>
    );
  }

  // Step 3: Loading AI Generation
  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.loaderContainer}>
      <GlassCard style={styles.loaderCard}>
        <AnimatedSpinner size={48} color={colors.accentGold} />
        <CustomText variant="body" weight="700" color={colors.textPrimary} style={{ marginTop: 18 }}>
          TRAVELOS AI ENGINE
        </CustomText>
        <CustomText variant="caption" color={colors.textSecondary} style={{ marginTop: 4 }}>
          {genStatusText}
        </CustomText>
      </GlassCard>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  stepTitle: {
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  destCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
  },
  destImg: {
    width: 60,
    height: 60,
  },
  destMeta: {
    flex: 1,
    marginLeft: 12,
  },
  nextBtn: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  backBtn: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    marginRight: 12,
  },
  btnRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  styleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
  },
  styleIconBox: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  daysCard: {
    padding: 32,
    alignItems: 'center',
    width: '100%',
  },
  counterRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  counterBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderCard: {
    padding: 32,
    alignItems: 'center',
    width: '100%',
  },
});
