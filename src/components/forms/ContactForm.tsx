'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

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
  className = ''
}: ContactFormProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const presetInquiryType = searchParams.get('type') || '';
  const presetSource = searchParams.get('source') || '';
  const presetContext = searchParams.get('context') || '';
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    inquiryType: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (presetInquiryType && !formData.inquiryType) {
      setFormData((prev) => ({ ...prev, inquiryType: presetInquiryType }));
    }
  }, [presetInquiryType, formData.inquiryType]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email && !formData.phone) {
      setStatus('error');
      setMessage('Please enter an email or phone number');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectCode,
          formType,
          fields: formData,
          additionalTags: [
            'Contact Form',
            'Website Inquiry',
            `Context: ${contextLabel}`,
            `Route: ${pathname}`,
            ...(presetSource ? [`Source: ${presetSource}`] : []),
            ...(presetContext ? [`Requested context: ${presetContext}`] : []),
            ...additionalTags,
          ],
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setMessage('Thanks for reaching out! We\'ll be in touch soon.');
        setFormData({ firstName: '', lastName: '', email: '', phone: '', inquiryType: '', message: '' });
      } else {
        setStatus('error');
        setMessage(result.error || 'Something went wrong');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error - please try again');
    }
  };

  const inputClass = "w-full rounded border border-[#E4D7BF] bg-white px-4 py-3 text-[var(--we-olive)] placeholder:text-[#B8A88A] focus:border-[#4CAF50] focus:outline-none disabled:opacity-50";
  const labelClass = "block text-sm font-medium text-[var(--we-brown-deep)] mb-1";

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {(presetSource || presetContext) && (
        <div className="rounded-2xl border border-[#D9C9A9] bg-[#F6F1E7]/80 p-4 text-sm text-[var(--we-brown)]">
          <p className="font-medium text-[var(--we-olive)]">
            This enquiry is already carrying page context.
          </p>
          <p className="mt-2 leading-7">
            {presetContext
              ? `You are reaching out from the ${presetContext.replace(/-/g, ' ')} path.`
              : 'You are reaching out from a more specific ACT route.'}{' '}
            We will include that context when the enquiry is routed.
          </p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="firstName" className={labelClass}>First name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Your first name"
            disabled={status === 'loading'}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="lastName" className={labelClass}>Last name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Your last name"
            disabled={status === 'loading'}
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="inquiryType" className={labelClass}>Conversation type</label>
          <select
            id="inquiryType"
            name="inquiryType"
            value={formData.inquiryType}
            onChange={handleChange}
            disabled={status === 'loading'}
            className={inputClass}
          >
            <option value="">Choose the closest fit</option>
            <option value="project-partnership">Project or partnership</option>
            <option value="residency-visit">Residency or visit</option>
            <option value="commission-cultural-work">Commission or cultural work</option>
            <option value="general">General enquiry</option>
          </select>
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            disabled={status === 'loading'}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className={labelClass}>Phone</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+61 4XX XXX XXX"
          disabled={status === 'loading'}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>Message</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us about your project, partnership, or how we can collaborate..."
          rows={5}
          disabled={status === 'loading'}
          className={inputClass}
        />
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full rounded bg-[#4CAF50] px-6 py-3 text-base font-semibold text-white transition hover:bg-[#3D9143] disabled:opacity-50 md:w-auto"
        >
          {status === 'loading' ? 'Sending...' : 'Send message'}
        </button>

        {message && (
          <p className={`text-sm ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
    </form>
  );
}
