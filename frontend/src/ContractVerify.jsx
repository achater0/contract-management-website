import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import myHeaderImage from "./image_3ec705.png"; // Header image import

export default function ContractVerify() {
  const { id } = useParams();
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Define your exact breakpoints based on Bootstrap's grid
  const isMobile = windowWidth <= 767;
  const isDesktop = windowWidth >= 992;
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
  
  const formattedDateString = ` ${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${dayNum} ${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}.`;

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
          padding: '8px' /* Forcing exactly 8px instead of 0.5rem */
        }}>
          
          {/* Logo Container (col-5 on desktop/tablet, col-12 on mobile) */}
          <div style={{ 
            boxSizing: 'border-box',
            position: 'relative',
            width: '100%',
            paddingRight: '15px',
            paddingLeft: '15px',
            margin: '0',
            flex: isMobile ? '0 0 100%' : '0 0 41.666667%', 
            maxWidth: isMobile ? '100%' : '41.666667%'
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
          
          {/* Title Container (col-6 on desktop/tablet, col-12 on mobile) */}
          <div style={{ 
            boxSizing: 'border-box',
            position: 'relative',
            width: '100%',
            paddingRight: '15px',
            paddingLeft: '15px',
            marginTop: '0.5rem',
            flex: isMobile ? '0 0 100%' : '0 0 50%',
            maxWidth: isMobile ? '100%' : '50%'
          }}>
            
            {/* Semantic wrapper changing based on screen width */}
            {isDesktop ? (
              /* --- EXACT H1 DUMP TRANSLATION --- */
<h1 style={{ 
    fontFamily: "'Arial', sans-serif",
    margin: '16px 0px 8px',
    lineHeight: '1.2',
    fontSize: '40px',
    textAlign: 'center',
    color: '#28a745',
    boxSizing: 'border-box'
  }}>
    <b style={{ 
      fontFamily: "'Arial', sans-serif",
      fontSize: '40px',
      color: '#28a745',
      fontWeight: 'bolder',
      lineHeight: '1.1',
      display: 'inline-block',
      letterSpacing: '0.08px'
    }}>
      Contrat : Validé (En Exécution)
    </b>
  </h1>
            ) : (
              /* --- H4 STYLE DISPLAY (< 992px) --- */
              <h4 style={{ 
                WebkitTextSizeAdjust: '100%',
                WebkitTapHighlightColor: 'transparent',
                boxSizing: 'border-box',
                fontFamily: "'Arial', sans-serif",
                marginTop: '0',
                marginBottom: '0.5rem',
                fontWeight: '500',
                lineHeight: '1.2',
                fontSize: '1.5rem',
                color: '#28a745',
                textAlign: 'left',
                letterSpacing: 'normal'
              }}>
                <b style={{ 
                  boxSizing: 'border-box',
                  fontFamily: "'Arial', sans-serif",
                  fontWeight: 'bolder',
                  letterSpacing: 'normal'
                }}>
                  Contrat : Validé (En Exécution)
                </b>
              </h4>
            )}

          </div>
        </div>

{/* ======================================================== */}
{/* PART 2: REFERENCE AND DATE                               */}
{/* ======================================================== */}
<div style={{ 
  width: '100%',
  padding: '8px',         // Matches .5rem!important in your source
  marginBottom: '0',         // Matches margin-bottom: 0!important
  boxSizing: 'border-box',
  color: '#0261A4',          // The specific blue from your CSS dump
  fontFamily: "'Arial', sans-serif",
  fontSize: '16px',
  lineHeight: '1.6',
  textAlign: 'left'
}}>
  {/* The first bold line */}
  <b style={{ fontWeight: 'bolder' }}>
    Contrat n°: {officialNumber}
  </b>
  
  <br />
  
  {/* The second line with specific bold parts */}
  Fait à <b style={{ fontWeight: 'bolder' }}>Agadir</b>, le{' '} 
  <b style={{ fontWeight: 'bolder' }}>{formattedDateString}</b>.
</div>

        {/* ======================================================== */}
        {/* PART 3: THE REST (CLIENT, ENGINEER, TABLE, RECLAMATION)  */}
        {/* ======================================================== */}
        <div style={{ 
  width: '100%',
  padding: '16px', /* p-3 */
  boxSizing: 'border-box',
  textAlign: 'left',
  fontFamily: "'Arial', sans-serif",
  fontSize: '16px',
  lineHeight: '1.6'
}}>
  
  {/* CLIENT SECTION */}
  <div style={{ 
    display: 'flex', 
    flexWrap: 'wrap', 
    alignItems: 'flex-start', 
    marginTop: '0', 
    marginLeft: '-5px', 
    marginRight: '-5px',
    color: '#0261A4' /* .cb class */
  }}>
    <b>Le Maître d'ouvrage (Client):</b>
  </div>

  <hr style={{ 
    margin: '0', 
    border: '0', 
    borderTop: '1px solid rgba(0,0,0,.1)', 
    color: '#0261A4' 
  }} />

  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    marginLeft: '-5px', 
    marginRight: '-5px' 
  }}>
    <ul style={{ margin: '0px 0px 16px', paddingLeft: '40px' }}>
      <li style={{ margin: '8px' }}> {/* m-2 class */}
        <b>{clients[0]?.client_name?.toUpperCase() || "CLIENT NON SPÉCIFIÉ"}</b>
      </li>
    </ul>
  </div>

  {/* ENGINEER SECTION */}
  <div style={{ 
    display: 'flex', 
    flexWrap: 'wrap', 
    alignItems: 'flex-start', 
    marginTop: '0', 
    marginLeft: '-5px', 
    marginRight: '-5px',
    color: '#0261A4' /* .cb class */
  }}>
    <b>Le Maître d'œuvre (Ingénieur Géomètre Topographe):</b>
  </div>

  <hr style={{ 
    margin: '0', 
    border: '0', 
    borderTop: '1px solid rgba(0,0,0,.1)', 
    color: '#0261A4' 
  }} />

  <div style={{ 
    display: 'flex', 
    flexDirection: 'column', 
    marginTop: '8px', /* mt-2 class */
    marginLeft: '-5px', 
    marginRight: '-5px' 
  }}>
    <ul style={{ margin: '0px 0px 16px', paddingLeft: '40px' }}>
      <li> {/* no margin class on this li in the original */}
        <b>CHATER Othmane</b>.
      </li>
    </ul>
  </div>

  <hr style={{ 
    margin: '0', 
    border: '0', 
    borderTop: '1px solid rgba(0,0,0,.1)' 
  }} />
  
  {/* INTRODUCTORY TEXT */}
  <p style={{ 
    marginTop: '10px', 
    marginBottom: '16px' 
  }}>
    Par le présent contrat, l’Ingénieur Géomètre Topographe s’engage envers le maître d’ouvrage de réaliser les prestations synthétisée(s) dans le tableau ci-dessus.
  </p>

