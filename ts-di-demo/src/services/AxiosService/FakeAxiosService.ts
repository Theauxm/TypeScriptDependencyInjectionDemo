import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Injectable } from '../../di-lib/decorators';
import { IAxiosService } from './IAxiosService';
import {
  LoginResponse,
  AuthenticateResponse,
  FrontPageResponse,
  DistrictsResponse,
  TopicsResponse,
  TopicResponse,
  UserTopicsResponse,
  PollsResponse,
  PollResponse,
  UserProfileResponse,
  LegislatorSearchResponse,
  SearchResponse,
  MessageFormResponse,
  SuccessResponse,
  UserMessagesResponse,
  AlertsResponse,
  AlertResponse,
  CampaignsResponse,
  CampaignResponse,
  PublicationsResponse,
  PublicationArticlesResponse,
  ArticleResponse,
  TalkingPoint,
  Topic,
  Alert,
  Poll,
  Campaign,
  Publication,
  Article,
  Legislator,
  UserProfile,
  Testimonial
} from '../../types/NwycTypes';

/**
 * Fake implementation of IAxiosService that returns mock data for all NWYC API endpoints.
 * Useful for testing, development, and demonstrating the service architecture.
 * Simulates network delay and provides realistic mock responses.
 * Active in Local and Development environments.
 */
@Injectable("AxiosService")
export class FakeAxiosService implements IAxiosService {
  
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    await this.simulateDelay();
    console.log(`[FakeAxiosService] GET ${url}`);
    
    return this.getMockResponse(url, 'GET') as T;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    await this.simulateDelay();
    console.log(`[FakeAxiosService] POST ${url}`, data);
    
    return this.getMockResponse(url, 'POST', data) as T;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    await this.simulateDelay();
    console.log(`[FakeAxiosService] PUT ${url}`, data);
    
    return this.getMockResponse(url, 'PUT', data) as T;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    await this.simulateDelay();
    console.log(`[FakeAxiosService] DELETE ${url}`);
    
    return this.getMockResponse(url, 'DELETE') as T;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    await this.simulateDelay();
    console.log(`[FakeAxiosService] PATCH ${url}`, data);
    
