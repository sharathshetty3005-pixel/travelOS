import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '@/theme';
import { GlassCard } from '@/components/layout/GlassCard';
import { CustomText } from '@/components/typography/CustomText';
import { WeatherDetailsEntity } from '@/mocks/weather';

interface WeatherWidgetProps {
  weather: WeatherDetailsEntity | null;
}

export const WeatherWidget = React.memo(function WeatherWidget({
  weather,
}: WeatherWidgetProps) {
  const { colors, spacing, radii, shadow } = useAppTheme();

  if (!weather) return null;

  const getWeatherIcon = (cond: string) => {
    switch (cond.toLowerCase()) {
      case 'cloudy':
        return 'cloudy-outline';
      case 'rainy':
        return 'rainy-outline';
      case 'snowy':
        return 'snow-outline';
      case 'windy':
        return 'cloud-outline';
      case 'sunny':
      default:
        return 'sunny-outline';
    }
  };

  const weatherIcon = getWeatherIcon(weather.condition);

  return (
    <View style={styles.container}>
      {/* 1. Main Weather summary block */}
      <GlassCard style={styles.mainCard}>
        <View style={styles.mainHeader}>
          <View>
            <CustomText variant="caption" weight="700" color={colors.accentGold}>
              CURRENT WEATHER
            </CustomText>
            <CustomText variant="display" weight="700" color={colors.textPrimary} style={styles.mainTemp}>
              {weather.temp}°C
            </CustomText>
            <CustomText variant="label" weight="600" color={colors.textPrimary}>
              {weather.condition} • Feels like {weather.feelsLike}°C
            </CustomText>
            <CustomText variant="caption" color={colors.textSecondary}>
              High {weather.highTemp}°C • Low {weather.lowTemp}°C
            </CustomText>
          </View>
          <Ionicons name={weatherIcon as any} size={44} color={colors.accentGold} />
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* 2. Horizontal hourly track */}
        <CustomText variant="caption" weight="700" color={colors.textSecondary} style={styles.trackTitle}>
          HOURLY FORECAST
        </CustomText>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.hourlyScroll, { gap: spacing.small }]}
        >
          {weather.hourly.map((item, index) => (
            <View key={`hourly-${index}`} style={[styles.hourlyItem, { backgroundColor: colors.backgroundTertiary, borderRadius: radii.m, borderColor: colors.border, borderWidth: 0.5 }]}>
              <CustomText variant="caption" color={colors.textSecondary}>
                {item.time}
              </CustomText>
              <Ionicons
                name={getWeatherIcon(item.condition) as any}
                size={16}
                color={colors.accentGold}
                style={styles.hourlyIcon}
              />
              <CustomText variant="label" weight="600" color={colors.textPrimary}>
                {item.temp}°
              </CustomText>
            </View>
          ))}
        </ScrollView>
      </GlassCard>

      {/* 3. Quadrants (Separate Apple-Weather glass widgets) */}
      <View style={[styles.grid, { gap: spacing.small, marginTop: spacing.small }]}>
        <View style={styles.gridRow}>
          <GlassCard style={[styles.statPanel, shadow.sm]}>
            <View style={styles.statHeader}>
              <Ionicons name="sunny-outline" size={14} color={colors.accentGold} />
              <CustomText variant="caption" color={colors.textSecondary} style={styles.statTitle}>
                UV INDEX
              </CustomText>
            </View>
            <CustomText variant="body" weight="600" color={colors.textPrimary} style={styles.statValue}>
              {weather.uvIndex}
            </CustomText>
            <CustomText variant="caption" color={colors.textSecondary}>
              Very High
            </CustomText>
          </GlassCard>

          <GlassCard style={[styles.statPanel, shadow.sm]}>
            <View style={styles.statHeader}>
              <Ionicons name="leaf-outline" size={14} color={colors.accentGold} />
              <CustomText variant="caption" color={colors.textSecondary} style={styles.statTitle}>
                WIND
              </CustomText>
            </View>
            <CustomText variant="body" weight="600" color={colors.textPrimary} style={styles.statValue}>
              {weather.windSpeedKph} km/h
            </CustomText>
            <CustomText variant="caption" color={colors.textSecondary}>
              Light breeze
            </CustomText>
          </GlassCard>
        </View>

        <View style={[styles.gridRow, { marginTop: spacing.tiny }]}>
          <GlassCard style={[styles.statPanel, shadow.sm]}>
            <View style={styles.statHeader}>
              <Ionicons name="water-outline" size={14} color={colors.accentGold} />
              <CustomText variant="caption" color={colors.textSecondary} style={styles.statTitle}>
                HUMIDITY
              </CustomText>
            </View>
            <CustomText variant="body" weight="600" color={colors.textPrimary} style={styles.statValue}>
              {weather.humidityPercentage}%
            </CustomText>
            <CustomText variant="caption" color={colors.textSecondary}>
              Dew point: 14°C
            </CustomText>
          </GlassCard>

          <GlassCard style={[styles.statPanel, shadow.sm]}>
            <View style={styles.statHeader}>
              <Ionicons name="time-outline" size={14} color={colors.accentGold} />
              <CustomText variant="caption" color={colors.textSecondary} style={styles.statTitle}>
                SUNSET
              </CustomText>
            </View>
            <CustomText variant="body" weight="600" color={colors.textPrimary} style={styles.statValue}>
              {weather.sunset}
            </CustomText>
            <CustomText variant="caption" color={colors.textSecondary}>
              Sunrise: {weather.sunrise}
            </CustomText>
          </GlassCard>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  mainCard: {
    padding: 18,
    borderWidth: 0.5,
  },
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mainTemp: {
    lineHeight: 46,
    marginVertical: 4,
  },
  divider: {
    height: 0.5,
    marginVertical: 14,
  },
  trackTitle: {
    letterSpacing: 1,
    marginBottom: 8,
  },
  hourlyScroll: {
    paddingVertical: 2,
  },
  hourlyItem: {
    width: 62,
    alignItems: 'center',
    paddingVertical: 10,
  },
  hourlyIcon: {
    marginVertical: 4,
  },
  grid: {
    width: '100%',
  },
  gridRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  statPanel: {
    flex: 1,
    padding: 12,
    borderWidth: 0.5,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  statTitle: {
    marginLeft: 6,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  statValue: {
    marginVertical: 2,
  },
});
