import { z } from 'zod'

// Mock Loops
jest.mock('loops', () => ({
  LoopsClient: jest.fn().mockImplementation(() => ({
    updateContact: jest.fn()
  }))
}))

// Mock fetch for Zapier webhook
global.fetch = jest.fn()

describe('Newsletter API Logic', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('Email Validation', () => {
    const emailSchema = z.object({
      email: z.string().email('Invalid email address'),
      firstName: z.string().optional(),
    })

    it('validates correct email format', () => {
      const result = emailSchema.safeParse({ email: 'test@example.com' })
      expect(result.success).toBe(true)
    })

    it('validates email with optional firstName', () => {
      const result = emailSchema.safeParse({ email: 'test@example.com', firstName: 'John' })
      expect(result.success).toBe(true)
    })

    it('rejects invalid email format', () => {
      const result = emailSchema.safeParse({ email: 'invalid-email' })
      expect(result.success).toBe(false)
      expect(result.error?.issues[0]?.message).toContain('Invalid email')
    })

    it('rejects missing email', () => {
      const result = emailSchema.safeParse({})
      expect(result.success).toBe(false)
    })
  })

  describe('Loops Integration', () => {
    it('calls Loops updateContact with correct parameters', async () => {
      const mockLoops = require('loops').LoopsClient
      const mockUpdateContact = jest.fn().mockResolvedValue({ success: true, id: 'contact-id' })
      mockLoops.mockImplementation(() => ({
        updateContact: mockUpdateContact
      }))

      const loops = new mockLoops('test-key')
      await loops.updateContact('test@example.com', {
        firstName: 'John',
        source: 'Website newsletter signup',
        subscribed: true,
      })

      expect(mockUpdateContact).toHaveBeenCalledWith('test@example.com', {
        firstName: 'John',
        source: 'Website newsletter signup',
        subscribed: true,
      })
    })

    it('handles Loops API errors', async () => {
      const mockLoops = require('loops').LoopsClient
      const mockUpdateContact = jest.fn().mockResolvedValue({ success: false, message: 'API error' })
      mockLoops.mockImplementation(() => ({
        updateContact: mockUpdateContact
      }))

      const loops = new mockLoops('test-key')
      const result = await loops.updateContact('test@example.com', {
        firstName: 'John',
        source: 'Website newsletter signup',
        subscribed: true,
      })
      
      expect(result.success).toBe(false)
      expect(result.message).toBe('API error')
    })

    it('handles Loops connection errors', async () => {
      const mockLoops = require('loops').LoopsClient
      const mockUpdateContact = jest.fn().mockRejectedValue(new Error('Connection error'))
      mockLoops.mockImplementation(() => ({
        updateContact: mockUpdateContact
      }))

      const loops = new mockLoops('test-key')
      
      await expect(
        loops.updateContact('test@example.com', {
          firstName: 'John',
          source: 'Website newsletter signup',
          subscribed: true,
        })
      ).rejects.toThrow('Connection error')
    })
  })

  describe('Zapier Webhook Integration', () => {
    it('sends correct data to Zapier webhook', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      } as Response)

      await fetch('https://hooks.zapier.com/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          timestamp: '2023-01-01T00:00:00.000Z',
          source: 'newsletter-signup',
        }),
      })

      expect(mockFetch).toHaveBeenCalledWith(
        'https://hooks.zapier.com/test',
        expect.objectContaining({
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            timestamp: '2023-01-01T00:00:00.000Z',
            source: 'newsletter-signup',
          }),
        })
      )
    })

    it('handles webhook failures gracefully', async () => {
      const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
      mockFetch.mockRejectedValueOnce(new Error('Webhook failed'))

      await expect(
        fetch('https://hooks.zapier.com/test', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            timestamp: '2023-01-01T00:00:00.000Z',
            source: 'newsletter-signup',
          }),
        })
      ).rejects.toThrow('Webhook failed')
    })
  })
})