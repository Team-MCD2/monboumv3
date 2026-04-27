// ═══════════════════════════════════════════════════════════════
// FranchiseForm — /formulaire-de-candidature submission island
// Uses: src/lib/emailjs.js → sendFranchise()
// Fields based on standard French franchise-application template
// (contact + project + financial capacity + message).
// ═══════════════════════════════════════════════════════════════
import { useState } from 'react';
import ErrorBoundary from './_ErrorBoundary.jsx';
import { sendFranchise, isConfigured } from '../../lib/emailjs.js';

const ENSEIGNES_OPTIONS = [
  { value: '', label: 'Choisir une enseigne…' },
  { value: 'Boum Burger', label: 'Boum Burger' },
  { value: "Boum Pizz's", label: "Boum Pizz's" },
  { value: 'Boum Chicken', label: 'Boum Chicken' },
  { value: 'Boum Saveurs', label: 'Boum Saveurs' },
  { value: 'Indifférent', label: 'Indifférent / à définir' },
];

const APPORT_OPTIONS = [
  { value: '', label: 'Choisir une tranche…' },
  { value: '< 100k€', label: 'Moins de 100 000 €' },
  { value: '100k-200k€', label: '100 000 – 200 000 €' },
  { value: '200k-300k€', label: '200 000 – 300 000 €' },
  { value: '> 300k€', label: 'Plus de 300 000 €' },
];

const ECHEANCE_OPTIONS = [
  { value: '', label: 'Choisir une échéance…' },
  { value: 'Immédiat', label: 'Immédiat (3 mois)' },
  { value: '3-6 mois', label: '3 à 6 mois' },
  { value: '6-12 mois', label: '6 à 12 mois' },
  { value: '> 1 an', label: 'Plus d’un an' },
];

