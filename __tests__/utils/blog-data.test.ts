import { getBlogArticles, getLatestArticles, getPopularArticles, type BlogArticle } from '@/lib/utils/blog-data';

describe('getBlogArticles', () => {
  it('should return an array of blog articles', () => {
    const articles = getBlogArticles();
    expect(Array.isArray(articles)).toBe(true);
    expect(articles.length).toBeGreaterThan(0);
  });

  it('should return articles with required properties', () => {
    const articles = getBlogArticles();
    const article = articles[0];
    
    expect(article).toHaveProperty('slug');
    expect(article).toHaveProperty('title');
    expect(article).toHaveProperty('description');
    expect(article).toHaveProperty('publishedDate');
    expect(article).toHaveProperty('readTime');
    expect(article).toHaveProperty('category');
    expect(article).toHaveProperty('tags');
    
    expect(typeof article.slug).toBe('string');
    expect(typeof article.title).toBe('string');
    expect(typeof article.description).toBe('string');
    expect(typeof article.publishedDate).toBe('string');
    expect(typeof article.readTime).toBe('number');
    expect(typeof article.category).toBe('string');
    expect(Array.isArray(article.tags)).toBe(true);
  });

  it('should return valid date formats', () => {
    const articles = getBlogArticles();
    articles.forEach(article => {
      const date = new Date(article.publishedDate);
      expect(date).toBeInstanceOf(Date);
      expect(isNaN(date.getTime())).toBe(false);
    });
  });
});

describe('getLatestArticles', () => {
  it('should return latest articles in descending order', () => {
    const articles = getLatestArticles(3);
    expect(articles).toHaveLength(3);
    
    // Check that articles are sorted by date (newest first)
    for (let i = 1; i < articles.length; i++) {
      const prevDate = new Date(articles[i - 1].publishedDate);
      const currDate = new Date(articles[i].publishedDate);
      expect(prevDate.getTime()).toBeGreaterThanOrEqual(currDate.getTime());
    }
  });

  it('should limit results to requested count', () => {
    const articles = getLatestArticles(2);
    expect(articles).toHaveLength(2);
  });

  it('should handle requests for more articles than available', () => {
    const articles = getLatestArticles(100);
    const allArticles = getBlogArticles();
    expect(articles).toHaveLength(allArticles.length);
  });
});

describe('getPopularArticles', () => {
  it('should return popular articles', () => {
    const articles = getPopularArticles(3);
    expect(articles).toHaveLength(3);
    
    // All articles should have views property when marked as popular
    articles.forEach(article => {
      expect(typeof article.views).toBe('number');
      expect(article.views).toBeGreaterThan(0);
    });
  });

  it('should sort by views in descending order', () => {
    const articles = getPopularArticles(3);
    
    for (let i = 1; i < articles.length; i++) {
      const prevViews = articles[i - 1].views || 0;
      const currViews = articles[i].views || 0;
      expect(prevViews).toBeGreaterThanOrEqual(currViews);
    }
  });
});