import { IAxiosService } from '../interfaces/IAxiosService';
import { INwycService } from '../interfaces/INwycService';
import {
  ApiResult,
  LoginResponse,
  AuthenticateResponse,
  FrontPageResponse,
  TopicsResponse,
  TopicResponse,
  UserTopicsResponse,
  PollsResponse,
  PollResponse,
  DistrictsResponse,
  LegislatorSearchResponse,
  SearchResponse,
  AlertsResponse,
  AlertResponse,
  MessageFormResponse,
  UserMessagesResponse,
  CampaignsResponse,
  CampaignResponse,
  PublicationsResponse,
  PublicationArticlesResponse,
  ArticleResponse,
  UserProfileResponse,
  TalkingPoint,
  SuccessResponse,
  LoginRequest,
  MessageCongressRequest,
  UserProfileUpdate,
  EmailSettingsUpdate,
  PollVoteRequest,
  GetTopicsParams,
  GetPollsParams,
  GetAlertsParams,
  GetAlertParams,
  GetPublicationArticlesParams,
  SearchParams,
  LegislatorSearchParams,
  MessageCongressParams,
  EmailSettingsParams,
} from '../../types/NwycTypes';

/**
 * Implementation of INwycService that wraps HTTP calls using IAxiosService.
 * Provides a clean business logic layer over the NWYC API with proper error handling
 * and type safety. Uses dependency injection for the HTTP service to enable testing.
 */
export class NwycService implements INwycService {
  private authToken: string | null = null;

  constructor(private readonly axiosService: IAxiosService) {}

  // ============================================================================
  // AUTHENTICATION METHODS
  // ============================================================================