function FranchiseFormFallback() {
  return (
    <div className="bg-white border-2 border-noir/10 p-8">
      <p className="font-body text-noir/80 mb-4">
        Le formulaire de candidature n'est pas disponible pour le moment.
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

function FranchiseFormImpl() {
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [fields, setFields] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    ville: '',
    enseigne: '',
    apport: '',
    echeance: '',
    experience: '',
    message: '',
    rgpd: false,
    website: '', // honeypot
  });
  const [touched, setTouched] = useState({});

  const update = (k) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFields((f) => ({ ...f, [k]: val }));
  };
  const blur = (k) => () => setTouched((t) => ({ ...t, [k]: true }));

  // ── Validation ──────────────────────────────────────────
  const errors = {};
  if (!fields.nom.trim()) errors.nom = 'Merci de renseigner votre nom.';
  if (!fields.prenom.trim()) errors.prenom = 'Merci de renseigner votre prénom.';
  if (!fields.email.trim()) {
    errors.email = 'Merci de renseigner votre e-mail.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = "Format d'e-mail invalide.";
  }
  if (!fields.telephone.trim() || fields.telephone.replace(/\D/g, '').length < 9) {
    errors.telephone = 'Numéro invalide.';
  }
  if (!fields.ville.trim()) errors.ville = "Merci d'indiquer la ville visée.";
  if (!fields.enseigne) errors.enseigne = 'Merci de choisir une enseigne.';
  if (!fields.apport) errors.apport = 'Merci d’indiquer votre apport.';
  if (!fields.echeance) errors.echeance = 'Merci d’indiquer votre échéance.';
  if (!fields.message.trim() || fields.message.trim().length < 20) {
    errors.message = 'Merci de détailler votre projet (20 caractères min.).';
  }
  if (!fields.rgpd) errors.rgpd = 'Merci d’accepter les conditions.';

  const isValid = Object.keys(errors).length === 0;

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({
      nom: true, prenom: true, email: true, telephone: true,
      ville: true, enseigne: true, apport: true, echeance: true,
      message: true, rgpd: true,
    });
    if (!isValid) return;

    if (fields.website) {
      setStatus('sent');
      return;
    }

    setStatus('sending');
    setErrorMsg('');
    const result = await sendFranchise({
      from_name: `${fields.prenom} ${fields.nom}`,
      from_email: fields.email,
      phone: fields.telephone,
      city: fields.ville,
      brand: fields.enseigne,
      investment_range: fields.apport,
      timeline: fields.echeance,
      experience: fields.experience || '—',
      message: fields.message,
    });
    if (result.ok) {
      setStatus('sent');
      setFields({
        nom: '', prenom: '', email: '', telephone: '', ville: '',
        enseigne: '', apport: '', echeance: '', experience: '',
        message: '', rgpd: false, website: '',
      });
      setTouched({});
    } else {
      setStatus('error');
      setErrorMsg(result.error);
    }
  }

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
        <p className="font-body text-noir/80 mb-2">
          Votre candidature est bien arrivée.
        </p>
        <p className="font-body text-noir/60 text-sm mb-6">
          L'équipe franchise Mon Boum vous recontacte sous 7 jours ouvrés.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="font-body text-sm text-rouge hover:underline uppercase tracking-wider"
        >
          Envoyer une autre candidature
        </button>
      </div>
    );
  }

  const showError = (k) => touched[k] && errors[k];
  const inputClass = (k) =>
    `w-full bg-white border-2 px-4 py-3 font-body text-noir transition-colors focus:outline-none focus:border-rouge ${
      showError(k) ? 'border-rouge' : 'border-noir/15'
    }`;

  // Tiny helper to reduce repetition
  const Field = ({ id, label, required, error, children }) => (
    <div>
      <label
        htmlFor={id}
        className="block font-body text-xs uppercase tracking-wider text-noir mb-2"
      >
        {label}{required && <span className="text-rouge"> *</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-err`} className="font-body text-xs text-rouge mt-1">
          {error}
        </p>
      )}
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="bg-white border-2 border-noir/10 p-6 md:p-10"
    >
      {!isConfigured && (
        <div className="mb-6 bg-jaune/20 border-l-4 border-jaune p-4 font-body text-sm text-noir/80">
          ⚠ Le formulaire est en mode démonstration. Vos candidatures ne seront pas
          encore reçues.
        </div>
      )}

      {/* ── Section 1: identité ─────────────────────────── */}
      <h3 className="font-display text-xl text-noir uppercase mb-4 border-b-2 border-rouge pb-2">
        Vos coordonnées
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Field id="ff-prenom" label="Prénom" required error={showError('prenom') && errors.prenom}>
          <input
            id="ff-prenom" type="text" autoComplete="given-name"
            value={fields.prenom} onChange={update('prenom')} onBlur={blur('prenom')}
            className={inputClass('prenom')}
            aria-invalid={showError('prenom') ? 'true' : 'false'}
            aria-describedby={showError('prenom') ? 'ff-prenom-err' : undefined}
            required
          />
        </Field>
        <Field id="ff-nom" label="Nom" required error={showError('nom') && errors.nom}>
          <input
            id="ff-nom" type="text" autoComplete="family-name"
            value={fields.nom} onChange={update('nom')} onBlur={blur('nom')}
            className={inputClass('nom')}
            aria-invalid={showError('nom') ? 'true' : 'false'}
            aria-describedby={showError('nom') ? 'ff-nom-err' : undefined}
            required
          />
        </Field>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Field id="ff-email" label="E-mail" required error={showError('email') && errors.email}>
          <input
            id="ff-email" type="email" autoComplete="email"
            value={fields.email} onChange={update('email')} onBlur={blur('email')}
            className={inputClass('email')}
            aria-invalid={showError('email') ? 'true' : 'false'}
            aria-describedby={showError('email') ? 'ff-email-err' : undefined}
            required
          />
        </Field>
        <Field id="ff-tel" label="Téléphone" required error={showError('telephone') && errors.telephone}>
          <input
            id="ff-tel" type="tel" autoComplete="tel"
            value={fields.telephone} onChange={update('telephone')} onBlur={blur('telephone')}
            className={inputClass('telephone')}
            aria-invalid={showError('telephone') ? 'true' : 'false'}
            aria-describedby={showError('telephone') ? 'ff-tel-err' : undefined}
            required
          />
        </Field>
      </div>

      {/* ── Section 2: projet ────────────────────────────── */}
      <h3 className="font-display text-xl text-noir uppercase mb-4 border-b-2 border-rouge pb-2">
        Votre projet
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Field id="ff-ville" label="Ville / zone visée" required error={showError('ville') && errors.ville}>
          <input
            id="ff-ville" type="text" autoComplete="address-level2"
            value={fields.ville} onChange={update('ville')} onBlur={blur('ville')}
            className={inputClass('ville')}
            aria-invalid={showError('ville') ? 'true' : 'false'}
            aria-describedby={showError('ville') ? 'ff-ville-err' : undefined}
            required
          />
        </Field>
        <Field id="ff-enseigne" label="Enseigne souhaitée" required error={showError('enseigne') && errors.enseigne}>
          <select
            id="ff-enseigne"
            value={fields.enseigne} onChange={update('enseigne')} onBlur={blur('enseigne')}
            className={inputClass('enseigne')}
            aria-invalid={showError('enseigne') ? 'true' : 'false'}
            aria-describedby={showError('enseigne') ? 'ff-enseigne-err' : undefined}
            required
          >
            {ENSEIGNES_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} disabled={!o.value}>{o.label}</option>
            ))}
          </select>
        </Field>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Field id="ff-apport" label="Apport personnel" required error={showError('apport') && errors.apport}>
          <select
            id="ff-apport"
            value={fields.apport} onChange={update('apport')} onBlur={blur('apport')}
            className={inputClass('apport')}
            aria-invalid={showError('apport') ? 'true' : 'false'}
            aria-describedby={showError('apport') ? 'ff-apport-err' : undefined}
            required
          >
            {APPORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} disabled={!o.value}>{o.label}</option>
            ))}
          </select>
        </Field>
        <Field id="ff-echeance" label="Échéance d'ouverture" required error={showError('echeance') && errors.echeance}>
          <select
            id="ff-echeance"
            value={fields.echeance} onChange={update('echeance')} onBlur={blur('echeance')}
            className={inputClass('echeance')}
            aria-invalid={showError('echeance') ? 'true' : 'false'}
            aria-describedby={showError('echeance') ? 'ff-echeance-err' : undefined}
            required
          >
            {ECHEANCE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} disabled={!o.value}>{o.label}</option>
            ))}
          </select>
        </Field>
      </div>

      {/* ── Section 3: message ───────────────────────────── */}
      <h3 className="font-display text-xl text-noir uppercase mb-4 border-b-2 border-rouge pb-2">
        À propos de vous
      </h3>
      <div className="mb-4">
        <Field id="ff-exp" label="Expérience en restauration (optionnel)">
          <input
            id="ff-exp" type="text"
            value={fields.experience} onChange={update('experience')}
            className={inputClass('experience')}
            placeholder="Ex. 5 ans en gestion de franchise"
          />
        </Field>
      </div>
      <div className="mb-6">
        <Field id="ff-msg" label="Votre projet en quelques lignes" required error={showError('message') && errors.message}>
          <textarea
            id="ff-msg" rows="6"
            value={fields.message} onChange={update('message')} onBlur={blur('message')}
            className={inputClass('message') + ' resize-y'}
            aria-invalid={showError('message') ? 'true' : 'false'}
            aria-describedby={showError('message') ? 'ff-msg-err' : undefined}
            required
          />
        </Field>
      </div>

      {/* ── RGPD consent ───────────────────────────────── */}
      <div className="mb-6">
        <label htmlFor="ff-rgpd" className="flex items-start gap-3 cursor-pointer">
          <input
            id="ff-rgpd"
            type="checkbox"
            checked={fields.rgpd}
            onChange={update('rgpd')}
            onBlur={blur('rgpd')}
            className="mt-1 w-4 h-4 accent-rouge flex-shrink-0"
            required
          />
          <span className="font-body text-xs text-noir/70">
            J'accepte que mes données soient utilisées pour traiter ma candidature,
            conformément à la <a href="/mentions-legales" className="text-rouge hover:underline">politique de confidentialité</a>.
            <span className="text-rouge"> *</span>
          </span>
        </label>
        {showError('rgpd') && (
          <p className="font-body text-xs text-rouge mt-1 ml-7">{errors.rgpd}</p>
        )}
      </div>

      {/* Honeypot */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', left: '-9999px',
          width: '1px', height: '1px', overflow: 'hidden',
        }}
      >
        <label htmlFor="ff-website">Laissez ce champ vide</label>
        <input
          id="ff-website" type="text" tabIndex="-1" autoComplete="off"
          value={fields.website} onChange={update('website')}
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-8">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="bg-rouge text-white font-display uppercase text-base px-10 py-4 hover:bg-noir transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'sending' ? 'Envoi en cours…' : 'Envoyer ma candidature'}
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

export default function FranchiseForm() {
  return (
    <ErrorBoundary fallback={<FranchiseFormFallback />}>
      <FranchiseFormImpl />
    </ErrorBoundary>
  );
}
