import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Auth from "./pages/Auth.jsx";
import UserPlaces from "./pages/UserPlaces.jsx";
import NewPlace from "./pages/NewPlace.jsx";
import PlaceDetail from "./pages/PlaceDetail.jsx";
import AllPlaces from "./pages/AllPlaces.jsx";
import EditPlace from "./pages/EditPlace.jsx"; 

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();
  return user ? children : <Navigate to="/authenticate" state={{ from: location }} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/places" element={<AllPlaces />} />
            <Route path="/:uid/places" element={<UserPlaces />} />
            <Route path="/authenticate" element={<Auth />} />
            <Route path="/places/new" element={<ProtectedRoute><NewPlace /></ProtectedRoute>} />
            <Route path="/places/:pid" element={<ProtectedRoute><PlaceDetail /></ProtectedRoute>} />
            <Route path="/places/:pid/edit" element={<EditPlace />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}