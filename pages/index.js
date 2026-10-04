import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialisation du client Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function HBKGrowthApp() {
  const [activeTab, setActiveTab] = useState('commercial');
  const [commercials, setCommercials] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [partenaires, setPartenaires] = useState([]);

  // Formulaires
  const [nom, setNom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [grade, setGrade] = useState('G1');
  
  const [caForm, setCaForm] = useState({ commercial_id: '', ca_mensuel: '', mois: '' });
  const [commandeForm, setCommandeForm] = useState({ commercial_id: '', client: '', produit: '', montant: '', statut: 'En cours' });

  // Chargement des données Supabase
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: comms } = await supabase.from('commercials').select('*');
    const { data: cmds } = await supabase.from('commandes').select('*');
    const { data: parts } = await supabase.from('partenaires').select('*');
    if (comms) setCommercials(comms);
    if (cmds) setCommandes(cmds);
    if (parts) setPartenaires(parts);
  };

  // Enregistrer un commercial
  const handleAddCommercial = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from('commercials').insert([{ nom, telephone, grade }]);
    if (!error) {
      setNom(''); setTelephone('');
      fetchData();
    }
  };

  // Enregistrer un CA Mensuel (Calcul automatique des GP : 1 GP = 100$)
  const handleAddCA = async (e) => {
    e.preventDefault();
    const ca = parseFloat(caForm.ca_mensuel);
    const gp = ca / 100;
    const { error } = await supabase.from('historique_ca').insert([
      { commercial_id: caForm.commercial_id, ca_mensuel: ca, gp_generes: gp, mois: caForm.mois }
    ]);
    if (!error) {
      setCaForm({ commercial_id: '', ca_mensuel: '', mois: '' });
      fetchData();
    }
  };

  // Enregistrer une commande (Secrétariat)
  const handleAddCommande = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('commandes').insert([commandeForm]);
    if (!error) {
      setCommandeForm({ commercial_id: '', client: '', produit: '', montant: '', statut: 'En cours' });
      fetchData();
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #000', paddingBottom: '10px', marginBottom: '20px' }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>HBK Growth Department App</h1>
        <nav style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => setActiveTab('commercial')} style={{ padding: '8px 16px', fontWeight: activeTab === 'commercial' ? 'bold' : 'normal' }}>Commercials & GP</button>
          <button onClick={() => setActiveTab('secretariat')} style={{ padding: '8px 16px', fontWeight: activeTab === 'secretariat' ? 'bold' : 'normal' }}>Secrétariat / Commandes</button>
        </nav>
      </header>

      {/* ONGLET COMMERCIAL & GP */}
      {activeTab === 'commercial' && (
        <div>
          <h2>Gestion des Commercials & Calculateur de GP</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            {/* Formulaire Commercial */}
            <form onSubmit={handleAddCommercial} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
              <h3>Ajouter un Commercial</h3>
              <input type="text" placeholder="Nom complet" value={nom} onChange={(e) => setNom(e.target.value)} required style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
              <input type="text" placeholder="Téléphone" value={telephone} onChange={(e) => setTelephone(e.target.value)} style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
              <select value={grade} onChange={(e) => setGrade(e.target.value)} style={{ width: '100%', marginBottom: '10px', padding: '8px' }}>
                <option value="G1">G1 - Débutant</option>
                <option value="G2">G2 - Intermédiaire</option>
                <option value="G3">G3 - Confirme</option>
                <option value="G4">G4 - Senior</option>
                <option value="G5">G5 - Expert</option>
                <option value="G6">G6 - Master</option>
              </select>
              <button type="submit" style={{ padding: '10px 20px', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Enregistrer</button>
            </form>

            {/* Formulaire Chiffre d'Affaires & GP */}
            <form onSubmit={handleAddCA} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
              <h3>Saisir CA Mensuel (Calcul de GP)</h3>
              <select value={caForm.commercial_id} onChange={(e) => setCaForm({ ...caForm, commercial_id: e.target.value })} required style={{ width: '100%', marginBottom: '10px', padding: '8px' }}>
                <option value="">-- Sélectionner Commercial --</option>
                {commercials.map(c => <option key={c.id} value={c.id}>{c.nom} ({c.grade})</option>)}
              </select>
              <input type="number" placeholder="Montant CA ($)" value={caForm.ca_mensuel} onChange={(e) => setCaForm({ ...caForm, ca_mensuel: e.target.value })} required style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
              <input type="text" placeholder="Mois (ex: Octobre 2026)" value={caForm.mois} onChange={(e) => setCaForm({ ...caForm, mois: e.target.value })} required style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
              <p style={{ fontSize: '14px', color: '#666' }}>Estimation GP : <strong>{caForm.ca_mensuel ? (parseFloat(caForm.ca_mensuel) / 100).toFixed(2) : 0} GP</strong></p>
              <button type="submit" style={{ padding: '10px 20px', background: '#10B981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Enregistrer CA</button>
            </form>
          </div>

          <h3>Liste des Commercials</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
            <thead>
              <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
                <th style={{ padding: '10px', border: '1px solid #ccc' }}>Nom</th>
                <th style={{ padding: '10px', border: '1px solid #ccc' }}>Téléphone</th>
                <th style={{ padding: '10px', border: '1px solid #ccc' }}>Grade</th>
                <th style={{ padding: '10px', border: '1px solid #ccc' }}>GP Cumulés</th>
              </tr>
            </thead>
            <tbody>
              {commercials.map(c => (
                <tr key={c.id}>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>{c.nom}</td>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>{c.telephone}</td>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}><strong>{c.grade}</strong></td>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>{c.gp_cumules || 0} GP</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ONGLET SECRETARIAT */}
      {activeTab === 'secretariat' && (
        <div>
          <h2>Espace Secrétariat - Suivi des Commandes</h2>
          <form onSubmit={handleAddCommande} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginBottom: '30px' }}>
            <h3>Saisir une Nouvelle Commande</h3>
            <select value={commandeForm.commercial_id} onChange={(e) => setCommandeForm({ ...commandeForm, commercial_id: e.target.value })} required style={{ width: '100%', marginBottom: '10px', padding: '8px' }}>
              <option value="">-- Commercial Apporteur --</option>
              {commercials.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
            </select>
            <input type="text" placeholder="Nom du Client" value={commandeForm.client} onChange={(e) => setCommandeForm({ ...commandeForm, client: e.target.value })} required style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
            <input type="text" placeholder="Produit / Service" value={commandeForm.produit} onChange={(e) => setCommandeForm({ ...commandeForm, produit: e.target.value })} required style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
            <input type="number" placeholder="Montant Total ($)" value={commandeForm.montant} onChange={(e) => setCommandeForm({ ...commandeForm, montant: e.target.value })} required style={{ width: '100%', marginBottom: '10px', padding: '8px' }} />
            <button type="submit" style={{ padding: '10px 20px', background: '#8B5CF6', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Créer Commande</button>
          </form>

          <h3>Historique des Commandes</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
            <thead>
              <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
                <th style={{ padding: '10px', border: '1px solid #ccc' }}>Client</th>
                <th style={{ padding: '10px', border: '1px solid #ccc' }}>Produit</th>
                <th style={{ padding: '10px', border: '1px solid #ccc' }}>Montant</th>
                <th style={{ padding: '10px', border: '1px solid #ccc' }}>Statut</th>
              </tr>
            </thead>
            <tbody>
              {commandes.map(cmd => (
                <tr key={cmd.id}>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>{cmd.client}</td>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>{cmd.produit}</td>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>{cmd.montant} $</td>
                  <td style={{ padding: '10px', border: '1px solid #ccc' }}>{cmd.statut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
