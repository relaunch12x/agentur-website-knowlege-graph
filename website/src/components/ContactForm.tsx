import { useState, type FormEvent } from 'react';

type FormState = 'idle' | 'submitting' | 'error';

export default function ContactForm() {
  const [state, setState] = useState<FormState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setState('submitting');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          company_name: companyName,
          message,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Etwas ist schiefgelaufen.');
      }

      // PostHog tracking
      (window as any).posthog?.capture('contact_form_submitted', {
        source: 'kontakt_page',
        has_phone: !!phone,
        has_company: !!companyName,
        has_message: !!message,
      });

      // Redirect to thank-you page
      window.location.href = '/danke';
    } catch (err) {
      setState('error');
      setErrorMsg(err instanceof Error ? err.message : 'Unbekannter Fehler');
    }
  };

  const inputStyles: React.CSSProperties = {
    width: '100%',
    padding: '14px 16px',
    background: 'rgba(245, 240, 232, 0.06)',
    border: '1px solid rgba(245, 240, 232, 0.12)',
    borderRadius: 'var(--radius-md)',
    color: 'var(--color-sand)',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.9375rem',
    lineHeight: '1.5',
    outline: 'none',
    transition: 'border-color 300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  };

  const labelStyles: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.75rem',
    fontWeight: 500,
    letterSpacing: '0.05em',
    textTransform: 'uppercase' as const,
    color: 'rgba(245, 240, 232, 0.5)',
    marginBottom: '8px',
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Name */}
      <div>
        <label htmlFor="name" style={labelStyles}>
          Name <span style={{ color: 'var(--color-ultraviolett-text)' }}>*</span>
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ihr vollständiger Name"
          style={inputStyles}
          onFocus={(e) => (e.target.style.borderColor = 'var(--color-ultraviolett-text)')}
          onBlur={(e) => (e.target.style.borderColor = 'rgba(245, 240, 232, 0.12)')}
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" style={labelStyles}>
          E-Mail <span style={{ color: 'var(--color-ultraviolett-text)' }}>*</span>
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ihre@email.de"
          style={inputStyles}
          onFocus={(e) => (e.target.style.borderColor = 'var(--color-ultraviolett-text)')}
          onBlur={(e) => (e.target.style.borderColor = 'rgba(245, 240, 232, 0.12)')}
        />
      </div>

      {/* Phone + Company in row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label htmlFor="phone" style={labelStyles}>Telefon</label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+49 ..."
            style={inputStyles}
            onFocus={(e) => (e.target.style.borderColor = 'var(--color-ultraviolett-text)')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(245, 240, 232, 0.12)')}
          />
        </div>
        <div>
          <label htmlFor="company" style={labelStyles}>Unternehmen</label>
          <input
            id="company"
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Firma GmbH"
            style={inputStyles}
            onFocus={(e) => (e.target.style.borderColor = 'var(--color-ultraviolett-text)')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(245, 240, 232, 0.12)')}
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" style={labelStyles}>Nachricht</label>
        <textarea
          id="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Erzählen Sie uns kurz von Ihrem Vorhaben ..."
          style={{ ...inputStyles, resize: 'vertical' as const, minHeight: '120px' }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--color-ultraviolett-text)')}
          onBlur={(e) => (e.target.style.borderColor = 'rgba(245, 240, 232, 0.12)')}
        />
      </div>

      {/* Error */}
      {state === 'error' && (
        <div
          style={{
            padding: '12px 16px',
            background: 'rgba(220, 38, 38, 0.1)',
            border: '1px solid rgba(220, 38, 38, 0.3)',
            borderRadius: 'var(--radius-md)',
            color: '#fca5a5',
            fontSize: '0.875rem',
          }}
        >
          {errorMsg}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={state === 'submitting'}
        style={{
          width: '100%',
          padding: '16px 32px',
          background: state === 'submitting' ? 'rgba(36, 0, 229, 0.5)' : 'var(--color-ultraviolett)',
          color: 'var(--color-sand)',
          fontFamily: 'var(--font-sans)',
          fontSize: '1rem',
          fontWeight: 600,
          borderRadius: 'var(--radius-lg)',
          border: 'none',
          cursor: state === 'submitting' ? 'wait' : 'pointer',
          transition: 'all 300ms cubic-bezier(0.22, 1, 0.36, 1)',
          transform: state === 'submitting' ? 'none' : undefined,
        }}
        onMouseEnter={(e) => {
          if (state !== 'submitting') {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 24px rgba(36, 0, 229, 0.4), 0 0 60px rgba(36, 0, 229, 0.15)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {state === 'submitting' ? 'Wird gesendet ...' : 'Nachricht senden'}
      </button>

      {/* Trust line */}
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          letterSpacing: '0.05em',
          color: 'rgba(245, 240, 232, 0.35)',
          textAlign: 'center',
          margin: 0,
        }}
      >
        Antwort innerhalb von 24 Stunden.
      </p>
    </form>
  );
}
