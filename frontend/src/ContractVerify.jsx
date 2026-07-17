import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import myHeaderImage from "./image_3ec705.png"; // Header image import

export default function ContractVerify() {
  const { id } = useParams();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    return <div style={{ padding: '20px', textAlign: 'left', fontFamily: 'Arial, sans-serif', fontSize: '16px' }}>Chargement...</div>;
  }

  if (error || !contract) {
    return (
      <div style={{ padding: '20px', textAlign: 'left', fontFamily: 'Arial, sans-serif', fontSize: '16px', color: '#dc3545' }}>
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
  const animaHeaderBg = "#d1d1d1";

  return (
    <div style={{ 
      fontFamily: "'Arial', sans-serif", 
      fontSize: '16px',
      lineHeight: '1.6',
      backgroundColor: '#fff', 
      minHeight: '100vh', 
      color: 'black',
      margin: '0px',
      padding: '0px',
      width: '100%'
    }}>
      
      {/* MAIN CONTAINER */}
      <div style={{ 
        width: '100%',
        margin: '0', 
        boxSizing: 'border-box' 
      }}>
        
        {/* ======================================================== */}
        {/* PART 1: LOGO & GREEN TEXT                                */}
        {/* ======================================================== */}
        <div style={{ 
          boxSizing: 'border-box',
          display: 'flex', 
          flexWrap: 'wrap', 
          position: 'relative',
          width: '100%',
          flex: '0 0 100%',
          maxWidth: '100%',
          margin: '0',
          padding: '0.5rem' /* Equivalent to p-2 */
        }}>
          
          {/* Logo Container (Equivalent to col-5) */}
          <div style={{ 
            boxSizing: 'border-box',
            position: 'relative',
            width: '100%',
            paddingRight: '15px',
            paddingLeft: '15px',
            flex: '0 0 41.666667%', 
            maxWidth: '41.666667%',
            margin: '0'
          }}>
            <img 
              src={myHeaderImage} 
              alt="ONIGT Logo" 
              style={{ 
                width: '100%',
                boxSizing: 'border-box',
                verticalAlign: 'middle',
                borderStyle: 'none'
              }} 
            />
          </div>
          
          {/* Title Container (Equivalent to col-6 mt-2) */}
          <div style={{ 
            boxSizing: 'border-box',
            position: 'relative',
            width: '100%',
            paddingRight: '15px',
            paddingLeft: '15px',
            flex: '0 0 50%',
            maxWidth: '50%',
            marginTop: '0.5rem' /* Equivalent to mt-2 */
          }}>
            <h4 style={{ 
              boxSizing: 'border-box',
              marginTop: '0',
              marginBottom: '0.5rem',
              fontWeight: '500',
              lineHeight: '1.2',
              fontSize: '1.5rem',
              color: '#28a745',
              textAlign: 'left', /* Switched to left per your CSS */
              fontFamily: "'Arial', sans-serif"
            }}>
              <b style={{ 
                boxSizing: 'border-box',
                fontWeight: 'bolder' 
              }}>
                Contrat : Validé (En Exécution)
              </b>
            </h4>
          </div>
        </div>

        {/* ======================================================== */}
        {/* PART 2: REFERENCE AND DATE                               */}
        {/* ======================================================== */}
        <div style={{ 
          width: '100%',
          paddingRight: '15px',
          paddingLeft: '15px',
          marginTop: '20px',
          marginBottom: '10px',
          boxSizing: 'border-box'
        }}>
          <div style={{ color: onigtBlue, fontWeight: 'bold', textAlign: 'left' }}>
            Contrat n°: {officialNumber}
          </div>
          <div style={{ color: onigtBlue, fontWeight: 'bold', textAlign: 'left' }}>
            {formattedDateString}
          </div>
        </div>

        {/* ======================================================== */}
        {/* PART 3: THE REST (CLIENT, ENGINEER, TABLE, RECLAMATION)  */}
        {/* ======================================================== */}
        <div style={{ 
          width: '100%',
          padding: '15px', /* Equivalent to Bootstrap's p-3 wrapper */
          boxSizing: 'border-box'
        }}>
          
          {/* CLIENT SECTION */}
          <div style={{ marginBottom: '16px', textAlign: 'left' }}>
            <div style={{ color: onigtBlue, fontWeight: 'bold', marginBottom: '4px', textAlign: 'left' }}>
              Le Maître d'ouvrage (Client):
            </div>
            <ul style={{ listStyleType: 'disc', margin: '0px', paddingLeft: '35px', textAlign: 'left' }}>
              <li style={{ fontWeight: 'bold' }}>
                {clients[0]?.client_name?.toUpperCase() || "CLIENT NON SPÉCIFIÉ"}
              </li>
            </ul>
          </div>
          
          <hr style={{ border: '0', borderTop: `1px solid ${borderColor}`, margin: '16px 0' }} />

          {/* ENGINEER SECTION */}
          <div style={{ marginBottom: '16px', textAlign: 'left' }}>
            <div style={{ color: onigtBlue, fontWeight: 'bold', marginBottom: '4px', textAlign: 'left' }}>
              Le Maître d'œuvre (Ingénieur Géomètre Topographe):
            </div>
            <ul style={{ listStyleType: 'disc', margin: '0px', paddingLeft: '35px', textAlign: 'left' }}>
              <li style={{ fontWeight: 'bold' }}>
                CHATER Othmane 
              </li>
            </ul>
          </div>

          <hr style={{ border: '0', borderTop: `1px solid ${borderColor}`, margin: '16px 0' }} />

          {/* INTRODUCTORY TEXT */}
          <p style={{ marginBottom: '16px', color: 'black', textAlign: 'left' }}>
            Par le présent contrat, l'Ingénieur Géomètre Topographe s'engage envers le maître d'ouvrage de réaliser les prestations synthétisée(s) dans le tableau ci-dessous.
          </p>

          {/* DATA TABLE */}
          <div style={{ overflowX: 'auto', width: '100%' }}>
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
                    padding: '8px 12px',
                    backgroundColor: animaHeaderBg, 
                    color: onigtBlue,
                    width: '40%',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '15px' 
                  }}>
                    Réf. foncière
                  </th>
                  <th style={{ 
                    border: `1px solid ${borderColor}`, 
                    padding: '8px 12px',
                    backgroundColor: animaHeaderBg, 
                    color: onigtBlue,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '15px' 
                  }}>
                    Prestation
                  </th>
                </tr>
              </thead>
              <tbody>
                {prestations.length === 0 ? (
                  <tr>
                    <td colSpan="2" style={{ padding: '8px 12px', textAlign: 'left', border: `1px solid ${borderColor}` }}>
                      Aucune prestation renseignée
                    </td>
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
                        .filter(([_, v]) => v !== "" && v !== null && v !== undefined)
                        .map(([k, v]) => {
                          const cleanKey = k.replace(/_/g, ' ');
                          const rawValue = String(v); 
                          return `(${cleanKey} = ${rawValue})`;
                        });

                      if (paramStrings.length > 0) {
                        paramsText = " " + paramStrings.join(' ');
                      }
                    }

                    return (
                      <tr key={idx}>
                        <td style={{ 
                          border: `1px solid ${borderColor}`, 
                          padding: '8px 12px', 
                          verticalAlign: 'top',
                          textAlign: 'left'
                        }}>
                          {associatedRef.regime ? refCellText : "-"}
                        </td>
                        <td style={{ 
                          border: `1px solid ${borderColor}`, 
                          padding: '8px 12px',
                          verticalAlign: 'top',
                          textAlign: 'left'
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

          {/* --- RECLAMATION SECTION --- */}
          <div style={{ 
            marginTop: '30px', 
            marginBottom: '20px',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center', 
            gap: '15px',              
            flexWrap: 'wrap'
          }}>
            <span style={{ 
              fontSize: '16px', 
              color: '#dc3545', 
              fontWeight: 'normal'
            }}>
              Vous avez une question ou une réclamation concernant ce contrat ?
            </span>
            
            <button
              type="button"
              style={{
                padding: '12px 24px', 
                backgroundColor: '#dc3545',
                color: '#fff',
                border: 'none',
                borderRadius: '9999px', 
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'normal',
                whiteSpace: 'nowrap'
              }}
            >
              Soumettre une réclamation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}