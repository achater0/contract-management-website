import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import myHeaderImage from "./image_3ec705.png"; 

export default function ContractVerify() {
  const { id } = useParams();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        // Handles fallback for both local development and deployment environment
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
    return <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial, sans-serif', fontSize: '16px' }}>Chargement...</div>;
  }

  if (error || !contract) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'Arial, sans-serif', fontSize: '16px', color: '#dc3545' }}>
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

  const onigtBlue = "#0261A4"; 
  const onigtGreen = "#28a745";
  const borderColor = "#7f7f7f"; 

  return (
    <div style={{ 
      fontFamily: "'Arial', sans-serif", 
      fontSize: '16px',
      lineHeight: '1.6',
      backgroundColor: '#fff', 
      minHeight: '100vh', 
      color: 'black',
      margin: '0px',
      padding: '0px'
    }}>
      
      {/* Container aligned to the left, matching your exact design structure */}
      <div style={{ padding: '8px', margin: '0px' }}>
        
        {/* HEADER LOGO - col-md-5 proportion from your template (5/12 = ~41.66%) */}
        <div style={{ margin: '0px', marginBottom: '20px', width: '100%', display: 'flex', justifyContent: 'flex-start' }}>
          <img 
            src={myHeaderImage} 
            alt="ONIGT Logo" 
            style={{ 
              width: '41.66666667%', 
              height: 'auto', 
              display: 'block',
              objectFit: 'cover'
            }} 
          />
        </div>

        {/* OFFICIAL STATUS TITLE */}
        <h2 style={{ 
          color: onigtGreen, 
          textAlign: 'center', 
          fontSize: '24px', 
          fontWeight: 'bold',
          marginBottom: '30px'
        }}>
          Contrat : Validé (En Exécution)
        </h2>

        {/* CONTRACT REFERENCE NUMBER AND DATE */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ color: onigtBlue, fontWeight: 'bold' }}>
            Contrat n°: {officialNumber}
          </div>
          <div style={{ color: onigtBlue, fontWeight: 'bold' }}>
            {formattedDateString}
          </div>
        </div>

        {/* CLIENT SECTION */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ color: onigtBlue, fontWeight: 'bold', marginBottom: '0px' }}>
            Le Maître d'ouvrage (Client):
          </div>
          <ol style={{ listStyleType: 'decimal', margin: '0px', paddingLeft: '20px', textAlign: 'justify' }}>
            <li style={{ fontWeight: 'bold' }}>
              {clients[0]?.client_name?.toUpperCase() || "CLIENT NON SPÉCIFIÉ"}
            </li>
          </ol>
          <hr style={{ border: '0', borderTop: `1px solid ${borderColor}`, marginTop: '15px' }} />
        </div>

        {/* ENGINEER SECTION */}
        <div style={{ marginBottom: '25px' }}>
          <div style={{ color: onigtBlue, fontWeight: 'bold', marginBottom: '0px' }}>
            Le Maître d'œuvre (Ingénieur Géomètre Topographe):
          </div>
          <ol style={{ listStyleType: 'decimal', margin: '0px', paddingLeft: '20px', textAlign: 'justify' }}>
            <li style={{ fontWeight: 'bold' }}>
              CHATER Othmane 
            </li>
          </ol>
          <hr style={{ border: '0', borderTop: `1px solid ${borderColor}`, marginTop: '15px' }} />
        </div>

        {/* INTRODUCTORY DESCRIPTION */}
        <p style={{ marginBottom: '20px', color: 'black', textAlign: 'justify' }}>
          Par le présent contrat, l'Ingénieur Géomètre Topographe s'engage envers le maître d'ouvrage de réaliser les prestations synthétisée(s) dans le tableau ci-dessous.
        </p>

        {/* DATA TABLE */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            border: `1px solid ${borderColor}`,
            color: 'black'
          }}>
            <thead>
              <tr>
                <th style={{ 
                  border: `1px solid ${borderColor}`, 
                  padding: '3px', 
                  backgroundColor: '#d3d3d3',
                  color: 'black', 
                  width: '40%',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}>
                  Réf. foncière
                </th>
                <th style={{ 
                  border: `1px solid ${borderColor}`, 
                  padding: '3px', 
                  backgroundColor: '#d3d3d3',
                  color: 'black',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}>
                  Prestation
                </th>
              </tr>
            </thead>
            <tbody>
              {prestations.length === 0 ? (
                <tr>
                  <td colSpan="2" style={{ padding: '3px', textAlign: 'center', border: `1px solid ${borderColor}` }}>Aucune prestation renseignée</td>
                </tr>
              ) : (
                prestations.map((presta, idx) => {
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
                        border: `1px solid ${borderColor}`, 
                        padding: '3px',
                        verticalAlign: 'top',
                        textAlign: 'justify'
                      }}>
                        {associatedRef.regime ? refCellText : "-"}
                      </td>
                      <td style={{ 
                        border: `1px solid ${borderColor}`, 
                        padding: '3px',
                        verticalAlign: 'top',
                        textAlign: 'justify'
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
    </div>
  );
}