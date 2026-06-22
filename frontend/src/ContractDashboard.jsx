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
  // AJOUTER CES DEUX LIGNES :
  const [isRefFonciereModalOpen, setIsRefFonciereModalOpen] = useState(false);
  const [refFonciereForm, setRefFonciereForm] = useState({
    commune: 'Agadir',
    regimeFoncier: 'Délimitation administrative',
    valeur: '',
    zone: 'Zone 1',
    x: '',
    y: ''
  });
  const [activeTab, setActiveTab] = useState("Prestation"); // To handle the tabs
// Remplacez votre état actuel par celui-ci :
  const [formData, setFormData] = useState({
   clients: [],
   prestations: [], // Pour stocker vos prestations
   references: []   // Pour stocker vos références foncières
  });
  const [tempClient, setTempClient] = useState({ client_name: '', cine: '', address: '', quality: '' });
  // Add this mapping object
const PRESTATION_OPTIONS = {
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
const PRESTATION_PARAMS_CONFIG = {
  // ==========================================
  // 1. PRESTATIONS CADASTRALES
  // ==========================================
  "Bornage complémentaire d'immatriculation": [
    { label: "Nombre de bornes", key: "nombre_bornes", unit: "Bornes", type: "number" }
  ],
  "DT de BC de distraction": [
    { label: "Nombre de lots", key: "nombre_lots", unit: "Lots", type: "number" },
    { label: "Superficie totale en Ha", key: "superficie_ha", unit: "Ha", type: "number" }
  ],
  "DT de levé régulier d'une Réquisition": [
    { label: "Superficie totale en Ha", key: "superficie_ha", unit: "Ha", type: "number" }
  ],
  "DT de Lotissement": [
    { label: "Nombre de lots", key: "nombre_lots", unit: "Lots", type: "number" },
    { label: "Superficie totale en Ha", key: "superficie_ha", unit: "Ha", type: "number" }
  ],
  "DT de Mise à jour d'une unité industrielle": [
    { label: "Superficie bâtie en m²", key: "superficie_batie", unit: "m²", type: "number" },
    { label: "Nombre de niveaux", key: "nombre_niveaux", unit: "Niveaux", type: "number" }
  ],
  "Assistance, dépôt et suivi auprès de la conservation foncière": [
    { label: "Nombre de dossiers", key: "nombre_dossiers", unit: "Dossiers", type: "number" }
  ],
  "Bornage d'immatriculation": [
    { label: "Nombre de bornes", key: "nombre_bornes", unit: "Bornes", type: "number" }
  ],
  "Conseil et étude pour l'assainissement d'une assiette foncière": [
    { label: "Superficie de l'assiette (Ha)", key: "superficie_ha", unit: "Ha", type: "number" }
  ],
  "Consultation et fourniture des document cadastraux ou fonciers ou urbanistiques": [
    { label: "Nombre de documents", key: "nombre_docs", unit: "Docs", type: "number" }
  ],
  "DT de copropriété": [
    { label: "Nombre de lots de copropriété", key: "lots_copropriete", unit: "Lots", type: "number" },
    { label: "Nombre de niveaux (Planchers)", key: "nombre_niveaux", unit: "Niveaux", type: "number" }
  ],
  "DT de Fusion totale": [
    { label: "Nombre de parcelles à fusionner", key: "nombre_parcelles", unit: "Parcelles", type: "number" },
    { label: "Superficie globale en Ha", key: "superficie_ha", unit: "Ha", type: "number" }
  ],
  "DT de Mise à jour d'un immeuble isolé": [
    { label: "Superficie au sol (m²)", key: "superficie_sol", unit: "m²", type: "number" },
    { label: "Nombre de niveaux", key: "nombre_niveaux", unit: "Niveaux", type: "number" }
  ],
  "DT de Mise à jour d'une villa": [
    { label: "Superficie emprise au sol (m²)", key: "superficie_sol", unit: "m²", type: "number" }
  ],
  "DT de Mise à jour Rural": [
    { label: "Superficie des bâtiments en m²", key: "superficie_bat_m2", unit: "m²", type: "number" },
    { label: "Superficie du terrain en Ha", key: "superficie_ha", unit: "Ha", type: "number" }
  ],
  "DT de Morcellement ou Morcellement-Fusion": [
    { label: "Nombre de lots issus", key: "nombre_lots", unit: "Lots", type: "number" },
    { label: "Superficie totale en Ha", key: "superficie_ha", unit: "Ha", type: "number" }
  ],
  "DT de récollement de Bornage d'une propriété foncière/ DT de délimitation administrative": [
    { label: "Nombre de bornes contrôlées", key: "nombre_bornes", unit: "Bornes", type: "number" }
  ],
  "Immatriculation foncière d'ensemble": [
    { label: "Nombre de parcelles (propriétés)", key: "nombre_parcelles", unit: "Propriétés", type: "number" },
    { label: "Superficie globale en Ha", key: "superficie_ha", unit: "Ha", type: "number" }
  ],
  "Rétablissement des bornes": [
    { label: "Nombre de bornes à rétablir", key: "nombre_bornes", unit: "Bornes", type: "number" }
  ],

  // ==========================================
  // 2. PLANS ET LEVES TOPOGRAPHIQUES
  // ==========================================
  "Délimitations Administratives": [
    { label: "Linéaire du périmètre en Km", key: "lineaire_km", unit: "Km", type: "number" }
  ],
  "Prestations pour carrière": [
    { label: "Superficie de la carrière (Ha)", key: "superficie_ha", unit: "Ha", type: "number" }
  ],
  "Profils en long": [
    { label: "Linéaire de voirie en Km", key: "lineaire_voirie_km", unit: "Km", type: "number" }
  ],
  "Réalisation des états et plans parcellaires": [
    { label: "Nombre de parcelles recensées", key: "nombre_parcelles", unit: "Parcelles", type: "number" },
    { label: "Superficie globale en Ha", key: "superficie_ha", unit: "Ha", type: "number" }
  ],
  "Autorisation de Morcellement (dépôt et suivi)": [
    { label: "Nombre de lots", key: "nombre_lots", unit: "Lots", type: "number" }
  ],
  "Calcul de Cubature": [
    { label: "Volume estimé (m³)", key: "volume_m3", unit: "m³", type: "number" }
  ],
  "Etude topographique pour le calcul de la TNB": [
    { label: "Superficie de la zone en Ha", key: "superficie_ha", unit: "Ha", type: "number" }
  ],
  "Implantations Topographiques": [
    { label: "Nombre de points d'axe/bornes", key: "nombre_points", unit: "Points", type: "number" }
  ],
  "Levé bathymétrique": [
    { label: "Superficie du plan d'eau (Ha)", key: "superficie_ha", unit: "Ha", type: "number" }
  ],
  "Levés de l'existant : Plan d'état des lieux d'un bien foncier": [
    { label: "Superficie du terrain en Ha", key: "superficie_ha", unit: "Ha", type: "number" }
  ],
  "Levés de l'existant : Plan de levé d'intérieur d'un bâtiment/ Coupe verticale": [
    { label: "Superficie développée en m²", key: "superficie_m2", unit: "m²", type: "number" }
  ],
  "Levés de l'existant : Plan de levé des façades d'un bâtiment": [
    { label: "Superficie de la façade en m²", key: "superficie_m2", unit: "m²", type: "number" }
  ],
  "Métré": [
    { label: "Nombre d'éléments ou unités", key: "quantite_metre", unit: "Unités", type: "number" }
  ],
  "Plan après bornage de lotissement": [
    { label: "Nombre de lots", key: "nombre_lots", unit: "Lots", type: "number" }
  ],
  "Plan coté": [
    { label: "Superficie en Ha", key: "superficie_ha", unit: "Ha", type: "number" }
  ],
  "Plan d'arrêté d'alignement": [
    { label: "Linéaire concerné en Km", key: "lineaire_km", unit: "Km", type: "number" }
  ],
  "Plan de cession de voirie (Loi 25-90)": [
    { label: "Linéaire de voirie en Km", key: "lineaire_km", unit: "Km", type: "number" }
  ],
  "Plan de cession de voirie (Lot individuel)": [
    { label: "Superficie de l'emprise en m²", key: "superficie_m2", unit: "m²", type: "number" }
  ],
  "Plan de Délimitation": [
    { label: "Superficie en Ha", key: "superficie_ha", unit: "m²", type: "number" }
  ],
  "Plan de Mitoyenneté des cours ou étude des cours": [
    { label: "Nombre de cours", key: "nombre_cours", unit: "Cours", type: "number" }
  ],
  "Plan de Partage (provisoire spatial et à l'amiable)": [
    { label: "Nombre des copartageants (Attributaires)", key: "nombre_parts", unit: "Parts", type: "number" },
    { label: "Superficie globale en Ha", key: "superficie_ha", unit: "Ha", type: "number" }
  ],
  "Plan de projet de Morcellement": [
    { label: "Nombre de parcelles projetées", key: "nombre_parcelles", unit: "Lots", type: "number" }
  ],
  "Plan de récement": [
    { label: "Nombre de points", key: "nombre_points", unit: "Points", type: "number" }
  ],
  "Plan de situation d'une parcelle": [
    { label: "Distance à l'axe principal le plus proche (m)", key: "distance_metres", unit: "m", type: "number" }
  ],
  "Plan de tracé d'accès à un projet": [
    { label: "Longueur de l'accès en Km", key: "lineaire_km", unit: "Km", type: "number" }
  ],
  "Prestations pour Projet de Galerie": [
    { label: "Longueur de la galerie en Km", key: "lineaire_km", unit: "Km", type: "number" }
  ],
  "Profils en travers ou coupe": [
    { label: "Linéaire de voirie en Km", key: "lineaire_voirie_km", unit: "Km", type: "number" }
  ]
};
const COMMUNES_MAROC = [
  "Agadir", "Aïn Harrouda", "Aïn Taoujdate", "Aït Melloul", "Al Hoceïma", "Assilah", 
  "Azemmour", "Azrou", "Ben Guerir", "Beni Ansar", "Beni Mellal", "Benslimane", 
  "Berkane", "Berrechid", "Boujdour", "Bouskoura", "Casablanca", "Chefchaouen", 
  "Chichaoua", "Dakhla", "Dar Bouazza", "Dcheira El Jihadia", "El Hajeb", "El Jadida", 
  "El Kelaa des Sraghna", "Errachidia", "Essaouira", "Fès", "Fnideq", "Fquih Ben Salah", 
  "Guelmim", "Guercif", "Ifrane", "Inezgane", "Jerada", "Kénitra", "Khemisset", 
  "Khenifra", "Khouribga", "Ksar El Kebir", "Laâyoune", "Lahraouyine", "Larache", 
  "Lqliaa", "M'diq", "Marrakech", "Martil", "Meknès", "Midelt", "Mohammedia", 
  "Nador", "Ouarzazate", "Ouazzane", "Oued Zem", "Oujda", "Oulad Teima", "Rabat", 
  "Safi", "Salé", "Sefrou", "Settat", "Sidi Bennour", "Sidi Kacem", "Sidi Slimane", 
  "Skhirat", "Smara", "Souk El Arbaa", "Tanger", "Tan-Tan", "Taounate", "Taourirt", 
  "Tarfaya", "Taroudant", "Taza", "Témara", "Tétouan", "Tifelt", "Tiznit", "Youssoufia", 
  "Zagora"
  // Vous pouvez continuer d'ajouter d'autres communes rurales ici si nécessaire
].sort(); // Le .sort() permet de garantir l'ordre alphabétique

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
  refFonciereZone: '',
  params: {} // <--- Stores dynamic input pairs like { lineaire_voirie_km: "1.5" }
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
  const removePrestation = (indexToRemove) => {
  setFormData(prev => ({
    ...prev,
    prestations: prev.prestations.filter((_, index) => index !== indexToRemove)
  }));
};


useEffect(() => {
  const fetchContracts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/contracts', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      const data = await response.json();
      
      // Parse the 'data' column into an object for each contract
      const processedContracts = data.map(contract => {
        try {
          return {
            ...contract,
            details: JSON.parse(contract.data) // Convert string to real object
          };
        } catch (e) {
          return { ...contract, details: { clients: [], prestations: [] } };
        }
      });
      
      setContracts(processedContracts);
    } catch (err) {
      console.error("Error fetching contracts:", err);
    }
  };
  fetchContracts();
}, []);

  const handleNouveauContratClick = () => {
    setShowConfirmStep(true);
  };

  const handleConfirmNextStep = () => {
    setShowConfirmStep(false);
    setIsModalOpen(true);
  };

  const getRandomTestContractData = () => {
    const testClients = [
      "Jean Dupont",
      "Habiba El Amrani",
      "Othmane Chater",
      "Rachid Benali"
    ];
    const testTitles = [
      "TR-4520/2026",
      "TF-9876/2026",
      "TF-3012/2026"
    ];
    const testWorks = [
      "Étude topographique complète",
      "Bornage et immatriculation foncière",
      "Cartographie et photogrammétrie"
    ];
    const testPrices = [12000, 9500, 18000, 25400];

    return {
      client_name: testClients[Math.floor(Math.random() * testClients.length)],
      titre_foncier: testTitles[Math.floor(Math.random() * testTitles.length)],
      work_type: testWorks[Math.floor(Math.random() * testWorks.length)],
      price: testPrices[Math.floor(Math.random() * testPrices.length)]
    };
  };
  const handlePrestationChange = (chosenPrestation) => {
  const fieldsConfig = PRESTATION_PARAMS_CONFIG[chosenPrestation] || [];
  
  // Prepare empty initial values for the specific parameters
  const initialParams = {};
  fieldsConfig.forEach(field => {
    initialParams[field.key] = "";
  });

  setPrestationForm(prev => ({
    ...prev,
    prestation: chosenPrestation,
    params: initialParams
  }));
};

