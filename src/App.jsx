import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase';
import './styles/App.css';

import Splash           from './pages/Splash';
import Login            from './pages/Login';
import Cadastro         from './pages/Cadastro';
import Home             from './pages/Home';
import Eventos          from './pages/Eventos';
import DetalheEvento    from './pages/DetalheEvento';
import MeusCursos       from './pages/MeusCursos';
import Frequencia       from './pages/Frequencia';
import CameraQR         from './pages/CameraQR';
import ConfirmarPresenca from './pages/ConfirmarPresenca';
import PresencaOk       from './pages/PresencaOk';
import Avaliacao        from './pages/Avaliacao';
import GerarQRCode      from './pages/GerarQRCode';
import Perfil           from './pages/Perfil';
import Admin            from './pages/Admin';
import AdminEvento      from './pages/AdminEvento';
import CriarEvento      from './pages/CriarEvento';

function App() {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false); });
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="splash-loading">
        <div className="splash-logo">STM</div>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {!user ? (
          <>
            <Route path="/"         element={<Splash />} />
            <Route path="/login"    element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="*"         element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            {/* Área pública autenticada */}
            <Route path="/"                    element={<Home />} />
            <Route path="/eventos"             element={<Eventos />} />
            <Route path="/eventos/:id"         element={<DetalheEvento />} />
            <Route path="/meus-cursos"         element={<MeusCursos />} />
            <Route path="/frequencia"          element={<Frequencia />} />
            <Route path="/camera-qr"           element={<CameraQR />} />
            <Route path="/confirmar-presenca"  element={<ConfirmarPresenca />} />
            <Route path="/presenca-ok"         element={<PresencaOk />} />
            <Route path="/avaliacao"           element={<Avaliacao />} />
            <Route path="/perfil"              element={<Perfil />} />

            {/* Área admin */}
            <Route path="/admin"                    element={<Admin />} />
            <Route path="/admin/evento/:id"         element={<AdminEvento />} />
            <Route path="/admin/criar-evento"       element={<CriarEvento />} />
            <Route path="/admin/qrcode/:eventoId"   element={<GerarQRCode />} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
