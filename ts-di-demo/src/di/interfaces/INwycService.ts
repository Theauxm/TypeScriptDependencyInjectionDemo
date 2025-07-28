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
 * Interface for the NWYC (National Write Your Congressman) service.
 * Provides methods for all API endpoints including authentication, content management,
 * legislative information, alerts, campaigns, and user management.
 */
export interface INwycService {
  // ============================================================================
  // AUTHENTICATION METHODS
  // ============================================================================

  /**
   * Get login form
   */
  getLoginForm(): Promise<ApiResult<LoginResponse>>;

  /**
   * Authenticate user with username/email and password
   */
  login(credentials: LoginRequest): Promise<ApiResult<SuccessResponse>>;

  /**
   * Authenticate and get comprehensive user data
   */
  authenticate(params?: { redirect?: string; quick?: boolean }): Promise<ApiResult<AuthenticateResponse>>;

  /**
   * Authenticate via POST with user data
   */
  authenticatePost(data: { redirect?: string; quick?: boolean }): Promise<ApiResult<AuthenticateResponse>>;

  // ============================================================================
  // CONTENT METHODS
  // ============================================================================

  /**
   * Get front page content including featured alerts and testimonials
   */
  getFrontPage(): Promise<ApiResult<FrontPageResponse>>;

  /**
   * Get default talking points for messaging
   */
  getDefaultTalkingPoints(): Promise<ApiResult<TalkingPoint[]>>;

  // ============================================================================
  // TOPIC METHODS
  // ============================================================================

  /**
   * Get all available topics with optional pagination and filtering
   */
  getAllTopics(params?: GetTopicsParams): Promise<ApiResult<TopicsResponse>>;

  /**
   * Get all topics via POST
   */
  getAllTopicsPost(params?: GetTopicsParams): Promise<ApiResult<TopicsResponse>>;

  /**
   * Get a specific topic by ID
   */
  getTopicById(topicId: number): Promise<ApiResult<TopicResponse>>;

  /**
   * Add a topic to the authenticated user's interests
   */
  addUserTopic(topicId: number): Promise<ApiResult<UserTopicsResponse>>;

  /**
   * Remove a topic from the authenticated user's interests
   */
  removeUserTopic(topicId: number): Promise<ApiResult<UserTopicsResponse>>;

  // ============================================================================
  // POLL METHODS
  // ============================================================================

  /**
   * Get all active polls with pagination
   */
  getActivePolls(params?: GetPollsParams): Promise<ApiResult<PollsResponse>>;

  /**
   * Get all polls for the current service
   */
  getAllPolls(params?: GetPollsParams): Promise<ApiResult<PollsResponse>>;

  /**
   * Get a specific poll by ID
   */
  getPollById(pollId: number): Promise<ApiResult<PollResponse>>;

  /**
   * Get poll details (alternative endpoint)
   */
  getPollDetails(pollId: number): Promise<ApiResult<PollResponse>>;

  /**
   * Vote in a poll by choice ID
   */
  voteInPollByChoice(choiceId: number): Promise<ApiResult<PollResponse>>;

  /**
   * Vote in a specific poll
   */
  voteInPoll(pollId: number, voteData: PollVoteRequest): Promise<ApiResult<PollResponse>>;

  // ============================================================================
  // LEGISLATIVE METHODS
  // ============================================================================

  /**
   * Find legislative districts for a given address
   */
  getDistrictsByAddress(address: string): Promise<ApiResult<DistrictsResponse>>;

  /**
   * Find districts by address via POST
   */
  getDistrictsByAddressPost(address: string): Promise<ApiResult<DistrictsResponse>>;

  /**
   * Get the authenticated user's elected representatives
   */
  getMyRepresentatives(): Promise<ApiResult<string>>;

  /**
   * Search for legislators with various filters
   */
  searchLegislators(params?: LegislatorSearchParams): Promise<ApiResult<string>>;

  /**
   * AJAX endpoint for searching legislators
   */
  searchLegislatorsAjax(params?: LegislatorSearchParams): Promise<ApiResult<LegislatorSearchResponse>>;

