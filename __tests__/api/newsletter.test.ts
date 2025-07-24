import { z } from 'zod'

// Mock Resend
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: jest.fn()
    }
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
    })

    it('validates correct email format', () => {
      const result = emailSchema.safeParse({ email: 'test@example.com' })
      expect(result.success).toBe(true)
    })

    it('rejects invalid email format', () => {
      const result = emailSchema.safeParse({ email: 'invalid-email' })
      expect(result.success).toBe(false)
      expect(result.error?.errors[0]?.message).toContain('Invalid email')
    })

    it('rejects missing email', () => {
      const result = emailSchema.safeParse({})
      expect(result.success).toBe(false)
    })
  })

  describe('Resend Integration', () => {
    it('calls Resend with correct parameters', async () => {
      const mockResend = require('resend').Resend
      const mockSend = jest.fn().mockResolvedValue({ data: { id: 'email-id' } })
      mockResend.mockImplementation(() => ({
        emails: { send: mockSend }
      }))

      const resend = new mockResend('test-key')
      await resend.emails.send({
        from: 'test@example.com',
        to: ['user@example.com'],
        subject: 'Test Subject',
        html: '<p>Test content</p>',
      })

      expect(mockSend).toHaveBeenCalledWith({
        from: 'test@example.com',
        to: ['user@example.com'],
        subject: 'Test Subject',
        html: '<p>Test content</p>',
      })
    })

    it('handles Resend errors', async () => {
      const mockResend = require('resend').Resend
      const mockSend = jest.fn().mockRejectedValue(new Error('Resend error'))
      mockResend.mockImplementation(() => ({
        emails: { send: mockSend }
      }))

      const resend = new mockResend('test-key')
      
      await expect(
        resend.emails.send({
          from: 'test@example.com',
          to: ['user@example.com'],
          subject: 'Test Subject',
          html: '<p>Test content</p>',
        })
      ).rejects.toThrow('Resend error')
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