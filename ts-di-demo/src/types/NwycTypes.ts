// NWYC API TypeScript Types
// Generated from OpenAPI 3.0.3 specification

// ============================================================================
// COMMON RESPONSE TYPES
// ============================================================================

export interface SuccessResponse {
  status: string;
  message: string;
  data?: any;
}

export interface ErrorResponse {
  status: string;
  message: string;
  data?: any;
}

export interface ValidationErrorResponse {
  status: string;
  message: string;
  data: {
    errors: Record<string, string[]>;
  };
}

// ============================================================================
// AUTHENTICATION TYPES
// ============================================================================

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    login_to?: string;
    idp_client_id?: string;
    idp_client_region?: string;
  };
}

export interface AuthenticateResponse {
  status: string;
  message: string;
  data: {
    user: UserProfile;
    lobbyday?: LobbyDay;
    lobbydays?: LobbyDay[];
    campaigns?: Campaign[];
    appsponsors?: AppSponsor[];
  };
}

export interface UserProfile {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  salutation?: string;
  home_address1?: string;
  home_address2?: string;
  home_city?: string;
  home_state?: string;
  home_zip?: string;
  cell_phone?: string;
  representatives?: Legislator[];
}

export interface UserProfileResponse {
  status: string;
  data: {
    user: UserProfile;
  };
}

export interface UserProfileUpdate {
  firstname?: string;
  lastname?: string;
  email?: string;
  salutation?: string;
  home_address1?: string;
  home_address2?: string;
  home_city?: string;
  home_state?: string;
  home_zip?: string;
  cell_phone?: string;
}

export interface EmailSettingsUpdate {
  coreBallotDelivery?: 'email' | 'fax' | 'mail';
  rnpDelivery?: 'email' | 'fax' | 'mail';
  taxFaxDelivery?: 'email' | 'fax' | 'mail';
  memberRequestsNoEmail?: 'on';
}

// ============================================================================
// CONTENT TYPES
// ============================================================================

export interface Testimonial {
  id: number;
  name: string;
  title: string;
  company: string;
  testimonial: string;
  image_url: string;
}

export interface FrontPageResponse {
  status: string;
  data: {
    testimonials: Testimonial[];
    alerts: Alert[];
  };
}

export interface TalkingPoint {
  sort_order: number;
  talkingpoint: string;
}

// ============================================================================
// TOPIC TYPES
// ============================================================================

export interface Topic {
  id: number;
  name: string;
  featured: boolean;
  image_url?: string;
  knowwho_issue_id?: number;
}

export interface TopicsResponse {
  status: string;
  data: {
    total_results: number;
    topics: Topic[];
  };
}

export interface TopicResponse {
  status: string;
  data: Topic;
}

export interface UserTopicsResponse {
  status: string;
  message: string;
  data: {
    topics: Topic[];
  };
}

// ============================================================================
// POLL TYPES
// ============================================================================

export interface PollChoice {
  id: number;
  choice: string;
  votes: number;
}

export interface Poll {
  id: number;
  question: string;
  description?: string;
  start_date: string;
  end_date?: string;
  active: boolean;
  choices: PollChoice[];
  user_vote?: number;
}

export interface PollsResponse {
  status: string;
  data: {
    total_results: number;
    polls: Poll[];
  };
}

export interface PollResponse {
  status: string;
  data: Poll;
}

export interface PollVoteRequest {
  choice_key: string[];
}

// ============================================================================
// LEGISLATIVE TYPES
// ============================================================================

export interface DistrictsResponse {
  status: string;
  data: {
    districts: string[];
  };
}

export interface LegislatorAddress {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  room?: string;
  phones: Array<{
    type: 'Phone' | 'Fax';
    number: string;
  }>;
}

export interface Legislator {
  id: number;
  firstname: string;
  lastname: string;
  full_name: string;
  title: string;
  title_abbr: string;
  party: string;
  gender: string;
  image: string;
  image_url: string;
  email: string;
  url: string;
  state: string;
  type: string;
  district: {
    type: string;
    state: string;
    district: string;
  };
  addresses: LegislatorAddress[];
}

export interface LegislatorSearchResponse {
  status: string;
  data: {
    legislators: Legislator[];
    total_results: number;
  };
}

// ============================================================================
// SEARCH TYPES
// ============================================================================

export interface SearchResult {
  id: number;
  kind: 'Alert' | 'Article' | 'Bill' | 'Legislator';
  title: string;
  highlights: string[];
  hit: {
    _source: any;
  };
  url: string;
  total: number;
}

export interface SearchResponse {
  status: string;
  data: {
    highlights: SearchResult[];
    paginate: boolean;
    total_pages: number;
    page: number;
  };
}

// ============================================================================
// ALERT TYPES
// ============================================================================

export interface Alert {
  id: number;
  title: string;
  summary: string;
  subject: string;
  message: string;
  letter?: string;
  letter_subject?: string;
  expires?: string;
  status: 'active' | 'inactive';
  alert_format_type: 'talking_points' | 'letter' | 'edit-letter';
  chambers: string[];
  topics: Topic[];
  permalink: string;
  share_url: string;
}

