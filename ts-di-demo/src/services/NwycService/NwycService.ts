import { Injectable } from '../../di-lib/decorators';
import { INwycService } from './INwycService';
import { IAxiosService } from '../AxiosService/IAxiosService';
import { serviceContainer } from '../../di-lib/ServiceContainer';
import { useQuery, useMutation, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { HttpMethod, RequestOptions } from '../../types/HttpTypes';
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
  // Private Request Helper Method
  // ============================================================================

  /**
   * Private method to handle all HTTP requests with consistent query parameter and header handling.
   * Automatically adds format=json to all requests and handles authentication headers.
   */
  private async makeRequest<T>(
    method: HttpMethod,
    url: string,
    options: RequestOptions = {}
  ): Promise<T> {
    // 1. Build query parameters (always include format=json)
    const allQueryParams = {
      format: 'json',
      ...options.queryParams
    };
    
    // 2. Construct URL with query parameters
    const queryString = new URLSearchParams(
      Object.entries(allQueryParams).map(([key, value]) => [key, String(value)])
    ).toString();
    const fullUrl = `${url}${queryString ? `?${queryString}` : ''}`;
    
    // 3. Build headers (include auth token if provided)
    const headers = {
      ...options.headers,
      ...(options.authToken && { 'Authentication': options.authToken })
    };
    
    // 4. Make the request based on HTTP method
    switch (method) {
      case HttpMethod.GET:
        return await this.axiosService.get<T>(fullUrl, { headers });
      case HttpMethod.POST:
        return await this.axiosService.post<T>(fullUrl, options.data, { headers });
      case HttpMethod.PUT:
        return await this.axiosService.put<T>(fullUrl, options.data, { headers });
      case HttpMethod.DELETE:
        return await this.axiosService.delete<T>(fullUrl, { headers });
      case HttpMethod.PATCH:
        return await this.axiosService.patch<T>(fullUrl, options.data, { headers });
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }

  // ============================================================================
  // Authentication Endpoints
  // ============================================================================

  async getLoginForm(): Promise<ServiceResult<LoginResponse>> {
    try {
      const response = await this.makeRequest<LoginResponse>(HttpMethod.GET, '/login');
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async login(credentials: LoginRequest): Promise<ServiceResult<SuccessResponse>> {
    try {
      const formData = new URLSearchParams();
      formData.append('user', credentials.user);
      formData.append('password', credentials.password);

      const response = await this.makeRequest<SuccessResponse>(HttpMethod.POST, '/login', {
        data: formData,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async authenticate(params?: GetAuthenticateParams, authToken?: string): Promise<ServiceResult<AuthenticateResponse>> {
    try {
      const response = await this.makeRequest<AuthenticateResponse>(HttpMethod.GET, '/authenticate', {
        queryParams: params as Record<string, string | number | boolean>,
        authToken
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async authenticatePost(params?: GetAuthenticateParams, authToken?: string): Promise<ServiceResult<AuthenticateResponse>> {
    try {
      const formData = params ? new URLSearchParams(params as any) : undefined;
      
      const response = await this.makeRequest<AuthenticateResponse>(HttpMethod.POST, '/authenticate', {
        data: formData,
        authToken,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
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
      const response = await this.makeRequest<FrontPageResponse>(HttpMethod.GET, '/frontpage');
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getDefaultTalkingPoints(authToken: string): Promise<ServiceResult<TalkingPoint[]>> {
    try {
      const response = await this.makeRequest<TalkingPoint[]>(HttpMethod.GET, '/default/talkingpoints', {
        authToken
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
      const response = await this.makeRequest<DistrictsResponse>(HttpMethod.GET, '/districts/by_address', {
        queryParams: { address },
        authToken
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getDistrictsByAddressPost(address: string, authToken: string): Promise<ServiceResult<DistrictsResponse>> {
    try {
      const formData = new URLSearchParams({ address });
      const response = await this.makeRequest<DistrictsResponse>(HttpMethod.POST, '/districts/by_address', {
        data: formData,
        authToken,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getUserRepresentatives(authToken: string): Promise<ServiceResult<string>> {
    try {
      const response = await this.makeRequest<string>(HttpMethod.GET, '/elected_officials/my_reps', {
        authToken
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async searchLegislators(params: GetLegislatorSearchParams, authToken: string): Promise<ServiceResult<string>> {
    try {
      const response = await this.makeRequest<string>(HttpMethod.GET, '/elected_officials/search', {
        queryParams: params as Record<string, string | number | boolean>,
        authToken
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async searchLegislatorsAjax(params: GetLegislatorSearchParams, authToken: string): Promise<ServiceResult<LegislatorSearchResponse>> {
    try {
      const response = await this.makeRequest<LegislatorSearchResponse>(HttpMethod.GET, '/elected_officials/search/ajax', {
        queryParams: params as Record<string, string | number | boolean>,
        authToken
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
      const response = await this.makeRequest<TopicsResponse>(HttpMethod.GET, '/topics/all', {
        queryParams: params as Record<string, string | number | boolean>,
        authToken
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getAllTopicsPost(params?: GetTopicsParams, authToken?: string): Promise<ServiceResult<TopicsResponse>> {
    try {
      const formData = params ? new URLSearchParams(params as any) : undefined;
      const response = await this.makeRequest<TopicsResponse>(HttpMethod.POST, '/topics/all', {
        data: formData,
        authToken,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getTopicById(topicId: number, authToken: string): Promise<ServiceResult<TopicResponse>> {
    try {
      const response = await this.makeRequest<TopicResponse>(HttpMethod.GET, `/topic/get/${topicId}`, {
        authToken
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async addUserTopic(topicId: number, authToken: string): Promise<ServiceResult<UserTopicsResponse>> {
    try {
      const response = await this.makeRequest<UserTopicsResponse>(HttpMethod.POST, `/user/topic/add/${topicId}`, {
        authToken
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async removeUserTopic(topicId: number, authToken: string): Promise<ServiceResult<UserTopicsResponse>> {
    try {
      const response = await this.makeRequest<UserTopicsResponse>(HttpMethod.POST, `/user/topic/delete/${topicId}`, {
        authToken
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
      const response = await this.makeRequest<PollsResponse>(HttpMethod.GET, '/polls/active', {
        queryParams: params as Record<string, string | number | boolean>,
        authToken
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getAllPolls(params?: GetPollsParams, authToken?: string): Promise<ServiceResult<PollsResponse>> {
    try {
      const response = await this.makeRequest<PollsResponse>(HttpMethod.GET, '/polls', {
        queryParams: params as Record<string, string | number | boolean>,
        authToken
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getPollById(pollId: number, authToken: string): Promise<ServiceResult<PollResponse>> {
    try {
      const response = await this.makeRequest<PollResponse>(HttpMethod.GET, `/poll/get/${pollId}`, {
        authToken
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getPollDetails(pollId: number, authToken: string): Promise<ServiceResult<PollResponse>> {
    try {
      const response = await this.makeRequest<PollResponse>(HttpMethod.GET, `/poll/${pollId}`, {
        authToken
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async voteInPoll(choiceId: number, authToken: string): Promise<ServiceResult<PollResponse>> {
    try {
      const response = await this.makeRequest<PollResponse>(HttpMethod.POST, `/poll/vote/${choiceId}`, {
        authToken
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
      
      const response = await this.makeRequest<PollResponse>(HttpMethod.POST, `/poll/${pollId}/vote`, {
        data: formData,
        authToken,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
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
      const response = await this.makeRequest<string>(HttpMethod.GET, '/settings', {
        authToken
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getUserProfile(authToken: string): Promise<ServiceResult<UserProfileResponse>> {
    try {
      const response = await this.makeRequest<UserProfileResponse>(HttpMethod.GET, '/settings/profile', {
        authToken
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async updateUserProfile(profile: UserProfileUpdate, authToken: string): Promise<ServiceResult<SuccessResponse>> {
    try {
      const formData = new URLSearchParams(profile as any);
      const response = await this.makeRequest<SuccessResponse>(HttpMethod.POST, '/settings/profile', {
        data: formData,
        authToken,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getBillingReceipt(authToken: string): Promise<ServiceResult<string>> {
    try {
      const response = await this.makeRequest<string>(HttpMethod.GET, '/settings/billing', {
        authToken
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async downloadReceipt(receiptId: number, authToken: string): Promise<ServiceResult<Blob>> {
    try {
      const response = await this.makeRequest<Blob>(HttpMethod.GET, `/settings/receipt/download/${receiptId}`, {
        authToken,
        headers: { responseType: 'blob' }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getEmailSettings(params?: GetEmailSettingsParams, authToken?: string): Promise<ServiceResult<string>> {
    try {
      const response = await this.makeRequest<string>(HttpMethod.GET, '/user/emailsettings', {
        queryParams: params as Record<string, string | number | boolean>,
        authToken
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async updateEmailSettings(settings: EmailSettingsUpdate, authToken: string): Promise<ServiceResult<SuccessResponse>> {
    try {
      const formData = new URLSearchParams(settings as any);
      const response = await this.makeRequest<SuccessResponse>(HttpMethod.POST, '/user/emailsettings', {
        data: formData,
        authToken,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
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
      const response = await this.makeRequest<SearchResponse>(HttpMethod.GET, '/search/results', {
        queryParams: params as unknown as Record<string, string | number | boolean>,
        authToken
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
      const response = await this.makeRequest<MessageFormResponse>(HttpMethod.GET, '/message/congress/write', {
        queryParams: params as unknown as Record<string, string | number | boolean>,
        authToken
      });
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

      const response = await this.makeRequest<SuccessResponse>(HttpMethod.POST, '/message/congress/write', {
        data: formData,
        authToken,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getAlertMessageForm(alertId: string, authToken: string): Promise<ServiceResult<MessageFormResponse>> {
    try {
      const response = await this.makeRequest<MessageFormResponse>(HttpMethod.GET, `/alert/${alertId}/message/congress/write`, {
        authToken
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

      const response = await this.makeRequest<SuccessResponse>(HttpMethod.POST, `/alert/${alertId}/message/congress/write`, {
        data: formData,
        authToken,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async resendMessage(messageLogId: number, authToken: string): Promise<ServiceResult<SuccessResponse>> {
    try {
      const response = await this.makeRequest<SuccessResponse>(HttpMethod.POST, `/message/resend/${messageLogId}`, {
        authToken
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getUserMessages(authToken: string): Promise<ServiceResult<UserMessagesResponse>> {
    try {
      const response = await this.makeRequest<UserMessagesResponse>(HttpMethod.GET, '/my/messages', {
        authToken
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
      const response = await this.makeRequest<AlertsResponse>(HttpMethod.GET, '/alerts', {
        queryParams: params as unknown as Record<string, string | number | boolean>,
        authToken
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getAlertById(alertId: string, params?: GetAlertParams, authToken?: string): Promise<ServiceResult<AlertResponse>> {
    try {
      const response = await this.makeRequest<AlertResponse>(HttpMethod.GET, `/alert/${alertId}`, {
        queryParams: params as unknown as Record<string, string | number | boolean>,
        authToken
      });
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
      const response = await this.makeRequest<CampaignsResponse>(HttpMethod.GET, '/campaigns', {
        authToken
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getCampaignById(campaignId: number, authToken: string): Promise<ServiceResult<CampaignResponse>> {
    try {
      const response = await this.makeRequest<CampaignResponse>(HttpMethod.GET, `/campaign/${campaignId}`, {
        authToken
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getCampaignAlerts(campaignId: number, authToken: string): Promise<ServiceResult<AlertsResponse>> {
    try {
      const response = await this.makeRequest<AlertsResponse>(HttpMethod.GET, `/campaign/${campaignId}/alerts`, {
        authToken
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
      const response = await this.makeRequest<PublicationsResponse>(HttpMethod.GET, '/publications', {
        authToken
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getPublicationArticles(publicationId: string, params?: GetPublicationArticlesParams, authToken?: string): Promise<ServiceResult<PublicationArticlesResponse>> {
    try {
      const response = await this.makeRequest<PublicationArticlesResponse>(HttpMethod.GET, `/publication/${publicationId}`, {
        queryParams: params as unknown as Record<string, string | number | boolean>,
        authToken
      });
      return { success: true, data: response };
    } catch (error) {
      return { success: false, error: this.handleError(error) };
    }
  }

  async getArticleById(articleId: string, authToken: string): Promise<ServiceResult<ArticleResponse>> {
    try {
      const response = await this.makeRequest<ArticleResponse>(HttpMethod.GET, `/article/${articleId}`, {
        authToken
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

  private handleError(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    
    if (typeof error === 'string') {
      return error;
    }
    
    return 'An unknown error occurred while making the API request';
  }
}