  // ============================================================================
  // SEARCH METHODS
  // ============================================================================

  /**
   * Search across content types (alerts, articles, bills, legislators)
   */
  searchContent(params: SearchParams): Promise<ApiResult<SearchResponse>>;

  // ============================================================================
  // ALERT METHODS
  // ============================================================================

  /**
   * Get a list of available action alerts
   */
  getAlerts(params?: GetAlertsParams): Promise<ApiResult<AlertsResponse>>;

  /**
   * Get a specific action alert by ID or slug
   */
  getAlert(alertId: string, params?: GetAlertParams): Promise<ApiResult<AlertResponse>>;

  // ============================================================================
  // MESSAGE CONGRESS METHODS
  // ============================================================================

  /**
   * Get the form for writing messages to Congress
   */
  getMessageCongressForm(params?: MessageCongressParams): Promise<ApiResult<MessageFormResponse>>;

  /**
   * Send a message to elected representatives
   */
  sendMessageToCongress(message: MessageCongressRequest): Promise<ApiResult<SuccessResponse>>;

  /**
   * Get alert-specific message form
   */
  getAlertMessageForm(alertId: string): Promise<ApiResult<MessageFormResponse>>;

  /**
   * Send alert-specific message to representatives
   */
  sendAlertMessage(alertId: string, message: MessageCongressRequest): Promise<ApiResult<SuccessResponse>>;

  /**
   * Resend a previously sent message
   */
  resendMessage(messageLogId: number): Promise<ApiResult<SuccessResponse>>;

  // ============================================================================
  // USER MESSAGE METHODS
  // ============================================================================

  /**
   * Get the authenticated user's message history
   */
  getUserMessages(): Promise<ApiResult<UserMessagesResponse>>;

  // ============================================================================
  // CAMPAIGN METHODS
  // ============================================================================

  /**
   * Get available campaigns for the user
   */
  getCampaigns(): Promise<ApiResult<CampaignsResponse>>;

  /**
   * Get detailed information about a specific campaign
   */
  getCampaign(campaignId: number): Promise<ApiResult<CampaignResponse>>;

  /**
   * Get alerts for a specific campaign
   */
  getCampaignAlerts(campaignId: number): Promise<ApiResult<AlertsResponse>>;

  // ============================================================================
  // PUBLICATION METHODS
  // ============================================================================

  /**
   * Get available publications
   */
  getPublications(): Promise<ApiResult<PublicationsResponse>>;

  /**
   * Get articles for a specific publication
   */
  getPublicationArticles(publicationId: string, params?: GetPublicationArticlesParams): Promise<ApiResult<PublicationArticlesResponse>>;

  /**
   * Get a specific article by ID or slug
   */
  getArticle(articleId: string): Promise<ApiResult<ArticleResponse>>;

  // ============================================================================
  // USER PROFILE METHODS
  // ============================================================================

  /**
   * Get user settings page
   */
  getUserSettings(): Promise<ApiResult<string>>;

  /**
   * Get user profile editing form
   */
  getUserProfile(): Promise<ApiResult<UserProfileResponse>>;

  /**
   * Update the authenticated user's profile information
   */
  updateUserProfile(profileData: UserProfileUpdate): Promise<ApiResult<SuccessResponse>>;

  /**
   * Get the most recent billing receipt for the user
   */
  getBillingReceipt(): Promise<ApiResult<string>>;

  /**
   * Download a specific receipt as PDF
   */
  downloadReceipt(receiptId: number): Promise<ApiResult<Blob>>;

  /**
   * Get user email preferences
   */
  getEmailSettings(params?: EmailSettingsParams): Promise<ApiResult<string>>;

  /**
   * Update user email preferences
   */
  updateEmailSettings(settings: EmailSettingsUpdate): Promise<ApiResult<SuccessResponse>>;

  // ============================================================================
  // AUTHENTICATION TOKEN MANAGEMENT
  // ============================================================================

  /**
   * Set the authentication token for API requests
   */
  setAuthToken(token: string | null): void;

  /**
   * Get the current authentication token
   */
  getAuthToken(): string | null;
}
