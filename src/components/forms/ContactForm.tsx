'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import styles from './contact-form.module.css';

interface ContactFormProps {
  projectCode?: string;
  formType?: string;
  contextLabel?: string;
  additionalTags?: string[];
  className?: string;
}

export function ContactForm({
  projectCode = 'ACT-IN',
  formType = 'contact',
  contextLabel = 'General studio contact',
  additionalTags = [],
  className = '',
}: ContactFormProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const presetInquiryType = searchParams.get('type') || '';
  const presetSource = searchParams.get('source') || '';
  const presetContext = searchParams.get('context') || '';
  const [formData, setFormData] = useState({ firstName: '', email: '', inquiryType: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (presetInquiryType) setFormData((current) => ({ ...current, inquiryType: presetInquiryType }));
  }, [presetInquiryType]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');
    try {
      const response = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectCode,
          formType,
          fields: {
            ...formData,
            context: contextLabel,
            source_route: pathname,
            ...(presetSource ? { preset_source: presetSource } : {}),
            ...(presetContext ? { requested_context: presetContext } : {}),
          },
          additionalTags,
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'The message could not be sent.');
      setStatus('success');
      setMessage('Thank you. Your message has reached us.');
      setFormData({ firstName: '', email: '', inquiryType: '', message: '' });
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'The message could not be sent. Please email hi@act.place.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`${styles.form} ${className}`}>
      <div className={styles.twoUp}>
        <label>
          <span>Your name</span>
          <input required name="firstName" value={formData.firstName} onChange={handleChange} autoComplete="given-name" placeholder="What should we call you?" disabled={status === 'loading'} />
        </label>
        <label>
          <span>Your email</span>
          <input required type="email" name="email" value={formData.email} onChange={handleChange} autoComplete="email" placeholder="you@example.com" disabled={status === 'loading'} />
        </label>
      </div>
      <label>
        <span>What brings you here?</span>
        <select required name="inquiryType" value={formData.inquiryType} onChange={handleChange} disabled={status === 'loading'}>
          <option value="">Choose the closest fit</option>
          <option value="project-partnership">A project or partnership</option>
          <option value="commission-cultural-work">Art, story or a commission</option>
          <option value="residency-visit">A visit or residency</option>
          <option value="share-your-story">A story to share</option>
          <option value="support">Supporting the work</option>
          <option value="research">Research or media</option>
          <option value="general">A question or something else</option>
        </select>
      </label>
      <label>
        <span>What is happening?</span>
        <textarea required name="message" value={formData.message} onChange={handleChange} rows={6} placeholder="Tell us enough to understand the place, people and question. It does not need to be polished." disabled={status === 'loading'} />
      </label>
      <div className={styles.finish}>
        <p>We will only use these details to respond to your enquiry.</p>
        <button type="submit" disabled={status === 'loading'}>{status === 'loading' ? 'Sending…' : 'Send the question'} <span>→</span></button>
      </div>
      {message ? <p className={status === 'success' ? styles.success : styles.error} role="status">{message}</p> : null}
    </form>
  );
}
