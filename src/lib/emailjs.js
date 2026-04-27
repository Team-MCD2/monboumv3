// ═══════════════════════════════════════════════════════════════
// emailjs.js — frontend-only mail helper with graceful fallback
// Docs: https://www.emailjs.com/docs/sdk/send/
// All vars come from import.meta.env.PUBLIC_* (Astro → Vite exposes
// these to client bundles automatically)
// ═══════════════════════════════════════════════════════════════
import emailjs from '@emailjs/browser';

const PUBLIC_KEY = import.meta.env.PUBLIC_EMAILJS_PUBLIC_KEY || '';
const SERVICE_ID = import.meta.env.PUBLIC_EMAILJS_SERVICE_ID || '';
const TEMPLATE_CONTACT = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_CONTACT || '';
const TEMPLATE_FRANCHISE = import.meta.env.PUBLIC_EMAILJS_TEMPLATE_FRANCHISE || '';

/** True only if all 3 core values are present */
export const isConfigured = Boolean(PUBLIC_KEY && SERVICE_ID);

/** Initialize EmailJS once on the client (safe to call repeatedly) */
let _initialized = false;
function ensureInit() {
  if (_initialized || !PUBLIC_KEY) return;
  try {
    emailjs.init({ publicKey: PUBLIC_KEY });
    _initialized = true;
  } catch (err) {
    console.warn('[emailjs] init failed', err);
  }
}

/**
 * Send a contact-form submission.
 * @param {Record<string, string>} params — matching EmailJS template fields
 * @returns {Promise<{ok: true} | {ok: false, error: string}>}
 */
export async function sendContact(params) {
  if (!isConfigured || !TEMPLATE_CONTACT) {
    return {
      ok: false,
      error:
        "Le formulaire n'est pas encore configuré. Merci de nous écrire directement à franchise@monboum.fr.",
    };
  }
  ensureInit();
  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_CONTACT, params);
    return { ok: true };
  } catch (err) {
    console.error('[emailjs] sendContact failed', err);
    return {
      ok: false,
      error: "Envoi impossible pour le moment. Merci de réessayer plus tard.",
    };
  }
}

/**
 * Send a franchise-application submission.
 * @param {Record<string, string>} params
 * @returns {Promise<{ok: true} | {ok: false, error: string}>}
 */
export async function sendFranchise(params) {
  if (!isConfigured || !TEMPLATE_FRANCHISE) {
    return {
      ok: false,
      error:
        "Le formulaire n'est pas encore configuré. Merci de nous écrire directement à franchise@monboum.fr.",
    };
  }
  ensureInit();
  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_FRANCHISE, params);
    return { ok: true };
  } catch (err) {
    console.error('[emailjs] sendFranchise failed', err);
    return {
      ok: false,
      error: "Envoi impossible pour le moment. Merci de réessayer plus tard.",
    };
  }
}
