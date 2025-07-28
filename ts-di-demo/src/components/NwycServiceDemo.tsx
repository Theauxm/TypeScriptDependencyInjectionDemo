import React, { useState, useEffect } from 'react';
import { useService } from '../di/useService';
import { INwycService } from '../di/interfaces/INwycService';
import { 
  Topic, 
  Poll, 
  Alert, 
  Campaign, 
  Publication,
  FrontPageResponse,
  TopicsResponse,
  PollsResponse,
  AlertsResponse,
  CampaignsResponse,
  PublicationsResponse,
  AuthenticateResponse
} from '../types/NwycTypes';
import { AppConfig } from '../config/AppConfig';

type DemoSection = 'authentication' | 'content' | 'topics' | 'polls' | 'alerts' | 'campaigns' | 'publications';

export const NwycServiceDemo: React.FC = () => {
  const nwycService = useService<INwycService>('INwycService');
  const [activeSection, setActiveSection] = useState<DemoSection>('content');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);

  // Data states for different sections
  const [frontPageData, setFrontPageData] = useState<FrontPageResponse | null>(null);
  const [topicsData, setTopicsData] = useState<TopicsResponse | null>(null);
  const [pollsData, setPollsData] = useState<PollsResponse | null>(null);
  const [alertsData, setAlertsData] = useState<AlertsResponse | null>(null);
  const [campaignsData, setCampaignsData] = useState<CampaignsResponse | null>(null);
  const [publicationsData, setPublicationsData] = useState<PublicationsResponse | null>(null);
  const [authData, setAuthData] = useState<AuthenticateResponse | null>(null);

  const sections = [
    { id: 'authentication' as DemoSection, label: '🔐 Authentication', description: 'Login and user data' },
    { id: 'content' as DemoSection, label: '📄 Content', description: 'Front page and talking points' },
    { id: 'topics' as DemoSection, label: '🏷️ Topics', description: 'Browse and manage topics' },
    { id: 'polls' as DemoSection, label: '📊 Polls', description: 'View and vote in polls' },
    { id: 'alerts' as DemoSection, label: '🚨 Alerts', description: 'Action alerts and campaigns' },
    { id: 'campaigns' as DemoSection, label: '🎯 Campaigns', description: 'Advocacy campaigns' },
    { id: 'publications' as DemoSection, label: '📰 Publications', description: 'Articles and newsletters' },
  ];

  const fetchData = async (section: DemoSection) => {
    setLoading(true);
    setError(null);

    try {
      switch (section) {
        case 'authentication':
          const authResult = await nwycService.authenticate();
          if (authResult.success) {
            setAuthData(authResult.data);
          } else {
            setError(authResult.error);
          }
          break;

        case 'content':
          const frontPageResult = await nwycService.getFrontPage();
          if (frontPageResult.success) {
            setFrontPageData(frontPageResult.data);
          } else {
            setError(frontPageResult.error);
          }
          break;

        case 'topics':
          const topicsResult = await nwycService.getAllTopics({ page_num: 0, featured: true });
          if (topicsResult.success) {
            setTopicsData(topicsResult.data);
          } else {
            setError(topicsResult.error);
          }
          break;

        case 'polls':
          const pollsResult = await nwycService.getActivePolls({ page_num: 0 });
          if (pollsResult.success) {
            setPollsData(pollsResult.data);
          } else {
            setError(pollsResult.error);
          }
          break;

        case 'alerts':
          const alertsResult = await nwycService.getAlerts({ page_num: 1, items: 10 });
          if (alertsResult.success) {
            setAlertsData(alertsResult.data);
          } else {
            setError(alertsResult.error);
          }
          break;

        case 'campaigns':
          const campaignsResult = await nwycService.getCampaigns();
          if (campaignsResult.success) {
            setCampaignsData(campaignsResult.data);
          } else {
            setError(campaignsResult.error);
          }
          break;

        case 'publications':
          const publicationsResult = await nwycService.getPublications();
          if (publicationsResult.success) {
            setPublicationsData(publicationsResult.data);
          } else {
            setError(publicationsResult.error);
          }
          break;
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSectionChange = (section: DemoSection) => {
    setActiveSection(section);
    fetchData(section);
  };

  const handleVoteInPoll = async (choiceId: number) => {
    setLoading(true);
    try {
      const result = await nwycService.voteInPollByChoice(choiceId);
      if (result.success) {
        // Refresh polls data to show updated vote counts
        fetchData('polls');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to vote in poll');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTopic = async (topicId: number) => {
    setLoading(true);
    try {
      const result = await nwycService.addUserTopic(topicId);
      if (result.success) {
        // Refresh topics data
        fetchData('topics');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to add topic');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthTokenChange = (token: string) => {
    setAuthToken(token);
    nwycService.setAuthToken(token);
  };

  // Load initial data
  useEffect(() => {
    fetchData(activeSection);
  }, []);

  const renderSectionContent = () => {
    if (loading) {
      return (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading {sections.find(s => s.id === activeSection)?.label}...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-state">
          <h4>❌ Error Loading Data</h4>
          <p>{error}</p>
          <button className="action-button secondary" onClick={() => fetchData(activeSection)}>
            Try Again
          </button>
        </div>
      );
    }

    switch (activeSection) {
      case 'authentication':
        return renderAuthenticationSection();
      case 'content':
        return renderContentSection();
      case 'topics':
        return renderTopicsSection();
      case 'polls':
        return renderPollsSection();
      case 'alerts':
        return renderAlertsSection();
      case 'campaigns':
        return renderCampaignsSection();
      case 'publications':
        return renderPublicationsSection();
      default:
        return <div>Select a section to view data</div>;
    }
  };

  const renderAuthenticationSection = () => {
    if (!authData) return <div>No authentication data available</div>;

    return (
      <div className="section-content">
        <h3>Authentication Data</h3>
        <div className="auth-token-input">
          <label>
            Authentication Token:
            <input
              type="text"
              value={authToken || ''}
              onChange={(e) => handleAuthTokenChange(e.target.value)}
              placeholder="Enter authentication token"
            />
          </label>
        </div>
        
        <div className="user-info">
          <h4>User Profile</h4>
          <p><strong>Name:</strong> {authData.data.user.firstname} {authData.data.user.lastname}</p>
          <p><strong>Email:</strong> {authData.data.user.email}</p>
          <p><strong>Address:</strong> {authData.data.user.home_address1}, {authData.data.user.home_city}, {authData.data.user.home_state} {authData.data.user.home_zip}</p>
        </div>

        {authData.data.campaigns && authData.data.campaigns.length > 0 && (
          <div className="user-campaigns">
            <h4>User Campaigns</h4>
            {authData.data.campaigns.map(campaign => (
              <div key={campaign.id} className="campaign-item">
                <strong>{campaign.name}</strong>
                <p>{campaign.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderContentSection = () => {
    if (!frontPageData) return <div>No front page data available</div>;

    return (
      <div className="section-content">
        <h3>Front Page Content</h3>
        
        {frontPageData.data.testimonials && frontPageData.data.testimonials.length > 0 && (
          <div className="testimonials">
            <h4>Testimonials</h4>
            {frontPageData.data.testimonials.map(testimonial => (
              <div key={testimonial.id} className="testimonial-item">
                <blockquote>"{testimonial.testimonial}"</blockquote>
                <cite>— {testimonial.name}, {testimonial.title} at {testimonial.company}</cite>
              </div>
            ))}
          </div>
        )}

        {frontPageData.data.alerts && frontPageData.data.alerts.length > 0 && (
          <div className="featured-alerts">
            <h4>Featured Alerts</h4>
            {frontPageData.data.alerts.map(alert => (
              <div key={alert.id} className="alert-item">
                <h5>{alert.title}</h5>
                <p>{alert.summary}</p>
                <span className={`alert-status ${alert.status}`}>{alert.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderTopicsSection = () => {
    if (!topicsData) return <div>No topics data available</div>;

    return (
      <div className="section-content">
        <h3>Topics ({topicsData.data.total_results} total)</h3>
        <div className="topics-grid">
          {topicsData.data.topics.map(topic => (
            <div key={topic.id} className="topic-item">
              <h4>{topic.name}</h4>
              {topic.featured && <span className="featured-badge">Featured</span>}
              {topic.image_url && <img src={topic.image_url} alt={topic.name} className="topic-image" />}
              <button 
                className="action-button secondary"
                onClick={() => handleAddTopic(topic.id)}
                disabled={loading}
              >
                Add to My Topics
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPollsSection = () => {
    if (!pollsData) return <div>No polls data available</div>;

    return (
      <div className="section-content">
        <h3>Active Polls ({pollsData.data.total_results} total)</h3>
        <div className="polls-list">
          {pollsData.data.polls.map(poll => (
            <div key={poll.id} className="poll-item">
              <h4>{poll.question}</h4>
              {poll.description && <p>{poll.description}</p>}
              <div className="poll-choices">
                {poll.choices.map(choice => (
                  <div key={choice.id} className="poll-choice">
                    <button
                      className={`choice-button ${poll.user_vote === choice.id ? 'voted' : ''}`}
                      onClick={() => handleVoteInPoll(choice.id)}
                      disabled={loading || poll.user_vote !== undefined}
                    >
                      {choice.choice} ({choice.votes} votes)
                    </button>
                  </div>
                ))}
              </div>
              {poll.user_vote && <p className="vote-status">✓ You voted for choice {poll.user_vote}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAlertsSection = () => {
    if (!alertsData) return <div>No alerts data available</div>;

    return (
      <div className="section-content">
        <h3>Action Alerts ({alertsData.data.total_results} total)</h3>
        <div className="alerts-list">
          {alertsData.data.alerts.map(alert => (
            <div key={alert.id} className="alert-item">
              <h4>{alert.title}</h4>
              <p>{alert.summary}</p>
              <div className="alert-meta">
                <span className={`alert-status ${alert.status}`}>{alert.status}</span>
                <span className="alert-type">{alert.alert_format_type}</span>
                {alert.chambers.length > 0 && (
                  <span className="alert-chambers">Chambers: {alert.chambers.join(', ')}</span>
                )}
              </div>
              {alert.expires && (
                <p className="alert-expires">Expires: {new Date(alert.expires).toLocaleDateString()}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCampaignsSection = () => {
    if (!campaignsData) return <div>No campaigns data available</div>;

    return (
      <div className="section-content">
        <h3>Campaigns</h3>
        <div className="campaigns-list">
          {campaignsData.data.campaigns.map(campaign => (
            <div key={campaign.id} className="campaign-item">
              <h4>{campaign.name}</h4>
              <p>{campaign.description}</p>
              <div className="campaign-meta">
                <span>Articles: {campaign.summary_article_count}</span>
                <span>Alert Limit: {campaign.summary_alert_limit}</span>
                {campaign.is_global && <span className="global-badge">Global</span>}
                {campaign.private && <span className="private-badge">Private</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPublicationsSection = () => {
    if (!publicationsData) return <div>No publications data available</div>;

    return (
      <div className="section-content">
        <h3>Publications ({publicationsData.data.total_results} total)</h3>
        <div className="publications-list">
          {publicationsData.data.publications.map(publication => (
            <div key={publication.id} className="publication-item">
              <h4>{publication.name}</h4>
              <p>{publication.description}</p>
              <div className="publication-meta">
                {publication.group_by_date && <span>Grouped by Date</span>}
                {publication.in_service_list && <span>In Service List</span>}
              </div>
              <a href={publication.url} className="publication-link">View Publication</a>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="view">
      <h2>NWYC Service Demo</h2>
      
      <div className="service-info">
        <p>This demo showcases the <strong>NWYC (National Write Your Congressman) API wrapper</strong> with dependency injection.</p>
        <p>
          <strong>Current Implementation:</strong> {' '}
          <span className={`implementation-badge ${AppConfig.USE_REAL_API ? 'real' : 'fake'}`}>
            {AppConfig.USE_REAL_API ? '🌐 Real NWYC API Service' : '🎭 Fake Mock Service'}
          </span>
        </p>
        <p>
          <em>Change the <code>USE_REAL_API</code> setting in AppConfig.ts and restart to switch implementations.</em>
        </p>
      </div>

      <div className="section-navigation">
        {sections.map(section => (
          <button
            key={section.id}
            className={`section-button ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => handleSectionChange(section.id)}
            disabled={loading}
          >
            <div className="section-label">{section.label}</div>
            <div className="section-description">{section.description}</div>
          </button>
        ))}
      </div>

      <div className="section-content-container">
        {renderSectionContent()}
      </div>

      <div className="technical-info">
        <h4>Technical Details:</h4>
        <ul>
          <li>Service retrieved via: <code>useService&lt;INwycService&gt;('INwycService')</code></li>
          <li>Factory type: <code>NwycServiceFactory</code> (Singleton)</li>
          <li>HTTP Layer: <code>{AppConfig.USE_REAL_API ? 'RealAxiosService' : 'FakeAxiosService'}</code></li>
          <li>Business Logic: <code>NwycService</code> (47 endpoint methods)</li>
          <li>Authentication: Token-based with automatic header injection</li>
          <li>Error handling: Service-level error management with user-friendly messages</li>
          <li>Type Safety: Full TypeScript coverage with OpenAPI-generated types</li>
        </ul>
      </div>
    </div>
  );
};
