import { 
  PollsResponse,
  GetPollsParams,
  PollResponse,
  PollVoteRequest
} from '../../types/NwycTypes';

/**
 * Domain-focused polling service interface.
 * Manages polls and voting.
 */
export interface IPollingService {
  /**
   * Get current active polls
   */
  getActivePolls(filters?: GetPollsParams): Promise<{ success: boolean; polls?: PollsResponse; error?: string }>;

  /**
   * Get all polls with filtering
   */
  getAllPolls(filters?: GetPollsParams): Promise<{ success: boolean; polls?: PollsResponse; error?: string }>;

  /**
   * Get specific poll information
   */
  getPollDetails(pollId: number): Promise<{ success: boolean; poll?: PollResponse; error?: string }>;

  /**
   * Submit poll vote
   */
  voteInPoll(pollId: number, choices: PollVoteRequest): Promise<{ success: boolean; poll?: PollResponse; error?: string }>;

  /**
   * Submit poll vote by choice ID
   */
  voteByChoiceId(choiceId: number): Promise<{ success: boolean; poll?: PollResponse; error?: string }>;

  /**
   * Get user's voting history (derived from poll responses)
   */
  getUserVotingHistory(): Promise<{ success: boolean; polls?: PollsResponse; error?: string }>;
}
