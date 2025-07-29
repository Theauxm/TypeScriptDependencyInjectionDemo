import { 
  TopicsResponse,
  GetTopicsParams,
  TopicResponse,
  UserTopicsResponse,
  TalkingPoint
} from '../../types/NwycTypes';

/**
 * Domain-focused topics service interface.
 * Manages political topics and issues.
 */
export interface ITopicsService {
  /**
   * Get available political topics
   */
  getAllTopics(filters?: GetTopicsParams): Promise<{ success: boolean; topics?: TopicsResponse; error?: string }>;

  /**
   * Get specific topic information
   */
  getTopicDetails(topicId: number): Promise<{ success: boolean; topic?: TopicResponse; error?: string }>;

  /**
   * Subscribe to topic
   */
  addUserTopic(topicId: number): Promise<{ success: boolean; userTopics?: UserTopicsResponse; error?: string }>;

  /**
   * Unsubscribe from topic
   */
  removeUserTopic(topicId: number): Promise<{ success: boolean; userTopics?: UserTopicsResponse; error?: string }>;

  /**
   * Get user's subscribed topics
   */
  getUserTopics(): Promise<{ success: boolean; userTopics?: UserTopicsResponse; error?: string }>;

  /**
   * Get advocacy talking points
   */
  getDefaultTalkingPoints(): Promise<{ success: boolean; talkingPoints?: TalkingPoint[]; error?: string }>;
}
