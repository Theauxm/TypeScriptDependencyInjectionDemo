import { 
  AlertsResponse,
  GetAlertsParams,
  AlertResponse,
  GetAlertParams,
  MessageFormResponse,
  MessageCongressRequest
} from '../../types/NwycTypes';

/**
 * Domain-focused alerts service interface.
 * Manages action alerts and advocacy.
 */
export interface IAlertsService {
  /**
   * Get available action alerts
   */
  getAlerts(filters?: GetAlertsParams): Promise<{ success: boolean; alerts?: AlertsResponse; error?: string }>;

  /**
   * Get specific alert information
   */
  getAlertDetails(alertId: string, params?: GetAlertParams): Promise<{ success: boolean; alert?: AlertResponse; error?: string }>;

  /**
   * Send alert-specific message
   */
  sendAlertMessage(alertId: string, message: MessageCongressRequest): Promise<{ success: boolean; error?: string }>;

  /**
   * Get alert message form
   */
  getAlertMessageForm(alertId: string): Promise<{ success: boolean; form?: MessageFormResponse; error?: string }>;
}
