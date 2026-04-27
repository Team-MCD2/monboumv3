# EmailJS setup — Mon Boum V3

Two email templates to create in the EmailJS dashboard: one for the `/contact` form and one for the `/formulaire-de-candidature` form. Both send to your inbox (e.g. `franchise@monboum.fr`); the customer's email is auto-set as Reply-To so you just hit "Reply" in your mail client.

Service ID already wired: **`service_at069ps`**

---

## 1 · Dashboard checklist

1. Go to https://dashboard.emailjs.com/
2. **Email Services** tab → confirm `service_at069ps` is connected to your outbound account (Gmail/SMTP/etc.) and can actually send mail — send a test.
3. **Account** tab → copy the **Public Key** (looks like `abc_xxxxxxxxxxxxxxx`). Paste into `.env`:
   ```
   PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
   ```
4. **Email Templates** tab → create **Template 1** (Contact) using section 2 below. Copy its ID (looks like `template_xxxxxxx`) into `.env`:
   ```
   PUBLIC_EMAILJS_TEMPLATE_CONTACT=template_xxxxxxx
   ```
5. Create **Template 2** (Franchise) using section 3 below. Copy its ID into `.env`:
   ```
   PUBLIC_EMAILJS_TEMPLATE_FRANCHISE=template_xxxxxxx
   ```
6. Restart dev server (`npm run dev`) — yellow "démonstration" banner disappears.
7. For production, add the same 4 vars in **Vercel → Project → Settings → Environment Variables**, then redeploy.

---

## 2 · Template 1: Contact

### Settings (top of EmailJS template editor)

