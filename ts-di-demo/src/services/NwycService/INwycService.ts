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
 * Interface for NWYC API service operations.
 * This interface provides methods for all NWYC API endpoints as defined in the OpenAPI specification.
 * The service is stateless and requires authentication tokens to be passed as parameters where needed.
 */
export interface INwycService {
  // ============================================================================
  // Authentication Endpoints
  // ============================================================================

  /**
   * Get login form
   * GET /login
   */
  getLoginForm(): Promise<ServiceResult<LoginResponse>>;

  /**
   * Authenticate user with credentials
   * POST /login
   */
  login(credentials: LoginRequest): Promise<ServiceResult<SuccessResponse>>;

  /**
   * Authenticate and get user data
   * GET /authenticate
   */
  authenticate(params?: GetAuthenticateParams, authToken?: string): Promise<ServiceResult<AuthenticateResponse>>;

  /**
   * Authenticate and get user data (POST)
   * POST /authenticate
   */
  authenticatePost(params?: GetAuthenticateParams, authToken?: string): Promise<ServiceResult<AuthenticateResponse>>;

  // ============================================================================
  // Content Endpoints
  // ============================================================================

  /**
   * Get front page content
   * GET /frontpage
   */
  getFrontPage(): Promise<ServiceResult<FrontPageResponse>>;

  /**
   * Get default talking points
   * GET /default/talkingpoints
   */
  getDefaultTalkingPoints(authToken: string): Promise<ServiceResult<TalkingPoint[]>>;

  // ============================================================================
  // Legislative Endpoints
  // ============================================================================

  /**
   * Get districts by address
   * GET /districts/by_address
   */
  getDistrictsByAddress(address: string, authToken: string): Promise<ServiceResult<DistrictsResponse>>;

  /**
   * Get districts by address (POST)
   * POST /districts/by_address
   */
  getDistrictsByAddressPost(address: string, authToken: string): Promise<ServiceResult<DistrictsResponse>>;

  /**
   * Get user's representatives
   * GET /elected_officials/my_reps
   */
  getUserRepresentatives(authToken: string): Promise<ServiceResult<string>>;

  /**
   * Search legislators
   * GET /elected_officials/search
   */
  searchLegislators(params: GetLegislatorSearchParams, authToken: string): Promise<ServiceResult<string>>;

  /**
   * AJAX legislator search
   * GET /elected_officials/search/ajax
   */
  searchLegislatorsAjax(params: GetLegislatorSearchParams, authToken: string): Promise<ServiceResult<LegislatorSearchResponse>>;

  // ============================================================================
  // Topics Endpoints
  // ============================================================================

  /**
   * Get all topics
   * GET /topics/all
   */
  getAllTopics(params?: GetTopicsParams, authToken?: string): Promise<ServiceResult<TopicsResponse>>;

  /**
   * Get all topics (POST)
   * POST /topics/all
   */
  getAllTopicsPost(params?: GetTopicsParams, authToken?: string): Promise<ServiceResult<TopicsResponse>>;

  /**
   * Get topic by ID
   * GET /topic/get/{topic_id}
   */
  getTopicById(topicId: number, authToken: string): Promise<ServiceResult<TopicResponse>>;

  /**
   * Add topic to user
   * POST /user/topic/add/{topic_id}
   */
  addUserTopic(topicId: number, authToken: string): Promise<ServiceResult<UserTopicsResponse>>;

  /**
   * Remove topic from user
   * POST /user/topic/delete/{topic_id}
   */
  removeUserTopic(topicId: number, authToken: string): Promise<ServiceResult<UserTopicsResponse>>;

  // ============================================================================
  // Polls Endpoints
  // ============================================================================

  /**
   * Get active polls
   * GET /polls/active
   */
  getActivePolls(params?: GetPollsParams, authToken?: string): Promise<ServiceResult<PollsResponse>>;

  /**
   * Get all polls
   * GET /polls
   */
  getAllPolls(params?: GetPollsParams, authToken?: string): Promise<ServiceResult<PollsResponse>>;

  /**
   * Get poll by ID
   * GET /poll/get/{poll_id}
   */
  getPollById(pollId: number, authToken: string): Promise<ServiceResult<PollResponse>>;

  /**
   * Get poll details
   * GET /poll/{poll_id}
   */
  getPollDetails(pollId: number, authToken: string): Promise<ServiceResult<PollResponse>>;

  /**
   * Vote in poll (by choice ID)
   * POST /poll/vote/{choice_id}
   */
  voteInPoll(choiceId: number, authToken: string): Promise<ServiceResult<PollResponse>>;