{/* DATA TABLE */}
<div style={{ overflowX: 'auto', width: '100%' }}>
  <table style={{ 
    width: '100%', 
    borderCollapse: 'collapse', 
    marginBottom: '16px',
    color: '#212529',
    fontFamily: "'Arial', sans-serif",
    fontSize: '16px',
    lineHeight: '1.6',
    boxSizing: 'border-box'
  }}>
    {/* Applied tbody styles */}
    <tbody style={{ textAlign: 'left' }}>
      
      {/* HEADER ROW - Applied color #0261A4 */}
      <tr style={{ color: '#0261A4' }}>
        {/* FIRST TH */}
        <th style={{ 
          verticalAlign: 'top',
          border: '1px solid #7f7f7f',
          backgroundColor: '#d3d3d3',
          padding: '3px',
          textAlign: 'center',
          boxSizing: 'border-box',
          width: '40%' /* Kept from earlier to maintain column proportions */
        }}>
          Réf. foncière
        </th>
        {/* SECOND TH */}
        <th style={{ 
          verticalAlign: 'top',
          border: '1px solid #7f7f7f',
          backgroundColor: '#d3d3d3',
          padding: '3px',
          textAlign: 'center',
          boxSizing: 'border-box'
        }}>
          Prestation
        </th>
      </tr>

      {/* DATA ROWS */}
      {prestations.length === 0 ? (
        <tr>
          <td colSpan="2" style={{ 
            padding: '3px', 
            textAlign: 'center', 
            border: '1px solid #7f7f7f',
            verticalAlign: 'top'
          }}>
            Aucune prestation renseignée
          </td>
        </tr>
      ) : (
        prestations.map((presta, idx) => {
          // --- UNTOUCHED LOGIC ---
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
          // --- END UNTOUCHED LOGIC ---

          return (
            <tr key={idx}>
              {/* FIRST TD */}
              <td style={{ 
                verticalAlign: 'top',
                border: '1px solid #7f7f7f',
                padding: '3px',
                textAlign: 'left',
                boxSizing: 'border-box'
              }}>
                {associatedRef.regime ? refCellText : "-"}
              </td>
              {/* SECOND TD */}
              <td style={{ 
                verticalAlign: 'top',
                border: '1px solid #7f7f7f',
                padding: '3px',
                textAlign: 'left',
                boxSizing: 'border-box'
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
          {/* --- RECLAMATION SECTION --- */}
<div style={{  
  marginBottom: '16px',
  marginTop: '8px',
  marginLeft: '0px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',               
  flexWrap: 'wrap',
  gap:'5px'
}}>
  <span style={{ 
    fontSize: '16px', 
    color: '#dc3545', 
  }}>
    Vous avez une question ou une réclamation concernant ce contrat ?
  </span>
  
  <button
    type="button"
    style={{
      padding: '12px 24px', /* Increased from 12px 24px */
      backgroundColor: '#dc3545',
      color: '#fff',
      border: 'none',
      borderRadius: '9999px', 
      cursor: 'pointer',
      fontSize: '16px',     /* Increased from 14px */
      whiteSpace: 'nowrap',
      boxShadow: '0 0.125rem 0.25rem rgba(0,0,0,.075)', /* Kept the subtle shadow from the site */
      transition: 'all 0.3s ease-in-out'
    }}
    onClick={() => {
      // Add your click handler here
      console.log('Soumettre une réclamation clicked');
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