  async getLoginForm(): Promise<ApiResult<LoginResponse>> {
    try {
      const response = await this.axiosService.get<LoginResponse>('/login');
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async login(credentials: LoginRequest): Promise<ApiResult<SuccessResponse>> {
    try {
      const response = await this.axiosService.post<SuccessResponse>('/login', credentials);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async authenticate(params?: { redirect?: string; quick?: boolean }): Promise<ApiResult<AuthenticateResponse>> {
    try {
      const response = await this.axiosService.get<AuthenticateResponse>('/authenticate', {
        params: params,
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async authenticatePost(data: { redirect?: string; quick?: boolean }): Promise<ApiResult<AuthenticateResponse>> {
    try {
      const response = await this.axiosService.post<AuthenticateResponse>('/authenticate', data);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  // ============================================================================
  // CONTENT METHODS
  // ============================================================================

  async getFrontPage(): Promise<ApiResult<FrontPageResponse>> {
    try {
      const response = await this.axiosService.get<FrontPageResponse>('/frontpage');
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async getDefaultTalkingPoints(): Promise<ApiResult<TalkingPoint[]>> {
    try {
      const response = await this.axiosService.get<TalkingPoint[]>('/default/talkingpoints');
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  // ============================================================================
  // TOPIC METHODS
  // ============================================================================

  async getAllTopics(params?: GetTopicsParams): Promise<ApiResult<TopicsResponse>> {
    try {
      const response = await this.axiosService.get<TopicsResponse>('/topics/all', {
        params: params,
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async getAllTopicsPost(params?: GetTopicsParams): Promise<ApiResult<TopicsResponse>> {
    try {
      const response = await this.axiosService.post<TopicsResponse>('/topics/all', params);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async getTopicById(topicId: number): Promise<ApiResult<TopicResponse>> {
    try {
      const response = await this.axiosService.get<TopicResponse>(`/topic/get/${topicId}`);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async addUserTopic(topicId: number): Promise<ApiResult<UserTopicsResponse>> {
    try {
      const response = await this.axiosService.post<UserTopicsResponse>(`/user/topic/add/${topicId}`);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async removeUserTopic(topicId: number): Promise<ApiResult<UserTopicsResponse>> {
    try {
      const response = await this.axiosService.post<UserTopicsResponse>(`/user/topic/delete/${topicId}`);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  // ============================================================================
  // POLL METHODS
  // ============================================================================

  async getActivePolls(params?: GetPollsParams): Promise<ApiResult<PollsResponse>> {
    try {
      const response = await this.axiosService.get<PollsResponse>('/polls/active', {
        params: params,
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async getAllPolls(params?: GetPollsParams): Promise<ApiResult<PollsResponse>> {
    try {
      const response = await this.axiosService.get<PollsResponse>('/polls', {
        params: params,
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async getPollById(pollId: number): Promise<ApiResult<PollResponse>> {
    try {
      const response = await this.axiosService.get<PollResponse>(`/poll/get/${pollId}`);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async getPollDetails(pollId: number): Promise<ApiResult<PollResponse>> {
    try {
      const response = await this.axiosService.get<PollResponse>(`/poll/${pollId}`);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async voteInPollByChoice(choiceId: number): Promise<ApiResult<PollResponse>> {
    try {
      const response = await this.axiosService.post<PollResponse>(`/poll/vote/${choiceId}`);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async voteInPoll(pollId: number, voteData: PollVoteRequest): Promise<ApiResult<PollResponse>> {
    try {
      const response = await this.axiosService.post<PollResponse>(`/poll/${pollId}/vote`, voteData);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  // ============================================================================
  // LEGISLATIVE METHODS
  // ============================================================================

  async getDistrictsByAddress(address: string): Promise<ApiResult<DistrictsResponse>> {
    try {
      const response = await this.axiosService.get<DistrictsResponse>('/districts/by_address', {
        params: { address },
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async getDistrictsByAddressPost(address: string): Promise<ApiResult<DistrictsResponse>> {
    try {
      const response = await this.axiosService.post<DistrictsResponse>('/districts/by_address', { address });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async getMyRepresentatives(): Promise<ApiResult<string>> {
    try {
      const response = await this.axiosService.get<string>('/elected_officials/my_reps');
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async searchLegislators(params?: LegislatorSearchParams): Promise<ApiResult<string>> {
    try {
      const response = await this.axiosService.get<string>('/elected_officials/search', {
        params: params,
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async searchLegislatorsAjax(params?: LegislatorSearchParams): Promise<ApiResult<LegislatorSearchResponse>> {
    try {
      const response = await this.axiosService.get<LegislatorSearchResponse>('/elected_officials/search/ajax', {
        params: params,
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  // ============================================================================
  // SEARCH METHODS
  // ============================================================================

  async searchContent(params: SearchParams): Promise<ApiResult<SearchResponse>> {
    try {
      const response = await this.axiosService.get<SearchResponse>('/search/results', {
        params: params,
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  // ============================================================================
  // ALERT METHODS
  // ============================================================================

  async getAlerts(params?: GetAlertsParams): Promise<ApiResult<AlertsResponse>> {
    try {
      const response = await this.axiosService.get<AlertsResponse>('/alerts', {
        params: params,
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async getAlert(alertId: string, params?: GetAlertParams): Promise<ApiResult<AlertResponse>> {
    try {
      const response = await this.axiosService.get<AlertResponse>(`/alert/${alertId}`, {
        params: params,
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  // ============================================================================
  // MESSAGE CONGRESS METHODS
  // ============================================================================

  async getMessageCongressForm(params?: MessageCongressParams): Promise<ApiResult<MessageFormResponse>> {
    try {
      const response = await this.axiosService.get<MessageFormResponse>('/message/congress/write', {
        params: params,
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async sendMessageToCongress(message: MessageCongressRequest): Promise<ApiResult<SuccessResponse>> {
    try {
      const response = await this.axiosService.post<SuccessResponse>('/message/congress/write', message);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async getAlertMessageForm(alertId: string): Promise<ApiResult<MessageFormResponse>> {
    try {
      const response = await this.axiosService.get<MessageFormResponse>(`/alert/${alertId}/message/congress/write`);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async sendAlertMessage(alertId: string, message: MessageCongressRequest): Promise<ApiResult<SuccessResponse>> {
    try {
      const response = await this.axiosService.post<SuccessResponse>(`/alert/${alertId}/message/congress/write`, message);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async resendMessage(messageLogId: number): Promise<ApiResult<SuccessResponse>> {
    try {
      const response = await this.axiosService.post<SuccessResponse>(`/message/resend/${messageLogId}`);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  // ============================================================================
  // USER MESSAGE METHODS
  // ============================================================================

  async getUserMessages(): Promise<ApiResult<UserMessagesResponse>> {
    try {
      const response = await this.axiosService.get<UserMessagesResponse>('/my/messages');
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  // ============================================================================
  // CAMPAIGN METHODS
  // ============================================================================

  async getCampaigns(): Promise<ApiResult<CampaignsResponse>> {
    try {
      const response = await this.axiosService.get<CampaignsResponse>('/campaigns');
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async getCampaign(campaignId: number): Promise<ApiResult<CampaignResponse>> {
    try {
      const response = await this.axiosService.get<CampaignResponse>(`/campaign/${campaignId}`);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async getCampaignAlerts(campaignId: number): Promise<ApiResult<AlertsResponse>> {
    try {
      const response = await this.axiosService.get<AlertsResponse>(`/campaign/${campaignId}/alerts`);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  // ============================================================================
  // PUBLICATION METHODS
  // ============================================================================

  async getPublications(): Promise<ApiResult<PublicationsResponse>> {
    try {
      const response = await this.axiosService.get<PublicationsResponse>('/publications');
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async getPublicationArticles(publicationId: string, params?: GetPublicationArticlesParams): Promise<ApiResult<PublicationArticlesResponse>> {
    try {
      const response = await this.axiosService.get<PublicationArticlesResponse>(`/publication/${publicationId}`, {
        params: params,
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async getArticle(articleId: string): Promise<ApiResult<ArticleResponse>> {
    try {
      const response = await this.axiosService.get<ArticleResponse>(`/article/${articleId}`);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  // ============================================================================
  // USER PROFILE METHODS
  // ============================================================================

  async getUserSettings(): Promise<ApiResult<string>> {
    try {
      const response = await this.axiosService.get<string>('/settings');
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async getUserProfile(): Promise<ApiResult<UserProfileResponse>> {
    try {
      const response = await this.axiosService.get<UserProfileResponse>('/settings/profile');
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async updateUserProfile(profileData: UserProfileUpdate): Promise<ApiResult<SuccessResponse>> {
    try {
      const response = await this.axiosService.post<SuccessResponse>('/settings/profile', profileData);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async getBillingReceipt(): Promise<ApiResult<string>> {
    try {
      const response = await this.axiosService.get<string>('/settings/billing');
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async downloadReceipt(receiptId: number): Promise<ApiResult<Blob>> {
    try {
      const response = await this.axiosService.get<Blob>(`/settings/receipt/download/${receiptId}`, {
        responseType: 'blob',
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async getEmailSettings(params?: EmailSettingsParams): Promise<ApiResult<string>> {
    try {
      const response = await this.axiosService.get<string>('/user/emailsettings', {
        params: params,
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  async updateEmailSettings(settings: EmailSettingsUpdate): Promise<ApiResult<SuccessResponse>> {
    try {
      const response = await this.axiosService.post<SuccessResponse>('/user/emailsettings', settings);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error) };
    }
  }

  // ============================================================================
  // AUTHENTICATION TOKEN MANAGEMENT
  // ============================================================================

  setAuthToken(token: string | null): void {
    this.authToken = token;
    this.axiosService.setAuthToken(token);
  }

  getAuthToken(): string | null {
    return this.authToken;
  }

  // ============================================================================
  // PRIVATE HELPER METHODS
  // ============================================================================

  private getErrorMessage(error: any): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'An unknown error occurred';
  }
}