| Field | Value |
|---|---|
| **Template Name** (internal) | `Mon Boum — Contact` |
| **Subject** | `[Mon Boum Contact] {{subject}} — {{from_name}}` |
| **From Name** | `Mon Boum — Site web` |
| **From Email** | *(leave default — uses your service's sender)* |
| **To Email** | `franchise@monboum.fr` *(or wherever you want messages)* |
| **Reply To** | `{{from_email}}` ← **critical**, lets you reply directly to the visitor |
| **BCC / CC** | *(optional)* |

### Variables the `/contact` form sends

| Variable | Content | Example |
|---|---|---|
| `{{from_name}}` | Full name | `Marie Dupont` |
| `{{from_email}}` | E-mail | `marie@example.com` |
| `{{phone}}` | Phone (or `—` if empty) | `06 12 34 56 78` |
| `{{subject}}` | Sujet dropdown value | `commande`, `restaurant`, `presse`, `partenariat`, `autre` |
| `{{message}}` | Free text | *(multi-line)* |

### HTML body — copy-paste into the "Content" editor (switch to HTML mode)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0; padding:0; font-family: 'Helvetica Neue', Arial, sans-serif; background:#f4f4f4;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f4f4f4; padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="580" style="max-width:580px; background:#ffffff; border-top:4px solid #E10600;">
          <tr>
            <td style="padding:32px 32px 24px;">
              <p style="margin:0 0 8px; color:#E10600; font-size:11px; letter-spacing:0.25em; text-transform:uppercase; font-weight:700;">
                Formulaire de contact — Mon Boum
              </p>
              <h1 style="margin:0; font-size:28px; line-height:1.1; color:#111; text-transform:uppercase; letter-spacing:-0.01em;">
                Nouveau message.
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:0 32px 8px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td width="110" style="padding:10px 0; color:#888; font-size:11px; letter-spacing:0.15em; text-transform:uppercase; vertical-align:top;">De</td>
                  <td style="padding:10px 0; color:#111; font-size:15px; vertical-align:top;">{{from_name}}</td>
                </tr>
                <tr>
                  <td width="110" style="padding:10px 0; color:#888; font-size:11px; letter-spacing:0.15em; text-transform:uppercase; vertical-align:top;">E-mail</td>
                  <td style="padding:10px 0; font-size:15px; vertical-align:top;">
                    <a href="mailto:{{from_email}}" style="color:#E10600; text-decoration:none;">{{from_email}}</a>
                  </td>
                </tr>
                <tr>
                  <td width="110" style="padding:10px 0; color:#888; font-size:11px; letter-spacing:0.15em; text-transform:uppercase; vertical-align:top;">Téléphone</td>
                  <td style="padding:10px 0; color:#111; font-size:15px; vertical-align:top;">{{phone}}</td>
                </tr>
                <tr>
                  <td width="110" style="padding:10px 0; color:#888; font-size:11px; letter-spacing:0.15em; text-transform:uppercase; vertical-align:top;">Sujet</td>
                  <td style="padding:10px 0; color:#111; font-size:15px; vertical-align:top; font-weight:600;">{{subject}}</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 32px 24px;">
              <div style="border-left:4px solid #E10600; padding:4px 0 4px 20px;">
                <p style="margin:0 0 12px; color:#888; font-size:11px; letter-spacing:0.15em; text-transform:uppercase;">Message</p>
                <p style="margin:0; color:#111; font-size:15px; line-height:1.6; white-space:pre-wrap;">{{message}}</p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 32px 32px; border-top:1px solid #eee;">
              <p style="margin:0; color:#aaa; font-size:11px; line-height:1.5;">
                Répondez directement à cet e-mail pour écrire à <strong>{{from_name}}</strong>.<br>
                Mon Boum Toulouse · Depuis 2004.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

### Plain-text fallback (optional but recommended)

```
[Mon Boum Contact] {{subject}}

De       : {{from_name}}
E-mail   : {{from_email}}
Téléphone: {{phone}}
Sujet    : {{subject}}

Message
───────
{{message}}

───
Répondez à cet e-mail pour écrire à {{from_name}}.
Mon Boum Toulouse · Depuis 2004.
```

---

## 3 · Template 2: Franchise candidature

### Settings

| Field | Value |
|---|---|
| **Template Name** (internal) | `Mon Boum — Candidature franchise` |
| **Subject** | `[Mon Boum Franchise] {{from_name}} — {{city}} — {{brand}}` |
| **From Name** | `Mon Boum — Site web` |
| **To Email** | `franchise@monboum.fr` |
| **Reply To** | `{{from_email}}` |

### Variables the `/formulaire-de-candidature` form sends

| Variable | Content | Example |
|---|---|---|
| `{{from_name}}` | Prénom + Nom | `Jean Martin` |
| `{{from_email}}` | E-mail | `jean.martin@example.com` |
| `{{phone}}` | Téléphone | `06 12 34 56 78` |
| `{{city}}` | Ville/zone visée | `Toulouse nord` |
| `{{brand}}` | Enseigne souhaitée | `Boum Burger`, `Boum Pizz's`, `Boum Chicken`, `Boum Saveurs`, `Indifférent` |
| `{{investment_range}}` | Apport personnel | `< 100k€`, `100k-200k€`, `200k-300k€`, `> 300k€` |
| `{{timeline}}` | Échéance | `Immédiat`, `3-6 mois`, `6-12 mois`, `> 1 an` |
| `{{experience}}` | Expérience (ou `—`) | `5 ans en gestion de franchise` |
| `{{message}}` | Description projet | *(multi-line)* |

### HTML body

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0; padding:0; font-family: 'Helvetica Neue', Arial, sans-serif; background:#f4f4f4;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f4f4f4; padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="620" style="max-width:620px; background:#ffffff; border-top:4px solid #E10600;">
          <tr>
            <td style="padding:32px 32px 24px;">
              <p style="margin:0 0 8px; color:#E10600; font-size:11px; letter-spacing:0.25em; text-transform:uppercase; font-weight:700;">
                Candidature franchise — Mon Boum
              </p>
              <h1 style="margin:0; font-size:28px; line-height:1.1; color:#111; text-transform:uppercase; letter-spacing:-0.01em;">
                Nouveau dossier.
              </h1>
              <p style="margin:12px 0 0; color:#555; font-size:14px;">
                <strong>{{from_name}}</strong> — {{city}} — {{brand}}
              </p>
            </td>
          </tr>

          <!-- Coordonnées -->
          <tr>
            <td style="padding:8px 32px 0;">
              <p style="margin:0 0 12px; color:#E10600; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; font-weight:600; border-bottom:2px solid #E10600; padding-bottom:6px; display:inline-block;">
                Coordonnées
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td width="140" style="padding:8px 0; color:#888; font-size:11px; letter-spacing:0.15em; text-transform:uppercase; vertical-align:top;">Nom complet</td>
                  <td style="padding:8px 0; color:#111; font-size:15px; vertical-align:top;">{{from_name}}</td>
                </tr>
                <tr>
                  <td width="140" style="padding:8px 0; color:#888; font-size:11px; letter-spacing:0.15em; text-transform:uppercase; vertical-align:top;">E-mail</td>
                  <td style="padding:8px 0; font-size:15px; vertical-align:top;">
                    <a href="mailto:{{from_email}}" style="color:#E10600; text-decoration:none;">{{from_email}}</a>
                  </td>
                </tr>
                <tr>
                  <td width="140" style="padding:8px 0; color:#888; font-size:11px; letter-spacing:0.15em; text-transform:uppercase; vertical-align:top;">Téléphone</td>
                  <td style="padding:8px 0; font-size:15px; vertical-align:top;">
                    <a href="tel:{{phone}}" style="color:#111; text-decoration:none;">{{phone}}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Projet -->
          <tr>
            <td style="padding:16px 32px 0;">
              <p style="margin:0 0 12px; color:#E10600; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; font-weight:600; border-bottom:2px solid #E10600; padding-bottom:6px; display:inline-block;">
                Projet
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td width="140" style="padding:8px 0; color:#888; font-size:11px; letter-spacing:0.15em; text-transform:uppercase; vertical-align:top;">Ville/zone</td>
                  <td style="padding:8px 0; color:#111; font-size:15px; vertical-align:top; font-weight:600;">{{city}}</td>
                </tr>
                <tr>
                  <td width="140" style="padding:8px 0; color:#888; font-size:11px; letter-spacing:0.15em; text-transform:uppercase; vertical-align:top;">Enseigne</td>
                  <td style="padding:8px 0; color:#111; font-size:15px; vertical-align:top; font-weight:600;">{{brand}}</td>
                </tr>
                <tr>
                  <td width="140" style="padding:8px 0; color:#888; font-size:11px; letter-spacing:0.15em; text-transform:uppercase; vertical-align:top;">Apport perso.</td>
                  <td style="padding:8px 0; color:#111; font-size:15px; vertical-align:top;">{{investment_range}}</td>
                </tr>
                <tr>
                  <td width="140" style="padding:8px 0; color:#888; font-size:11px; letter-spacing:0.15em; text-transform:uppercase; vertical-align:top;">Échéance</td>
                  <td style="padding:8px 0; color:#111; font-size:15px; vertical-align:top;">{{timeline}}</td>
                </tr>
                <tr>
                  <td width="140" style="padding:8px 0; color:#888; font-size:11px; letter-spacing:0.15em; text-transform:uppercase; vertical-align:top;">Expérience</td>
                  <td style="padding:8px 0; color:#111; font-size:15px; vertical-align:top;">{{experience}}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding:24px 32px;">
              <p style="margin:0 0 12px; color:#E10600; font-size:11px; letter-spacing:0.2em; text-transform:uppercase; font-weight:600; border-bottom:2px solid #E10600; padding-bottom:6px; display:inline-block;">
                Projet détaillé
              </p>
              <div style="border-left:4px solid #E10600; padding:4px 0 4px 20px; margin-top:12px;">
                <p style="margin:0; color:#111; font-size:15px; line-height:1.6; white-space:pre-wrap;">{{message}}</p>
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 32px 32px; border-top:1px solid #eee;">
              <p style="margin:0; color:#aaa; font-size:11px; line-height:1.5;">
                Répondez directement à cet e-mail pour contacter <strong>{{from_name}}</strong>.<br>
                Engagement : recontacter sous 7 jours ouvrés.<br>
                Mon Boum Toulouse · Depuis 2004.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
```

### Plain-text fallback

```
[Mon Boum Franchise] Candidature de {{from_name}} — {{city}}

═══ COORDONNÉES ═══
Nom       : {{from_name}}
E-mail    : {{from_email}}
Téléphone : {{phone}}

═══ PROJET ═══
Ville/zone  : {{city}}
Enseigne    : {{brand}}
Apport      : {{investment_range}}
Échéance    : {{timeline}}
Expérience  : {{experience}}

═══ PROJET DÉTAILLÉ ═══
{{message}}

───
Répondez à cet e-mail pour contacter {{from_name}}.
Engagement : recontacter sous 7 jours ouvrés.
Mon Boum Toulouse · Depuis 2004.
```

---

## 4 · Optional — auto-reply to the visitor

If you want visitors to receive an automatic confirmation, create a **third template** with:

- **To Email** : `{{from_email}}` (sends to the visitor, not to you)
- **From Name** : `Mon Boum`
- **Subject** : `Merci pour votre message — Mon Boum`
- Body : simple "We received your message, we'll reply shortly. — Mon Boum team"

Then add a second `emailjs.send()` call in `src/lib/emailjs.js` after the main send. This is out-of-scope for the current setup; ping me if you want it later.

---

## 5 · Troubleshooting

- **Form shows yellow banner** → one of the 4 `PUBLIC_EMAILJS_*` vars is missing in `.env`. Restart `npm run dev` after editing.
- **"Envoi impossible"** red error on form → open browser devtools console, you'll see `[emailjs]` error. Common causes: wrong public key, wrong template ID, template uses a variable my code doesn't send.
- **Test e-mail never arrives** → EmailJS free tier has 200 emails/month and 2-min cooldowns. Check EmailJS dashboard **History** tab.
- **Vercel prod has old env** → after changing env vars in Vercel, trigger a redeploy (any commit or manual "Redeploy" from dashboard).

---

Generated for Mon Boum V3 · Microdidact