  /**
   * Vote in poll (by poll ID)
   * POST /poll/{poll_id}/vote
   */
  voteInPollById(pollId: number, choices: PollVoteRequest, authToken: string): Promise<ServiceResult<PollResponse>>;

  // ============================================================================
  // User Settings Endpoints
  // ============================================================================

  /**
   * Get user settings page
   * GET /settings
   */
  getUserSettings(authToken: string): Promise<ServiceResult<string>>;

  /**
   * Get user profile form
   * GET /settings/profile
   */
  getUserProfile(authToken: string): Promise<ServiceResult<UserProfileResponse>>;

  /**
   * Update user profile
   * POST /settings/profile
   */
  updateUserProfile(profile: UserProfileUpdate, authToken: string): Promise<ServiceResult<SuccessResponse>>;

  /**
   * Get billing receipt
   * GET /settings/billing
   */
  getBillingReceipt(authToken: string): Promise<ServiceResult<string>>;

  /**
   * Download receipt PDF
   * GET /settings/receipt/download/{receipt_id}
   */
  downloadReceipt(receiptId: number, authToken: string): Promise<ServiceResult<Blob>>;

  /**
   * Get email settings
   * GET /user/emailsettings
   */
  getEmailSettings(params?: GetEmailSettingsParams, authToken?: string): Promise<ServiceResult<string>>;

  /**
   * Update email settings
   * POST /user/emailsettings
   */
  updateEmailSettings(settings: EmailSettingsUpdate, authToken: string): Promise<ServiceResult<SuccessResponse>>;

  // ============================================================================
  // Search Endpoints
  // ============================================================================

  /**
   * Search across content types
   * GET /search/results
   */
  searchContent(params: GetSearchParams, authToken: string): Promise<ServiceResult<SearchResponse>>;

  // ============================================================================
  // Message Congress Endpoints
  // ============================================================================

  /**
   * Get message congress form
   * GET /message/congress/write
   */
  getMessageCongressForm(params?: GetMessageFormParams, authToken?: string): Promise<ServiceResult<MessageFormResponse>>;

  /**
   * Send message to Congress
   * POST /message/congress/write
   */
  sendMessageToCongress(message: MessageCongressRequest, authToken: string): Promise<ServiceResult<SuccessResponse>>;

  /**
   * Get alert-specific message form
   * GET /alert/{alert_id}/message/congress/write
   */
  getAlertMessageForm(alertId: string, authToken: string): Promise<ServiceResult<MessageFormResponse>>;

  /**
   * Send alert-specific message
   * POST /alert/{alert_id}/message/congress/write
   */
  sendAlertMessage(alertId: string, message: MessageCongressRequest, authToken: string): Promise<ServiceResult<SuccessResponse>>;

  /**
   * Resend message
   * POST /message/resend/{message_log_id}
   */
  resendMessage(messageLogId: number, authToken: string): Promise<ServiceResult<SuccessResponse>>;

  /**
   * Get user message history
   * GET /my/messages
   */
  getUserMessages(authToken: string): Promise<ServiceResult<UserMessagesResponse>>;

  // ============================================================================
  // Alerts Endpoints
  // ============================================================================

  /**
   * List action alerts
   * GET /alerts
   */
  getAlerts(params?: GetAlertsParams, authToken?: string): Promise<ServiceResult<AlertsResponse>>;

  /**
   * Get specific alert
   * GET /alert/{alert_id}
   */
  getAlertById(alertId: string, params?: GetAlertParams, authToken?: string): Promise<ServiceResult<AlertResponse>>;

  // ============================================================================
  // Campaigns Endpoints
  // ============================================================================

  /**
   * List campaigns
   * GET /campaigns
   */
  getCampaigns(authToken: string): Promise<ServiceResult<CampaignsResponse>>;

  /**
   * Get campaign details
   * GET /campaign/{campaign_id}
   */
  getCampaignById(campaignId: number, authToken: string): Promise<ServiceResult<CampaignResponse>>;

  /**
   * Get campaign alerts
   * GET /campaign/{campaign_id}/alerts
   */
  getCampaignAlerts(campaignId: number, authToken: string): Promise<ServiceResult<AlertsResponse>>;

  // ============================================================================
  // Publications Endpoints
  // ============================================================================

  /**
   * List publications
   * GET /publications
   */
  getPublications(authToken: string): Promise<ServiceResult<PublicationsResponse>>;

  /**
   * Get publication articles
   * GET /publication/{publication_id}
   */
  getPublicationArticles(publicationId: string, params?: GetPublicationArticlesParams, authToken?: string): Promise<ServiceResult<PublicationArticlesResponse>>;

  /**
   * Get article
   * GET /article/{article_id}
   */
  getArticleById(articleId: string, authToken: string): Promise<ServiceResult<ArticleResponse>>;
}
