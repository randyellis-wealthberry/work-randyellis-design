/**
 * CSP Nonce Utilities for Next.js
 * 
 * Provides utilities to access and use CSP nonces in React components.
 */

import { headers } from 'next/headers';

/**
 * Get the CSP nonce for the current request (server-side only)
 */
export async function getNonce(): Promise<string | null> {
  try {
    const headersList = await headers();
    return headersList.get('x-nonce');
  } catch {
    // Return null if headers are not available (client-side)
    return null;
  }
}

/**
 * Get the CSP nonce for client-side usage
 * This reads from a meta tag that should be set by the server
 */
export function getClientNonce(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const metaTag = document.querySelector('meta[name="csp-nonce"]');
  return metaTag?.getAttribute('content') || null;
}

/**
 * Script component that automatically includes the CSP nonce
 */
interface NonceScriptProps {
  id?: string;
  src?: string;
  strategy?: 'beforeInteractive' | 'afterInteractive' | 'lazyOnload';
  children?: string;
  dangerouslySetInnerHTML?: {
    __html: string;
  };
}

export function NonceScript({ 
  id, 
  src, 
  strategy = 'afterInteractive', 
  children, 
  dangerouslySetInnerHTML 
}: NonceScriptProps) {
  // This will be handled by Next.js Script component which should automatically
  // include the nonce when CSP headers are detected
  const Script = require('next/script').default;
  
  return (
    <Script
      id={id}
      src={src}
      strategy={strategy}
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
    >
      {children}
    </Script>
  );
}