import React, { useState } from 'react';
import { useService } from '../hooks/use-service';
import { AppConfig } from '../config/AppConfig';
import { 
  LoginRequest, 
  GetTopicsParams, 
  GetAlertsParams,
  MessageCongressRequest 
} from '../types/NwycTypes';

export const NwycDemoView: React.FC = () => {
  const nwycService = useService('NwycService');
  
  // State for different demo sections
  const [authToken, setAuthToken] = useState<string>('demo-token-123');
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);

  // Helper function to handle API calls
  const handleApiCall = async (key: string, apiCall: () => Promise<any>) => {
    setLoading(prev => ({ ...prev, [key]: true }));
    setError(null);
    
    try {
      const result = await apiCall();
      setResults(prev => ({ ...prev, [key]: result }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  // Demo functions for different API categories
  const testFrontPage = () => {
    handleApiCall('frontPage', () => nwycService.getFrontPage());
  };

  const testLogin = () => {
    const credentials: LoginRequest = {
      username: 'demo@example.com',
      password: 'demo123'
    };
    handleApiCall('login', () => nwycService.login(credentials));
  };

  const testAuthenticate = () => {
    handleApiCall('authenticate', () => nwycService.authenticate({ quick: false }, authToken));
  };

  const testTopics = () => {
    const params: GetTopicsParams = { page_num: 0, featured: true };
    handleApiCall('topics', () => nwycService.getAllTopics(params, authToken));
  };

  const testAlerts = () => {
    const params: GetAlertsParams = { 
      page_num: 1, 
      items: 5, 
      sort_by: 'created',
      sort_dir: 'desc'
    };
    handleApiCall('alerts', () => nwycService.getAlerts(params, authToken));
  };

  const testPolls = () => {
    handleApiCall('polls', () => nwycService.getActivePolls({ page_num: 0 }, authToken));
  };

  const testDistricts = () => {
    handleApiCall('districts', () => nwycService.getDistrictsByAddress('123 Main St, Albany, NY 12345', authToken));
  };

  const testUserProfile = () => {
    handleApiCall('userProfile', () => nwycService.getUserProfile(authToken));
  };

  const testCampaigns = () => {
    handleApiCall('campaigns', () => nwycService.getCampaigns(authToken));
  };

  const testPublications = () => {
    handleApiCall('publications', () => nwycService.getPublications(authToken));
  };

  const testTalkingPoints = () => {
    handleApiCall('talkingPoints', () => nwycService.getDefaultTalkingPoints(authToken));
  };

  const testMessageForm = () => {
    handleApiCall('messageForm', () => nwycService.getMessageCongressForm({ style: 'webform' }, authToken));
  };

  const testSendMessage = () => {
    const message: MessageCongressRequest = {
      firstname: 'John',
      lastname: 'Doe',
      email: 'john.doe@example.com',
      address1: '123 Main St',
      city: 'Albany',
      state: 'NY',
      zip: '12345',
      subject: 'Important Issue',
      message: 'Please consider this important matter.',
      recipients: ['sen', 'rep']
    };
    handleApiCall('sendMessage', () => nwycService.sendMessageToCongress(message, authToken));
  };

  const testSearch = () => {
    handleApiCall('search', () => nwycService.searchContent({ 
      q: 'healthcare', 
      size: 5 
    }, authToken));
  };

  const renderResult = (key: string) => {
    const result = results[key];
    const isLoading = loading[key];
    
    if (isLoading) {
      return <div className="loading-spinner">Loading...</div>;
    }
    
    if (!result) {
      return <div className="no-result">No result yet</div>;
    }
    
    return (
      <div className="api-result">
        <div className="result-status">
          <span className={`status-badge ${result.success ? 'success' : 'error'}`}>
            {result.success ? '✅ Success' : '❌ Error'}
          </span>
        </div>
        <pre className="result-data">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div className="view">
      <h2>NWYC API Demo - Complete Service Wrapper</h2>
      
      <div className="service-info">
        <p>This demo showcases the <strong>complete NWYC API service wrapper</strong> with all endpoints implemented.</p>
        <p>
          <strong>Current Implementation:</strong> {' '}
          <span className={`implementation-badge ${AppConfig.USE_REAL_NWYC_API ? 'real' : 'fake'}`}>
            {AppConfig.USE_REAL_NWYC_API ? '🌐 Real NWYC API' : '🎭 Fake Mock Service'}
          </span>
        </p>
        <p>
          <em>Change the <code>USE_REAL_NWYC_API</code> setting in AppConfig.ts and restart to switch implementations.</em>
        </p>
      </div>

      <div className="auth-section">
        <h3>Authentication Token</h3>
        <input
          type="text"
          value={authToken}
          onChange={(e) => setAuthToken(e.target.value)}
          placeholder="Enter auth token"
          className="auth-input"
        />
        <p><em>This token will be used for authenticated endpoints</em></p>
      </div>

      {error && (
        <div className="error-state">
          <h4>❌ Error</h4>
          <p>{error}</p>
        </div>
      )}

      <div className="demo-sections">
        
        {/* Authentication Section */}
        <div className="demo-section">
          <h3>🔐 Authentication</h3>
          <div className="demo-buttons">
            <button className="demo-button" onClick={testLogin}>
              Test Login
            </button>
            <button className="demo-button" onClick={testAuthenticate}>
              Test Authenticate
            </button>
          </div>
          <div className="demo-results">
            {renderResult('login')}
            {renderResult('authenticate')}
          </div>
        </div>

        {/* Content Section */}
        <div className="demo-section">
          <h3>📄 Content</h3>
          <div className="demo-buttons">
            <button className="demo-button" onClick={testFrontPage}>
              Get Front Page
            </button>
            <button className="demo-button" onClick={testTalkingPoints}>
              Get Talking Points
            </button>
          </div>
          <div className="demo-results">
            {renderResult('frontPage')}
            {renderResult('talkingPoints')}
          </div>
        </div>

        {/* Topics Section */}
        <div className="demo-section">
          <h3>🏷️ Topics</h3>
          <div className="demo-buttons">
            <button className="demo-button" onClick={testTopics}>
              Get All Topics
            </button>
          </div>
          <div className="demo-results">
            {renderResult('topics')}
          </div>
        </div>

        {/* Alerts Section */}
        <div className="demo-section">
          <h3>🚨 Alerts</h3>
          <div className="demo-buttons">
            <button className="demo-button" onClick={testAlerts}>
              Get Alerts
            </button>
          </div>
          <div className="demo-results">
            {renderResult('alerts')}
          </div>
        </div>

        {/* Polls Section */}
        <div className="demo-section">
          <h3>📊 Polls</h3>
          <div className="demo-buttons">
            <button className="demo-button" onClick={testPolls}>
              Get Active Polls
            </button>
          </div>
          <div className="demo-results">
            {renderResult('polls')}
          </div>
        </div>

        {/* Legislative Section */}
        <div className="demo-section">
          <h3>🏛️ Legislative</h3>
          <div className="demo-buttons">
            <button className="demo-button" onClick={testDistricts}>
              Get Districts by Address
            </button>
          </div>
          <div className="demo-results">
            {renderResult('districts')}
          </div>
        </div>

        {/* User Management Section */}
        <div className="demo-section">
          <h3>👤 User Management</h3>
          <div className="demo-buttons">
            <button className="demo-button" onClick={testUserProfile}>
              Get User Profile
            </button>
          </div>
          <div className="demo-results">
            {renderResult('userProfile')}
          </div>
        </div>

        {/* Campaigns Section */}
        <div className="demo-section">
          <h3>📢 Campaigns</h3>
          <div className="demo-buttons">
            <button className="demo-button" onClick={testCampaigns}>
              Get Campaigns
            </button>
          </div>
          <div className="demo-results">
            {renderResult('campaigns')}
          </div>
        </div>

        {/* Publications Section */}
        <div className="demo-section">
          <h3>📚 Publications</h3>
          <div className="demo-buttons">
            <button className="demo-button" onClick={testPublications}>
              Get Publications
            </button>
          </div>
          <div className="demo-results">
            {renderResult('publications')}
          </div>
        </div>

        {/* Message Congress Section */}
        <div className="demo-section">
          <h3>✉️ Message Congress</h3>
          <div className="demo-buttons">
            <button className="demo-button" onClick={testMessageForm}>
              Get Message Form
            </button>
            <button className="demo-button" onClick={testSendMessage}>
              Send Test Message
            </button>
          </div>
          <div className="demo-results">
            {renderResult('messageForm')}
            {renderResult('sendMessage')}
          </div>
        </div>

        {/* Search Section */}
        <div className="demo-section">
          <h3>🔍 Search</h3>
          <div className="demo-buttons">
            <button className="demo-button" onClick={testSearch}>
              Search Content
            </button>
          </div>
          <div className="demo-results">
            {renderResult('search')}
          </div>
        </div>

      </div>

      <div className="technical-info">
        <h4>Technical Architecture:</h4>
        <ul>
          <li><strong>Service Layer:</strong> <code>NwycService</code> implements <code>INwycService</code></li>
          <li><strong>HTTP Abstraction:</strong> Uses injected <code>IAxiosService</code> (Real or Fake)</li>
          <li><strong>Dependency Injection:</strong> Services resolved via <code>serviceContainer</code></li>
          <li><strong>Error Handling:</strong> Consistent <code>ServiceResult&lt;T&gt;</code> pattern</li>
          <li><strong>TanStack Query:</strong> Integrated for caching and state management</li>
          <li><strong>Type Safety:</strong> Complete TypeScript coverage for all endpoints</li>
          <li><strong>Configuration:</strong> Real vs Mock determined by <code>AppConfig.USE_REAL_NWYC_API</code></li>
        </ul>
      </div>

      <div className="endpoint-summary">
        <h4>Implemented Endpoints ({Object.keys({
          // Count all the endpoints we implemented
          getLoginForm: 1, login: 1, authenticate: 1, authenticatePost: 1,
          getFrontPage: 1, getDefaultTalkingPoints: 1,
          getDistrictsByAddress: 1, getDistrictsByAddressPost: 1, getUserRepresentatives: 1,
          searchLegislators: 1, searchLegislatorsAjax: 1,
          getAllTopics: 1, getAllTopicsPost: 1, getTopicById: 1, addUserTopic: 1, removeUserTopic: 1,
          getActivePolls: 1, getAllPolls: 1, getPollById: 1, getPollDetails: 1, voteInPoll: 1, voteInPollById: 1,
          getUserSettings: 1, getUserProfile: 1, updateUserProfile: 1, getBillingReceipt: 1,
          downloadReceipt: 1, getEmailSettings: 1, updateEmailSettings: 1,
          searchContent: 1,
          getMessageCongressForm: 1, sendMessageToCongress: 1, getAlertMessageForm: 1,
          sendAlertMessage: 1, resendMessage: 1, getUserMessages: 1,
          getAlerts: 1, getAlertById: 1,
          getCampaigns: 1, getCampaignById: 1, getCampaignAlerts: 1,
          getPublications: 1, getPublicationArticles: 1, getArticleById: 1
        }).length} total):</h4>
        <div className="endpoint-categories">
          <div className="endpoint-category">
            <strong>Authentication:</strong> 4 endpoints
          </div>
          <div className="endpoint-category">
            <strong>Content:</strong> 2 endpoints
          </div>
          <div className="endpoint-category">
            <strong>Legislative:</strong> 5 endpoints
          </div>
          <div className="endpoint-category">
            <strong>Topics:</strong> 5 endpoints
          </div>
          <div className="endpoint-category">
            <strong>Polls:</strong> 6 endpoints
          </div>
          <div className="endpoint-category">
            <strong>User Settings:</strong> 7 endpoints
          </div>
          <div className="endpoint-category">
            <strong>Search:</strong> 1 endpoint
          </div>
          <div className="endpoint-category">
            <strong>Message Congress:</strong> 6 endpoints
          </div>
          <div className="endpoint-category">
            <strong>Alerts:</strong> 2 endpoints
          </div>
          <div className="endpoint-category">
            <strong>Campaigns:</strong> 3 endpoints
          </div>
          <div className="endpoint-category">
            <strong>Publications:</strong> 3 endpoints
          </div>
        </div>
      </div>
    </div>
  );
};
