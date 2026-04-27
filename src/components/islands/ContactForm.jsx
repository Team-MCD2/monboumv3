// ═══════════════════════════════════════════════════════════════
// ContactForm — /contact page submission island
// Uses: src/lib/emailjs.js → sendContact()
// States: idle | sending | sent | error
// Accessibility: labels, aria-invalid, aria-describedby on errors,
//   aria-live="polite" on the status region.
// Honeypot: hidden `website` field — bots fill, humans don't.
// ═══════════════════════════════════════════════════════════════
import { useState } from 'react';
import ErrorBoundary from './_ErrorBoundary.jsx';
import { sendContact, isConfigured } from '../../lib/emailjs.js';

const SUJETS = [
  { value: '', label: 'Choisir un sujet…' },
  { value: 'commande', label: 'Question sur une commande' },
  { value: 'restaurant', label: "Contacter un restaurant" },
  { value: 'presse', label: 'Presse / média' },
  { value: 'partenariat', label: 'Partenariat' },
  { value: 'autre', label: 'Autre' },
];

function ContactFormFallback() {
  return (
    <div className="bg-white border-2 border-noir/10 p-8">
      <p className="font-body text-noir/80 mb-4">
        Le formulaire n'est pas disponible pour le moment.
      </p>
      <a
        href="mailto:franchise@monboum.fr"
        className="inline-block bg-rouge text-white font-display uppercase text-sm px-6 py-3 hover:bg-noir transition-colors"
      >
        Écrivez-nous directement
      </a>
    </div>
  );
}

