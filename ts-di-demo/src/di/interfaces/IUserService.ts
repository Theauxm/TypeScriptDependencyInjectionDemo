import { 
  UserProfile, 
  UserProfileUpdate, 
  EmailSettingsUpdate,
  GetEmailSettingsParams,
  UserMessagesResponse 
} from '../../types/NwycTypes';

/**
 * Domain-focused user service interface.
 * Manages user profile and account information.
 */
export interface IUserService {
  /**
   * Get user profile data
   */
  getProfile(): Promise<{ success: boolean; profile?: UserProfile; error?: string }>;

  /**
   * Update user information
   */
  updateProfile(profile: UserProfileUpdate): Promise<{ success: boolean; error?: string }>;

  /**
   * Get notification preferences
   */
  getEmailSettings(params?: GetEmailSettingsParams): Promise<{ success: boolean; settings?: string; error?: string }>;

  /**
   * Update notification preferences
   */
  updateEmailSettings(settings: EmailSettingsUpdate): Promise<{ success: boolean; error?: string }>;

  /**
   * Get billing information
   */
  getBillingReceipts(): Promise<{ success: boolean; receipts?: string; error?: string }>;

  /**
   * Download specific receipt
   */
  downloadReceipt(receiptId: number): Promise<{ success: boolean; receipt?: Blob; error?: string }>;

  /**
   * Get user's message history
   */
  getMessageHistory(): Promise<{ success: boolean; messages?: UserMessagesResponse; error?: string }>;
}
