import { calculateReadTime, calculateAdvancedReadTime, type ArticleMetadata } from '@/lib/utils/read-time';

describe('calculateReadTime', () => {
  it('should calculate basic read time correctly', () => {
    const content = 'This is a test content with exactly twenty words to test the basic reading time calculation function properly here.';
    // 20 words / 200 WPM = 0.1 minutes = ceil(0.1) = 1 minute
    expect(calculateReadTime(content)).toBe(1);
  });

  it('should handle empty content', () => {
    expect(calculateReadTime('')).toBe(1); // Minimum 1 minute
  });

  it('should handle longer content', () => {
    // Create content with approximately 400 words
    const longContent = Array(400).fill('word').join(' ');
    // 400 words / 200 WPM = 2 minutes
    expect(calculateReadTime(longContent)).toBe(2);
  });

  it('should handle content with multiple spaces and newlines', () => {
    const content = 'Word1    Word2\n\nWord3\t\tWord4     Word5';
    // 5 words / 200 WPM = 0.025 minutes = ceil(0.025) = 1 minute
    expect(calculateReadTime(content)).toBe(1);
  });
});

describe('calculateAdvancedReadTime', () => {
  it('should calculate basic time without metadata', () => {
    const content = Array(200).fill('word').join(' '); // 200 words = 1 minute
    expect(calculateAdvancedReadTime(content)).toBe(1);
  });

  it('should add time for images', () => {
    const content = Array(200).fill('word').join(' '); // 1 minute base
    const metadata: ArticleMetadata = {
      wordCount: 200,
      imageCount: 2,
      codeBlockCount: 0,
      complexityScore: 1
    };
    // 1 minute + (2 images * 12 seconds / 60) = 1 + 0.4 = 1.4 = ceil(1.4) = 2 minutes
    expect(calculateAdvancedReadTime(content, metadata)).toBe(2);
  });

  it('should add time for code blocks', () => {
    const content = Array(200).fill('word').join(' '); // 1 minute base
    const metadata: ArticleMetadata = {
      wordCount: 200,
      imageCount: 0,
      codeBlockCount: 3,
      complexityScore: 1
    };
    // 1 minute + (3 code blocks * 30 seconds / 60) = 1 + 1.5 = 2.5 = ceil(2.5) = 3 minutes
    expect(calculateAdvancedReadTime(content, metadata)).toBe(3);
  });

  it('should combine images and code blocks', () => {
    const content = Array(400).fill('word').join(' '); // 2 minutes base
    const metadata: ArticleMetadata = {
      wordCount: 400,
      imageCount: 1,
      codeBlockCount: 2,
      complexityScore: 1
    };
    // 2 minutes + (1 image * 12s/60) + (2 code blocks * 30s/60) = 2 + 0.2 + 1 = 3.2 = ceil(3.2) = 4 minutes
    expect(calculateAdvancedReadTime(content, metadata)).toBe(4);
  });

  it('should handle zero images and code blocks', () => {
    const content = Array(300).fill('word').join(' '); // 1.5 minutes base
    const metadata: ArticleMetadata = {
      wordCount: 300,
      imageCount: 0,
      codeBlockCount: 0,
      complexityScore: 1
    };
    // 1.5 minutes = ceil(1.5) = 2 minutes
    expect(calculateAdvancedReadTime(content, metadata)).toBe(2);
  });
});