function ContactFormImpl() {
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('');
  const [fields, setFields] = useState({
    nom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: '',
    website: '', // honeypot
  });
  const [touched, setTouched] = useState({});

  const update = (k) => (e) =>
    setFields((f) => ({ ...f, [k]: e.target.value }));

  const blur = (k) => () => setTouched((t) => ({ ...t, [k]: true }));

  // ── Validation ──────────────────────────────────────────
  const errors = {};
  if (!fields.nom.trim()) errors.nom = 'Merci de renseigner votre nom.';
  if (!fields.email.trim()) {
    errors.email = 'Merci de renseigner votre e-mail.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = "Format d'e-mail invalide.";
  }
  if (!fields.sujet) errors.sujet = 'Merci de choisir un sujet.';
  if (!fields.message.trim() || fields.message.trim().length < 10) {
    errors.message = 'Message trop court (10 caractères min.).';
  }

  const isValid = Object.keys(errors).length === 0;

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ nom: true, email: true, sujet: true, message: true });
    if (!isValid) return;

    // Honeypot check — silently succeed for bots
    if (fields.website) {
      setStatus('sent');
      return;
    }

    setStatus('sending');
    setErrorMsg('');
    const result = await sendContact({
      from_name: fields.nom,
      from_email: fields.email,
      phone: fields.telephone || '—',
      subject: fields.sujet,
      message: fields.message,
    });
    if (result.ok) {
      setStatus('sent');
      setFields({
        nom: '',
        email: '',
        telephone: '',
        sujet: '',
        message: '',
        website: '',
      });
      setTouched({});
    } else {
      setStatus('error');
      setErrorMsg(result.error);
    }
  }

  // ── Success state ───────────────────────────────────────
  if (status === 'sent') {
    return (
      <div
        className="bg-white border-2 border-rouge p-8 md:p-12 text-center"
        role="status"
        aria-live="polite"
      >
        <p className="font-display text-rouge text-5xl md:text-6xl uppercase leading-none mb-4">
          Merci !
        </p>
        <p className="font-body text-noir/80 mb-6">
          Votre message est bien arrivé. Nous vous répondons au plus vite.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="font-body text-sm text-rouge hover:underline uppercase tracking-wider"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  const showError = (k) => touched[k] && errors[k];
  const inputClass = (k) =>
    `w-full bg-white border-2 px-4 py-3 font-body text-noir transition-colors focus:outline-none focus:border-rouge ${
      showError(k) ? 'border-rouge' : 'border-noir/15'
    }`;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white border-2 border-noir/10 p-6 md:p-10"
    >
      {!isConfigured && (
        <div className="mb-6 bg-jaune/20 border-l-4 border-jaune p-4 font-body text-sm text-noir/80">
          ⚠ Le formulaire est en mode démonstration. Vos messages ne seront pas
          encore reçus.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="cf-nom"
            className="block font-body text-xs uppercase tracking-wider text-noir mb-2"
          >
            Nom complet <span className="text-rouge">*</span>
          </label>
          <input
            id="cf-nom"
            type="text"
            autoComplete="name"
            value={fields.nom}
            onChange={update('nom')}
            onBlur={blur('nom')}
            className={inputClass('nom')}
            aria-invalid={showError('nom') ? 'true' : 'false'}
            aria-describedby={showError('nom') ? 'cf-nom-err' : undefined}
            required
          />
          {showError('nom') && (
            <p id="cf-nom-err" className="font-body text-xs text-rouge mt-1">
              {errors.nom}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="cf-email"
            className="block font-body text-xs uppercase tracking-wider text-noir mb-2"
          >
            E-mail <span className="text-rouge">*</span>
          </label>
          <input
            id="cf-email"
            type="email"
            autoComplete="email"
            value={fields.email}
            onChange={update('email')}
            onBlur={blur('email')}
            className={inputClass('email')}
            aria-invalid={showError('email') ? 'true' : 'false'}
            aria-describedby={showError('email') ? 'cf-email-err' : undefined}
            required
          />
          {showError('email') && (
            <p id="cf-email-err" className="font-body text-xs text-rouge mt-1">
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label
            htmlFor="cf-tel"
            className="block font-body text-xs uppercase tracking-wider text-noir mb-2"
          >
            Téléphone
          </label>
          <input
            id="cf-tel"
            type="tel"
            autoComplete="tel"
            value={fields.telephone}
            onChange={update('telephone')}
            className={inputClass('telephone')}
          />
        </div>

        <div>
          <label
            htmlFor="cf-sujet"
            className="block font-body text-xs uppercase tracking-wider text-noir mb-2"
          >
            Sujet <span className="text-rouge">*</span>
          </label>
          <select
            id="cf-sujet"
            value={fields.sujet}
            onChange={update('sujet')}
            onBlur={blur('sujet')}
            className={inputClass('sujet')}
            aria-invalid={showError('sujet') ? 'true' : 'false'}
            aria-describedby={showError('sujet') ? 'cf-sujet-err' : undefined}
            required
          >
            {SUJETS.map((s) => (
              <option key={s.value} value={s.value} disabled={!s.value}>
                {s.label}
              </option>
            ))}
          </select>
          {showError('sujet') && (
            <p id="cf-sujet-err" className="font-body text-xs text-rouge mt-1">
              {errors.sujet}
            </p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label
          htmlFor="cf-msg"
          className="block font-body text-xs uppercase tracking-wider text-noir mb-2"
        >
          Message <span className="text-rouge">*</span>
        </label>
        <textarea
          id="cf-msg"
          rows="6"
          value={fields.message}
          onChange={update('message')}
          onBlur={blur('message')}
          className={inputClass('message') + ' resize-y'}
          aria-invalid={showError('message') ? 'true' : 'false'}
          aria-describedby={showError('message') ? 'cf-msg-err' : undefined}
          required
        />
        {showError('message') && (
          <p id="cf-msg-err" className="font-body text-xs text-rouge mt-1">
            {errors.message}
          </p>
        )}
      </div>

      {/* Honeypot — visually hidden, bots fill it */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-9999px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
        <label htmlFor="cf-website">Laissez ce champ vide</label>
        <input
          id="cf-website"
          type="text"
          tabIndex="-1"
          autoComplete="off"
          value={fields.website}
          onChange={update('website')}
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="bg-rouge text-white font-display uppercase text-base px-10 py-4 hover:bg-noir transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'sending' ? 'Envoi en cours…' : 'Envoyer le message'}
        </button>
        <p className="font-body text-xs text-noir/50">
          * Champs obligatoires
        </p>
      </div>

      {status === 'error' && (
        <div
          role="alert"
          aria-live="assertive"
          className="mt-6 bg-rouge/5 border-l-4 border-rouge p-4 font-body text-sm text-rouge"
        >
          {errorMsg}
        </div>
      )}
    </form>
  );
}

export default function ContactForm() {
  return (
    <ErrorBoundary fallback={<ContactFormFallback />}>
      <ContactFormImpl />
    </ErrorBoundary>
  );
}
