import { 
  DistrictsResponse,
  LegislatorSearchResponse,
  GetLegislatorSearchParams,
  MessageFormResponse,
  GetMessageFormParams,
  MessageCongressRequest
} from '../../types/NwycTypes';

/**
 * Domain-focused legislative service interface.
 * Manages legislative and representative information.
 */
export interface ILegislativeService {
  /**
   * Find electoral districts by address
   */
  getDistrictsByAddress(address: string): Promise<{ success: boolean; districts?: DistrictsResponse; error?: string }>;

  /**
   * Get user's elected officials
   */
  getMyRepresentatives(): Promise<{ success: boolean; representatives?: string; error?: string }>;

  /**
   * Search for legislators
   */
  searchLegislators(criteria: GetLegislatorSearchParams): Promise<{ success: boolean; results?: LegislatorSearchResponse; error?: string }>;

  /**
   * Get detailed legislator info
   */
  getLegislatorDetails(params: GetLegislatorSearchParams): Promise<{ success: boolean; details?: string; error?: string }>;

  /**
   * Send message to representatives
   */
  sendMessageToCongress(message: MessageCongressRequest): Promise<{ success: boolean; error?: string }>;

  /**
   * Get message composition form
   */
  getMessageForm(params?: GetMessageFormParams): Promise<{ success: boolean; form?: MessageFormResponse; error?: string }>;

  /**
   * Resend a previous message
   */
  resendMessage(messageId: number): Promise<{ success: boolean; error?: string }>;
}
