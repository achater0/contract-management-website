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
        // Left exactly as it was
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
    return <div style={{ padding: '0px', textAlign: 'left', fontFamily: 'Arial, sans-serif', fontSize: '16px' }}>Chargement...</div>;
  }

  if (error || !contract) {
    return (
      <div style={{ padding: '0px', textAlign: 'left', fontFamily: 'Arial, sans-serif', fontSize: '16px', color: '#dc3545' }}>
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
      padding: '0px',
      width: '100%'
    }}>
      
      <div style={{ 
        margin: '0px', 
        width: '100%', 
        padding: '0px', 
        textAlign: 'left',
        boxSizing: 'border-box' 
      }}>
        
        {/* HEADER BLOCK: Places logo and enlarged green text side-by-side */}
        <div style={{ 
          margin: '0px', 
          marginBottom: '25px', 
          width: '100%', 
          display: 'flex', 
          flexDirection: 'row',
          alignItems: 'center', 
          justifyContent: 'flex-start',
          gap: '40px',
          flexWrap: 'wrap'
        }}>
          {/* Logo on the left */}
          <img 
            src={myHeaderImage} 
            alt="ONIGT Logo" 
            style={{ 
              width: '41.66666667%', 
              height: 'auto', 
              display: 'block',
              objectFit: 'cover',
              margin: '0px'
            }} 
          />
          
          {/* Enlarged Green Status Title matching Capture31_4.PNG */}
          <h2 style={{ 
            color: onigtGreen, 
            textAlign: 'left', 
            fontSize: '36px', /* Larger font size option */
            fontWeight: 'bold',
            margin: '0px'
          }}>
            Contrat : Validé (En Exécution)
          </h2>
        </div>

        {/* REFERENCE AND DATE */}
        <div style={{ marginBottom: '30px', paddingLeft: '0px' }}>
          <div style={{ color: onigtBlue, fontWeight: 'bold', textAlign: 'left' }}>
            Contrat n°: {officialNumber}
          </div>
          <div style={{ color: onigtBlue, fontWeight: 'bold', textAlign: 'left' }}>
            {formattedDateString}
          </div>
        </div>

        {/* CLIENT SECTION - Discs/Dots shifted cleanly to the right */}
        <div style={{ marginBottom: '20px', textAlign: 'left', paddingLeft: '0px' }}>
          <div style={{ color: onigtBlue, fontWeight: 'bold', marginBottom: '5px', textAlign: 'left' }}>
            Le Maître d'ouvrage (Client):
          </div>
          <ul style={{ listStyleType: 'disc', margin: '0px', paddingLeft: '35px', textAlign: 'left' }}>
            <li style={{ fontWeight: 'bold' }}>
              {clients[0]?.client_name?.toUpperCase() || "CLIENT NON SPÉCIFIÉ"}
            </li>
          </ul>
          <hr style={{ border: '0', borderTop: `1px solid ${borderColor}`, marginTop: '15px', marginLeft: '0px' }} />
        </div>

        {/* ENGINEER SECTION - Discs/Dots shifted cleanly to the right */}
        <div style={{ marginBottom: '25px', textAlign: 'left', paddingLeft: '0px' }}>
          <div style={{ color: onigtBlue, fontWeight: 'bold', marginBottom: '5px', textAlign: 'left' }}>
            Le Maître d'œuvre (Ingénieur Géomètre Topographe):
          </div>
          <ul style={{ listStyleType: 'disc', margin: '0px', paddingLeft: '35px', textAlign: 'left' }}>
            <li style={{ fontWeight: 'bold' }}>
              CHATER Othmane 
            </li>
          </ul>
          <hr style={{ border: '0', borderTop: `1px solid ${borderColor}`, marginTop: '15px', marginLeft: '0px' }} />
        </div>

        {/* INTRODUCTORY TEXT */}
        <p style={{ marginBottom: '20px', color: 'black', textAlign: 'left', paddingLeft: '0px' }}>
          Par le présent contrat, l'Ingénieur Géomètre Topographe s'engage envers le maître d'ouvrage de réaliser les prestations synthétisée(s) dans le tableau ci-dessous.
        </p>

        {/* DATA TABLE */}
        <div style={{ overflowX: 'auto', width: '100%', paddingLeft: '0px' }}>
          <table style={{ 
            width: '100%', 
            borderCollapse: 'collapse', 
            border: `1px solid ${borderColor}`,
            color: 'black',
            marginLeft: '0px'
          }}>
            <thead>
              <tr>
                <th style={{ 
                  border: `1px solid ${borderColor}`, 
                  padding: '8px 10px', 
                  backgroundColor: '#d3d3d3',
                  color: 'black', 
                  width: '40%',
                  textAlign: 'left',
                  fontWeight: 'bold'
                }}>
                  Réf. foncière
                </th>
                <th style={{ 
                  border: `1px solid ${borderColor}`, 
                  padding: '8px 10px', 
                  backgroundColor: '#d3d3d3',
                  color: 'black',
                  textAlign: 'left',
                  fontWeight: 'bold'
                }}>
                  Prestation
                </th>
              </tr>
            </thead>
            <tbody>
              {prestations.length === 0 ? (
                <tr>
                  <td colSpan="2" style={{ padding: '8px 10px', textAlign: 'left', border: `1px solid ${borderColor}` }}>Aucune prestation renseignée</td>
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
  // We use String(v) to force JavaScript to treat it as a text string 
  // so it doesn't try to perform any math, rounding, or formatting.
  const paramStrings = Object.entries(presta.params)
    .filter(([_, v]) => v !== "" && v !== null && v !== undefined)
    .map(([k, v]) => {
      const cleanKey = k.replace(/_/g, ' ');
      const rawValue = String(v); // Force to string: prevents rounding and value changes
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
                        padding: '8px 10px',
                        verticalAlign: 'top',
                        textAlign: 'left'
                      }}>
                        {associatedRef.regime ? refCellText : "-"}
                      </td>
                      <td style={{ 
                        border: `1px solid ${borderColor}`, 
                        padding: '8px 10px',
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
      <div style={{ 
          marginTop: '40px', 
          textAlign: 'center', 
          width: '100%', 
          padding: '20px',
          borderTop: '1px solid #eee' 
        }}>
          <p style={{ fontSize: '16px', marginBottom: '15px', color: '#333' }}>
            Vous avez une question ou une réclamation concernant ce contrat ?
          </p>
          <button
            type="button"
            onClick={() => alert("Fonctionnalité de réclamation à configurer")}
            style={{
              display: 'inline-block',
              padding: '12px 30px',
              backgroundColor: onigtBlue,
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              transition: 'background-color 0.3s ease'
            }}
          >
            Soumettre une réclamation
          </button>
        </div>
      </div>
    </div>
  );
}