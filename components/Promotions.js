import React, { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { hasPermission } from '../lib/permissions';

const ACTIVE_STATUSES = [
  'EN_ATTENTE',
  'VERIFICATION_SECRETARIAT',
  'EXAMEN_MARKETING',
  'EN_DECISION',
  'APPROUVEE',
];

const STATUS_LABELS = {
  EN_ATTENTE: 'En attente de vérification',
  VERIFICATION_SECRETARIAT: 'Vérification du secrétariat',
  EXAMEN_MARKETING: 'Examen du marketing',
  EN_DECISION: 'En attente de décision',
  APPROUVEE: 'Approuvée — application à effectuer',
  VALIDEE: 'Validée et appliquée',
  REFUSEE: 'Refusée',
  ANNULEE: 'Annulée',
};

const STATUS_COLORS = {
  EN_ATTENTE: '#92400e',
  VERIFICATION_SECRETARIAT: '#92400e',
  EXAMEN_MARKETING: '#1d4ed8',
  EN_DECISION: '#6d28d9',
  APPROUVEE: '#166534',
  VALIDEE: '#166534',
  REFUSEE: '#b91c1c',
  ANNULEE: '#6b7280',
};

function formatDate(value) {
  if (!value) return '—';

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleString('fr-FR');
}

function formatGP(value) {
  const number = Number(value);

  return Number.isFinite(number)
    ? number.toLocaleString('fr-FR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : '—';
}

export default function Promotions({ permissions = [], profile }) {
  const [promotions, setPromotions] = useState([]);
  const [motif, setMotif] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const roleRelation = profile?.roles;
  const role = Array.isArray(roleRelation)
    ? roleRelation[0]
    : roleRelation;

  const roleCode = role?.code ?? '';

  const canView = hasPermission(permissions, 'PROMOTION_VIEW');
  const canRequest =
    roleCode === 'COMMERCIAL' &&
    hasPermission(permissions, 'PROMOTION_REQUEST');

  const canVerify =
    roleCode === 'SECRETARIAT' &&
    hasPermission(permissions, 'PROMOTION_VERIFY');

  const canReview =
    roleCode === 'MARKETING' &&
    hasPermission(permissions, 'PROMOTION_REVIEW');

  const canDecide =
    roleCode === 'ADMIN' &&
    hasPermission(permissions, 'PROMOTION_DECIDE');

  const canApply =
    roleCode === 'ADMIN' &&
    hasPermission(permissions, 'PROMOTION_APPLY');

  const loadPromotions = useCallback(async () => {
    if (!canView) {
      setPromotions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    const { data, error: queryError } = await supabase
      .from('promotions')
      .select(`
        id,
        commercial_id,
        ancien_grade,
        nouveau_grade,
        clients_valides,
        gp_valides,
        statut,
        motif,
        date_demande,
        date_validation,
        secretariat_verifie_le,
        secretariat_observations,
        marketing_examine_le,
        marketing_observations,
        decision_le,
        decision_motif,
        applique_le
      `)
      .order('date_demande', { ascending: false })
      .limit(100);

    if (queryError) {
      setError(
        `Impossible de charger les demandes : ${queryError.message}`
      );
      setPromotions([]);
    } else {
      setPromotions(data || []);
    }

    setLoading(false);
  }, [canView]);

  useEffect(() => {
    loadPromotions();
  }, [loadPromotions]);

  async function runAction(action, args, successMessage) {
    setSubmitting(true);
    setError('');
    setNotice('');

    try {
      const { error: rpcError } = await supabase.rpc(action, args);

      if (rpcError) {
        throw rpcError;
      }

      setNotice(successMessage);
      await loadPromotions();
    } catch (actionError) {
      setError(
        actionError?.message ||
        'L’opération a échoué. Veuillez réessayer.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function requestPromotion(event) {
    event.preventDefault();

    if (!canRequest || submitting) return;

    await runAction(
      'request_promotion',
      { p_motif: motif.trim() || null },
      'Demande transmise. Son statut a été actualisé.'
    );

    setMotif('');
  }

  async function verifyPromotion(promotion, approved) {
    const observations = window.prompt(
      approved
        ? 'Observations du secrétariat (facultatif) :'
        : 'Motif obligatoire du refus par le secrétariat :'
    );

    if (observations === null) return;

    if (!approved && !observations.trim()) {
      setError('Le motif du refus est obligatoire.');
      return;
    }

    await runAction(
      'verify_promotion_secretariat',
      {
        p_promotion_id: promotion.id,
        p_approuve: approved,
        p_observations: observations.trim() || null,
      },
      approved
        ? 'Vérification du secrétariat enregistrée.'
        : 'Refus du secrétariat enregistré.'
    );
  }

  async function reviewPromotion(promotion, approved) {
    const observations = window.prompt(
      approved
        ? 'Observations du marketing (facultatif) :'
        : 'Motif obligatoire du refus par le marketing :'
    );

    if (observations === null) return;

    if (!approved && !observations.trim()) {
      setError('Le motif du refus est obligatoire.');
      return;
    }

    await runAction(
      'review_promotion_marketing',
      {
        p_promotion_id: promotion.id,
        p_approuve: approved,
        p_observations: observations.trim() || null,
      },
      approved
        ? 'Examen du marketing enregistré.'
        : 'Refus du marketing enregistré.'
    );
  }

  async function decidePromotion(promotion, approved) {
    const decisionMotif = window.prompt(
      approved
        ? 'Motif ou observations de la décision (facultatif) :'
        : 'Motif obligatoire de la décision de refus :'
    );

    if (decisionMotif === null) return;

    if (!approved && !decisionMotif.trim()) {
      setError('Le motif du refus est obligatoire.');
      return;
    }

    await runAction(
      'decide_promotion',
      {
        p_promotion_id: promotion.id,
        p_approuve: approved,
        p_motif: decisionMotif.trim() || null,
      },
      approved
        ? 'Décision favorable enregistrée. Le grade n’a pas encore été modifié.'
        : 'Décision de refus enregistrée.'
    );
  }

  async function applyPromotion(promotion) {
    const confirmed = window.confirm(
      `Confirmer l’application du grade ${promotion.nouveau_grade} ? ` +
      'Les critères seront recalculés par la base de données.'
    );

    if (!confirmed) return;

    await runAction(
      'apply_approved_promotion',
      { p_promotion_id: promotion.id },
      'Promotion appliquée. Le nouveau grade a été traité par la base de données.'
    );
  }

  const panelStyle = {
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '16px',
    marginTop: '16px',
  };

  const buttonStyle = {
    padding: '8px 12px',
    margin: '4px 6px 4px 0',
    cursor: submitting ? 'wait' : 'pointer',
  };

  if (!canView) {
    return (
      <section style={panelStyle}>
        <h2>Gestion des promotions</h2>
        <p>Votre compte ne dispose pas de la permission de consultation.</p>
      </section>
    );
  }

  return (
    <section style={panelStyle}>
      <h2>Gestion des promotions</h2>
      <p>
        Circuit : Commercial → Secrétariat → Marketing →
        Coordination/Admin → Application du grade.
      </p>

      {error && (
        <p role="alert" style={{ color: '#b91c1c' }}>
          {error}
        </p>
      )}

      {notice && (
        <p role="status" style={{ color: '#166534' }}>
          {notice}
        </p>
      )}

      {canRequest && (
        <form onSubmit={requestPromotion} style={panelStyle}>
          <h3>Soumettre une demande</h3>
          <label htmlFor="promotion-motif">
            Motif ou observations (facultatif)
          </label>
          <br />
          <textarea
            id="promotion-motif"
            value={motif}
            onChange={(event) => setMotif(event.target.value)}
            rows={3}
            maxLength={2000}
            style={{ width: '100%', maxWidth: '600px', marginTop: '8px' }}
          />
          <br />
          <button
            type="submit"
            style={buttonStyle}
            disabled={submitting}
          >
            {submitting ? 'Traitement…' : 'Soumettre la demande'}
          </button>
          <p>
            L’éligibilité et les performances seront vérifiées par Supabase.
          </p>
        </form>
      )}

      <div style={{ marginTop: '20px' }}>
        <h3>Demandes de promotion</h3>

        <button
          type="button"
          style={buttonStyle}
          onClick={loadPromotions}
          disabled={loading || submitting}
        >
          Actualiser
        </button>

        {loading ? (
          <p>Chargement des demandes…</p>
        ) : promotions.length === 0 ? (
          <p>Aucune demande visible.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginTop: '12px',
              }}
            >
              <thead>
                <tr>
                  {[
                    'Date',
                    'Identifiant commercial',
                    'Progression',
                    'Clients',
                    'GP',
                    'Statut',
                    'Observations',
                    'Actions',
                  ].map((heading) => (
                    <th
                      key={heading}
                      scope="col"
                      style={{
                        textAlign: 'left',
                        padding: '10px',
                        borderBottom: '2px solid #d1d5db',
                      }}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {promotions.map((promotion) => (
                  <tr key={promotion.id}>
                    <td style={{ padding: '10px', verticalAlign: 'top' }}>
                      {formatDate(promotion.date_demande)}
                    </td>
                    <td
                      style={{
                        padding: '10px',
                        verticalAlign: 'top',
                        minWidth: '180px',
                        overflowWrap: 'anywhere',
                      }}
                    >
                      {promotion.commercial_id}
                    </td>
                    <td style={{ padding: '10px', verticalAlign: 'top' }}>
                      Grade {promotion.ancien_grade} → {promotion.nouveau_grade}
                    </td>
                    <td style={{ padding: '10px', verticalAlign: 'top' }}>
                      {promotion.clients_valides}
                    </td>
                    <td style={{ padding: '10px', verticalAlign: 'top' }}>
                      {formatGP(promotion.gp_valides)}
                    </td>
                    <td style={{ padding: '10px', verticalAlign: 'top' }}>
                      <strong
                        style={{
                          color: STATUS_COLORS[promotion.statut] || '#374151',
                        }}
                      >
                        {STATUS_LABELS[promotion.statut] || promotion.statut}
                      </strong>
                    </td>
                    <td style={{ padding: '10px', verticalAlign: 'top' }}>
                      <p>
                        <strong>Demande :</strong>{' '}
                        {promotion.motif || '—'}
                      </p>
                      <p>
                        <strong>Secrétariat :</strong>{' '}
                        {promotion.secretariat_observations || '—'}
                      </p>
                      <p>
                        <strong>Marketing :</strong>{' '}
                        {promotion.marketing_observations || '—'}
                      </p>
                      <p>
                        <strong>Décision :</strong>{' '}
                        {promotion.decision_motif || '—'}
                      </p>
                    </td>
                    <td style={{ padding: '10px', verticalAlign: 'top', minWidth: '210px' }}>
                      {canVerify && promotion.statut === 'EN_ATTENTE' && (
                        <>
                          <button
                            type="button"
                            style={buttonStyle}
                            disabled={submitting}
                            onClick={() => verifyPromotion(promotion, true)}
                          >
                            Vérifier
                          </button>
                          <button
                            type="button"
                            style={buttonStyle}
                            disabled={submitting}
                            onClick={() => verifyPromotion(promotion, false)}
                          >
                            Refuser
                          </button>
                        </>
                      )}

                      {canReview && promotion.statut === 'EXAMEN_MARKETING' && (
                        <>
                          <button
                            type="button"
                            style={buttonStyle}
                            disabled={submitting}
                            onClick={() => reviewPromotion(promotion, true)}
                          >
                            Approuver l’examen
                          </button>
                          <button
                            type="button"
                            style={buttonStyle}
                            disabled={submitting}
                            onClick={() => reviewPromotion(promotion, false)}
                          >
                            Refuser
                          </button>
                        </>
                      )}

                      {canDecide && promotion.statut === 'EN_DECISION' && (
                        <>
                          <button
                            type="button"
                            style={buttonStyle}
                            disabled={submitting}
                            onClick={() => decidePromotion(promotion, true)}
                          >
                            Approuver
                          </button>
                          <button
                            type="button"
                            style={buttonStyle}
                            disabled={submitting}
                            onClick={() => decidePromotion(promotion, false)}
                          >
                            Refuser
                          </button>
                        </>
                      )}

                      {canApply && promotion.statut === 'APPROUVEE' && (
                        <button
                          type="button"
                          style={buttonStyle}
                          disabled={submitting}
                          onClick={() => applyPromotion(promotion)}
                        >
                          Appliquer le grade
                        </button>
                      )}

                      {ACTIVE_STATUSES.includes(promotion.statut) &&
                        !(
                          (canVerify && promotion.statut === 'EN_ATTENTE') ||
                          (canReview && promotion.statut === 'EXAMEN_MARKETING') ||
                          (canDecide && promotion.statut === 'EN_DECISION') ||
                          (canApply && promotion.statut === 'APPROUVEE')
                        ) && (
                          <span>Aucune action disponible pour ce rôle à cette étape.</span>
                        )}

                      {!ACTIVE_STATUSES.includes(promotion.statut) && (
                        <span>Aucune action requise.</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
