import { 
  CampaignsResponse,
  CampaignResponse,
  AlertsResponse
} from '../../types/NwycTypes';

/**
 * Domain-focused campaigns service interface.
 * Manages advocacy campaigns.
 */
export interface ICampaignsService {
  /**
   * Get available campaigns
   */
  getCampaigns(): Promise<{ success: boolean; campaigns?: CampaignsResponse; error?: string }>;

  /**
   * Get campaign information
   */
  getCampaignDetails(campaignId: number): Promise<{ success: boolean; campaign?: CampaignResponse; error?: string }>;

  /**
   * Get alerts for campaign
   */
  getCampaignAlerts(campaignId: number): Promise<{ success: boolean; alerts?: AlertsResponse; error?: string }>;
}
