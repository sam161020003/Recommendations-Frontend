import React from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import RecommendationPage from './pages/RecommendationPage';
import AnalyticsPage from './pages/AnalyticsPage';

function App() {
  return (
    <Router>
      <div className="bg-gray-900 text-white min-h-screen font-sans">
        <nav className="bg-gray-800 shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <span className="text-2xl font-bold text-cyan-400">Ikarus AI</span>
              <div className="flex space-x-4">
                <NavLink to="/" className={({ isActive }) => isActive ? "bg-cyan-500 text-white px-3 py-2 rounded-md text-sm font-medium" : "text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"}>
                  Recommendations
                </NavLink>
                <NavLink to="/analytics" className={({ isActive }) => isActive ? "bg-cyan-500 text-white px-3 py-2 rounded-md text-sm font-medium" : "text-gray-300 hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium"}>
                  Analytics
                </NavLink>
              </div>
            </div>
          </div>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<RecommendationPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;