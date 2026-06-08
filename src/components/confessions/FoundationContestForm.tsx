'use client';

// Right of reply for foundations. The wall names organisations from public
// records; this is the published way to contest a cell, correct a figure, or
// tell us a foundation does have a way in that we missed. Posts through the
// standard forms pipeline (/api/forms/submit -> GHL + Supabase log) so a real
// person sees every dispute. Project code ACT-IN (studio inbound), tagged so it
// routes to whoever holds the data.

import { useState } from 'react';

export function FoundationContestForm() {
  const [form, setForm] = useState({
    foundation: '',
    name: '',
    role: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [note, setNote] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.foundation.trim()) {
      setStatus('error');
      setNote('Please tell us which foundation this is about.');
      return;
    }
    if (!form.email.trim() && !form.message.trim()) {
      setStatus('error');
      setNote('Add an email so we can reply, or tell us what to correct.');
      return;
    }
    setStatus('loading');
    setNote('');
    try {
      const res = await fetch('/api/forms/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectCode: 'ACT-IN',
          formType: 'payout-wall-contest',
          // foundation + the submitter's role are already in `form` (the fields).
          // Page provenance lives in fields, not tags. Canonical
          // source:/role:/interest:/project: tags are applied server-side by
          // /api/forms/submit (FORM_RULES + project registry) — payout-wall-contest
          // gets role:supporter + interest:justice-reform, no comms:/consent.
          fields: { ...form, source_route: '/confessions/wall' },
          additionalTags: [],
        }),
      });
      const result = await res.json();
      if (result.success) {
        setStatus('success');
        setNote('Thank you. A person will read this and reply. Corrections are made publicly.');
        setForm({ foundation: '', name: '', role: '', email: '', message: '' });
      } else {
        setStatus('error');
        setNote(result.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setNote('Network error. Please try again.');
    }
  };

  const input =
    'w-full rounded-lg border border-[#3A2C18] bg-[#1A130B] px-3.5 py-2.5 font-[var(--font-body)] text-sm text-[#F3EBDD] placeholder:text-[#7C7060] focus:border-[#CFA16B] focus:outline-none disabled:opacity-50';
  const label = 'mb-1.5 block font-[var(--font-sans)] text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9C8E78]';
  const loading = status === 'loading';

  if (status === 'success') {
    return (
      <div className="rounded-2xl border border-[#CFA16B]/50 bg-[#1A130B] p-8 text-center">
        <p className="font-[var(--font-display)] text-xl font-semibold text-[#F8F1E3]">Received.</p>
        <p className="mx-auto mt-3 max-w-md font-[var(--font-body)] text-[15px] leading-7 text-[#C7B9A4]">{note}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-[#3A2C18] bg-[#15100A] p-6 md:p-8">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor="foundation" className={label}>Foundation or organisation *</label>
          <input id="foundation" name="foundation" value={form.foundation} onChange={onChange} disabled={loading} placeholder="The name as it appears on the wall" className={input} />
        </div>
        <div>
          <label htmlFor="name" className={label}>Your name</label>
          <input id="name" name="name" value={form.name} onChange={onChange} disabled={loading} placeholder="Who is writing" className={input} />
        </div>
        <div>
          <label htmlFor="role" className={label}>Your role</label>
          <input id="role" name="role" value={form.role} onChange={onChange} disabled={loading} placeholder="e.g. trustee, program lead" className={input} />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="email" className={label}>Email</label>
          <input id="email" type="email" name="email" value={form.email} onChange={onChange} disabled={loading} placeholder="So we can reply" className={input} />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="message" className={label}>What should we correct?</label>
          <textarea id="message" name="message" rows={5} value={form.message} onChange={onChange} disabled={loading} placeholder="Tell us what is wrong, or what a grantseeker should know, e.g. there is a public way to apply, the figure is out of date, the classification is off. Link a source if you have one." className={input} />
        </div>
      </div>
      <div className="mt-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full border border-[#CFA16B] bg-[#CFA16B] px-6 py-2.5 font-[var(--font-sans)] text-xs font-bold uppercase tracking-[0.22em] text-[#15100A] transition hover:bg-[#E0B068] disabled:opacity-50"
        >
          {loading ? 'Sending…' : 'Send a correction'}
        </button>
        {note && (
          <p className={`font-[var(--font-body)] text-sm ${status === 'error' ? 'text-[#E0896B]' : 'text-[#C7B9A4]'}`}>{note}</p>
        )}
      </div>
    </form>
  );
}
