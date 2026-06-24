import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function ContractVerify() {
  const { id } = useParams();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || '';
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
    return <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>Chargement...</div>;
  }

  if (error || !contract) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial, sans-serif', color: '#dc3545' }}>
        <h2>❌ Erreur</h2>
        <p>{error || "Ce QR code ne correspond à aucun contrat valide."}</p>
      </div>
    );
  }

  // --- EXTRACTION ET FORMATAGE DES DONNÉES ---
  const d = contract.details || {};
  const clients = d.clients || [];
  const prestations = d.prestations || [];
  const refs = d.references || [];

  const officialNumber = `N°604/SO/ONIGT/CN-${String(contract.sequence || 0).padStart(4, '0')}/2026`;

  // Formatage de la date en français (ex: Jeudi 18 Juin 2026)
  const dateObj = new Date(contract.created_at || Date.now());
  const dayName = dateObj.toLocaleDateString('fr-FR', { weekday: 'long' });
  const dayNum = dateObj.getDate();
  const monthName = dateObj.toLocaleDateString('fr-FR', { month: 'long' });
  const year = dateObj.getFullYear();
  
  const formattedDateString = `Fait à Agadir, le ${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${dayNum} ${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}.`;

  // Couleurs officielles ONIGT approximées d'après votre image
  const onigtBlue = "#005b9f";
  const onigtLightBlue = "#0078d7";
  const onigtGreen = "#28a745";

  return (
    <div style={{ 
      fontFamily: 'Arial, Helvetica, sans-serif', 
      backgroundColor: '#fff', 
      minHeight: '100vh', 
      color: '#333',
      padding: '15px',
      maxWidth: '800px',
      margin: '0 auto'
    }}>
      
      {/* HEADER LOGO ONIGT TEXTUEL (Simulé pour ressembler à l'image) */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ 
          fontSize: '60px', 
          fontWeight: '900', 
          color: onigtLightBlue, 
          margin: '0 0 5px 0', 
          letterSpacing: '-2px',
          lineHeight: '1'
        }}>
          ONIGT
        </h1>
        <div style={{ color: onigtBlue, fontWeight: 'bold', fontSize: '15px', lineHeight: '1.4' }}>
          <div>الهيئة الوطنية للمهندسين المساحين الطبوغرافيين</div>
          <div style={{ fontFamily: 'sans-serif', letterSpacing: '1px', fontSize: '13px' }}>
            oIXC.C oI.C:O ΣIIΣ:QI ΣCØØX:EI ΣE:Θ:YQ.XΣI
          </div>
          <div>ORDRE NATIONAL DES INGENIEURS GEOMETRES TOPOGRAPHES</div>
        </div>
      </div>

      {/* TITRE PRINCIPAL (Vert) */}
      <h2 style={{ 
        color: onigtGreen, 
        textAlign: 'center', 
        fontSize: '24px', 
        fontWeight: 'bold',
        marginBottom: '30px'
      }}>
        Contrat : Validé (En Exécution)
      </h2>

      {/* NUMÉRO ET DATE */}
      <div style={{ marginBottom: '30px', fontSize: '16px' }}>
        <div style={{ color: onigtBlue, fontWeight: 'bold', marginBottom: '8px' }}>
          Contrat n°: {officialNumber}
        </div>
        <div style={{ color: onigtBlue }}>
          {formattedDateString}
        </div>
      </div>

      {/* MAÎTRE D'OUVRAGE (Client) */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ color: onigtBlue, fontWeight: 'bold', fontSize: '16px', marginBottom: '10px' }}>
          Le Maître d'ouvrage (Client):
        </div>
        <ul style={{ margin: '0 0 15px 0', paddingLeft: '30px' }}>
          <li style={{ fontWeight: 'bold', fontSize: '16px' }}>
            {clients[0]?.client_name?.toUpperCase() || "CLIENT NON SPÉCIFIÉ"}
          </li>
        </ul>
        <hr style={{ border: '0', borderTop: '1px solid #eee' }} />
      </div>

      {/* MAÎTRE D'OEUVRE (IGT) */}
      <div style={{ marginBottom: '25px' }}>
        <div style={{ color: onigtBlue, fontWeight: 'bold', fontSize: '16px', marginBottom: '10px', lineHeight: '1.4' }}>
          Le Maître d'œuvre (Ingénieur Géomètre Topographe):
        </div>
        <ul style={{ margin: '0 0 15px 0', paddingLeft: '30px' }}>
          <li style={{ fontWeight: 'bold', fontSize: '16px' }}>
            CHATER Othmane 
          </li>
        </ul>
        <hr style={{ border: '0', borderTop: '1px solid #eee' }} />
      </div>

      {/* TEXTE INTRODUCTIF DU TABLEAU */}
      <p style={{ fontSize: '15px', lineHeight: '1.5', marginBottom: '20px', color: '#000' }}>
        Par le présent contrat, l'Ingénieur Géomètre Topographe s'engage envers le maître d'ouvrage de réaliser les prestations synthétisée(s) dans le tableau ci-dessous.
      </p>

      {/* TABLEAU DES PRESTATIONS */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse', 
          border: '1px solid #999',
          fontSize: '15px'
        }}>
          <thead>
            <tr style={{ backgroundColor: '#e9ecef' }}>
              <th style={{ 
                border: '1px solid #999', 
                padding: '12px 10px', 
                color: onigtBlue, 
                width: '40%',
                textAlign: 'center'
              }}>
                Réf. foncière
              </th>
              <th style={{ 
                border: '1px solid #999', 
                padding: '12px 10px', 
                color: onigtBlue,
                textAlign: 'center'
              }}>
                Prestation
              </th>
            </tr>
          </thead>
          <tbody>
            {prestations.length === 0 ? (
              <tr>
                <td colSpan="2" style={{ padding: '15px', textAlign: 'center', border: '1px solid #999' }}>Aucune prestation renseignée</td>
              </tr>
            ) : (
              prestations.map((presta, idx) => {
                // Construction de la référence foncière formatée (ex: "- /NI, Aourir Zone 2")
                const associatedRef = refs[idx] || refs[0] || {}; 
                const prefixMap = {
                  "Titre foncier": "T",
                  "Réquisition": "R",
                  "Non immatriculé": "NI",
                  "Délimitation administrative": "DA",
                  "Non défini": "ND"
                };
                const prefix = prefixMap[associatedRef.regime] || "";
                const val = associatedRef.valeur || "";
                const commune = associatedRef.commune || "";
                const zone = associatedRef.zone || "";
                
                const refCellText = `- /${prefix}${val ? ' ' + val : ''}, ${commune} ${zone}`;

                // Construction de la prestation avec ses paramètres
                let paramsText = "";
                if (presta.params && Object.keys(presta.params).length > 0) {
                  const paramStrings = Object.entries(presta.params)
                    .filter(([_, v]) => v !== "")
                    .map(([k, v]) => `${k.replace(/_/g, ' ')} = ${v}`);
                  if (paramStrings.length > 0) {
                    paramsText = ` (${paramStrings.join(', ')})`;
                  }
                }

                return (
                  <tr key={idx}>
                    <td style={{ 
                      border: '1px solid #999', 
                      padding: '12px 10px',
                      verticalAlign: 'top',
                      color: '#333'
                    }}>
                      {associatedRef.regime ? refCellText : "-"}
                    </td>
                    <td style={{ 
                      border: '1px solid #999', 
                      padding: '12px 10px',
                      verticalAlign: 'top',
                      color: '#333'
                    }}>
                      {presta.prestation}{paramsText}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}