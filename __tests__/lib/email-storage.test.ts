import { promises as fs } from 'fs';
import path from 'path';
import { emailStorage, EmailSubscription } from '@/lib/email-storage';

// Mock fs to avoid actual file operations during tests
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
    mkdir: jest.fn(),
    access: jest.fn(),
  },
}));

const mockFs = fs as jest.Mocked<typeof fs>;

describe('EmailStorage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock successful directory access by default
    mockFs.access.mockResolvedValue(undefined);
  });

  describe('addSubscription', () => {
    it('adds new subscription successfully', async () => {
      // Mock empty file (no existing subscriptions)
      mockFs.readFile.mockRejectedValueOnce(new Error('File not found'));
      mockFs.writeFile.mockResolvedValueOnce(undefined);

      const result = await emailStorage.addSubscription({
        email: 'test@example.com',
        source: 'website',
        ipAddress: '127.0.0.1',
        userAgent: 'test-agent',
        signupSource: 'Newsletter form',
      });

      expect(result.email).toBe('test@example.com');
      expect(result.status).toBe('subscribed');
      expect(result.source).toBe('website');
      expect(result.metadata.ipAddress).toBe('127.0.0.1');
      expect(result.metadata.emailProvider).toBe('example.com');
      expect(result.metadata.consentGiven).toBe(true);
      expect(mockFs.writeFile).toHaveBeenCalled();
    });

    it('detects common email providers', async () => {
      mockFs.readFile.mockRejectedValueOnce(new Error('File not found'));
      mockFs.writeFile.mockResolvedValueOnce(undefined);

      const result = await emailStorage.addSubscription({
        email: 'user@gmail.com',
      });

      expect(result.metadata.emailProvider).toBe('Gmail');
    });

    it('updates existing subscription', async () => {
      const existingSubscriptions = [
        {
          id: 'existing-id',
          email: 'test@example.com',
          status: 'unsubscribed',
          source: 'old-source',
          subscribedAt: '2023-01-01T00:00:00.000Z',
          metadata: {
            consentGiven: true,
            consentTimestamp: '2023-01-01T00:00:00.000Z',
            emailProvider: 'example.com',
            signupSource: 'Old form',
          },
        } as EmailSubscription,
      ];

      mockFs.readFile.mockResolvedValueOnce(JSON.stringify(existingSubscriptions));
      mockFs.writeFile.mockResolvedValueOnce(undefined);

      const result = await emailStorage.addSubscription({
        email: 'test@example.com',
        source: 'website',
      });

      expect(result.status).toBe('subscribed');
      expect(result.metadata.signupSource).toBe('Newsletter form');
    });
  });

  describe('getSubscription', () => {
    it('retrieves existing subscription', async () => {
      const subscriptions = [
        {
          id: 'test-id',
          email: 'test@example.com',
          status: 'subscribed',
          source: 'website',
          subscribedAt: '2023-01-01T00:00:00.000Z',
          metadata: {
            consentGiven: true,
            consentTimestamp: '2023-01-01T00:00:00.000Z',
            emailProvider: 'example.com',
            signupSource: 'Newsletter form',
          },
        } as EmailSubscription,
      ];

      mockFs.readFile.mockResolvedValueOnce(JSON.stringify(subscriptions));

      const result = await emailStorage.getSubscription('test@example.com');

      expect(result).not.toBeNull();
      expect(result?.email).toBe('test@example.com');
      expect(result?.status).toBe('subscribed');
    });

    it('returns null for non-existent subscription', async () => {
      mockFs.readFile.mockResolvedValueOnce(JSON.stringify([]));

      const result = await emailStorage.getSubscription('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('updateSubscriptionStatus', () => {
    it('updates subscription status successfully', async () => {
      const subscriptions = [
        {
          id: 'test-id',
          email: 'test@example.com',
          status: 'pending',
          source: 'website',
          subscribedAt: '2023-01-01T00:00:00.000Z',
          metadata: {
            consentGiven: true,
            consentTimestamp: '2023-01-01T00:00:00.000Z',
            emailProvider: 'example.com',
            signupSource: 'Newsletter form',
          },
        } as EmailSubscription,
      ];

      mockFs.readFile.mockResolvedValueOnce(JSON.stringify(subscriptions));
      mockFs.writeFile.mockResolvedValueOnce(undefined);

      const result = await emailStorage.updateSubscriptionStatus('test@example.com', 'verified');

      expect(result?.status).toBe('verified');
      expect(result?.verifiedAt).toBeDefined();
    });

    it('returns null for non-existent subscription', async () => {
      mockFs.readFile.mockResolvedValueOnce(JSON.stringify([]));

      const result = await emailStorage.updateSubscriptionStatus('nonexistent@example.com', 'verified');

      expect(result).toBeNull();
    });
  });

  describe('getStats', () => {
    it('calculates statistics correctly', async () => {
      const subscriptions = [
        {
          id: 'id1',
          email: 'user1@gmail.com',
          status: 'subscribed',
          source: 'website',
          subscribedAt: '2023-01-15T00:00:00.000Z',
          metadata: {
            consentGiven: true,
            consentTimestamp: '2023-01-15T00:00:00.000Z',
            emailProvider: 'Gmail',
            signupSource: 'Newsletter form',
          },
        },
        {
          id: 'id2',
          email: 'user2@gmail.com',
          status: 'verified',
          source: 'website',
          subscribedAt: '2023-01-20T00:00:00.000Z',
          metadata: {
            consentGiven: true,
            consentTimestamp: '2023-01-20T00:00:00.000Z',
            emailProvider: 'Gmail',
            signupSource: 'Newsletter form',
          },
        },
        {
          id: 'id3',
          email: 'user3@yahoo.com',
          status: 'unsubscribed',
          source: 'social',
          subscribedAt: '2023-02-10T00:00:00.000Z',
          metadata: {
            consentGiven: true,
            consentTimestamp: '2023-02-10T00:00:00.000Z',
            emailProvider: 'Yahoo',
            signupSource: 'Social media',
          },
        },
      ] as EmailSubscription[];

      mockFs.readFile.mockResolvedValueOnce(JSON.stringify(subscriptions));

      const stats = await emailStorage.getStats();

      expect(stats.totalSubscriptions).toBe(3);
      expect(stats.activeSubscriptions).toBe(2); // subscribed + verified
      expect(stats.unsubscribed).toBe(1);
      expect(stats.verified).toBe(1);
      expect(stats.subscriptionsByMonth['2023-01']).toBe(2);
      expect(stats.subscriptionsByMonth['2023-02']).toBe(1);
      expect(stats.topEmailProviders['Gmail']).toBe(2);
      expect(stats.topEmailProviders['Yahoo']).toBe(1);
      expect(stats.sources['website']).toBe(2);
      expect(stats.sources['social']).toBe(1);
    });
  });

  describe('deleteSubscription', () => {
    it('deletes existing subscription', async () => {
      const subscriptions = [
        {
          id: 'id1',
          email: 'user1@example.com',
          status: 'subscribed',
          source: 'website',
          subscribedAt: '2023-01-01T00:00:00.000Z',
          metadata: {
            consentGiven: true,
            consentTimestamp: '2023-01-01T00:00:00.000Z',
            emailProvider: 'example.com',
            signupSource: 'Newsletter form',
          },
        },
        {
          id: 'id2',
          email: 'user2@example.com',
          status: 'subscribed',
          source: 'website',
          subscribedAt: '2023-01-01T00:00:00.000Z',
          metadata: {
            consentGiven: true,
            consentTimestamp: '2023-01-01T00:00:00.000Z',
            emailProvider: 'example.com',
            signupSource: 'Newsletter form',
          },
        },
      ] as EmailSubscription[];

      mockFs.readFile.mockResolvedValueOnce(JSON.stringify(subscriptions));
      mockFs.writeFile.mockResolvedValueOnce(undefined);

      const result = await emailStorage.deleteSubscription('user1@example.com');

      expect(result).toBe(true);
      expect(mockFs.writeFile).toHaveBeenCalled();
    });

    it('returns false for non-existent subscription', async () => {
      mockFs.readFile.mockResolvedValueOnce(JSON.stringify([]));

      const result = await emailStorage.deleteSubscription('nonexistent@example.com');

      expect(result).toBe(false);
    });
  });

  describe('file operations', () => {
    it('creates data directory if it does not exist', async () => {
      mockFs.access.mockRejectedValueOnce(new Error('Directory not found'));
      mockFs.mkdir.mockResolvedValueOnce(undefined);
      mockFs.readFile.mockRejectedValueOnce(new Error('File not found'));
      mockFs.writeFile.mockResolvedValueOnce(undefined);

      await emailStorage.addSubscription({
        email: 'test@example.com',
      });

      expect(mockFs.mkdir).toHaveBeenCalledWith(
        expect.stringContaining('data'),
        { recursive: true }
      );
    });

    it('creates backup before writing new data', async () => {
      const existingData = JSON.stringify([]);
      mockFs.readFile
        .mockResolvedValueOnce(existingData) // For backup
        .mockResolvedValueOnce(existingData); // For reading subscriptions
      mockFs.writeFile.mockResolvedValue(undefined);

      await emailStorage.addSubscription({
        email: 'test@example.com',
      });

      expect(mockFs.writeFile).toHaveBeenCalledTimes(2); // backup + main file
    });
  });
});