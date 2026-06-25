import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaLock, FaUser } from 'react-icons/fa';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ login: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5000' : '';
      const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) throw new Error("Identifiants incorrects");

      const data = await response.json();
      localStorage.setItem("authToken", data.access_token);
      window.location.href = "/";
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#f4f6f9',
      fontFamily: '"Source Sans Pro", sans-serif'
    }}>
      <div style={{ 
        backgroundColor: '#fff', 
        padding: '40px', 
        borderRadius: '8px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
        width: '100%', 
        maxWidth: '360px' 
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '24px', color: '#333', margin: '0 0 10px 0' }}>IGT Portal</h1>
          <p style={{ color: '#6c757d', fontSize: '14px' }}>Connectez-vous pour accéder à vos contrats</p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ position: 'relative' }}>
            <FaUser style={{ position: 'absolute', left: '12px', top: '12px', color: '#adb5bd' }} />
            <input 
              type="text" placeholder="Login" required
              style={{ width: '100%', padding: '10px 10px 10px 35px', border: '1px solid #ced4da', borderRadius: '4px', boxSizing: 'border-box' }}
              onChange={(e) => setCredentials({...credentials, login: e.target.value})} 
            />
          </div>
          
          <div style={{ position: 'relative' }}>
            <FaLock style={{ position: 'absolute', left: '12px', top: '12px', color: '#adb5bd' }} />
            <input 
              type="password" placeholder="Mot de passe" required
              style={{ width: '100%', padding: '10px 10px 10px 35px', border: '1px solid #ced4da', borderRadius: '4px', boxSizing: 'border-box' }}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})} 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              backgroundColor: '#17a2b8', 
              color: '#fff', 
              border: 'none', 
              padding: '12px', 
              borderRadius: '4px', 
              fontWeight: '600', 
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '10px'
            }}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}