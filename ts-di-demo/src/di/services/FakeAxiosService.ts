import { IAxiosService, RequestConfig } from '../interfaces/IAxiosService';
import {
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
} from '../../types/NwycTypes';

/**
 * Fake implementation of IAxiosService that returns mock data.
 * Useful for testing, development, and demonstrating dependency injection patterns.
 * Simulates network delay to mimic real API behavior.
 */
export class FakeAxiosService implements IAxiosService {
  private authToken: string | null = null;
  private baseURL: string = 'https://nwyc.com';

  async get<T = any>(url: string, config?: RequestConfig): Promise<T> {
    // Simulate network delay
    await this.simulateDelay();

    // Route to appropriate mock response based on URL
    return this.getMockResponse(url, 'GET') as T;
  }

  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    // Simulate network delay
    await this.simulateDelay();

    // Route to appropriate mock response based on URL
    return this.getMockResponse(url, 'POST', data) as T;
  }

  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    await this.simulateDelay();
    return this.getMockResponse(url, 'PUT', data) as T;
  }

  async delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
    await this.simulateDelay();
    return this.getMockResponse(url, 'DELETE') as T;
  }

  setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL;
  }

  private async simulateDelay(): Promise<void> {
    const delay = Math.random() * 800 + 200; // 200-1000ms delay
    return new Promise(resolve => setTimeout(resolve, delay));
  }

  private getMockResponse(url: string, method: string, data?: any): any {
    console.log(`🎭 Fake API Call: ${method} ${url}`, data ? { data } : '');

    // Authentication endpoints
    if (url.includes('/login')) {
      return this.getMockLoginResponse();
    }
    if (url.includes('/authenticate')) {
      return this.getMockAuthenticateResponse();
    }

    // Content endpoints
    if (url.includes('/frontpage')) {
      return this.getMockFrontPageResponse();
    }
    if (url.includes('/default/talkingpoints')) {
      return this.getMockTalkingPointsResponse();
    }

    // Topic endpoints
    if (url.includes('/topics/all')) {
      return this.getMockTopicsResponse();
    }
    if (url.match(/\/topic\/get\/\d+/)) {
      return this.getMockTopicResponse();
    }
    if (url.includes('/user/topic/add') || url.includes('/user/topic/delete')) {
      return this.getMockUserTopicsResponse();
    }

    // Poll endpoints
    if (url.includes('/polls/active') || url.includes('/polls')) {
      return this.getMockPollsResponse();
    }
    if (url.match(/\/poll\/get\/\d+/) || url.match(/\/poll\/\d+$/)) {
      return this.getMockPollResponse();
    }
    if (url.includes('/poll/vote') || url.match(/\/poll\/\d+\/vote/)) {
      return this.getMockPollResponse();
    }

    // Legislative endpoints
    if (url.includes('/districts/by_address')) {
      return this.getMockDistrictsResponse();
    }
    if (url.includes('/elected_officials/my_reps')) {
      return this.getMockLegislatorSearchResponse();
    }
    if (url.includes('/elected_officials/search')) {
      return this.getMockLegislatorSearchResponse();
    }

    // Search endpoints
    if (url.includes('/search/results')) {
      return this.getMockSearchResponse();
    }

    // Alert endpoints
    if (url.includes('/alerts')) {
      return this.getMockAlertsResponse();
    }
    if (url.match(/\/alert\/[^\/]+$/)) {
      return this.getMockAlertResponse();
    }
    if (url.includes('/message/congress/write')) {
      return this.getMockMessageFormResponse();
    }

    // Campaign endpoints
    if (url.includes('/campaigns')) {
      return this.getMockCampaignsResponse();
    }
    if (url.match(/\/campaign\/\d+$/)) {
      return this.getMockCampaignResponse();
    }

    // Publication endpoints
    if (url.includes('/publications')) {
      return this.getMockPublicationsResponse();
    }
    if (url.match(/\/publication\/[^\/]+$/)) {
      return this.getMockPublicationArticlesResponse();
    }
    if (url.match(/\/article\/[^\/]+$/)) {
      return this.getMockArticleResponse();
    }

    // User endpoints
    if (url.includes('/my/messages')) {
      return this.getMockUserMessagesResponse();
    }
    if (url.includes('/settings/profile')) {
      return this.getMockUserProfileResponse();
    }

    // Default success response
    return this.getMockSuccessResponse();
  }

  private getMockLoginResponse(): LoginResponse {
    return {
      status: 'OK',
      message: 'Login form retrieved',
      data: {
        login_to: '/dashboard',
        idp_client_id: 'mock-client-id',
        idp_client_region: 'us-east-1',
      },
    };
  }

  private getMockAuthenticateResponse(): AuthenticateResponse {
    return {
      status: 'OK',
      message: 'Logged in successfully',
      data: {
        user: {
          id: 12345,
          firstname: 'John',
          lastname: 'Doe',
          email: 'john.doe@example.com',
          home_address1: '123 Main St',
          home_city: 'Albany',
          home_state: 'NY',
          home_zip: '12345',
          cell_phone: '555-123-4567',
        },
        campaigns: [
          {
            id: 1,
            name: 'Healthcare Reform',
            description: 'Advocating for better healthcare policies',
            private: false,
            is_global: true,
            position: 1,
            summary_article_count: 5,
            summary_alert_limit: 10,
          },
        ],
        appsponsors: [
          {
            id: 1,
            name: 'NWYC',
            image_url: 'https://nwyc.com/logo.png',
          },
        ],
      },
    };
  }

  private getMockFrontPageResponse(): FrontPageResponse {
    return {
      status: 'OK',
      data: {
        testimonials: [
          {
            id: 1,
            name: 'Jane Smith',
            title: 'CEO',
            company: 'Advocacy Corp',
            testimonial: 'NWYC has been instrumental in our advocacy efforts.',
            image_url: 'https://example.com/jane.jpg',
          },
        ],
        alerts: [
          {
            id: 1,
            title: 'Support Healthcare Reform',
            summary: 'Contact your representatives about healthcare reform',
            subject: 'Healthcare Reform',
            message: 'Please support the healthcare reform bill',
            status: 'active',
            alert_format_type: 'talking_points',
            chambers: ['House', 'Senate'],
            topics: [],
            permalink: '/alert/healthcare-reform',
            share_url: 'https://nwyc.com/alert/healthcare-reform',
          },
        ],
      },
    };
  }

  private getMockTalkingPointsResponse(): TalkingPoint[] {
    return [
      {
        sort_order: 1,
        talkingpoint: 'Healthcare is a fundamental right that should be accessible to all Americans.',
      },
      {
        sort_order: 2,
        talkingpoint: 'Current healthcare costs are unsustainable for working families.',
      },
    ];
  }

  private getMockTopicsResponse(): TopicsResponse {
    return {
      status: 'OK',
      data: {
        total_results: 3,
        topics: [
          {
            id: 1,
            name: 'Healthcare',
            featured: true,
            image_url: 'https://example.com/healthcare.jpg',
          },
          {
            id: 2,
            name: 'Education',
            featured: false,
          },
          {
            id: 3,
            name: 'Environment',
            featured: true,
            image_url: 'https://example.com/environment.jpg',
          },
        ],
      },
    };
  }

  private getMockTopicResponse(): TopicResponse {
    return {
      status: 'OK',
      data: {
        id: 1,
        name: 'Healthcare',
        featured: true,
        image_url: 'https://example.com/healthcare.jpg',
      },
    };
  }

  private getMockUserTopicsResponse(): UserTopicsResponse {
    return {
      status: 'OK',
      message: 'Topic updated successfully',
      data: {
        topics: [
          {
            id: 1,
            name: 'Healthcare',
            featured: true,
          },
          {
            id: 3,
            name: 'Environment',
            featured: true,
          },
        ],
      },
    };
  }

  private getMockPollsResponse(): PollsResponse {
    return {
      status: 'OK',
      data: {
        total_results: 2,
        polls: [
          {
            id: 1,
            question: 'Do you support healthcare reform?',
            description: 'A poll about healthcare reform',
            start_date: '2024-01-01T00:00:00Z',
            active: true,
            choices: [
              { id: 1, choice: 'Yes', votes: 150 },
              { id: 2, choice: 'No', votes: 75 },
            ],
          },
          {
            id: 2,
            question: 'Should education funding be increased?',
            start_date: '2024-01-15T00:00:00Z',
            active: true,
            choices: [
              { id: 3, choice: 'Yes', votes: 200 },
              { id: 4, choice: 'No', votes: 50 },
            ],
          },
        ],
      },
    };
  }

  private getMockPollResponse(): PollResponse {
    return {
      status: 'OK',
      data: {
        id: 1,
        question: 'Do you support healthcare reform?',
        description: 'A poll about healthcare reform',
        start_date: '2024-01-01T00:00:00Z',
        active: true,
        choices: [
          { id: 1, choice: 'Yes', votes: 151 },
          { id: 2, choice: 'No', votes: 75 },
        ],
        user_vote: 1,
      },
    };
  }

  private getMockDistrictsResponse(): DistrictsResponse {
    return {
      status: 'OK',
      data: {
        districts: ['NY-21', 'NY-S01', 'NY-A113'],
      },
    };
  }

  private getMockLegislatorSearchResponse(): LegislatorSearchResponse {
    return {
      status: 'OK',
      data: {
        total_results: 2,
        legislators: [
          {
            id: 1,
            firstname: 'Chuck',
            lastname: 'Schumer',
            full_name: 'Charles E. Schumer',
            title: 'Senator',
            title_abbr: 'Sen.',
            party: 'Democratic',
            gender: 'M',
            image: 'schumer.jpg',
            image_url: 'https://example.com/schumer.jpg',
            email: 'senator@schumer.senate.gov',
            url: 'https://schumer.senate.gov',
            state: 'NY',
            type: 'federal',
            district: {
              type: 'state',
              state: 'NY',
              district: 'Senior',
            },
            addresses: [
              {
                address1: '322 Hart Senate Office Building',
                city: 'Washington',
                state: 'DC',
                zip: '20510',
                phones: [
                  { type: 'Phone', number: '202-224-6542' },
                ],
              },
            ],
          },
        ],
      },
    };
  }

  private getMockSearchResponse(): SearchResponse {
    return {
      status: 'OK',
      data: {
        highlights: [
          {
            id: 1,
            kind: 'Alert',
            title: 'Healthcare Reform Alert',
            highlights: ['healthcare', 'reform'],
            hit: { _source: {} },
            url: '/alert/healthcare-reform',
            total: 1,
          },
        ],
        paginate: false,
        total_pages: 1,
        page: 1,
      },
    };
  }

  private getMockAlertsResponse(): AlertsResponse {
    return {
      status: 'OK',
      data: {
        total_results: 1,
        alerts: [
          {
            id: 1,
            title: 'Support Healthcare Reform',
            summary: 'Contact your representatives about healthcare reform',
            subject: 'Healthcare Reform',
            message: 'Please support the healthcare reform bill',
            status: 'active',
            alert_format_type: 'talking_points',
            chambers: ['House', 'Senate'],
            topics: [],
            permalink: '/alert/healthcare-reform',
            share_url: 'https://nwyc.com/alert/healthcare-reform',
          },
        ],
      },
    };
  }

  private getMockAlertResponse(): AlertResponse {
    return {
      status: 'OK',
      data: {
        alert: {
          id: 1,
          title: 'Support Healthcare Reform',
          summary: 'Contact your representatives about healthcare reform',
          subject: 'Healthcare Reform',
          message: 'Please support the healthcare reform bill',
          status: 'active',
          alert_format_type: 'talking_points',
          chambers: ['House', 'Senate'],
          topics: [],
          permalink: '/alert/healthcare-reform',
          share_url: 'https://nwyc.com/alert/healthcare-reform',
        },
        states: [['NY', 'New York'], ['CA', 'California']],
      },
    };
  }

  private getMockMessageFormResponse(): MessageFormResponse {
    return {
      status: 'OK',
      data: {
        form: {},
        legislators: [],
        final_message: 'Please support healthcare reform',
        final_subject: 'Healthcare Reform',
        is_expired: false,
      },
    };
  }

  private getMockUserMessagesResponse(): UserMessagesResponse {
    return {
      status: 'OK',
      data: {
        messages: {
          '1': {
            id: 1,
            created: '2024-01-01T12:00:00Z',
            subject: 'Healthcare Reform',
            message: 'Please support healthcare reform',
            status: 'sent',
            firstname: 'John',
            lastname: 'Doe',
            email: 'john.doe@example.com',
            recipients: {},
          },
        },
      },
    };
  }

  private getMockCampaignsResponse(): CampaignsResponse {
    return {
      status: 'OK',
      data: {
        campaigns: [
          {
            id: 1,
            name: 'Healthcare Reform',
            description: 'Advocating for better healthcare policies',
            private: false,
            is_global: true,
            position: 1,
            summary_article_count: 5,
            summary_alert_limit: 10,
          },
        ],
      },
    };
  }

  private getMockCampaignResponse(): CampaignResponse {
    return {
      status: 'OK',
      data: {
        id: 1,
        name: 'Healthcare Reform',
        description: 'Advocating for better healthcare policies',
        private: false,
        is_global: true,
        position: 1,
        summary_article_count: 5,
        summary_alert_limit: 10,
        articles: [],
        alerts: [],
      },
    };
  }

  private getMockPublicationsResponse(): PublicationsResponse {
    return {
      status: 'OK',
      data: {
        total_results: 1,
        publications: [
          {
            id: 1,
            name: 'NWYC Newsletter',
            url: '/publication/newsletter',
            description: 'Weekly newsletter with advocacy updates',
            group_by_date: true,
            in_service_list: true,
          },
        ],
      },
    };
  }

  private getMockPublicationArticlesResponse(): PublicationArticlesResponse {
    return {
      status: 'OK',
      data: {
        total_results: 1,
        articles: [
          {
            id: 1,
            title: 'Healthcare Reform Update',
            slug: 'healthcare-reform-update',
            article_text: 'Latest updates on healthcare reform legislation...',
            pub_date: '2024-01-01T12:00:00Z',
          },
        ],
        publication: {
          id: 1,
          name: 'NWYC Newsletter',
          url: '/publication/newsletter',
          description: 'Weekly newsletter with advocacy updates',
          group_by_date: true,
          in_service_list: true,
        },
      },
    };
  }

  private getMockArticleResponse(): ArticleResponse {
    return {
      status: 'OK',
      data: {
        article: {
          id: 1,
          title: 'Healthcare Reform Update',
          slug: 'healthcare-reform-update',
          article_text: 'Latest updates on healthcare reform legislation...',
          pub_date: '2024-01-01T12:00:00Z',
        },
      },
    };
  }

  private getMockUserProfileResponse(): UserProfileResponse {
    return {
      status: 'OK',
      data: {
        user: {
          id: 12345,
          firstname: 'John',
          lastname: 'Doe',
          email: 'john.doe@example.com',
          home_address1: '123 Main St',
          home_city: 'Albany',
          home_state: 'NY',
          home_zip: '12345',
          cell_phone: '555-123-4567',
        },
      },
    };
  }

  private getMockSuccessResponse(): SuccessResponse {
    return {
      status: 'OK',
      message: 'Operation completed successfully',
      data: {},
    };
  }
}
