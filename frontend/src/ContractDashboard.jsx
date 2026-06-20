import React, { useState, useEffect } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { MdInput } from 'react-icons/md';

import { FaFileContract, FaComments, FaUserCircle } from "react-icons/fa";
import QRCode from "qrcode";

export default function ContractDashboard() {
  const [contracts, setContracts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showConfirmStep, setShowConfirmStep] = useState(false);
  const [currentView, setCurrentView] = useState("mes-contrats");
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [formData, setFormData] = useState({
  clients: [], // Array to store multiple clients
  titre_foncier: '',
  work_type: '',
  price: ''
  });
  const [tempClient, setTempClient] = useState({ client_name: '', cine: '', address: '', quality: '' });



  // Bulletproof fetch handling network dropping/missing servers smoothly
  const removeClient = (indexToRemove) => {
  setFormData(prev => ({
    ...prev,
    clients: prev.clients.filter((_, index) => index !== indexToRemove)
  }));
  };
  const fetchContracts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/contracts');
      if (!res.ok) {
        throw new Error(`Server responded with status: ${res.status}`);
      }
      const data = await res.json();
      setContracts(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error("Backend server offline or unreachable on port 5000:", err);
      
      // Fallback empty array prevents the application view from hanging in limbo
      setContracts([]); 
    }
  };

  useEffect(() => {
    fetchContracts();
  }, []);

  const handleNouveauContratClick = () => {
    setShowConfirmStep(true);
  };

  const handleConfirmNextStep = () => {
    setShowConfirmStep(false);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/contracts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.id) {
        setFormData({ client_name: '', titre_foncier: '', work_type: '', price: '' });
        setIsModalOpen(false);
        fetchContracts();
      }
    } catch (err) {
      console.error("Failed to submit contract:", err);
    }
  };

  const ActionButtons = ({ contractId, clientName }) => {
    const [qrSrc, setQrSrc] = useState('');
    
    useEffect(() => {
      let isMounted = true;
      const url = `${window.location.origin}/verify/${contractId}`;
      QRCode.toDataURL(url, { width: 250, margin: 1 })
        .then(src => {
          if (isMounted) setQrSrc(src);
        })
        .catch(err => console.error(err));

      return () => { isMounted = false; };
    }, [contractId]);

    const handleDownloadTextFile = () => {
      const fileContent = `Bonjour,\n\nCeci est le contrat pour le client : ${clientName.toUpperCase()}.\nRéférence officielle : N°604/SO/ONIGT/CN-${String(contractId).padStart(4, '0')}/2026\n\nFichier généré avec succès.`;
      const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
      const element = document.createElement("a");
      element.href = URL.createObjectURL(blob);
      element.download = `Contrat_CN_${contractId}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    };

    return (
      <div style={{ display: 'flex', gap: '10px', width: '100%', paddingTop: '6px' }}>
        {qrSrc && (
          <a 
            href={qrSrc} 
            download={`QR_REF_${contractId}.png`} 
            style={{ 
              flex: '1',
              textAlign: 'center',
              backgroundColor: '#17a2b8',
              color: '#fff',
              textDecoration: 'none',
              padding: '10px 6px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Télécharger le QR
          </a>
        )}
        <button 
          onClick={handleDownloadTextFile}
          style={{ 
            flex: '1',
            backgroundColor: '#fff',
            color: '#495057',
            border: '1px solid #ced4da',
            padding: '10px 6px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          Télécharger le contrat
        </button>
      </div>
    );
  };

  const SidebarLink = ({ viewId, icon: Icon, label }) => {
    const isActive = currentView === viewId;
    return (
      <button
        onClick={() => setCurrentView(viewId)}
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          padding: "12px 14px",
          border: "none",
          borderRadius: isActive ? "4px" : "0px",
          backgroundColor: isActive ? "#3a87ad" : "transparent",
          color: isActive ? "#ffffff" : "#495057",
          fontSize: "14px",
          fontWeight: isActive ? "600" : "400",
          textAlign: "left",
          cursor: "pointer",
          marginBottom: "4px",
          gap: "10px"
        }}
      >
        <Icon style={{ fontSize: "16px", color: isActive ? "#fff" : "#495057" }} />
        <span>{label}</span>
      </button>
    );
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f4f6f9', 
      fontFamily: '"Source Sans Pro", sans-serif',
      boxSizing: 'border-box'
    }}>
      
      <style>{`
        html, body, #root, .App {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          overflow-x: hidden !important;
        }
      `}</style>
      
      {/* SIDEBAR */}
      <div style={{ 
        width: '240px', 
        backgroundColor: '#ffffff', 
        borderRight: '1px solid #dee2e6', 
        display: 'flex', 
        flexDirection: 'column',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 90
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '20px 14px', borderBottom: '1px solid #dee2e6' }}>
          <FaUserCircle style={{ fontSize: '34px', color: '#6c757d' }} />
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>CHATER OTHMANE</span>
        </div>

        <div style={{ flexGrow: 1, padding: '12px 8px', overflowY: 'auto' }}>
          <SidebarLink viewId="mes-contrats" icon={FaFileContract} label="Mes contrats" />
          <SidebarLink viewId="reclamations" icon={FaComments} label="Réclamations" />
        </div>
      </div>

      {/* WORKSPACE */}
      <div style={{ 
        marginLeft: '240px', 
        padding: '24px 30px', 
        boxSizing: 'border-box'
      }}>
        
        {currentView === "mes-contrats" ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.8rem' }}>
              <h1 style={{ fontSize: '1.85rem', fontWeight: '400', margin: 0, color: '#212529' }}>Mes contrats privés</h1>
              <button 
                onClick={handleNouveauContratClick}
                style={{ backgroundColor: '#17a2b8', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '4px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <AiFillPlusCircle style={{ fontSize: '18px' }} /> Nouveau contrat
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '20px' }}>
              {contracts.length === 0 ? (
                <div style={{ color: '#6c757d', fontSize: '15px', gridColumn: '1/-1', textAlign: 'center', padding: '50px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #dee2e6' }}>
                  Aucun contrat disponible. Cliquez sur "Nouveau contrat" pour commencer.
                </div>
              ) : (
                contracts.map((item) => {
                  const formattedDate = new Date(item.created_at || Date.now()).toISOString().split('T')[0];
                  return (
                    <div key={item.id} style={{ backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #dee2e6', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                      <div style={{ backgroundColor: '#17a2b8', color: '#fff', padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14.5px', fontWeight: '700' }}>
                          <span>⏳</span> 
                          <span>N° : N°604/SO/ONIGT/CN-{(String(item.id).padStart(4, '0'))}/2026</span>
                        </div>
                        <div style={{ textAlign: 'right', fontSize: '12px', marginTop: '4px', opacity: '0.95', fontWeight: '600' }}>{formattedDate}</div>
                      </div>

                      <div style={{ padding: '18px 20px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '700', color: '#343a40', fontSize: '15px' }}>
                          <span style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2.5px solid #17a2b8', display: 'inline-block', backgroundColor: '#fff' }}></span>
                          <span>{item.client_name ? item.client_name.toUpperCase() : "CLIENT INCONNU"}</span>
                        </div>
                        <div style={{ borderTop: '1px solid #eaeaea' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14.5px' }}>
                          <span style={{ fontWeight: '800', color: '#495057' }}>P1:</span>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                            <span style={{ backgroundColor: '#f8f9fa', color: '#212529', padding: '4px 10px', borderRadius: '4px', fontSize: '12.5px', border: '1px solid #ced4da', fontWeight: '600' }}>
                              T/Partie du {item.titre_foncier}
                            </span>
                            <span style={{ color: '#6c757d', fontSize: '13.5px', fontWeight: '600' }}>{item.work_type}</span>
                          </div>
                        </div>
                        <div style={{ borderTop: '1px solid #eaeaea' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14.5px' }}>
                          <div>
                            <div style={{ color: '#6c757d', fontSize: '13px', fontWeight: '600' }}>Contrat</div>
                            <div style={{ fontWeight: '800', color: '#212529', fontSize: '16px', marginTop: '2px' }}>{Number(item.price).toLocaleString()} MAD</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ color: '#6c757d', fontSize: '13px', fontWeight: '600' }}>Ce trimestre</div>
                            <div style={{ fontWeight: '800', color: '#212529', fontSize: '16px', marginTop: '2px' }}>{(item.price * 0.8).toLocaleString()} MAD</div>
                          </div>
                        </div>
                        <div style={{ borderTop: '1px solid #eaeaea' }} />
                        <ActionButtons contractId={item.id} clientName={item.client_name || "Client"} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        ) : (
          <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '4px', border: '1px solid #dee2e6' }}>
            <h2 style={{ fontWeight: '400', margin: '0 0 10px 0' }}>Réclamations</h2>
            <p style={{ color: '#6c757d', margin: 0 }}>L'historique et la gestion de vos réclamations s'afficheront ici.</p>
          </div>
        )}

      </div>

      {/* STEP 1: CONFIRMATION INTERCEPTOR POP-UP */}
      {showConfirmStep && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1100 }}>
          <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '6px', width: '100%', maxWidth: '440px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '76px', height: '76px', borderRadius: '50%', border: '4px solid #adb5bd', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '18px' }}>
              <span style={{ fontSize: '42px', color: '#6c757d', fontFamily: 'serif' }}>?</span>
            </div>
            <h2 style={{ fontSize: '22px', margin: '0 0 14px 0', color: '#495057', fontWeight: '700' }}>Confirmation</h2>
            <p style={{ fontSize: '15px', color: '#495057', margin: '0 0 24px 0', fontWeight: '500' }}>
              Vous êtes sur le point de créer un contrat ?
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', width: '100%' }}>
              <button onClick={handleConfirmNextStep} style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '4px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', minWidth: '100px' }}>Continuer</button>
              <button onClick={() => setShowConfirmStep(false)} style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '4px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', minWidth: '100px' }}>Non</button>
            </div>
          </div>
        </div>
      )}

{isModalOpen && (
  <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
    <div style={{ backgroundColor: '#fff', width: '90%', maxWidth: '1000px', borderRadius: '4px', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
      
      {/* Modal Header */}
      <div style={{ padding: '15px 20px', borderBottom: '1px solid #dee2e6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '18px', margin: 0, color: '#333', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#17a2b8' }}>⚡</span> ASSISTANT
        </h2>
        <span style={{ fontWeight: '700', fontSize: '16px' }}>PROJET DE CONTRAT</span>
        <button onClick={() => setIsModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px' }}>✕</button>
      </div>

      {/* Scrollable Content */}
      <div style={{ padding: '20px', overflowY: 'auto' }}>
        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', border: '1px solid #dee2e6', fontSize: '14px', color: '#333', marginBottom: '20px' }}>
          Cette interface vous permet de préparer et visualiser un contrat avant sa finalisation. Vous pouvez ajouter les clients concernés, définir les prestations associées, et compléter les informations nécessaires telles que les montants et les conditions. L'aperçu proposé reflète fidèlement le contrat final.
        </div>

{/* Section: Entre */}
<div style={{ marginBottom: '20px', textAlign: 'left', fontSize: '14px' }}>
  <div style={{ fontWeight: '700', marginBottom: '10px' }}>Entre :</div>
  
  <button onClick={() => setIsClientModalOpen(true)} style={{ border: 'none', background: 'none', color: '#17a2b8', cursor: 'pointer', fontWeight: '600', marginBottom: '10px' }}>
    <AiFillPlusCircle /> Ajouter client
  </button>

{formData.clients.map((client, index) => (
  <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0' }}>
    <ul style={{ paddingLeft: '20px', margin: 0 }}>
      <li>
        <strong>{client.client_name?.toUpperCase()}</strong>, C.I.N.E: {client.cine}, Adresse: {client.address}, Qualité: {client.quality}
      </li>
    </ul>
    {/* Delete Button */}
    <button 
      onClick={() => removeClient(index)} 
      style={{ border: 'none', background: '#fff2f2', color: '#dc3545', cursor: 'pointer', padding: '5px 10px', borderRadius: '4px', fontSize: '12px' }}
    >
      Supprimer
    </button>
  </div>
))}
  
  <div style={{ textAlign: 'right', fontSize: '13px' }}>De première part.</div>
</div>

{/* Section: Objet */}
<div style={{ marginBottom: '20px', textAlign: 'left', fontSize: '14px' }}>
  <div style={{ fontWeight: '700', marginBottom: '10px' }}>
    Objet, désignation, honoraires, nature des prestations et prix unitaire :
  </div>
  <div style={{ fontSize: '14px', color: '#333' }}>
    Le maître d'ouvrage s'engage avec l'I.G. T pour la réalisation de la mission détaillée dans le tableau suivant et portant sur la(les) propriété(es)
  </div>
</div>

        {/* Placeholder for the Table from Capture2_4.PNG */}
{/* Conditions Particulières Section */}
{/* Section: Prestation */}
<div style={{ marginTop: '20px', marginBottom: '20px', textAlign: 'left' }}>
  <button style={{ 
    border: 'none', 
    background: 'none', 
    color: '#17a2b8', 
    cursor: 'pointer', 
    fontWeight: '600', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '6px',
    fontSize: '14px'
  }}>
    <AiFillPlusCircle style={{ fontSize: '18px' }} /> Ajouter prestation
  </button>
</div>

      </div>

      {/* Fixed Footer */}
      <div style={{ padding: '15px 20px', borderTop: '1px solid #dee2e6', display: 'flex', justifyContent: 'space-between', backgroundColor: '#f8f9fa' }}>
        <button onClick={() => setIsModalOpen(false)} style={{ backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: '600' }}>Fermer</button>
        <button style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: '600' }}>📄 Générer le contrat</button>
      </div>
    </div>
  </div>
  
)}
{isClientModalOpen && (
  <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
    <div style={{ backgroundColor: '#fff', width: '600px', borderRadius: '4px', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
      {/* ... header ... */}
      
      <div style={{ padding: '20px' }}>
        {/* ... */}
        
        {/* Input Fields using the top-level tempClient */}
        {['client_name', 'cine', 'address', 'quality'].map((field) => (
          <div key={field} style={{ marginBottom: '10px', display: 'flex' }}>
            <div style={{ width: '100px', padding: '8px', backgroundColor: '#e9ecef', border: '1px solid #ced4da', fontSize: '13px' }}>
              {field === 'client_name' ? 'Nom' : field.toUpperCase()}
            </div>
            <input 
              type="text" 
              value={tempClient[field]} 
              onChange={(e) => setTempClient({...tempClient, [field]: e.target.value})} 
              style={{ flex: 1, padding: '8px', border: '1px solid #ced4da' }} 
            />
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <button onClick={() => {
            setTempClient({ client_name: '', cine: '', address: '', quality: '' });
            setIsClientModalOpen(false);
          }} style={{ padding: '8px 20px', cursor: 'pointer' }}>Fermer</button>
          
          <button onClick={() => {
            setFormData(prev => ({ ...prev, clients: [...prev.clients, tempClient] }));
            setTempClient({ client_name: '', cine: '', address: '', quality: '' }); // Reset
            setIsClientModalOpen(false);
          }} style={{ padding: '8px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Envoyer</button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}