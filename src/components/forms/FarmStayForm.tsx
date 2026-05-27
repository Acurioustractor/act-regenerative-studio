'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

interface FarmStayFormProps {
  className?: string;
  contextLabel?: string;
  additionalTags?: string[];
}

export function FarmStayForm({
  className = '',
  contextLabel = 'Farm stay enquiry',
  additionalTags = [],
}: FarmStayFormProps) {
  const pathname = usePathname();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    stayType: '',
    preferredDates: '',
    groupSize: '',
    purpose: '',
    accessibilityNeeds: '',
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
          projectCode: 'ACT-BV',
          formType: 'farm-stay',
          fields: formData,
          additionalTags: [
            'Farm Stay',
            'Accommodation',
            `Stay: ${formData.stayType || 'Unspecified'}`,
            `Context: ${contextLabel}`,
            `Route: ${pathname}`,
            ...additionalTags,
          ],
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setMessage('Thanks for your inquiry! We\'ll review your request and be in touch about availability.');
        setFormData({ firstName: '', lastName: '', email: '', phone: '', stayType: '', preferredDates: '', groupSize: '', purpose: '', accessibilityNeeds: '', comments: '' });
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
          <label htmlFor="stayType" className={labelClass}>Stay type</label>
          <select
            id="stayType"
            name="stayType"
            value={formData.stayType}
            onChange={handleChange}
            disabled={status === 'loading'}
            className={inputClass}
          >
            <option value="">Select accommodation</option>
            <option value="residency-cabin">Residency cabin</option>
            <option value="farmhouse">Farmhouse stay</option>
            <option value="group">Group accommodation</option>
          </select>
        </div>
        <div>
          <label htmlFor="groupSize" className={labelClass}>Group size</label>
          <select
            id="groupSize"
            name="groupSize"
            value={formData.groupSize}
            onChange={handleChange}
            disabled={status === 'loading'}
            className={inputClass}
          >
            <option value="">How many people?</option>
            <option value="1">Just me</option>
            <option value="2">2 people</option>
            <option value="3-5">3-5 people</option>
            <option value="6+">6+ people</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="preferredDates" className={labelClass}>Preferred dates</label>
        <input
          type="text"
          id="preferredDates"
          name="preferredDates"
          value={formData.preferredDates}
          onChange={handleChange}
          placeholder="e.g., March 2026, flexible on dates"
          disabled={status === 'loading'}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="purpose" className={labelClass}>Purpose of visit</label>
        <textarea
          id="purpose"
          name="purpose"
          value={formData.purpose}
          onChange={handleChange}
          placeholder="Tell us about your work, research, or what brings you to the farm..."
          rows={3}
          disabled={status === 'loading'}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="accessibilityNeeds" className={labelClass}>Accessibility needs</label>
        <input
          type="text"
          id="accessibilityNeeds"
          name="accessibilityNeeds"
          value={formData.accessibilityNeeds}
          onChange={handleChange}
          placeholder="Any mobility, dietary, or other accessibility requirements?"
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
          placeholder="Anything else we should know?"
          rows={2}
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
          {status === 'loading' ? 'Submitting...' : 'Request dates'}
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
