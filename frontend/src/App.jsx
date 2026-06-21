
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ContractDashboard from './ContractDashboard';
import ContractVerify from './ContractVerify';
import LoginPage from './LoginPage'; // You'll create this

function App() {
  // Check if token exists
  const isAuthenticated = !!localStorage.getItem("authToken");

  return (
    <Router>
      <Routes>
        {/* If user is ALREADY logged in, /login redirects to / */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} 
        />
        
        {/* Public scan page - always accessible */}
        <Route path="/verify/:id" element={<ContractVerify />} />

        {/* Protected Dashboard */}
        <Route 
          path="/" 
          element={isAuthenticated ? <ContractDashboard /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}
export default App;
