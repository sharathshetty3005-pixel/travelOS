import { authService, AuthResponse } from '@/services/auth/authService';

export const userRepository = {
  async authenticateUser(email: string, password: string): Promise<AuthResponse> {
    try {
      // Direct call to simulate API POST
      return await authService.authenticate(email, password);
    } catch (error) {
      // Map system exceptions to localized, user-facing descriptive strings
      const errorMsg = error instanceof Error ? error.message : '';
      
      switch (errorMsg) {
        case 'INVALID_CREDENTIALS':
          throw new Error('Incorrect email address or password. Please verify and try again.');
        case 'NETWORK_TIMEOUT':
          throw new Error('The connection timed out. Please check your internet connection and try again.');
        case 'SERVER_UNAVAILABLE':
          throw new Error('Our luxury network service is currently undergoing minor upgrades. Please try again shortly.');
        default:
          throw new Error('An unexpected verification error occurred. Please contact TravelOS support.');
      }
    }
  },

  async requestPasswordReset(email: string): Promise<void> {
    try {
      await authService.mockForgotPassword(email);
    } catch {
      throw new Error('The email address provided does not match our records. Please verify spelling.');
    }
  },

  async verifyResetOTP(code: string): Promise<void> {
    try {
      await authService.mockVerifyCode(code);
    } catch {
      throw new Error('The verification code is incorrect. Use code: 123456 for testing.');
    }
  },
};
