'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

interface NewsletterFormProps {
  projectCode?: string;  // e.g., 'ACT-HV' for The Harvest
  contextLabel?: string;
  source?: string;
  projectSlug?: string;
  storySlug?: string;
  audience?: string;
  additionalTags?: string[];
  className?: string;
}

export function NewsletterForm({
  projectCode,
  contextLabel = 'Footer newsletter signup',
  source = 'footer',
  projectSlug,
  storySlug,
  audience,
  additionalTags = [],
  className = '',
}: NewsletterFormProps) {
  const pathname = usePathname();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectCode: projectCode || 'ACT-IN', // Default to ACT Infrastructure
          formType: 'newsletter',
          fields: { email },
          additionalTags: [
            'Newsletter',
            `Context: ${contextLabel}`,
            `Route: ${pathname}`,
            `Source: ${source}`,
            ...(projectSlug ? [`Project: ${projectSlug}`] : []),
            ...(storySlug ? [`Story: ${storySlug}`] : []),
            ...(audience ? [`Audience: ${audience}`] : []),
            ...additionalTags,
          ],
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setMessage('Thanks for subscribing!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(result.error || 'Something went wrong');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error - please try again');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col gap-2 ${className}`}>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          disabled={status === 'loading'}
          className="flex-1 rounded border border-[#E4D7BF] bg-white px-3 py-2 text-sm text-[var(--we-olive)] placeholder:text-[#B8A88A] focus:border-[#4CAF50] focus:outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded bg-[#4CAF50] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#3D9143] disabled:opacity-50"
        >
          {status === 'loading' ? '...' : 'Join'}
        </button>
      </div>
      {message && (
        <p className={`text-xs ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
    </form>
  );
}
