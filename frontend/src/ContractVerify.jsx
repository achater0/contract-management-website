import React from 'react';
import { useParams } from 'react-router-dom';

export default function ContractVerify() {
  const { id } = useParams();

  return (
    <div style={{ padding: '2rem', textAlign: 'center', color: '#00ffcc' }}>
      <h1>🔍 Hello from the Mobile Verification View!</h1>
      <p>You are successfully looking at contract reference ID: <strong>{id}</strong></p>
    </div>
  );
}