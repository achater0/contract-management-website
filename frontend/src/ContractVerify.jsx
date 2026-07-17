import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import myHeaderImage from "./image_3ec705.png";

export default function ContractVerify() {
  const { id } = useParams();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Design tokens based on Anima design export
  const colors = {
    primary: "#0073e6",      // Derived from Anima primary var
    accent: "#2f9e44",       // Derived from Anima accent var
    button: "#e63950",       // Derived from Anima button var
    tableHeader: "#d1d1d1",  // Derived from Anima table-header var
    border: "#7a7a7a",       // Derived from Anima border style
    background: "#f2f2f2",   // Derived from Anima background var
    foreground: "#121212"    // Derived from Anima foreground var
  };

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
        const response = await fetch(`${apiUrl}/api/contracts/${id}`);
        
        if (!response.ok) {
          throw new Error("Contrat introuvable ou invalide.");
        }

        const row = await response.json();
        const formData = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
        
        setContract({
          ...row,
          details: formData
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContract();
  }, [id]);

  if (loading) {
    return <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>Chargement...</div>;
  }

  if (error || !contract) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', color: colors.button }}>
        <h2>❌ Erreur</h2>
        <p>{error || "Ce code QR ne correspond à aucun contrat valide."}</p>
      </div>
    );
  }

  // --- DATA EXTRACTION & FORMATTING ---
  const d = contract.details || {};
  const clients = d.clients || [];
  const prestations = d.prestations || [];
  const refs = d.references || [];

  const officialNumber = `N°604/SO/ONIGT/CN-${String(contract.sequence || 0).padStart(4, '0')}/2026`;

  const dateObj = new Date(contract.created_at || Date.now());
  const dayName = dateObj.toLocaleDateString('fr-FR', { weekday: 'long' });
  const dayNum = dateObj.getDate();
  const monthName = dateObj.toLocaleDateString('fr-FR', { month: 'long' });
  const year = dateObj.getFullYear();
  
  const formattedDateString = `Fait à Agadir, le ${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${dayNum} ${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}.`;

  return (
    <div style={{ 
      fontFamily: 'Arial, Helvetica, sans-serif', 
      fontSize: '16px',
      lineHeight: '1.6',
      backgroundColor: colors.background, 
      minHeight: '100vh', 
      color: colors.foreground,
      margin: '0px',
      padding: '0px',
      width: '100%'
    }}>
      
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '16px 32px', 
        boxSizing: 'border-box' 
      }}>
        
        {/* HEADER */}
        <div style={{ marginBottom: '35px', display: 'flex', alignItems: 'center', gap: '32px' }}>
          <img 
            src={myHeaderImage} 
            alt="ONIGT Logo" 
            style={{ 
              height: '202px', 
              width: 'auto'
            }} 
          />
          
          <h2 style={{ 
            color: colors.accent, 
            fontSize: '40px',
            fontWeight: 'bold',
            margin: '0px',
            lineHeight: '1.2'
          }}>
            Contrat : Validé (En Exécution)
          </h2>
        </div>

        {/* METADATA */}
        <div style={{ marginBottom: '30px', color: colors.primary, fontWeight: 'bold' }}>
          <div>Contrat n°: {officialNumber}</div>
          <div>{formattedDateString}</div>
        </div>

        {/* CLIENT & ENGINEER SECTIONS */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ color: colors.primary, fontWeight: 'bold', marginBottom: '5px' }}>Le Maître d'ouvrage (Client):</div>
          <ul style={{ listStyleType: 'disc', paddingLeft: '35px' }}>
            <li style={{ fontWeight: 'bold' }}>{clients[0]?.client_name?.toUpperCase() || "CLIENT NON SPÉCIFIÉ"}</li>
          </ul>
          <hr style={{ border: '0', borderTop: `1px solid ${colors.border}`, marginTop: '15px' }} />
        </div>

        <div style={{ marginBottom: '25px' }}>
          <div style={{ color: colors.primary, fontWeight: 'bold', marginBottom: '5px' }}>Le Maître d'œuvre (Ingénieur Géomètre Topographe):</div>
          <ul style={{ listStyleType: 'disc', paddingLeft: '35px' }}>
            <li style={{ fontWeight: 'bold' }}>CHATER Othmane</li>
          </ul>
          <hr style={{ border: '0', borderTop: `1px solid ${colors.border}`, marginTop: '15px' }} />
        </div>

        <p style={{ marginBottom: '20px' }}>
          Par le présent contrat, l'Ingénieur Géomètre Topographe s'engage envers le maître d'ouvrage de réaliser les prestations synthétisée(s) dans le tableau ci-dessous.
        </p>

        {/* DATA TABLE */}
        <div style={{ overflowX: 'auto', marginBottom: '40px' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            border: `1px solid ${colors.border}`,
          }}>
            <thead>
              <tr style={{ backgroundColor: colors.tableHeader }}>
                <th style={{ border: `1px solid ${colors.border}`, padding: '8px 16px', color: colors.primary, width: '26%', fontWeight: 'bold' }}>Réf. foncière</th>
                <th style={{ border: `1px solid ${colors.border}`, padding: '8px 16px', color: colors.primary, fontWeight: 'bold' }}>Prestation</th>
              </tr>
            </thead>
            <tbody>
              {prestations.map((presta, idx) => {
                const associatedRef = refs[idx] || refs[0] || {}; 
                const prefixMap = { "Titre foncier": "T", "Réquisition": "R", "Non immatriculé": "NI", "Délimitation administrative": "DA", "Non défini": "ND" };
                const prefix = prefixMap[associatedRef.regime] || "";
                const refCellText = `- /${prefix}${associatedRef.valeur ? ' ' + associatedRef.valeur : ''}, ${associatedRef.commune} ${associatedRef.zone}`;
                
                return (
                  <tr key={idx}>
                    <td style={{ border: `1px solid ${colors.border}`, padding: '8px 16px' }}>{associatedRef.regime ? refCellText : "-"}</td>
                    <td style={{ border: `1px solid ${colors.border}`, padding: '8px 16px' }}>{presta.prestation}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* FOOTER ACTION */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <span style={{ color: colors.button }}>Vous avez une question ou une réclamation concernant ce contrat ?</span>
          <button
            type="button"
            style={{
              padding: '12px 24px',
              backgroundColor: colors.button,
              color: '#fff',
              border: 'none',
              borderRadius: '9999px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Soumettre une réclamation
          </button>
        </div>
      </div>
    </div>
  );
}