    return this.getMockResponse(url, 'PATCH', data) as T;
  }

  async getResponse<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const data = await this.get<T>(url, config);
    return this.createMockAxiosResponse(data, 200);
  }

  async postResponse<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const responseData = await this.post<T>(url, data, config);
    return this.createMockAxiosResponse(responseData, 200);
  }

  private async simulateDelay(): Promise<void> {
    const delay = Math.random() * 800 + 200; // 200-1000ms delay
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  private createMockAxiosResponse<T>(data: T, status: number): AxiosResponse<T> {
    return {
      data,
      status,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    };
  }

  private getMockResponse(url: string, method: string, data?: any): any {
    // Authentication endpoints
    if (url.includes('/login') && method === 'GET') {
      return this.getMockLoginForm();
    }
    if (url.includes('/login') && method === 'POST') {
      return this.getMockLoginSuccess();
    }
    if (url.includes('/authenticate')) {
      return this.getMockAuthenticateResponse();
    }

    // Content endpoints
    if (url.includes('/frontpage')) {
      return this.getMockFrontPage();
    }
    if (url.includes('/default/talkingpoints')) {
      return this.getMockTalkingPoints();
    }

    // Legislative endpoints
    if (url.includes('/districts/by_address')) {
      return this.getMockDistricts();
    }
    if (url.includes('/elected_officials/my_reps')) {
      return this.getMockUserReps();
    }
    if (url.includes('/elected_officials/search/ajax')) {
      return this.getMockLegislatorSearch();
    }
    if (url.includes('/elected_officials/search')) {
      return this.getMockLegislatorSearchPage();
    }

    // Topics endpoints
    if (url.includes('/topics/all')) {
      return this.getMockTopics();
    }
    if (url.includes('/topic/get/')) {
      return this.getMockTopic();
    }
    if (url.includes('/user/topic/add/') || url.includes('/user/topic/delete/')) {
      return this.getMockUserTopics();
    }

    // Polls endpoints
    if (url.includes('/polls/active')) {
      return this.getMockActivePolls();
    }
    if (url.includes('/polls')) {
      return this.getMockAllPolls();
    }
    if (url.includes('/poll/get/') || url.includes('/poll/') && !url.includes('/vote')) {
      return this.getMockPoll();
    }
    if (url.includes('/poll/vote/') || url.includes('/vote')) {
      return this.getMockPollVote();
    }

    // User settings endpoints
    if (url.includes('/settings/profile') && method === 'GET') {
      return this.getMockUserProfile();
    }
    if (url.includes('/settings/profile') && method === 'POST') {
      return this.getMockUpdateSuccess();
    }
    if (url.includes('/settings/billing')) {
      return this.getMockBillingReceipt();
    }
    if (url.includes('/settings/receipt/download/')) {
      return this.getMockReceiptPdf();
    }
    if (url.includes('/settings')) {
      return this.getMockUserSettings();
    }
    if (url.includes('/user/emailsettings') && method === 'GET') {
      return this.getMockEmailSettings();
    }
    if (url.includes('/user/emailsettings') && method === 'POST') {
      return this.getMockUpdateSuccess();
    }

    // Search endpoints
    if (url.includes('/search/results')) {
      return this.getMockSearchResults();
    }

    // Message Congress endpoints
    if (url.includes('/message/congress/write') && method === 'GET') {
      return this.getMockMessageForm();
    }
    if (url.includes('/message/congress/write') && method === 'POST') {
      return this.getMockMessageSuccess();
    }
    if (url.includes('/alert/') && url.includes('/message/congress/write') && method === 'GET') {
      return this.getMockAlertMessageForm();
    }
    if (url.includes('/alert/') && url.includes('/message/congress/write') && method === 'POST') {
      return this.getMockMessageSuccess();
    }
    if (url.includes('/message/resend/')) {
      return this.getMockMessageSuccess();
    }
    if (url.includes('/my/messages')) {
      return this.getMockUserMessages();
    }

    // Alerts endpoints
    if (url.includes('/alerts')) {
      return this.getMockAlerts();
    }
    if (url.includes('/alert/')) {
      return this.getMockAlert();
    }

    // Campaigns endpoints
    if (url.includes('/campaigns')) {
      return this.getMockCampaigns();
    }
    if (url.includes('/campaign/') && url.includes('/alerts')) {
      return this.getMockCampaignAlerts();
    }
    if (url.includes('/campaign/')) {
      return this.getMockCampaign();
    }

    // Publications endpoints
    if (url.includes('/publications')) {
      return this.getMockPublications();
    }
    if (url.includes('/publication/')) {
      return this.getMockPublicationArticles();
    }
    if (url.includes('/article/')) {
      return this.getMockArticle();
    }

    // Default fallback
    console.warn(`[FakeAxiosService] No mock implemented for: ${method} ${url}`);
    return this.getMockGenericSuccess();
  }

  // Mock response generators
  private getMockLoginForm(): LoginResponse {
    return {
      status: "OK",
      message: "Login form retrieved",
      data: {
        login_to: "/dashboard",
        idp_client_id: "mock-client-id",
        idp_client_region: "us-east-1"
      }
    };
  }

  private getMockLoginSuccess(): SuccessResponse {
    return {
      status: "OK",
      message: "Login successful",
      data: {}
    };
  }

  private getMockAuthenticateResponse(): AuthenticateResponse {
    return {
      status: "OK",
      message: "Authenticated successfully",
      data: {
        user: this.getMockUserProfileData(),
        campaigns: this.getMockCampaignsData(),
        appsponsors: [
          { id: 1, name: "Mock Sponsor", image_url: "https://via.placeholder.com/100" }
        ]
      }
    };
  }

  private getMockUserProfileData(): UserProfile {
    return {
      id: 1,
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@example.com",
      salutation: "Mr.",
      home_address1: "123 Main St",
      home_city: "Anytown",
      home_state: "NY",
      home_zip: "12345",
      cell_phone: "555-123-4567",
      representatives: [this.getMockLegislator()]
    };
  }

  private getMockLegislator(): Legislator {
    return {
      id: 1,
      firstname: "Jane",
      lastname: "Smith",
      full_name: "Jane Smith",
      title: "Senator",
      title_abbr: "Sen.",
      party: "D",
      gender: "F",
      image: "senator-smith.jpg",
      image_url: "https://via.placeholder.com/150",
      email: "jane.smith@senate.gov",
      url: "https://senate.gov/smith",
      state: "NY",
      type: "federal",
      district: {
        type: "Senate",
        state: "NY",
        district: "1"
      },
      addresses: [{
        address1: "123 Capitol Hill",
        city: "Washington",
        state: "DC",
        zip: "20515",
        phones: [
          { type: "Phone", number: "202-555-0123" }
        ]
      }]
    };
  }

  private getMockFrontPage(): FrontPageResponse {
    return {
      status: "OK",
      data: {
        testimonials: [
          {
            id: 1,
            name: "Mock User",
            title: "Citizen",
            company: "Mock Company",
            testimonial: "This service helps me stay engaged with my representatives.",
            image_url: "https://via.placeholder.com/100"
          }
        ],
        alerts: [this.getMockAlertData()]
      }
    };
  }

  private getMockAlertData(): Alert {
    return {
      id: 1,
      title: "Mock Alert: Important Legislation",
      summary: "This is a mock alert for testing purposes.",
      subject: "Take Action Now",
      message: "Please contact your representatives about this important issue.",
      status: "active",
      alert_format_type: "talking_points",
      chambers: ["House", "Senate"],
      topics: [{ id: 1, name: "Healthcare", featured: true }],
      permalink: "/alert/mock-alert",
      share_url: "https://example.com/alert/mock-alert"
    };
  }

  private getMockTalkingPoints(): TalkingPoint[] {
    return [
      { sort_order: 1, talkingpoint: "This is an important issue that affects all Americans." },
      { sort_order: 2, talkingpoint: "We need bipartisan support to address this challenge." },
      { sort_order: 3, talkingpoint: "Your voice matters in this democratic process." }
    ];
  }

  private getMockDistricts(): DistrictsResponse {
    return {
      status: "OK",
      data: {
        districts: ["S01", "H12", "SS025", "SH087"]
      }
    };
  }

  private getMockUserReps(): string {
    return "<html><body><h1>Your Representatives</h1><p>Mock HTML content</p></body></html>";
  }

  private getMockLegislatorSearch(): LegislatorSearchResponse {
    return {
      status: "OK",
      data: {
        legislators: [this.getMockLegislator()],
        total_results: 1
      }
    };
  }

  private getMockLegislatorSearchPage(): string {
    return "<html><body><h1>Legislator Search</h1><p>Mock HTML content</p></body></html>";
  }

  private getMockTopics(): TopicsResponse {
    return {
      status: "OK",
      data: {
        total_results: 3,
        topics: [
          { id: 1, name: "Healthcare", featured: true },
          { id: 2, name: "Education", featured: false },
          { id: 3, name: "Environment", featured: true }
        ]
      }
    };
  }

  private getMockTopic(): TopicResponse {
    return {
      status: "OK",
      data: { id: 1, name: "Healthcare", featured: true }
    };
  }

  private getMockUserTopics(): UserTopicsResponse {
    return {
      status: "OK",
      message: "Topic updated successfully",
      data: {
        topics: [
          { id: 1, name: "Healthcare", featured: true },
          { id: 2, name: "Education", featured: false }
        ]
      }
    };
  }

  private getMockActivePolls(): PollsResponse {
    return {
      status: "OK",
      data: {
        total_results: 1,
        polls: [this.getMockPollData()]
      }
    };
  }

  private getMockAllPolls(): PollsResponse {
    return {
      status: "OK",
      data: {
        total_results: 2,
        polls: [
          this.getMockPollData(),
          {
            id: 2,
            question: "Should we increase funding for education?",
            start_date: "2024-01-01T00:00:00Z",
            active: false,
            choices: [
              { id: 3, choice: "Yes", votes: 150 },
              { id: 4, choice: "No", votes: 75 }
            ]
          }
        ]
      }
    };
  }

  private getMockPollData(): Poll {
    return {
      id: 1,
      question: "Do you support the current healthcare proposal?",
      description: "This poll asks about your opinion on healthcare reform.",
      start_date: "2024-01-01T00:00:00Z",
      end_date: "2024-12-31T23:59:59Z",
      active: true,
      choices: [
        { id: 1, choice: "Yes", votes: 100 },
        { id: 2, choice: "No", votes: 50 }
      ],
      user_vote: undefined
    };
  }

  private getMockPoll(): PollResponse {
    return {
      status: "OK",
      data: this.getMockPollData()
    };
  }

  private getMockPollVote(): PollResponse {
    return {
      status: "OK",
      data: {
        ...this.getMockPollData(),
        user_vote: 1
      }
    };
  }

  private getMockUserProfile(): UserProfileResponse {
    return {
      status: "OK",
      data: {
        user: this.getMockUserProfileData()
      }
    };
  }

  private getMockUpdateSuccess(): SuccessResponse {
    return {
      status: "OK",
      message: "Updated successfully",
      data: {}
    };
  }

  private getMockUserSettings(): string {
    return "<html><body><h1>User Settings</h1><p>Mock HTML content</p></body></html>";
  }

  private getMockBillingReceipt(): string {
    return "<html><body><h1>Billing Receipt</h1><p>Mock HTML content</p></body></html>";
  }

  private getMockReceiptPdf(): Blob {
    return new Blob(['Mock PDF content'], { type: 'application/pdf' });
  }

  private getMockEmailSettings(): string {
    return "<html><body><h1>Email Settings</h1><p>Mock HTML content</p></body></html>";
  }

  private getMockSearchResults(): SearchResponse {
    return {
      status: "OK",
      data: {
        highlights: [
          {
            id: 1,
            kind: "Alert",
            title: "Mock Search Result",
            highlights: ["This is a highlighted snippet"],
            hit: { _source: {} },
            url: "/alert/1",
            total: 1
          }
        ],
        paginate: false,
        total_pages: 1,
        page: 1
      }
    };
  }

  private getMockMessageForm(): MessageFormResponse {
    return {
      status: "OK",
      data: {
        form: {},
        alert: this.getMockAlertData(),
        legislators: [this.getMockLegislator()],
        final_message: "Mock message content",
        final_subject: "Mock subject",
        is_expired: false
      }
    };
  }

  private getMockAlertMessageForm(): MessageFormResponse {
    return this.getMockMessageForm();
  }

  private getMockMessageSuccess(): SuccessResponse {
    return {
      status: "OK",
      message: "Message sent successfully",
      data: {}
    };
  }

  private getMockUserMessages(): UserMessagesResponse {
    return {
      status: "OK",
      data: {
        messages: {
          "1": {
            id: 1,
            created: "2024-01-01T12:00:00Z",
            subject: "Mock Message",
            message: "This is a mock message",
            status: "sent",
            firstname: "John",
            lastname: "Doe",
            email: "john.doe@example.com",
            recipients: {}
          }
        }
      }
    };
  }

  private getMockAlerts(): AlertsResponse {
    return {
      status: "OK",
      data: {
        alerts: [this.getMockAlertData()],
        total_results: 1,
        default_signature: "Mock Signature"
      }
    };
  }

  private getMockAlert(): AlertResponse {
    return {
      status: "OK",
      data: {
        alert: this.getMockAlertData(),
        states: [["NY", "New York"], ["CA", "California"]],
        edit_address: false,
        scroll: false
      }
    };
  }

  private getMockCampaigns(): CampaignsResponse {
    return {
      status: "OK",
      data: {
        campaigns: this.getMockCampaignsData()
      }
    };
  }

  private getMockCampaignsData(): Campaign[] {
    return [
      {
        id: 1,
        name: "Mock Campaign",
        description: "This is a mock campaign for testing",
        private: false,
        is_global: true,
        position: 1,
        summary_article_count: 5,
        summary_alert_limit: 10
      }
    ];
  }

  private getMockCampaign(): CampaignResponse {
    return {
      status: "OK",
      data: {
        ...this.getMockCampaignsData()[0],
        articles: [this.getMockArticleData()],
        alerts: [this.getMockAlertData()],
        latest_poll: this.getMockPollData()
      }
    };
  }

  private getMockCampaignAlerts(): AlertsResponse {
    return this.getMockAlerts();
  }

  private getMockPublications(): PublicationsResponse {
    return {
      status: "OK",
      data: {
        publications: [
          {
            id: 1,
            name: "Mock Publication",
            url: "/publication/mock",
            description: "A mock publication for testing",
            group_by_date: true,
            in_service_list: true
          }
        ],
        total_results: 1
      }
    };
  }

  private getMockPublicationArticles(): PublicationArticlesResponse {
    return {
      status: "OK",
      data: {
        articles: [this.getMockArticleData()],
        total_results: 1,
        publication: {
          id: 1,
          name: "Mock Publication",
          url: "/publication/mock",
          description: "A mock publication for testing",
          group_by_date: true,
          in_service_list: true
        }
      }
    };
  }

  private getMockArticleData(): Article {
    return {
      id: 1,
      title: "Mock Article",
      slug: "mock-article",
      article_text: "This is mock article content for testing purposes.",
      pub_date: "2024-01-01T12:00:00Z",
      topic: { id: 1, name: "Healthcare", featured: true }
    };
  }

  private getMockArticle(): ArticleResponse {
    return {
      status: "OK",
      data: {
        article: this.getMockArticleData()
      }
    };
  }

  private getMockGenericSuccess(): SuccessResponse {
    return {
      status: "OK",
      message: "Operation completed successfully",
      data: {}
    };
  }
}
