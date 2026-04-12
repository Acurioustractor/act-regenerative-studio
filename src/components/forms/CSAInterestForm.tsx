'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

interface CSAInterestFormProps {
  className?: string;
  contextLabel?: string;
  additionalTags?: string[];
}

export function CSAInterestForm({
  className = '',
  contextLabel = 'CSA interest',
  additionalTags = [],
}: CSAInterestFormProps) {
  const pathname = usePathname();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    shareType: '',
    householdSize: '',
    dietaryNotes: '',
    comments: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email) {
      setStatus('error');
      setMessage('Please enter your email address');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectCode: 'ACT-HV',
          formType: 'csa',
          fields: formData,
          additionalTags: [
            'CSA Interest',
            'The Harvest',
            `Share: ${formData.shareType || 'Unspecified'}`,
            `Context: ${contextLabel}`,
            `Route: ${pathname}`,
            ...additionalTags,
          ],
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setMessage('Thanks for your interest! We\'ll be in touch as harvest shares become available.');
        setFormData({ firstName: '', lastName: '', email: '', phone: '', shareType: '', householdSize: '', dietaryNotes: '', comments: '' });
      } else {
        setStatus('error');
        setMessage(result.error || 'Something went wrong');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Network error - please try again');
    }
  };

  const inputClass = "w-full rounded border border-[#E4D7BF] bg-white px-4 py-3 text-[#2F3E2E] placeholder:text-[#B8A88A] focus:border-[#4CAF50] focus:outline-none disabled:opacity-50";
  const labelClass = "block text-sm font-medium text-[#4A4035] mb-1";

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
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
          <label htmlFor="email" className={labelClass}>Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            disabled={status === 'loading'}
            className={inputClass}
          />
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
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="shareType" className={labelClass}>Share type</label>
          <select
            id="shareType"
            name="shareType"
            value={formData.shareType}
            onChange={handleChange}
            disabled={status === 'loading'}
            className={inputClass}
          >
            <option value="">Select a share type</option>
            <option value="weekly">Weekly share</option>
            <option value="fortnightly">Fortnightly share</option>
            <option value="community">Community share (subsidized)</option>
          </select>
        </div>
        <div>
          <label htmlFor="householdSize" className={labelClass}>Household size</label>
          <select
            id="householdSize"
            name="householdSize"
            value={formData.householdSize}
            onChange={handleChange}
            disabled={status === 'loading'}
            className={inputClass}
          >
            <option value="">How many people?</option>
            <option value="1-2">1-2 people</option>
            <option value="3-4">3-4 people</option>
            <option value="5+">5+ people</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="dietaryNotes" className={labelClass}>Dietary notes</label>
        <input
          type="text"
          id="dietaryNotes"
          name="dietaryNotes"
          value={formData.dietaryNotes}
          onChange={handleChange}
          placeholder="Any allergies or preferences we should know about?"
          disabled={status === 'loading'}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="comments" className={labelClass}>Additional notes</label>
        <textarea
          id="comments"
          name="comments"
          value={formData.comments}
          onChange={handleChange}
          placeholder="Anything else you'd like us to know?"
          rows={3}
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
          {status === 'loading' ? 'Registering...' : 'Register interest'}
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
