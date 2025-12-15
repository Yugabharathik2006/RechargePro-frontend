import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Welcome from './pages/Welcome';
import Auth from './pages/Auth';
import Home from './pages/Home';
import LandingPage from './pages/LandingPage';
import RechargePlans from './pages/RechargePlans';
import History from './pages/History';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            {/* Welcome page without navbar/footer */}
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<Auth />} />
            <Route path="/signup" element={<Auth />} />
            
            {/* Main app with navbar/footer */}
            <Route path="/*" element={
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/landing" element={<LandingPage />} />
                    <Route path="/plans" element={<RechargePlans />} />
                    <Route path="/history" element={<History />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            } />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;