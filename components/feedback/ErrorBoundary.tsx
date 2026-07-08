import React, { Component, ErrorInfo, ReactNode } from 'react';
import { StyleSheet, View, Pressable, SafeAreaView, Platform } from 'react-native';
import * as Updates from 'expo-updates';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { CustomText } from '../typography/CustomText';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log exception to remote monitoring in production environments if needed
  }

  private handleReset = async () => {
    try {
      // Clear stores configuration to recover from state corruption crashes
      await AsyncStorage.clear();
      await SecureStore.deleteItemAsync('travelos-auth-storage').catch(() => {});
      
      // Reload the application updates or crash reboot
      if (Platform.OS !== 'web') {
        await Updates.reloadAsync();
      } else {
        window.location.reload();
      }
    } catch {
      // Hard restart fallback
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={styles.container}>
          <View style={styles.content}>
            {/* Red alert dot emblem */}
            <View style={styles.errorIcon}>
              <View style={styles.errorIconInner} />
            </View>

            <CustomText variant="heading" weight="700" color="rgb(247, 247, 249)" style={styles.title}>
              Something went wrong.
            </CustomText>
            
            <CustomText variant="body" color="rgba(247, 247, 249, 0.60)" style={styles.subtitle}>
              An unexpected runtime error occurred. We have saved your position, but you may need to reset the state cache to recover.
            </CustomText>

            {this.state.error && (
              <View style={styles.errorLogBox}>
                <CustomText variant="caption" color="rgb(255, 59, 48)" numberOfLines={3}>
                  {this.state.error.toString()}
                </CustomText>
              </View>
            )}

            <Pressable
              onPress={this.handleReset}
              style={({ pressed }) => [
                styles.resetBtn,
                pressed && styles.resetBtnPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Reset and restart application"
            >
              <CustomText variant="label" color="rgb(10, 10, 12)">
                RESET & RESTART
              </CustomText>
            </Pressable>
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(10, 10, 12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '90%',
    padding: 24,
    borderRadius: 20,
    backgroundColor: 'rgb(24, 24, 28)',
    borderColor: 'rgba(247, 247, 249, 0.1)',
    borderWidth: 1,
    alignItems: 'center',
  },
  errorIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: 'rgb(255, 59, 48)',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  errorIconInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgb(255, 59, 48)',
  },
  title: {
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  errorLogBox: {
    width: '100%',
    backgroundColor: 'rgb(10, 10, 12)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 24,
    borderColor: 'rgba(255, 59, 48, 0.2)',
    borderWidth: 1,
  },
  resetBtn: {
    height: 48,
    width: '100%',
    backgroundColor: 'rgb(212, 175, 55)',
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtnPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});
