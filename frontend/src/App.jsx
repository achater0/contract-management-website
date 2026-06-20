import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ContractDashboard from './ContractDashboard';
import ContractVerify from './ContractVerify';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main page where your brother inputs contract details */}
        <Route path="/" element={<ContractDashboard />} />
        
        {/* The target page that opens when someone scans the QR code */}
        <Route path="/verify/:id" element={<ContractVerify />} />
      </Routes>
    </Router>
  );
}

export default App;