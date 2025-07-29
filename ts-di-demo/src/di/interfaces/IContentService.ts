import { 
  FrontPageResponse,
  SearchResponse,
  GetSearchParams
} from '../../types/NwycTypes';

/**
 * Domain-focused content service interface.
 * Manages general content and search.
 */
export interface IContentService {
  /**
   * Get homepage content
   */
  getFrontPageContent(): Promise<{ success: boolean; content?: FrontPageResponse; error?: string }>;

  /**
   * Search across content types
   */
  searchContent(query: GetSearchParams): Promise<{ success: boolean; results?: SearchResponse; error?: string }>;
}
