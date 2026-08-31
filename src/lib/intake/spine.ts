/**
 * Client for the ACT intake spine (`intake` edge function on tednluwflfhxyucgwigh).
 *
 * WHY THIS EXISTS
 * Every ACT property currently decides for itself who gets told about a submission,
 * and they disagree. This site fires a GHL webhook. Goods sends a conversation plus an
 * email. JusticeHub emails the sender and tells no one here at all. The spine is the
 * one place that computes the lane from (projectCode, formType) against an explicit
 * allowlist, default-denying to duty_of_care, so a person in trouble can never become
 * a CRM record by accident. See supabase/functions/intake/lanes.ts in the spine repo.
 *
 * WHY IT CANNOT BREAK A FORM
 * Three properties, in order of how they fail:
 *
 *   1. Unconfigured is silent. With no ACT_INTAKE_URL or ACT_INTAKE_KEY this returns
 *      `not-configured` without a network call and without logging an error. Shipping
 *      this file changes nothing until someone sets the env.
 *   2. It never throws. Every failure is a returned reason. A caller that ignores the
 *      result is still correct.
 *   3. It times out fast. A slow or dead spine costs the submitter INTAKE_TIMEOUT_MS,
 *      never their submission, because callers mirror to it rather than depend on it.
 *
 * MIRROR FIRST, CUT OVER LATER. Call this alongside the existing delivery path, not
 * instead of it. When the spine has carried a site's real traffic for long enough to
 * trust, delete that site's old path. Doing it the other way round means the first
 * bug in the spine is a lost enquiry from a real person.
 */

/** How long a caller will wait for the spine before giving up on it. */
const INTAKE_TIMEOUT_MS = 4000;

export interface IntakeSubmission {
  /** Stable slug for the calling property. Must match its ACT_INTAKE_KEY_<SLUG> secret. */
  site: string;
  /** Canonical ACT project code, e.g. ACT-CORE. Half of the lane decision. */
  projectCode: string;
  /** Form identity, e.g. 'contact'. The other half of the lane decision. */
  formType: string;
  fields: Record<string, unknown>;
  additionalTags?: string[];
  consent?: { newsletter?: boolean; sourceUrl?: string; timestamp?: string };
  /**
   * Dedupe handle. Supply the upstream row id when mirroring an existing store, or
   * the spine derives one from (site, formType, email, today) which collapses a
   * genuine second submission from the same person on the same day.
   */
  idempotencyKey?: string;
  capturedAt?: string;
  /** Honeypot passthrough. Any value marks the submission as a bot. */
  website?: string;
  /** Caller-side signal that this submission needs a human, whatever the form says. */
  safetyRisk?: boolean;
}

export type IntakeOutcome =
  | { delivered: true; id?: string; lane?: string }
  | { delivered: false; reason: 'not-configured' | 'rejected' | 'unreachable' | 'timeout'; detail?: string };

/**
 * Mirror a submission to the spine. Resolves an outcome, never rejects.
 *
 * The lane is deliberately NOT a parameter. The caller cannot set, suggest or
 * influence it; the spine derives it server-side and an unlisted pair falls to
 * duty_of_care. That is the whole point of routing through one endpoint.
 */
export async function mirrorToIntake(submission: IntakeSubmission): Promise<IntakeOutcome> {
  const url = process.env.ACT_INTAKE_URL;
  const key = process.env.ACT_INTAKE_KEY;

  // Silent by design. This is the state every property is in until it is switched on,
  // so it must not fill the logs of a site that is working perfectly well without us.
  if (!url || !key) return { delivered: false, reason: 'not-configured' };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), INTAKE_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-act-intake-key': key },
      body: JSON.stringify(submission),
      signal: controller.signal,
    });

    if (!response.ok) {
      // 401 here means this site's key is absent or wrong on the spine, which is the
      // expected state before provisioning and worth saying out loud rather than
      // swallowing: it is the difference between "not switched on" and "misconfigured".
      const detail = `${response.status} ${await response.text().catch(() => '')}`.trim();
      return { delivered: false, reason: 'rejected', detail };
    }

    const body = (await response.json().catch(() => ({}))) as { id?: string; lane?: string };
    return { delivered: true, id: body.id, lane: body.lane };
  } catch (error) {
    const timedOut = error instanceof Error && error.name === 'AbortError';
    return {
      delivered: false,
      reason: timedOut ? 'timeout' : 'unreachable',
      detail: error instanceof Error ? error.message : String(error),
    };
  } finally {
    clearTimeout(timer);
  }
}
