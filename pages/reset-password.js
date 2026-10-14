import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export default function ResetPasswordPage() {
  const router = useRouter();

  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        setError(
          'Le lien de récupération est invalide ou a expiré. Demandez un nouveau lien.'
        );
        setReady(true);
        return;
      }

      setReady(true);
    }

    checkSession();
  }, []);

  async function handleUpdatePassword(event) {
    event.preventDefault();

    setError('');
    setMessage('');

    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return;
    }

    if (password !== confirmation) {
      setError('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMessage('Mot de passe modifié avec succès.');

    setTimeout(() => {
      router.replace('/');
    }, 1000);
  }

  if (!ready) {
    return <main style={{ padding: '24px' }}>Vérification du lien...</main>;
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <form
        onSubmit={handleUpdatePassword}
        style={{
          width: '100%',
          maxWidth: '420px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <div>
          <h1>HBK Growth</h1>
          <p>Définir un nouveau mot de passe</p>
        </div>

        <label>
          Nouveau mot de passe
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            style={{ width: '100%', padding: '10px', marginTop: '6px' }}
          />
        </label>

        <label>
          Confirmer le mot de passe
          <input
            type="password"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            required
            minLength={8}
            autoComplete="new-password"
            style={{ width: '100%', padding: '10px', marginTop: '6px' }}
          />
        </label>

        {error && (
          <p role="alert" style={{ color: 'crimson' }}>
            {error}
          </p>
        )}

        {message && (
          <p role="status" style={{ color: 'green' }}>
            {message}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Modification...' : 'Modifier le mot de passe'}
        </button>
      </form>
    </main>
  );
}