export interface AlertsResponse {
  status: string;
  data: {
    alerts: Alert[];
    total_results: number;
    default_signature?: string;
    alert_format_type?: string;
    state_name?: string;
  };
}

export interface AlertResponse {
  status: string;
  data: {
    alert: Alert;
    states: string[][];
    reset?: any;
    edit_address?: boolean;
    scroll?: boolean;
  };
}

// ============================================================================
// MESSAGE CONGRESS TYPES
// ============================================================================

export interface MessageCongressRequest {
  salutation?: string;
  firstname: string;
  lastname: string;
  email: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  phone?: string;
  subject?: string;
  message?: string;
  recipients: Array<'president' | 'sen' | 'rep' | 'governor' | 'state-sen' | 'state-rep' | 'municipal-exec' | 'municipal-leg'>;
  exclude?: number[];
  send_copy?: boolean;
  preview?: boolean;
  edit?: boolean;
}

export interface MessageFormResponse {
  status: string;
  data: {
    form?: any;
    alert?: Alert;
    alert_format_type?: string;
    edit_address?: boolean;
    legislators?: Legislator[];
    final_message?: string;
    final_subject?: string;
    is_expired?: boolean;
    previous_message?: any;
  };
}

// ============================================================================
// CAMPAIGN TYPES
// ============================================================================

export interface Campaign {
  id: number;
  name: string;
  description: string;
  private: boolean;
  is_global: boolean;
  position: number;
  summary_article_count: number;
  summary_alert_limit: number;
  articles?: Article[];
  alerts?: Alert[];
  latest_poll?: Poll;
  bills?: Array<{
    id: number;
    title: string;
    vendor_position: string;
  }>;
}

export interface CampaignsResponse {
  status: string;
  data: {
    campaigns: Campaign[];
  };
}

export interface CampaignResponse {
  status: string;
  data: Campaign;
}

// ============================================================================
// PUBLICATION TYPES
// ============================================================================

export interface Publication {
  id: number;
  name: string;
  url: string;
  description: string;
  group_by_date: boolean;
  in_service_list: boolean;
  unique_articles?: Article[];
}

export interface PublicationsResponse {
  status: string;
  data: {
    publications: Publication[];
    total_results: number;
  };
}

export interface Article {
  id: number;
  title: string;
  slug: string;
  article_text: string;
  pub_date: string;
  end_date?: string;
  topic?: Topic;
  alert?: Alert;
}

export interface PublicationArticlesResponse {
  status: string;
  data: {
    articles: Article[];
    total_results: number;
    publication: Publication;
    article_groups?: any;
  };
}

export interface ArticleResponse {
  status: string;
  data: {
    article: Article;
  };
}

// ============================================================================
// USER MESSAGES TYPES
// ============================================================================

export interface MessageLog {
  id: number;
  created: string;
  subject: string;
  message: string;
  status: string;
  firstname: string;
  lastname: string;
  email: string;
  recipients: any;
}

export interface UserMessagesResponse {
  status: string;
  data: {
    messages: Record<string, MessageLog>;
    paginated?: any;
  };
}

// ============================================================================
// ADDITIONAL TYPES
// ============================================================================

export interface LobbyDay {
  id: number;
  name: string;
  meetings: any[];
  schedule_disabled: boolean;
}

export interface AppSponsor {
  id: number;
  name: string;
  image_url: string;
}

// ============================================================================
// REQUEST PARAMETER TYPES
// ============================================================================

export interface GetTopicsParams {
  page_num?: number;
  featured?: boolean;
}

export interface GetPollsParams {
  page_num?: number;
}

export interface GetAlertsParams {
  page_num?: number;
  q?: string;
  kind?: 'federal' | 'state' | 'regulation' | 'local';
  state?: string;
  items?: number;
  sort_by?: 'created' | 'popularity' | 'global_display_order';
  sort_dir?: 'asc' | 'desc';
  ajax?: boolean;
}

export interface GetAlertParams {
  edit_address?: boolean;
  clear_address?: boolean;
}

export interface GetPublicationArticlesParams {
  page_num?: number;
  section?: string;
  limit?: number;
}

export interface SearchParams {
  q: string;
  section_id?: 'alerts_results' | 'articles_results' | 'bills_results' | 'legislators_results';
  size?: number;
  paginate?: boolean;
}

export interface LegislatorSearchParams {
  search?: string;
  state?: string;
  legislature?: string;
}

export interface MessageCongressParams {
  clear_address?: boolean;
  ajax?: boolean;
  style?: 'wizard' | 'webform';
  vote_id?: number;
}

export interface EmailSettingsParams {
  e?: string;
  feml?: boolean;
}

// ============================================================================
// API RESULT TYPES
// ============================================================================

export type ApiResult<T> = {
  success: true;
  data: T;
} | {
  success: false;
  error: string;
};
