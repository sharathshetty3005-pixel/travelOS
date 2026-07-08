import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TextInputProps,
  Pressable,
  ViewStyle,
  StyleProp,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useAppTheme } from '@/theme';
import { CustomText } from '@/components/typography/CustomText';

interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  success?: boolean;
  helperText?: string;
  prefixIcon?: React.ComponentProps<typeof Ionicons>['name']; // Typings matching valid Ionicons glyphs
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const TextField = React.memo(function TextField({
  label,
  value,
  onChangeText,
  error,
  success,
  helperText,
  prefixIcon,
  loading = false,
  disabled = false,
  secureTextEntry = false,
  style,
  ...props
}: TextFieldProps) {
  const { colors, spacing, radii, animation, opacity } = useAppTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const inputRef = useRef<TextInput>(null);

  // Label float position tracking
  const labelProgress = useSharedValue(value ? 1 : 0);
  // Border focus glow animation
  const focusProgress = useSharedValue(0);

  useEffect(() => {
    labelProgress.value = withTiming(isFocused || value ? 1 : 0, {
      duration: animation.duration.fast,
      easing: animation.easing.smooth,
    });
  }, [isFocused, value]);

  useEffect(() => {
    focusProgress.value = withTiming(isFocused ? 1 : 0, {
      duration: animation.duration.fast,
    });
  }, [isFocused]);

  const animatedLabelStyle = useAnimatedStyle(() => {
    const translateY = interpolate(labelProgress.value, [0, 1], [0, -12]);
    const translateX = interpolate(labelProgress.value, [0, 1], [0, -14]); // Prevents drift on scale
    const scale = interpolate(labelProgress.value, [0, 1], [1, 0.8]);

    return {
      transform: [{ translateY }, { translateX }, { scale }],
    };
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    // Dynamic border focus transitions
    let borderColor: string = colors.border;
    if (error) {
      borderColor = colors.error;
    } else if (success) {
      borderColor = colors.success;
    } else {
      borderColor = isFocused ? colors.accentGold : colors.border;
    }

    return {
      borderColor,
      borderWidth: isFocused || error || success ? 1.5 : 1,
    };
  });

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  // Toggle password secure display configuration
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  const isEditable = !disabled && !loading;

  return (
    <View style={[styles.root, { marginBottom: spacing.medium }, style]}>
      {/* Outer borders input panel */}
      <Animated.View
        style={[
          styles.container,
          {
            borderRadius: radii.m,
            backgroundColor: colors.backgroundSecondary,
            opacity: disabled ? opacity.disabled : 1.0,
            paddingLeft: prefixIcon ? spacing.medium : spacing.large,
            paddingRight: secureTextEntry ? spacing.medium : spacing.large,
          },
          animatedContainerStyle,
        ]}
      >
        {/* Optional Prefix Icon */}
        {prefixIcon && (
          <Ionicons
            name={prefixIcon as any}
            size={20}
            color={error ? colors.error : isFocused ? colors.accentGold : colors.textSecondary}
            style={styles.prefixIcon}
          />
        )}

        {/* Floating Label Container */}
        <View style={styles.inputArea}>
          <Animated.View
            pointerEvents="none"
            style={[styles.labelWrapper, animatedLabelStyle]}
          >
            <CustomText
              variant="body"
              color={
                error
                  ? colors.error
                  : isFocused
                  ? colors.accentGold
                  : colors.textSecondary
              }
            >
              {label}
            </CustomText>
          </Animated.View>

          {/* Core TextInput */}
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            editable={isEditable}
            secureTextEntry={secureTextEntry && !isPasswordVisible}
            style={[
              styles.input,
              {
                color: colors.textPrimary,
                fontSize: 16,
                // Adjust text padding on web vs native to align content nicely
                paddingTop: Platform.OS === 'web' ? 18 : 16,
              },
            ]}
            placeholderTextColor="transparent" // Hide defaults to let floating label shine
            accessibilityLabel={`${label} input field`}
            accessibilityRole="text"
            accessibilityState={{ disabled: !isEditable }}
            {...props}
          />
        </View>

        {/* Optional Secure Eye visibility toggles */}
        {secureTextEntry && (
          <Pressable
            onPress={togglePasswordVisibility}
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}
            style={styles.suffixIcon}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>
        )}
      </Animated.View>

      {/* Validation helper descriptions */}
      {error ? (
        <CustomText
          variant="caption"
          color={colors.error}
          style={[styles.helper, { marginLeft: spacing.small }]}
        >
          {error}
        </CustomText>
      ) : helperText ? (
        <CustomText
          variant="caption"
          color={colors.textSecondary}
          style={[styles.helper, { marginLeft: spacing.small }]}
        >
          {helperText}
        </CustomText>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
  },
  prefixIcon: {
    marginRight: 10,
  },
  inputArea: {
    flex: 1,
    height: '100%',
    position: 'relative',
    justifyContent: 'center',
  },
  labelWrapper: {
    position: 'absolute',
    left: 0,
    zIndex: 1,
  },
  input: {
    flex: 1,
    width: '100%',
    paddingBottom: 4,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  suffixIcon: {
    padding: 4,
  },
  helper: {
    marginTop: 4,
  },
});
