'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';

interface ResidencyFormProps {
  className?: string;
  contextLabel?: string;
  additionalTags?: string[];
}

export function ResidencyForm({
  className = '',
  contextLabel = 'Residency application',
  additionalTags = [],
}: ResidencyFormProps) {
  const pathname = usePathname();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    website: '',
    residencyType: '',
    practiceType: '',
    projectDescription: '',
    timing: '',
    communityConnection: '',
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
          projectCode: 'ACT-AS',
          formType: 'residency',
          // Provenance (page context/route) lives in fields, not tags — it is
          // preserved on the Supabase row without polluting the GHL tag space.
          // Canonical role:/interest:/source:/project: tags are applied server-side
          // by /api/forms/submit (FORM_RULES + project registry).
          fields: { ...formData, context: contextLabel, source_route: pathname },
          additionalTags: [...additionalTags],
        }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus('success');
        setMessage('Thanks for your application! We\'ll review it and be in touch about next steps.');
        setFormData({ firstName: '', lastName: '', email: '', phone: '', website: '', residencyType: '', practiceType: '', projectDescription: '', timing: '', communityConnection: '', comments: '' });
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
          <label htmlFor="firstName" className={labelClass}>First name *</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Your first name"
            required
            disabled={status === 'loading'}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="lastName" className={labelClass}>Last name *</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Your last name"
            required
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

      <div>
        <label htmlFor="website" className={labelClass}>Website / Portfolio</label>
        <input
          type="url"
          id="website"
          name="website"
          value={formData.website}
          onChange={handleChange}
          placeholder="https://yoursite.com"
          disabled={status === 'loading'}
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="residencyType" className={labelClass}>Residency type</label>
          <select
            id="residencyType"
            name="residencyType"
            value={formData.residencyType}
            onChange={handleChange}
            disabled={status === 'loading'}
            className={inputClass}
          >
            <option value="">Select residency format</option>
            <option value="studio">Studio residency</option>
            <option value="community">Community co-design</option>
            <option value="public">Public showcase</option>
          </select>
        </div>
        <div>
          <label htmlFor="practiceType" className={labelClass}>Practice area</label>
          <select
            id="practiceType"
            name="practiceType"
            value={formData.practiceType}
            onChange={handleChange}
            disabled={status === 'loading'}
            className={inputClass}
          >
            <option value="">Select your practice</option>
            <option value="visual-arts">Visual arts</option>
            <option value="music-sound">Music / Sound</option>
            <option value="writing">Writing / Poetry</option>
            <option value="performance">Performance / Theatre</option>
            <option value="film-media">Film / New media</option>
            <option value="craft-making">Craft / Making</option>
            <option value="research">Research / Academia</option>
            <option value="social-practice">Social practice</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="projectDescription" className={labelClass}>Project description *</label>
        <textarea
          id="projectDescription"
          name="projectDescription"
          value={formData.projectDescription}
          onChange={handleChange}
          placeholder="Tell us about the work you'd like to develop during your residency..."
          rows={4}
          required
          disabled={status === 'loading'}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="timing" className={labelClass}>Preferred timing</label>
        <input
          type="text"
          id="timing"
          name="timing"
          value={formData.timing}
          onChange={handleChange}
          placeholder="e.g., 2-4 weeks in April 2026, or flexible"
          disabled={status === 'loading'}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="communityConnection" className={labelClass}>Community connection</label>
        <textarea
          id="communityConnection"
          name="communityConnection"
          value={formData.communityConnection}
          onChange={handleChange}
          placeholder="How does your practice connect with community, Country, or regenerative principles?"
          rows={3}
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
          placeholder="Anything else we should know about your practice or needs?"
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
          {status === 'loading' ? 'Submitting...' : 'Submit application'}
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
