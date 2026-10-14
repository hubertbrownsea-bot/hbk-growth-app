import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';
import {
  getUserPermissions,
  hasPermission,
} from '../lib/permissions';
import Promotions from '../components/Promotions';

export default function HBKGrowthApp() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [profileError, setProfileError] = useState('');
  const [sqlPermissionTest, setSqlPermissionTest] = useState({
    status: 'pending',
    result: null,
    error: '',
  });
    const [currentRoleTest, setCurrentRoleTest] = useState({
    status: 'pending',
    result: null,
    error: '',
  });

  const [currentCommercialTest, setCurrentCommercialTest] = useState({
    status: 'pending',
    result: null,
    error: '',
  });
  const [clientsTest, setClientsTest] = useState({
  status: 'pending',
  result: null,
  error: '',
});

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      try {
        const {
          data: { session: currentSession },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!mounted) return;

        if (!currentSession) {
          setLoading(false);
          await router.replace('/login');
          return;
        }

        setSession(currentSession);

        const result = await getUserPermissions();

        const {
          data: sqlPermissionResult,
          error: sqlPermissionError,
        } = await supabase.rpc('has_permission', {
          p_permission_code: 'DASHBOARD_VIEW',
        });
                const {
          data: currentRoleResult,
          error: currentRoleError,
        } = await supabase.rpc('current_role_code');

        const {
          data: currentCommercialResult,
          error: currentCommercialError,
        } = await supabase.rpc('current_commercial_id');
        const {
  data: clientsResult,
  error: clientsError,
} = await supabase
  .from('clients')
  .select('id, code_client, nom_prospect, commercial_origine_id')
  .limit(5);
                if (!mounted) return;
                setClientsTest(
  clientsError
    ? {
        status: 'error',
        result: null,
        error: clientsError.message,
      }
    : {
        status: 'success',
        result: clientsResult,
        error: '',
      }
);

        setCurrentRoleTest(
          currentRoleError
            ? {
                status: 'error',
                result: null,
                error: currentRoleError.message,
              }
            : {
                status: 'success',
                result: currentRoleResult,
                error: '',
              }
        );

        setCurrentCommercialTest(
          currentCommercialError
            ? {
                status: 'error',
                result: null,
                error: currentCommercialError.message,
              }
            : {
                status: 'success',
                result: currentCommercialResult,
                error: '',
              }
        );

        if (!mounted) return;

        setSqlPermissionTest(
          sqlPermissionError
            ? {
                status: 'error',
                result: null,
                error: sqlPermissionError.message,
              }
            : {
                status: 'success',
                result: sqlPermissionResult,
                error: '',
              }
        );

        setProfile(result.profile);
        setPermissions(result.permissions);
        setProfileError('');
        setLoading(false);
      } catch (error) {
        if (!mounted) return;

        setProfileError(
          error instanceof Error
            ? error.message
            : 'Une erreur inattendue est survenue.'
        );
        setLoading(false);
      }
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setSession(null);
        setProfile(null);
        setPermissions([]);
        router.replace('/login');
      }
    });

    initialize();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  async function handleLogout() {
    setLoading(true);

    const { error } = await supabase.auth.signOut();

    if (error) {
      setProfileError(
        'La déconnexion a échoué. Veuillez réessayer.'
      );
      setLoading(false);
      return;
    }

    setSession(null);
    setProfile(null);
    setPermissions([]);
    await router.replace('/login');
  }

  if (loading) {
    return <main style={{ padding: '24px' }}>Vérification de votre accès...</main>;
  }

  if (!session) {
    return <main style={{ padding: '24px' }}>Redirection vers la connexion...</main>;
  }

  const canViewDashboard = hasPermission(permissions, 'DASHBOARD_VIEW');

  return (
    <main style={{ padding: '24px' }}>
      <h1>HBK Growth</h1>

      {profileError ? (
        <section>
          <p role="alert" style={{ color: 'crimson' }}>
            {profileError}
          </p>
          <p>
            Aucune fonctionnalité métier n'est accessible tant que le profil
            n'a pas été vérifié.
          </p>
        </section>
      ) : profile ? (
        <section>
          <p>Session authentifiée.</p>
          <p>E-mail Auth : {session.user.email}</p>

          <h2>Profil utilisateur</h2>
          <p>Nom : {profile.nom_complet}</p>
          <p>E-mail du profil : {profile.email}</p>
          <p>
            Rôle : {profile.roles?.nom ?? profile.roles?.code ?? 'Non identifié'}
          </p>
          <p>Compte actif : Oui</p>
          <p>Permissions actives chargées : {permissions.length}</p>

          <h2>Contrôle des accès</h2>
          <h3>Test RLS : lecture des clients</h3>

<p>
  {clientsTest.status === 'pending'
    ? 'Test en cours...'
    : clientsTest.status === 'error'
      ? `Erreur de lecture : ${clientsTest.error}`
      : `Lecture autorisée : ${clientsTest.result.length} client(s) retourné(s).`}
</p>

{clientsTest.status === 'success' && clientsTest.result.length > 0 && (
  <ul>
    {clientsTest.result.map((client) => (
      <li key={client.id}>
        {client.code_client} — {client.nom_prospect}
      </li>
    ))}
  </ul>
)}
                    <h3>Fonction SQL current_role_code</h3>
          <p>
            {currentRoleTest.status === 'pending'
              ? 'Test en cours...'
              : currentRoleTest.status === 'error'
                ? `Erreur : ${currentRoleTest.error}`
                : `Rôle retourné : ${currentRoleTest.result ?? 'Aucun rôle'}`}
          </p>

          <h3>Fonction SQL current_commercial_id</h3>
          <p>
            {currentCommercialTest.status === 'pending'
              ? 'Test en cours...'
              : currentCommercialTest.status === 'error'
                ? `Erreur : ${currentCommercialTest.error}`
                : `Identifiant commercial : ${currentCommercialTest.result ?? 'NULL (aucun commercial associé)'}`}
          </p>
          <p>
            Fonction SQL has_permission :
            {' '}
            {sqlPermissionTest.status === 'pending'
              ? 'Test en cours...'
              : sqlPermissionTest.status === 'error'
                ? `Erreur : ${sqlPermissionTest.error}`
                : sqlPermissionTest.result === true
                  ? 'DASHBOARD_VIEW accordée'
                  : 'DASHBOARD_VIEW refusée'}
          </p>
          {canViewDashboard ? (
            <p>Autorisation DASHBOARD_VIEW : accordée.</p>
          ) : (
            <p role="alert">
              Autorisation DASHBOARD_VIEW : refusée.
            </p>
          )}

          <Promotions permissions={permissions} profile={profile} />
        </section>
      ) : (
        <p role="alert">
          Le profil n'a pas pu être vérifié. Accès aux fonctionnalités bloqué.
        </p>
      )}

      <button onClick={handleLogout} disabled={loading}>
        Se déconnecter
      </button>
    </main>
  );
}
