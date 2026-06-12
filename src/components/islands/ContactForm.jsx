// ═══════════════════════════════════════════════════════════════
// ContactForm — /contact page submission island
// Uses: monboum SDK
// ═══════════════════════════════════════════════════════════════

const SUJETS = [
  { value: '', label: 'Choisir un sujet…' },
  { value: 'commande', label: 'Question sur une commande' },
  { value: 'restaurant', label: "Contacter un restaurant" },
  { value: 'presse', label: 'Presse / média' },
  { value: 'partenariat', label: 'Partenariat' },
  { value: 'autre', label: 'Autre' },
];

export default function ContactForm() {
  const inputClass = "w-full bg-white border-2 border-noir/15 px-4 py-3 font-body text-noir transition-colors focus:outline-none focus:border-rouge";

  return (
    <form
      data-api-form="monboum"
      className="bg-white border-2 border-noir/10 p-6 md:p-10"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="cf-nom" className="block font-body text-xs uppercase tracking-wider text-noir mb-2">
            Nom complet <span className="text-rouge">*</span>
          </label>
          <input id="cf-nom" name="nom" type="text" autoComplete="name" className={inputClass} required />
        </div>
        <div>
          <label htmlFor="cf-email" className="block font-body text-xs uppercase tracking-wider text-noir mb-2">
            E-mail <span className="text-rouge">*</span>
          </label>
          <input id="cf-email" name="email" type="email" autoComplete="email" className={inputClass} required />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="cf-tel" className="block font-body text-xs uppercase tracking-wider text-noir mb-2">
            Téléphone
          </label>
          <input id="cf-tel" name="telephone" type="tel" autoComplete="tel" className={inputClass} />
        </div>
        <div>
          <label htmlFor="cf-sujet" className="block font-body text-xs uppercase tracking-wider text-noir mb-2">
            Sujet <span className="text-rouge">*</span>
          </label>
          <select id="cf-sujet" name="sujet" defaultValue="" className={inputClass} required>
            {SUJETS.map((s) => (
              <option key={s.value} value={s.value} disabled={!s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="cf-msg" className="block font-body text-xs uppercase tracking-wider text-noir mb-2">
          Message <span className="text-rouge">*</span>
        </label>
        <textarea id="cf-msg" name="message" rows="6" className={inputClass + ' resize-y'} required />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <button type="submit" className="bg-rouge text-white font-display uppercase text-base px-10 py-4 hover:bg-noir transition-colors">
          Envoyer le message
        </button>
        <p className="font-body text-xs text-noir/50">
          * Champs obligatoires
        </p>
      </div>
    </form>
  );
}
