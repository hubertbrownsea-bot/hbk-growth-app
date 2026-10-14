import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin(event) {
    event.preventDefault();

    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    await router.push('/');
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
        onSubmit={handleLogin}
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
          <p>Connexion à votre espace</p>
        </div>

        <label>
          Adresse e-mail
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            autoComplete="email"
            style={{ width: '100%', padding: '10px', marginTop: '6px' }}
          />
        </label>

        <label>
          Mot de passe
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            autoComplete="current-password"
            style={{ width: '100%', padding: '10px', marginTop: '6px' }}
          />
        </label>

        {error && (
          <p role="alert" style={{ color: 'crimson' }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>
    </main>
  );
}
