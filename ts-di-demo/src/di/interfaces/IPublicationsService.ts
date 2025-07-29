import { 
  PublicationsResponse,
  PublicationArticlesResponse,
  GetPublicationArticlesParams,
  ArticleResponse
} from '../../types/NwycTypes';

/**
 * Domain-focused publications service interface.
 * Manages publications and content.
 */
export interface IPublicationsService {
  /**
   * Get available publications
   */
  getPublications(): Promise<{ success: boolean; publications?: PublicationsResponse; error?: string }>;

  /**
   * Get articles from publication
   */
  getPublicationArticles(publicationId: string, filters?: GetPublicationArticlesParams): Promise<{ success: boolean; articles?: PublicationArticlesResponse; error?: string }>;

  /**
   * Get specific article content
   */
  getArticleDetails(articleId: string): Promise<{ success: boolean; article?: ArticleResponse; error?: string }>;
}
