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
  const [isPrestationModalOpen, setIsPrestationModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Prestation"); // To handle the tabs
  const [formData, setFormData] = useState({
  clients: [], // Array to store multiple clients
  titre_foncier: '',
  work_type: '',
  price: ''
  });
  const [tempClient, setTempClient] = useState({ client_name: '', cine: '', address: '', quality: '' });
  // Add this mapping object
const PRESTATION_OPTIONS = {
  "CONTRÔLE TOPOGRAPHIQUES ET GEOMETRIQUES A LA VACATION": [
    "Assistance topographique par une équipe topographique (sous le contrôle d'un IGT non permanent)",
    "Assistance topographique par un IGT permanent"
  ],
  "LA CARTOGRAPHIE ET PHOTOGRAMMETRIE": [
    "Aérotriangulation & Traitement photogrammétrique",
    "Complètement et toponymie",
    "MNS",
    "MNT",
    "NUMERISATION OU DIGITALISATION",
    "Orthophotoplan",
    "Prise de vue (Rural)",
    "Prise de vue (Urbain)",
    "Rédaction cartographique",
    "Restitution planimétrique et altimétrique (Rural)",
    "Restitution planimétrique et altimétrique (Urbain)",
    "Stéréo-préparation (points de calage)"
  ],
  "PRESTATIONS CADASTRALES": [
    "Bornage complémentaire d'immatriculation",
    "DT de BC de distraction",
    "DT de levé régulier d'une Réquisition",
    "DT de Lotissement",
    "DT de Mise à jour d'une unité industrielle",
    "Assistance, dépôt et suivi auprès de la conservation foncière",
    "Bornage d'immatriculation",
    "Conseil et étude pour l'assainissement d'une assiette foncière",
    "Consultation et fourniture des document cadastraux ou fonciers ou urbanistiques",
    "DT de copropriété",
    "DT de Fusion totale",
    "DT de Mise à jour d'un immeuble isolé",
    "DT de Mise à jour d'une villa",
    "DT de Mise à jour Rural",
    "DT de Morcellement ou Morcellement-Fusion",
    "DT de récollement de Bornage d'une propriété foncière/ DT de délimitation administrative",
    "Immatriculation foncière d'ensemble",
    "Rétablissement des bornes"
  ],
  "DOSSIER TECHNIQUES TOPOGRAPHIQUES DE MESURAGE": [
    "Dossier technique de création d'un local pour location de voitures",
    "Dossier technique pour la création d'Elevage avicole",
    "Mesurage des distances pour la création d'établissement d'enseignement de la conduite",
    "Mesurage des distances pour la création d'un local pour un bureau de change",
    "Mesurage des distances pour la création des officines de pharmacie",
    "Mesurage des distances pour l'obtention d'une autorisation d'exploitation d'un débit de tabac"
  ],
  "ETUDES TECHNIQUES TOPOGRAPHIQUES ET MISSION DIVERSES": [
    "BIM/CIM",
    "Coordination de chantier (Lotissement ou complexe immobilier)",
    "Etude de ligne aérienne électrique",
    "Etude de voirie (pistes rurales, communales, giratoires …) / Etude d'accès",
    "Etudes Voirie assainissement et réseaux divers (Lotissement ou complexe immobilier)",
    "Redistribution urbaine",
    "Remembrement Rural",
    "Systèmes d'informations géographiques",
    "Télédétection et traitement d'images thématique"
  ],
  "EXPERTISE FONCIÈRE ET IMMOBILIERE": [
    "Arbitrage",
    "Les constats",
    "Les estimations et évaluations immobilières"
  ],
  "LA GEODESIE": [
    "Auscultation (barrage)",
    "Auscultation (ouvrage d'art)",
    "Nivellement de précision rattaché NGM",
    "Polygonation (rattaché au système Lambert)",
    "Triangulation et trilatération (par tout procédé)"
  ],
  "PLANS ET LEVES TOPOGRAPHIQUES": [
    "Délimitations Administratives",
    "Prestations pour carrière",
    "Profils en long",
    "Réalisation des états et plans parcellaires",
    "Autorisation de Morcellement (dépôt et suivi)",
    "Calcul de Cubature",
    "Etude topographique pour le calcul de la TNB",
    "Implantations Topographiques",
    "Levé bathymétrique",
    "Levés de l'existant : Plan d'état des lieux d'un bien foncier",
    "Levés de l'existant : Plan de levé d'intérieur d'un bâtiment/ Coupe verticale",
    "Levés de l'existant : Plan de levé des façades d'un bâtiment",
    "Métré",
    "Plan après bornage de lotissement",
    "Plan coté",
    "Plan d'arrêté d'alignement",
    "Plan de cession de voirie (Loi 25-90)",
    "Plan de cession de voirie (Lot individuel)",
    "Plan de Délimitation",
    "Plan de Mitoyenneté des cours ou étude des cours",
    "Plan de Partage (provisoire spatial et à l'amiable)",
    "Plan de projet de Morcellement",
    "Plan de récement",
    "Plan de situation d'une parcelle",
    "Plan de tracé d'accès à un projet",
    "Prestations pour Projet de Galerie",
    "Profils en travers ou coupe"
  ]
};

// Inside your ContractDashboard component:
const [selectedCategory, setSelectedCategory] = useState("");
const [prestationForm, setPrestationForm] = useState({
  category: '',
  prestation: '',
  price: '0',
  quantity: '1',
  unit: '',
  refFonciereRef: '',
  refFonciereCommune: '',
  refFonciereZone: ''
});
const [refFonciereList, setRefFonciereList] = useState([]);
const [favoritePrestat] = useState([
  "Plan de situation d'une parcelle",
  "Plan de Délimitation",
  "DT de Mise à jour d'un immeuble isolé",
  "Plan coté",
  "Mesurage des distances pour l'obtention d'une autorisation d'exploitation d'un débit de tabac",
  "DT de copropriété",
  "DT de Morcellement ou Morcellement-Fusion",
  "DT de Mise à jour d'une villa",
  "Implantations Topographiques",
  "Mesurage des distances pour la création des officines de pharmacie",
  "Mesurage des distances pour la création d'établissement d'enseignement de la conduite"
]);

  // Bulletproof fetch handling network dropping/missing servers smoothly
  const removeClient = (indexToRemove) => {
  setFormData(prev => ({
    ...prev,
    clients: prev.clients.filter((_, index) => index !== indexToRemove)
  }));
  };
const fetchContracts = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const res = await fetch('http://localhost:5000/api/contracts', {
      headers: {
        'Authorization': `Bearer ${token}` // Send the token here
      }
    });
    
    if (!res.ok) throw new Error("Unauthorized");
    
    const data = await res.json();
    setContracts(Array.isArray(data) ? data : [data]);
  } catch (err) {
    console.error("Auth error:", err);
    // Redirect to login if token is expired/invalid
    window.location.href = "/login";
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
<button 
  onClick={() => setIsPrestationModalOpen(true)}
  style={{ border: 'none', background: 'none', color: '#17a2b8', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}
>
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
{isPrestationModalOpen && (
  <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
    <div style={{ backgroundColor: '#fff', width: '90%', maxWidth: '920px', borderRadius: '6px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
      <div style={{ padding: '18px 24px', borderBottom: '1px solid #dee2e6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '20px', color: '#1d4d73' }}>Nouvelle prestation</h3>
        </div>
        <button onClick={() => setIsPrestationModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '24px', lineHeight: '1' }}>✕</button>
      </div>

      <div style={{ padding: '22px', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
        <div style={{ backgroundColor: '#eef6fb', padding: '16px 18px', border: '1px solid #d1e7f5', borderRadius: '6px', marginBottom: '22px', color: '#1f4b70' }}>
          Interface de préparation de la prestation. Décrivez les tâches à réaliser, le système calculera automatiquement la quantification, puis ajoutez les autres détails si nécessaire.
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', borderBottom: '1px solid #dee2e6', marginBottom: '20px', gap: '6px' }}>
          {['Prestation', 'Référence foncière'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 18px',
                border: 'none',
                background: activeTab === tab ? '#fff' : 'transparent',
                color: activeTab === tab ? '#0b5ed7' : '#6c757d',
                borderBottom: activeTab === tab ? '3px solid #0b5ed7' : '3px solid transparent',
                cursor: 'pointer',
                fontWeight: activeTab === tab ? 700 : 500,
                borderRadius: '4px 4px 0 0'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'Prestation' && (
          <div>
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 280px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700 }}>Catégorie</label>
                  <select
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #ced4da', borderRadius: '6px' }}
                    value={selectedCategory}
                    onChange={(e) => {
                      setSelectedCategory(e.target.value);
                      setPrestationForm(prev => ({ ...prev, category: e.target.value, prestation: '' }));
                    }}
                  >
                    <option value="">Choisir parmi la liste</option>
                    {Object.keys(PRESTATION_OPTIONS).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div style={{ flex: '1 1 280px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700 }}>Prestation</label>
                  <select
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #ced4da', borderRadius: '6px' }}
                    value={prestationForm.prestation}
                    disabled={!selectedCategory}
                    onChange={(e) => setPrestationForm(prev => ({ ...prev, prestation: e.target.value }))}
                  >
                    <option value="">{selectedCategory ? '⭐ Choisir parmi mes favoris' : 'Sélectionnez d\'abord une catégorie'}</option>
                    {selectedCategory && (
                      <>
                        {PRESTATION_OPTIONS[selectedCategory].filter(s => favoritePrestat.includes(s)).length > 0 && (
                          <optgroup label="Favoris">
                            {PRESTATION_OPTIONS[selectedCategory]
                              .filter(service => favoritePrestat.includes(service))
                              .map(service => (
                                <option key={service} value={service}>⭐ {service}</option>
                              ))}
                          </optgroup>
                        )}
                        <optgroup label="Tous les services">
                          {PRESTATION_OPTIONS[selectedCategory]
                            .filter(service => !favoritePrestat.includes(service))
                            .map(service => (
                              <option key={service} value={service}>{service}</option>
                            ))}
                        </optgroup>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>

            <div style={{ padding: '18px', backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px', marginBottom: '22px' }}>
              <div style={{ marginBottom: '16px' }}>
                <h5 style={{ margin: 0, fontSize: '16px' }}>Paramètre de prestation</h5>
              </div>

              <div style={{ padding: '18px', backgroundColor: '#fff', border: '1px solid #ced4da', borderRadius: '8px', color: '#495057' }}>
                Merci de sélectionner une prestation pour charger les paramètres associés.
              </div>
            </div>

            <div style={{ padding: '18px', backgroundColor: '#fff', border: '1px solid #dee2e6', borderRadius: '8px', marginBottom: '22px' }}>
              <div style={{ marginBottom: '16px' }}>
                <h5 style={{ margin: 0, fontSize: '16px' }}>Données facturation</h5>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700 }}>Prix unitaire</label>
                  <input
                    type="number"
                    min="0"
                    value={prestationForm.price}
                    onChange={(e) => setPrestationForm(prev => ({ ...prev, price: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #ced4da', borderRadius: '6px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700 }}>Quantité</label>
                  <input
                    type="number"
                    min="1"
                    value={prestationForm.quantity}
                    onChange={(e) => setPrestationForm(prev => ({ ...prev, quantity: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #ced4da', borderRadius: '6px' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 700 }}>Unité</label>
                  <input
                    type="text"
                    value={prestationForm.unit}
                    onChange={(e) => setPrestationForm(prev => ({ ...prev, unit: e.target.value }))}
                    placeholder="Ex: m, m², unité"
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #ced4da', borderRadius: '6px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Référence foncière' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
              <h5 style={{ margin: 0, fontSize: '16px' }}>Référence foncière</h5>
              <button
                type="button"
                onClick={() => {
                  const { refFonciereRef, refFonciereCommune, refFonciereZone } = prestationForm;
                  if (!refFonciereRef) return;
                  setRefFonciereList(prev => ([...prev, { id: Date.now(), ref: refFonciereRef, commune: refFonciereCommune, zone: refFonciereZone }]));
                  setPrestationForm(prev => ({ ...prev, refFonciereRef: '', refFonciereCommune: '', refFonciereZone: '' }));
                }}
                style={{ padding: '10px 16px', backgroundColor: '#0d6efd', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
              >
                <AiFillPlusCircle /> Référence foncière
              </button>
            </div>

            <div style={{ overflowX: 'auto', backgroundColor: '#fff', border: '1px solid #dee2e6', borderRadius: '6px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f3f5' }}>
                    <th style={{ padding: '12px', borderBottom: '1px solid #dee2e6', textAlign: 'left' }}>Référence foncière</th>
                    <th style={{ padding: '12px', borderBottom: '1px solid #dee2e6', textAlign: 'left' }}>Commune</th>
                    <th style={{ padding: '12px', borderBottom: '1px solid #dee2e6', textAlign: 'left' }}>Zone</th>
                    <th style={{ padding: '12px', borderBottom: '1px solid #dee2e6', textAlign: 'left' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {refFonciereList.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ padding: '16px', color: '#6c757d', textAlign: 'center' }}>Aucune référence foncière ajoutée.</td>
                    </tr>
                  ) : refFonciereList.map(item => (
                    <tr key={item.id}>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{item.ref}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{item.commune}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{item.zone}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
                        <button
                          type="button"
                          onClick={() => setRefFonciereList(prev => prev.filter(row => row.id !== item.id))}
                          style={{ border: 'none', background: '#f8d7da', color: '#842029', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}
                        >Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginTop: '18px' }}>
              <input
                type="text"
                placeholder="Référence foncière"
                value={prestationForm.refFonciereRef}
                onChange={(e) => setPrestationForm(prev => ({ ...prev, refFonciereRef: e.target.value }))}
                style={{ padding: '12px', border: '1px solid #ced4da', borderRadius: '6px' }}
              />
              <input
                type="text"
                placeholder="Commune"
                value={prestationForm.refFonciereCommune}
                onChange={(e) => setPrestationForm(prev => ({ ...prev, refFonciereCommune: e.target.value }))}
                style={{ padding: '12px', border: '1px solid #ced4da', borderRadius: '6px' }}
              />
              <input
                type="text"
                placeholder="Zone"
                value={prestationForm.refFonciereZone}
                onChange={(e) => setPrestationForm(prev => ({ ...prev, refFonciereZone: e.target.value }))}
                style={{ padding: '12px', border: '1px solid #ced4da', borderRadius: '6px' }}
              />
            </div>
          </div>
        )}


        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginTop: '30px' }}>
          <button onClick={() => setIsPrestationModalOpen(false)} style={{ padding: '10px 24px', cursor: 'pointer', borderRadius: '6px', border: '1px solid #ced4da', backgroundColor: '#fff', color: '#333' }}>Fermer</button>
          <button style={{ padding: '10px 24px', backgroundColor: '#198754', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Enregistrer</button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );
}