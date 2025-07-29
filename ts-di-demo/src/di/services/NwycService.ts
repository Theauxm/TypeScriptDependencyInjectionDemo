import { Injectable } from '../decorators';
import { INwycService } from '../interfaces/INwycService';
import { IAxiosService } from '../interfaces/IAxiosService';
import { serviceContainer } from '../ServiceContainer';
import { useQuery, useMutation, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import {
  ServiceResult,
  LoginRequest,
  LoginResponse,
  AuthenticateResponse,
  GetAuthenticateParams,
  FrontPageResponse,
  DistrictsResponse,
  TopicsResponse,
  GetTopicsParams,
  TopicResponse,
  UserTopicsResponse,
  PollsResponse,
  GetPollsParams,
  PollResponse,
  PollVoteRequest,
  UserProfileResponse,
  UserProfileUpdate,
  EmailSettingsUpdate,
  GetEmailSettingsParams,
  LegislatorSearchResponse,
  GetLegislatorSearchParams,
  SearchResponse,
  GetSearchParams,
  MessageFormResponse,
  GetMessageFormParams,
  MessageCongressRequest,
  SuccessResponse,
  UserMessagesResponse,
  AlertsResponse,
  GetAlertsParams,
  AlertResponse,
  GetAlertParams,
  CampaignsResponse,
  CampaignResponse,
  PublicationsResponse,
  PublicationArticlesResponse,
  GetPublicationArticlesParams,
  ArticleResponse,
  TalkingPoint
} from '../../types/NwycTypes';

/**
 * NWYC API service implementation that uses the injected IAxiosService for HTTP operations.
 * Integrates with TanStack Query for caching and state management.
 * All methods return ServiceResult<T> for consistent error handling.
 * Active in all environments.
 */
@Injectable("NwycService")
export class NwycService implements INwycService {
  private axiosService: IAxiosService;

  constructor() {
    this.axiosService = serviceContainer.resolve("AxiosService");
  }

  // ============================================================================
  // Authentication Endpoints
  // ============================================================================

  async getLoginForm(): Promise<ServiceResult<LoginResponse>> {
    try {
      const response = await this.axiosService.get<LoginResponse>('/login');
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async login(credentials: LoginRequest): Promise<ServiceResult<SuccessResponse>> {
    try {
      const formData = new URLSearchParams();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);

      const response = await this.axiosService.post<SuccessResponse>('/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async authenticate(params?: GetAuthenticateParams, authToken?: string): Promise<ServiceResult<AuthenticateResponse>> {
    try {
      const config = authToken ? { headers: { 'Authentication': authToken } } : undefined;
      const queryParams = params ? new URLSearchParams(params as any).toString() : '';
      const url = `/authenticate${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await this.axiosService.get<AuthenticateResponse>(url, config);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async authenticatePost(params?: GetAuthenticateParams, authToken?: string): Promise<ServiceResult<AuthenticateResponse>> {
    try {
      const config = authToken ? { headers: { 'Authentication': authToken } } : undefined;
      const formData = params ? new URLSearchParams(params as any) : undefined;
      
      const response = await this.axiosService.post<AuthenticateResponse>('/authenticate', formData, {
        ...config,
        headers: { 
          ...config?.headers,
          'Content-Type': 'application/x-www-form-urlencoded' 
        }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  // ============================================================================
  // Content Endpoints
  // ============================================================================

  async getFrontPage(): Promise<ServiceResult<FrontPageResponse>> {
    try {
      const response = await this.axiosService.get<FrontPageResponse>('/frontpage');
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getDefaultTalkingPoints(authToken: string): Promise<ServiceResult<TalkingPoint[]>> {
    try {
      const response = await this.axiosService.get<TalkingPoint[]>('/default/talkingpoints', {
        headers: { 'Authentication': authToken }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  // ============================================================================
  // Legislative Endpoints
  // ============================================================================

  async getDistrictsByAddress(address: string, authToken: string): Promise<ServiceResult<DistrictsResponse>> {
    try {
      const queryParams = new URLSearchParams({ address }).toString();
      const response = await this.axiosService.get<DistrictsResponse>(`/districts/by_address?${queryParams}`, {
        headers: { 'Authentication': authToken }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getDistrictsByAddressPost(address: string, authToken: string): Promise<ServiceResult<DistrictsResponse>> {
    try {
      const formData = new URLSearchParams({ address });
      const response = await this.axiosService.post<DistrictsResponse>('/districts/by_address', formData, {
        headers: { 
          'Authentication': authToken,
          'Content-Type': 'application/x-www-form-urlencoded' 
        }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getUserRepresentatives(authToken: string): Promise<ServiceResult<string>> {
    try {
      const response = await this.axiosService.get<string>('/elected_officials/my_reps', {
        headers: { 'Authentication': authToken }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async searchLegislators(params: GetLegislatorSearchParams, authToken: string): Promise<ServiceResult<string>> {
    try {
      const queryParams = new URLSearchParams(params as any).toString();
      const response = await this.axiosService.get<string>(`/elected_officials/search?${queryParams}`, {
        headers: { 'Authentication': authToken }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async searchLegislatorsAjax(params: GetLegislatorSearchParams, authToken: string): Promise<ServiceResult<LegislatorSearchResponse>> {
    try {
      const queryParams = new URLSearchParams(params as any).toString();
      const response = await this.axiosService.get<LegislatorSearchResponse>(`/elected_officials/search/ajax?${queryParams}`, {
        headers: { 'Authentication': authToken }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  // ============================================================================
  // Topics Endpoints
  // ============================================================================

  async getAllTopics(params?: GetTopicsParams, authToken?: string): Promise<ServiceResult<TopicsResponse>> {
    try {
      const queryParams = params ? new URLSearchParams(params as any).toString() : '';
      const url = `/topics/all${queryParams ? `?${queryParams}` : ''}`;
      const config = authToken ? { headers: { 'Authentication': authToken } } : undefined;
      
      const response = await this.axiosService.get<TopicsResponse>(url, config);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getAllTopicsPost(params?: GetTopicsParams, authToken?: string): Promise<ServiceResult<TopicsResponse>> {
    try {
      const formData = params ? new URLSearchParams(params as any) : undefined;
      const config = authToken ? { headers: { 'Authentication': authToken } } : undefined;
      
      const response = await this.axiosService.post<TopicsResponse>('/topics/all', formData, {
        ...config,
        headers: { 
          ...config?.headers,
          'Content-Type': 'application/x-www-form-urlencoded' 
        }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getTopicById(topicId: number, authToken: string): Promise<ServiceResult<TopicResponse>> {
    try {
      const response = await this.axiosService.get<TopicResponse>(`/topic/get/${topicId}`, {
        headers: { 'Authentication': authToken }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async addUserTopic(topicId: number, authToken: string): Promise<ServiceResult<UserTopicsResponse>> {
    try {
      const response = await this.axiosService.post<UserTopicsResponse>(`/user/topic/add/${topicId}`, null, {
        headers: { 'Authentication': authToken }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async removeUserTopic(topicId: number, authToken: string): Promise<ServiceResult<UserTopicsResponse>> {
    try {
      const response = await this.axiosService.post<UserTopicsResponse>(`/user/topic/delete/${topicId}`, null, {
        headers: { 'Authentication': authToken }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  // ============================================================================
  // Polls Endpoints
  // ============================================================================

  async getActivePolls(params?: GetPollsParams, authToken?: string): Promise<ServiceResult<PollsResponse>> {
    try {
      const queryParams = params ? new URLSearchParams(params as any).toString() : '';
      const url = `/polls/active${queryParams ? `?${queryParams}` : ''}`;
      const config = authToken ? { headers: { 'Authentication': authToken } } : undefined;
      
      const response = await this.axiosService.get<PollsResponse>(url, config);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getAllPolls(params?: GetPollsParams, authToken?: string): Promise<ServiceResult<PollsResponse>> {
    try {
      const queryParams = params ? new URLSearchParams(params as any).toString() : '';
      const url = `/polls${queryParams ? `?${queryParams}` : ''}`;
      const config = authToken ? { headers: { 'Authentication': authToken } } : undefined;
      
      const response = await this.axiosService.get<PollsResponse>(url, config);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getPollById(pollId: number, authToken: string): Promise<ServiceResult<PollResponse>> {
    try {
      const response = await this.axiosService.get<PollResponse>(`/poll/get/${pollId}`, {
        headers: { 'Authentication': authToken }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getPollDetails(pollId: number, authToken: string): Promise<ServiceResult<PollResponse>> {
    try {
      const response = await this.axiosService.get<PollResponse>(`/poll/${pollId}`, {
        headers: { 'Authentication': authToken }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async voteInPoll(choiceId: number, authToken: string): Promise<ServiceResult<PollResponse>> {
    try {
      const response = await this.axiosService.post<PollResponse>(`/poll/vote/${choiceId}`, null, {
        headers: { 'Authentication': authToken }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async voteInPollById(pollId: number, choices: PollVoteRequest, authToken: string): Promise<ServiceResult<PollResponse>> {
    try {
      const formData = new URLSearchParams();
      choices.choice_key.forEach(choice => formData.append('choice_key', choice));
      
      const response = await this.axiosService.post<PollResponse>(`/poll/${pollId}/vote`, formData, {
        headers: { 
          'Authentication': authToken,
          'Content-Type': 'application/x-www-form-urlencoded' 
        }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  // ============================================================================
  // User Settings Endpoints
  // ============================================================================

  async getUserSettings(authToken: string): Promise<ServiceResult<string>> {
    try {
      const response = await this.axiosService.get<string>('/settings', {
        headers: { 'Authentication': authToken }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getUserProfile(authToken: string): Promise<ServiceResult<UserProfileResponse>> {
    try {
      const response = await this.axiosService.get<UserProfileResponse>('/settings/profile', {
        headers: { 'Authentication': authToken }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async updateUserProfile(profile: UserProfileUpdate, authToken: string): Promise<ServiceResult<SuccessResponse>> {
    try {
      const formData = new URLSearchParams(profile as any);
      const response = await this.axiosService.post<SuccessResponse>('/settings/profile', formData, {
        headers: { 
          'Authentication': authToken,
          'Content-Type': 'application/x-www-form-urlencoded' 
        }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getBillingReceipt(authToken: string): Promise<ServiceResult<string>> {
    try {
      const response = await this.axiosService.get<string>('/settings/billing', {
        headers: { 'Authentication': authToken }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async downloadReceipt(receiptId: number, authToken: string): Promise<ServiceResult<Blob>> {
    try {
      const response = await this.axiosService.get<Blob>(`/settings/receipt/download/${receiptId}`, {
        headers: { 'Authentication': authToken },
        responseType: 'blob'
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getEmailSettings(params?: GetEmailSettingsParams, authToken?: string): Promise<ServiceResult<string>> {
    try {
      const queryParams = params ? new URLSearchParams(params as any).toString() : '';
      const url = `/user/emailsettings${queryParams ? `?${queryParams}` : ''}`;
      const config = authToken ? { headers: { 'Authentication': authToken } } : undefined;
      
      const response = await this.axiosService.get<string>(url, config);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async updateEmailSettings(settings: EmailSettingsUpdate, authToken: string): Promise<ServiceResult<SuccessResponse>> {
    try {
      const formData = new URLSearchParams(settings as any);
      const response = await this.axiosService.post<SuccessResponse>('/user/emailsettings', formData, {
        headers: { 
          'Authentication': authToken,
          'Content-Type': 'application/x-www-form-urlencoded' 
        }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  // ============================================================================
  // Search Endpoints
  // ============================================================================

  async searchContent(params: GetSearchParams, authToken: string): Promise<ServiceResult<SearchResponse>> {
    try {
      const queryParams = new URLSearchParams(params as any).toString();
      const response = await this.axiosService.get<SearchResponse>(`/search/results?${queryParams}`, {
        headers: { 'Authentication': authToken }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  // ============================================================================
  // Message Congress Endpoints
  // ============================================================================

  async getMessageCongressForm(params?: GetMessageFormParams, authToken?: string): Promise<ServiceResult<MessageFormResponse>> {
    try {
      const queryParams = params ? new URLSearchParams(params as any).toString() : '';
      const url = `/message/congress/write${queryParams ? `?${queryParams}` : ''}`;
      const config = authToken ? { headers: { 'Authentication': authToken } } : undefined;
      
      const response = await this.axiosService.get<MessageFormResponse>(url, config);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async sendMessageToCongress(message: MessageCongressRequest, authToken: string): Promise<ServiceResult<SuccessResponse>> {
    try {
      const formData = new URLSearchParams();
      Object.entries(message).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(item => formData.append(key, item.toString()));
        } else if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      const response = await this.axiosService.post<SuccessResponse>('/message/congress/write', formData, {
        headers: { 
          'Authentication': authToken,
          'Content-Type': 'application/x-www-form-urlencoded' 
        }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getAlertMessageForm(alertId: string, authToken: string): Promise<ServiceResult<MessageFormResponse>> {
    try {
      const response = await this.axiosService.get<MessageFormResponse>(`/alert/${alertId}/message/congress/write`, {
        headers: { 'Authentication': authToken }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async sendAlertMessage(alertId: string, message: MessageCongressRequest, authToken: string): Promise<ServiceResult<SuccessResponse>> {
    try {
      const formData = new URLSearchParams();
      Object.entries(message).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach(item => formData.append(key, item.toString()));
        } else if (value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      const response = await this.axiosService.post<SuccessResponse>(`/alert/${alertId}/message/congress/write`, formData, {
        headers: { 
          'Authentication': authToken,
          'Content-Type': 'application/x-www-form-urlencoded' 
        }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async resendMessage(messageLogId: number, authToken: string): Promise<ServiceResult<SuccessResponse>> {
    try {
      const response = await this.axiosService.post<SuccessResponse>(`/message/resend/${messageLogId}`, null, {
        headers: { 'Authentication': authToken }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getUserMessages(authToken: string): Promise<ServiceResult<UserMessagesResponse>> {
    try {
      const response = await this.axiosService.get<UserMessagesResponse>('/my/messages', {
        headers: { 'Authentication': authToken }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  // ============================================================================
  // Alerts Endpoints
  // ============================================================================

  async getAlerts(params?: GetAlertsParams, authToken?: string): Promise<ServiceResult<AlertsResponse>> {
    try {
      const queryParams = params ? new URLSearchParams(params as any).toString() : '';
      const url = `/alerts${queryParams ? `?${queryParams}` : ''}`;
      const config = authToken ? { headers: { 'Authentication': authToken } } : undefined;
      
      const response = await this.axiosService.get<AlertsResponse>(url, config);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getAlertById(alertId: string, params?: GetAlertParams, authToken?: string): Promise<ServiceResult<AlertResponse>> {
    try {
      const queryParams = params ? new URLSearchParams(params as any).toString() : '';
      const url = `/alert/${alertId}${queryParams ? `?${queryParams}` : ''}`;
      const config = authToken ? { headers: { 'Authentication': authToken } } : undefined;
      
      const response = await this.axiosService.get<AlertResponse>(url, config);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  // ============================================================================
  // Campaigns Endpoints
  // ============================================================================

  async getCampaigns(authToken: string): Promise<ServiceResult<CampaignsResponse>> {
    try {
      const response = await this.axiosService.get<CampaignsResponse>('/campaigns', {
        headers: { 'Authentication': authToken }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getCampaignById(campaignId: number, authToken: string): Promise<ServiceResult<CampaignResponse>> {
    try {
      const response = await this.axiosService.get<CampaignResponse>(`/campaign/${campaignId}`, {
        headers: { 'Authentication': authToken }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getCampaignAlerts(campaignId: number, authToken: string): Promise<ServiceResult<AlertsResponse>> {
    try {
      const response = await this.axiosService.get<AlertsResponse>(`/campaign/${campaignId}/alerts`, {
        headers: { 'Authentication': authToken }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  // ============================================================================
  // Publications Endpoints
  // ============================================================================

  async getPublications(authToken: string): Promise<ServiceResult<PublicationsResponse>> {
    try {
      const response = await this.axiosService.get<PublicationsResponse>('/publications', {
        headers: { 'Authentication': authToken }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getPublicationArticles(publicationId: string, params?: GetPublicationArticlesParams, authToken?: string): Promise<ServiceResult<PublicationArticlesResponse>> {
    try {
      const queryParams = params ? new URLSearchParams(params as any).toString() : '';
      const url = `/publication/${publicationId}${queryParams ? `?${queryParams}` : ''}`;
      const config = authToken ? { headers: { 'Authentication': authToken } } : undefined;
      
      const response = await this.axiosService.get<PublicationArticlesResponse>(url, config);
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getArticleById(articleId: string, authToken: string): Promise<ServiceResult<ArticleResponse>> {
    try {
      const response = await this.axiosService.get<ArticleResponse>(`/article/${articleId}`, {
        headers: { 'Authentication': authToken }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  // ============================================================================
  // TanStack Query Integration Methods
  // ============================================================================

  /**
   * Get front page data with TanStack Query caching
   */
  useFrontPage(): UseQueryResult<FrontPageResponse, Error> {
    return useQuery({
      queryKey: ['nwyc', 'frontpage'],
      queryFn: async () => {
        const result = await this.getFrontPage();
        if (!result.success) {
          throw new Error(result.error);
        }
        return result.data;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  }

  /**
   * Get topics with TanStack Query caching
   */
  useTopics(params?: GetTopicsParams, authToken?: string): UseQueryResult<TopicsResponse, Error> {
    return useQuery({
      queryKey: ['nwyc', 'topics', params],
      queryFn: async () => {
        const result = await this.getAllTopics(params, authToken);
        if (!result.success) {
          throw new Error(result.error);
        }
        return result.data;
      },
      enabled: !!authToken,
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  }

  /**
   * Get alerts with TanStack Query caching
   */
  useAlerts(params?: GetAlertsParams, authToken?: string): UseQueryResult<AlertsResponse, Error> {
    return useQuery({
      queryKey: ['nwyc', 'alerts', params],
      queryFn: async () => {
        const result = await this.getAlerts(params, authToken);
        if (!result.success) {
          throw new Error(result.error);
        }
        return result.data;
      },
      enabled: !!authToken,
      staleTime: 2 * 60 * 1000, // 2 minutes
    });
  }

  /**
   * Login mutation with TanStack Query
   */
  useLogin(): UseMutationResult<SuccessResponse, Error, LoginRequest> {
    return useMutation({
      mutationFn: async (credentials: LoginRequest) => {
        const result = await this.login(credentials);
        if (!result.success) {
          throw new Error(result.error);
        }
        return result.data;
      },
    });
  }

  /**
   * Send message to Congress mutation
   */
  useSendMessage(authToken: string): UseMutationResult<SuccessResponse, Error, MessageCongressRequest> {
    return useMutation({
      mutationFn: async (message: MessageCongressRequest) => {
        const result = await this.sendMessageToCongress(message, authToken);
        if (!result.success) {
          throw new Error(result.error);
        }
        return result.data;
      },
    });
  }

  /**
   * Vote in poll mutation
   */
  useVoteInPoll(authToken: string): UseMutationResult<PollResponse, Error, number> {
    return useMutation({
      mutationFn: async (choiceId: number) => {
        const result = await this.voteInPoll(choiceId, authToken);
        if (!result.success) {
          throw new Error(result.error);
        }
        return result.data;
      },
    });
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  private handleError(error: any): string {
    if (error instanceof Error) {
      return error.message;
    }
    
    if (typeof error === 'string') {
      return error;
    }
    
    return 'An unknown error occurred while making the API request';
  }
}
