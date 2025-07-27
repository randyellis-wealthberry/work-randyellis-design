import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NewsletterSignup } from '@/components/ui/newsletter-signup'

// Mock fetch
global.fetch = jest.fn()

describe('NewsletterSignup', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('renders newsletter signup form', () => {
    render(<NewsletterSignup />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /subscribe/i })).toBeInTheDocument()
  })

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup()
    render(<NewsletterSignup />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /subscribe/i })
    
    await user.type(emailInput, 'invalid-email')
    
    // Trigger blur to activate validation
    await user.tab()
    
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('shows validation error for empty email', async () => {
    const user = userEvent.setup()
    render(<NewsletterSignup />)
    
    const submitButton = screen.getByRole('button', { name: /subscribe/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('submits form with valid email', async () => {
    const user = userEvent.setup()
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    } as Response)
    
    render(<NewsletterSignup />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /subscribe/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)
    
    expect(mockFetch).toHaveBeenCalledWith('/api/newsletter/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: 'test@example.com' }),
    })
  })

  it('shows loading state during submission', async () => {
    const user = userEvent.setup()
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    render(<NewsletterSignup />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /subscribe/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)
    
    expect(screen.getByText(/subscribing/i)).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })

  it('shows success message after successful submission', async () => {
    const user = userEvent.setup()
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    } as Response)
    
    render(<NewsletterSignup />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /subscribe/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/successfully subscribed/i)).toBeInTheDocument()
    })
  })

  it('shows error message on API failure', async () => {
    const user = userEvent.setup()
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Server error' })
    } as Response)
    
    render(<NewsletterSignup />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /subscribe/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    })
  })

  it('has proper accessibility attributes', () => {
    render(<NewsletterSignup />)
    
    const emailInput = screen.getByLabelText(/email/i)
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(emailInput).toHaveAttribute('required')
    expect(emailInput).toHaveAttribute('aria-describedby')
  })

  it('clears form after successful submission', async () => {
    const user = userEvent.setup()
    const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    } as Response)
    
    render(<NewsletterSignup />)
    
    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement
    const submitButton = screen.getByRole('button', { name: /subscribe/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(emailInput.value).toBe('')
    })
  })
})