// In your ContractDashboard.jsx

const handleFormSubmit = async () => {
  const token = localStorage.getItem('authToken'); 

  const payload = {
    formData: { 
      ...formData, 
      references: refFonciereList 
    }
  };
  
  try {
    const response = await fetch('http://localhost:5000/api/contracts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Erreur lors de la sauvegarde");
    }

    alert("Saved successfully!");

    // ====== ADD THESE LINES HERE ======
    // 1. Clear all the form data so it's empty next time
    setFormData({ clients: [], prestations: [], references: [] });
    
    // 2. Clear the references list
    setRefFonciereList([]);
    
    // 3. Close the modal window
    setIsModalOpen(false);
    
    // Optional: Refresh the page so the new contract immediately appears on the dashboard
    window.location.reload(); 
    // ==================================

  } catch (error) {
    console.error("Erreur:", error);
    alert("Échec de la sauvegarde: " + error.message);
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
          type="button"
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
        type="button"
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
                type="button"
                onClick={handleNouveauContratClick}
                style={{ backgroundColor: '#17a2b8', color: '#fff', border: 'none', padding: '9px 18px', borderRadius: '4px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <AiFillPlusCircle style={{ fontSize: '18px' }} /> Nouveau contrat
              </button>
            </div>

<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '20px' }}>
  {contracts.length === 0 ? (
    <div style={{ color: '#6c757d', fontSize: '15px', gridColumn: '1/-1', textAlign: 'center', padding: '50px', backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #dee2e6' }}>
      Aucun contrat disponible.
    </div>
  ) : (
    contracts.map((item) => {
      // Parse data safely from server payload
      const d = item.details?.formData || item.details || {};
      const refs = d.references || [];
      const prestations = d.prestations || [];

      // Format date to YYYY-MM-DD format as seen on the website
      const dateObj = new Date(item.created_at || Date.now());
      const formattedDate = item.created_at 
        ? dateObj.toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0];

      // Format contract reference identically to the ONIGT official layout rules
      const officialNumber = `N°604/SO/ONIGT/CN-${String(item.sequence || 0).padStart(4, '0')}/2026`;

      return (
        <div 
          key={item.id} 
          style={{ 
            backgroundColor: '#fff', 
            borderRadius: '4px', 
            border: '1px solid #dee2e6', 
            display: 'flex', 
            flexDirection: 'column', 
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          {/* Official Layout Header */}
          <div style={{ backgroundColor: '#17a2b8', color: '#fff', padding: '12px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '13px', fontWeight: '700' }}>
              <span style={{ marginRight: '5px' }}>⏳</span> N° : {officialNumber}
            </div>
            <div style={{ fontSize: '13px', fontWeight: '600' }}>
              {formattedDate}
            </div>
          </div>

          {/* Compact Card Body */}
          <div style={{ padding: '15px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              {/* Client Name (Bold & Uppercase) */}
              <div style={{ fontWeight: '700', fontSize: '15px', color: '#212529', marginBottom: '12px', textTransform: 'uppercase' }}>
                {d.clients?.[0]?.client_name || "CLIENT INCONNU"}
              </div>

              {/* Combined Prestations & Land References Badges */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {prestations.map((presta, idx) => {
                  // Link each prestation index to its matching land reference item
                  const associatedRef = refs[idx] || refs[0]; 
                  let refBadge = "";
                  
                  if (associatedRef) {
                    const prefixMap = {
                      "Titre foncier": "T/",
                      "Réquisition": "R/",
                      "Non immatriculé": "NI/",
                      "Délimitation administrative": "DA/",
                      "Non défini": "ND/"
                    };
                    const prefix = prefixMap[associatedRef.regime] || "";
                    refBadge = `${prefix}${associatedRef.valeur || ""}`;
                  }

                  return (
                    <div key={presta.id || idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', fontSize: '13px', color: '#495057' }}>
                      <span style={{ fontWeight: '700', color: '#17a2b8' }}>P{idx + 1} :</span>
                      {refBadge && (
                        <span style={{ 
                          border: '1px solid #ced4da', 
                          padding: '2px 6px', 
                          borderRadius: '4px', 
                          backgroundColor: '#f8f9fa', 
                          fontSize: '11px', 
                          fontWeight: '600',
                          color: '#333'
                        }}>
                          {refBadge}
                        </span>
                      )}
                      <span style={{ fontWeight: '500' }}>{presta.prestation}</span>
                    </div>
                  );
                })}

                {/* Fallback layout if land references exist without specified prestations */}
                {prestations.length === 0 && refs.length > 0 && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#17a2b8' }}>Ref:</span>
                    {refs.map((ref, idx) => {
                      const prefixMap = {
                        "Titre foncier": "T/",
                        "Réquisition": "R/",
                        "Non immatriculé": "NI/",
                        "Délimitation administrative": "DA/",
                        "Non défini": "ND/"
                      };
                      const prefix = prefixMap[ref.regime] || "";
                      return (
                        <span key={idx} style={{ border: '1px solid #ced4da', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#f8f9fa', fontSize: '11px', fontWeight: '600', color: '#333' }}>
                          {prefix}{ref.valeur || "Sans valeur"}
                        </span>
                      );
                    })}
                  </div>
                )}

                {prestations.length === 0 && refs.length === 0 && (
                  <div style={{ color: '#999', fontStyle: 'italic', fontSize: '13px' }}>
                    Aucune prestation ni référence enregistrée.
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons Container */}
            <div style={{ marginTop: '15px' }}>
              <ActionButtons contractId={item.id} clientName={d.clients?.[0]?.client_name || "Client"} />
            </div>
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
              <button type="button" onClick={handleConfirmNextStep} style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '4px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', minWidth: '100px' }}>Continuer</button>
              <button type="button" onClick={() => setShowConfirmStep(false)} style={{ backgroundColor: '#dc3545', color: '#fff', border: 'none', padding: '10px 24px', borderRadius: '4px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', minWidth: '100px' }}>Non</button>
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
        <button type="button" onClick={() => setIsModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px' }}>✕</button>
      </div>

      <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        {/* Scrollable Content */}
        <div style={{ padding: '20px', overflowY: 'auto' }}>
        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', border: '1px solid #dee2e6', fontSize: '14px', color: '#333', marginBottom: '20px' }}>
          Cette interface vous permet de préparer et visualiser un contrat avant sa finalisation. Vous pouvez ajouter les clients concernés, définir les prestations associées, et compléter les informations nécessaires telles que les montants et les conditions. L'aperçu proposé reflète fidèlement le contrat final.
        </div>

{/* Section: Entre */}
<div style={{ marginBottom: '20px', textAlign: 'left', fontSize: '14px' }}>
  <div style={{ fontWeight: '700', marginBottom: '10px' }}>Entre :</div>
  
  <button type="button" onClick={() => setIsClientModalOpen(true)} style={{ border: 'none', background: 'none', color: '#17a2b8', cursor: 'pointer', fontWeight: '600', marginBottom: '10px' }}>
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
      type="button"
      onClick={() => removeClient(index)} 
      style={{ border: 'none', background: '#fff2f2', color: '#dc3545', cursor: 'pointer', padding: '5px 10px', borderRadius: '4px', fontSize: '12px' }}
    >
      Supprimer
    </button>
  </div>
))}

</div>



        {/* Placeholder for the Table from Capture2_4.PNG */}
{/* Conditions Particulières Section */}
{/* Section: Prestation */}
<div style={{ marginTop: '20px', marginBottom: '20px', textAlign: 'left' }}>
<button 
  type="button"
  onClick={() => setIsPrestationModalOpen(true)}
  style={{ border: 'none', background: 'none', color: '#17a2b8', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}
>
  <AiFillPlusCircle style={{ fontSize: '18px' }} /> Ajouter prestation
</button>
{/* ================= PRESTATIONS LIST DISPLAY ================= */}
{/* ================= PRESTATIONS LIST DISPLAY ================= */}
{formData.prestations.length > 0 && (
  <div style={{ marginTop: '20px' }}>
    <h6 style={{ fontWeight: '600', marginBottom: '10px', color: '#444' }}>Prestations sélectionnées :</h6>
    {formData.prestations.map((presta, index) => (
      <div 
        key={index} 
        style={{ 
          border: '1px solid #dee2e6', 
          borderRadius: '6px', 
          padding: '12px', 
          marginBottom: '10px',
          backgroundColor: '#f9f9f9' 
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong style={{ fontSize: '14px' }}>{presta.prestation}</strong>
            <div style={{ fontSize: '12px', color: '#666' }}>Catégorie: {presta.category}</div>
          </div>
          
          {/* BUTTON ADDED HERE */}
          <button 
            type="button" 
            onClick={() => removePrestation(index)}
            style={{ 
              backgroundColor: '#fff2f2', 
              color: '#dc3545', 
              border: 'none', 
              padding: '5px 10px', 
              borderRadius: '4px', 
              fontSize: '12px', 
              cursor: 'pointer' 
            }}
          >
            Supprimer
          </button>
        </div>

        {/* Dynamic Parameters Display */}
        {presta.params && Object.keys(presta.params).length > 0 && (
          <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px dashed #ccc', fontSize: '12px' }}>
            <span style={{ fontWeight: '600', color: '#555' }}>Détails: </span>
            {Object.entries(presta.params).map(([key, value], i) => (
              <span key={i} style={{ marginRight: '10px' }}>
                {key.replace(/_/g, ' ')}: <strong>{value}</strong>
              </span>
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
)}
</div>

      </div>

      {/* Fixed Footer */}
      <div style={{ padding: '15px 20px', borderTop: '1px solid #dee2e6', display: 'flex', justifyContent: 'space-between', backgroundColor: '#f8f9fa' }}>
        <button type="button" onClick={() => setIsModalOpen(false)} style={{ backgroundColor: '#28a745', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '4px', fontWeight: '600' }}>Fermer</button>
        <button 
  type="button"
  onClick={handleFormSubmit}
  style={{
    padding: '12px 24px',
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  }}
>
  Générer le contrat
</button>
      </div>
    </form>
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
          <button type="button" onClick={() => {
            setTempClient({ client_name: '', cine: '', address: '', quality: '' });
            setIsClientModalOpen(false);
          }} style={{ padding: '8px 20px', cursor: 'pointer' }}>Fermer</button>
          
          <button type="button" onClick={() => {
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
  <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
    <div style={{ backgroundColor: '#fff', width: '90%', maxWidth: '920px', borderRadius: '6px', boxShadow: '0 10px 40px rgba(0,0,0,0.25)', display: 'flex', flexDirection: 'column' }}>
      
      {/* Modal Header */}
      <div style={{ padding: '15px 24px', borderBottom: '1px solid #dee2e6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '18px', color: '#333', fontWeight: '500' }}>Nouvelle prestation</h3>
        <button type="button" onClick={() => setIsPrestationModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '22px', color: '#6c757d' }}>✕</button>
      </div>

      <div style={{ padding: '24px', maxHeight: 'calc(100vh - 160px)', overflowY: 'auto' }}>
        
        {/* Blue Info Callout Box */}
        <div style={{ backgroundColor: '#f8f9fa', padding: '16px 20px', borderLeft: '4px solid #17a2b8', borderTop: '1px solid #dee2e6', borderRight: '1px solid #dee2e6', borderBottom: '1px solid #dee2e6', borderRadius: '4px', marginBottom: '24px', color: '#333', fontSize: '14.5px', lineHeight: '1.5' }}>
          Interface de préparation de la prestation. Décrivez les tâches à réaliser, le système calculera automatiquement la quantification, puis ajoutez les autres détails si nécessaire.
        </div>

        {/* Navigation Tabs - Styled to match Capture25.PNG exactly */}
        <div style={{ display: 'flex', borderBottom: '1px solid #dee2e6', marginBottom: '20px', paddingLeft: '10px' }}>
          {['Prestation', 'Référence foncière', 'Missions'].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '10px 20px',
                  border: isActive ? '1px solid #dee2e6' : '1px solid transparent',
                  borderBottom: isActive ? '1px solid #fff' : 'transparent',
                  background: isActive ? '#fff' : 'transparent',
                  color: isActive ? '#333' : '#007bff',
                  cursor: 'pointer',
                  fontWeight: isActive ? '500' : '400',
                  fontSize: '14px',
                  borderRadius: '4px 4px 0 0',
                  marginBottom: '-1px',
                  zIndex: isActive ? 2 : 1
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENT: PRESTATION */}
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
                    onChange={(e) => handlePrestationChange(e.target.value)}                  
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

{/* ================= SECTION : DYNAMIC PARAMÈTRE DE PRESTATION ================= */}
<div style={{ marginTop: '24px' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #dee2e6', paddingBottom: '8px', marginBottom: '16px' }}>
    <h5 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#333' }}>Paramètre de prestation</h5>
    <div style={{ backgroundColor: '#fff', border: '1px solid #ced4da', color: '#495057', fontWeight: '700', padding: '6px 16px', borderRadius: '4px', fontSize: '14px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
      0.00 points.
    </div>
  </div>

  <div id="new_prestation_params_prestation" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
    {PRESTATION_PARAMS_CONFIG[prestationForm.prestation] && PRESTATION_PARAMS_CONFIG[prestationForm.prestation].length > 0 ? (
      PRESTATION_PARAMS_CONFIG[prestationForm.prestation].map((param) => (
        <div key={param.key} style={{ display: 'flex', borderRadius: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
          <span style={{ display: 'flex', alignItems: 'center', padding: '0 12px', backgroundColor: '#f8f9fa', color: '#6c757d', border: '1px solid #ced4da', borderRight: 'none', borderTopLeftRadius: '4px', borderBottomLeftRadius: '4px', fontSize: '14px', whiteSpace: 'nowrap' }}>
            {param.label}
          </span>
          <input 
            type={param.type || "text"} 
            step="0.001" 
            placeholder="0.00" 
            value={prestationForm.params[param.key] || ''}
            onChange={(e) => setPrestationForm(prev => ({
              ...prev,
              params: {
                ...prev.params,
                [param.key]: e.target.value
              }
            }))}
            style={{ flex: 1, padding: '10px 12px', border: '1px solid #ced4da', fontSize: '14px', outline: 'none' }}
          />
          {param.unit && (
            <span style={{ display: 'flex', alignItems: 'center', padding: '0 12px', backgroundColor: '#f8f9fa', color: '#6c757d', border: '1px solid #ced4da', borderLeft: 'none', borderTopRightRadius: '4px', borderBottomRightRadius: '4px', fontSize: '14px' }}>
              {param.unit}
            </span>
          )}
        </div>
      ))
    ) : (
      <p style={{ margin: 0, color: '#6c757d', fontSize: '14px', fontStyle: 'italic' }}>
        Aucun paramètre supplémentaire requis pour cette prestation.
      </p>
    )}
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

        {/* TAB CONTENT: RÉFÉRENCE FONCIÈRE[cite: 9] */}
        {activeTab === 'Référence foncière' && (
          <div>
            {/* Top Teal Action Button Right-Aligned[cite: 9] */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
              <button
                type="button"
                onClick={() => setIsRefFonciereModalOpen(true)}
                style={{ padding: '8px 16px', backgroundColor: '#17a2b8', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}
              >
                <span style={{ border: '1px solid #fff', borderRadius: '50%', width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold' }}>+</span> 
                Référence foncière
              </button>
            </div>

            {/* Structured Table[cite: 9] */}
            <div style={{ overflowX: 'auto', backgroundColor: '#fff', border: '1px solid #ccc' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#dbdbdb', color: '#212529' }}>
                    <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left', fontWeight: '600', width: '40%' }}>Référence foncière</th>
                    <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left', fontWeight: '600', width: '25%' }}>Commune</th>
                    <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'left', fontWeight: '600', width: '20%' }}>Zone</th>
                    <th style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center', fontWeight: '600', width: '15%' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {refFonciereList.length === 0 ? (
                    <tr>
                      {/* Placeholder row matching empty style state */}
                      <td style={{ padding: '12px', border: '1px solid #ccc' }}>T/</td>
                      <td style={{ padding: '12px', border: '1px solid #ccc' }}>Agadir</td>
                      <td style={{ padding: '12px', border: '1px solid #ccc' }}>Zone 1</td>
                      <td style={{ padding: '12px', border: '1px solid #ccc', textAlign: 'center' }}>
                        <span style={{ color: '#e0a800', marginRight: '15px', cursor: 'pointer' }}>📝</span>
                        <span style={{ color: '#dc3545', cursor: 'pointer' }}>🗑️</span>
                      </td>
                    </tr>
                  ) : (
                    refFonciereList.map(item => {
                      // Smart Prefix extraction matching Moroccan Land Regimes
                      const prefixMap = {
                        "Titre foncier": "T/",
                        "Réquisition": "R/",
                        "Non immatriculé": "NI/",
                        "Délimitation administrative": "DA/",
                        "Non défini": "ND/"
                      };
                      const prefix = prefixMap[item.regime] || "";

                      return (
                        <tr key={item.id}>
                          <td style={{ padding: '10px', border: '1px solid #ccc', color: '#333' }}>
                            {prefix}{item.valeur}
                          </td>
                          <td style={{ padding: '10px', border: '1px solid #ccc', color: '#333' }}>{item.commune}</td>
                          <td style={{ padding: '10px', border: '1px solid #ccc', color: '#333' }}>{item.zone}</td>
                          <td style={{ padding: '10px', border: '1px solid #ccc', textAlign: 'center' }}>
                            {/* Action Tools matching styling icons[cite: 9] */}
                            <button 
                              type="button"
                              onClick={() => {
                                setRefFonciereForm({
                                  commune: item.commune,
                                  regimeFoncier: item.regime,
                                  valeur: item.valeur,
                                  zone: item.zone,
                                  x: item.x || '',
                                  y: item.y || ''
                                });
                                setRefFonciereList(prev => prev.filter(row => row.id !== item.id));
                                setIsRefFonciereModalOpen(true);
                              }}
                              style={{ border: '1px solid #ffc107', background: 'none', borderRadius: '3px', padding: '2px 6px', color: '#e0a800', cursor: 'pointer', marginRight: '8px' }}
                            >
                              ✏️
                            </button>
                            <button
                              type="button"
                              onClick={() => setRefFonciereList(prev => prev.filter(row => row.id !== item.id))}
                              style={{ border: '1px solid #dc3545', background: 'none', borderRadius: '3px', padding: '2px 6px', color: '#dc3545', cursor: 'pointer' }}
                            >
                              🗑️
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB CONTENT: MISSIONS[cite: 9] */}
        {activeTab === 'Missions' && (
          <div style={{ padding: '10px', color: '#6c757d' }}>
            Interface de configuration des missions et étapes de validation.
          </div>
        )}

        {/* Modal Action Controls Footer Container[cite: 9] */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '30px' }}>
          <button 
            type="button"
            onClick={() => setIsPrestationModalOpen(false)} 
            style={{ padding: '8px 20px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ced4da', backgroundColor: '#fff', color: '#333', fontSize: '14px' }}
          >
            Fermer
          </button>
          <button 
  type="button"
  onClick={() => {
    // 1. Basic Validation
    if (!prestationForm.prestation) {
      alert("Veuillez sélectionner une prestation.");
      return;
    }

    // 2. Append to formData.prestations (The "Envoyer" pattern)
    setFormData(prev => ({
      ...prev,
      prestations: [
        ...prev.prestations, 
        { 
          ...prestationForm, 
          id: Date.now() // Unique ID to keep list items distinct
        }
      ]
    }));

    // 3. Reset the form state to clear inputs
    setPrestationForm({
      category: '',
      prestation: '',
      price: '0',
      quantity: '1',
      unit: '',
      refFonciereRef: '',
      refFonciereCommune: '',
      refFonciereZone: '',
      params: {}
    });

    // 4. Close the Modal
    setIsPrestationModalOpen(false);
  }}
  style={{ 
    padding: '10px 24px', 
    backgroundColor: '#007bff', // Match your "Envoyer" color
    color: '#fff', 
    border: 'none', 
    borderRadius: '6px', 
    cursor: 'pointer',
    fontWeight: '600'
  }}
>
  Enregistrer
</button>
        </div>

      </div>
    </div>
  </div>
)}

{/* NOUVELLE MODALE : RÉFÉRENCE FONCIÈRE */}
{isRefFonciereModalOpen && (
  <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000 }}>
    <div style={{ backgroundColor: '#fff', width: '550px', borderRadius: '6px', boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}>
      
      {/* En-tête */}
      <div style={{ padding: '15px 20px', borderBottom: '1px solid #dee2e6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '18px', color: '#333', fontWeight: '400' }}>Nouvelle Référence foncière</h3>
        <button  type="button" onClick={() => setIsRefFonciereModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px', color: '#6c757d' }}>✕</button>
      </div>

      <div style={{ padding: '20px' }}>
        {/* Commune */}
        <div style={{ display: 'flex', marginBottom: '15px' }}>
          <div style={{ width: '130px', padding: '10px', backgroundColor: '#f8f9fa', border: '1px solid #ced4da', borderRight: 'none', fontSize: '14px', color: '#495057' }}>
            Commune
          </div>
          <select 
            value={refFonciereForm.commune} 
            onChange={(e) => setRefFonciereForm({...refFonciereForm, commune: e.target.value})} 
            style={{ flex: 1, padding: '10px', border: '1px solid #ced4da', color: '#495057', fontSize: '14px' }}
          >
            {/* Boucle sur la constante pour générer toutes les communes */}
            {COMMUNES_MAROC.map((commune) => (
              <option key={commune} value={commune}>{commune}</option>
            ))}
          </select>
        </div>

        {/* Régime foncier & Valeur */}
        <div style={{ display: 'flex', marginBottom: '15px' }}>
          <div style={{ width: '130px', padding: '10px', backgroundColor: '#f8f9fa', border: '1px solid #ced4da', borderRight: 'none', fontSize: '14px', color: '#495057' }}>
            Régime foncier
          </div>
          <select 
            value={refFonciereForm.regimeFoncier} 
            onChange={(e) => setRefFonciereForm({...refFonciereForm, regimeFoncier: e.target.value})} 
            style={{ width: '200px', padding: '10px', border: '1px solid #ced4da', borderRight: 'none', color: '#0056b3', fontSize: '14px' }}
          >
            <option value="Titre foncier">Titre foncier</option>
            <option value="Réquisition">Réquisition</option>
            <option value="Non immatriculé">Non immatriculé</option>
            <option value="Délimitation administrative">Délimitation administrative</option>
            <option value="Non défini">Non défini</option>
          </select>
          <input 
            type="text" 
            placeholder="Saisissez une valeur" 
            value={refFonciereForm.valeur} 
            onChange={(e) => setRefFonciereForm({...refFonciereForm, valeur: e.target.value})} 
            style={{ flex: 1, padding: '10px', border: '1px solid #ced4da', fontSize: '14px' }} 
          />
        </div>

        {/* Zone */}
        <div style={{ display: 'flex', marginBottom: '15px' }}>
          <div style={{ width: '130px', padding: '10px', backgroundColor: '#f8f9fa', border: '1px solid #ced4da', borderRight: 'none', fontSize: '14px', color: '#495057' }}>
            Zone
          </div>
          <select 
            value={refFonciereForm.zone} 
            onChange={(e) => setRefFonciereForm({...refFonciereForm, zone: e.target.value})} 
            style={{ width: '150px', padding: '10px', border: '1px solid #ced4da', color: '#495057', fontSize: '14px' }}
          >
            {/* Ajout des 4 zones ici */}
            <option value="Zone 1">Zone 1</option>
            <option value="Zone 2">Zone 2</option>
            <option value="Zone 3">Zone 3</option>
            <option value="Zone 4">Zone 4</option>
          </select>
        </div>

        {/* X & Y */}
        <div style={{ display: 'flex', marginBottom: '15px' }}>
          <div style={{ width: '130px', padding: '10px', backgroundColor: '#f8f9fa', border: '1px solid #ced4da', borderRight: 'none', fontSize: '14px', color: '#495057', textAlign: 'center' }}>
            X
          </div>
          <input 
            type="text" 
            placeholder="X" 
            value={refFonciereForm.x} 
            onChange={(e) => setRefFonciereForm({...refFonciereForm, x: e.target.value})} 
            style={{ flex: 1, padding: '10px', border: '1px solid #ced4da', fontSize: '14px' }} 
          />
        </div>
        <div style={{ display: 'flex', marginBottom: '20px' }}>
          <div style={{ width: '130px', padding: '10px', backgroundColor: '#f8f9fa', border: '1px solid #ced4da', borderRight: 'none', fontSize: '14px', color: '#495057', textAlign: 'center' }}>
            Y
          </div>
          <input 
            type="text" 
            placeholder="Y" 
            value={refFonciereForm.y} 
            onChange={(e) => setRefFonciereForm({...refFonciereForm, y: e.target.value})} 
            style={{ flex: 1, padding: '10px', border: '1px solid #ced4da', fontSize: '14px' }} 
          />
        </div>

        {/* Boutons d'action */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <button 
            type="button"
            onClick={() => setIsRefFonciereModalOpen(false)} 
            style={{ padding: '8px 24px', cursor: 'pointer', border: '1px solid #ced4da', backgroundColor: '#f8f9fa', color: '#333', borderRadius: '4px' }}
          >
            Fermer
          </button>
          <button 
            type="button"
            onClick={() => {
              setRefFonciereList(prev => [...prev, { 
                id: Date.now(), 
                regime: refFonciereForm.regimeFoncier, 
                valeur: refFonciereForm.valeur, 
                commune: refFonciereForm.commune, 
                zone: refFonciereForm.zone, 
                x: refFonciereForm.x, 
                y: refFonciereForm.y 
              }]);
              setIsRefFonciereModalOpen(false);
              setRefFonciereForm({ commune: 'Agadir', regimeFoncier: 'Délimitation administrative', valeur: '', zone: 'Zone 1', x: '', y: '' });
            }} 
            style={{ padding: '8px 24px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
          >
            Envoyer
          </button>
        </div>

      </div>
    </div>
    
  </div>
  
)}

    </div>
  );
}