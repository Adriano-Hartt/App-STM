import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obterEventos } from '../services/firestore';
import { auth } from '../services/firebase';
import '../styles/App.css';

function Home() {
  const navigate = useNavigate();
  const [eventos,    setEventos]    = useState([]);
  const [carregando, setCarregando] = useState(true);

  const nome = auth.currentUser?.displayName?.split(' ')[0] ?? 'usuário';

  useEffect(() => {
    obterEventos()
      .then(data => setEventos(data.slice(0, 3)))
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, []);

  return (
    <div className="app-container">
      <div className="app-header">
        <span className="app-header-title">STM</span>
        <div className="app-header-icons">
          <span style={{ cursor: 'pointer' }}>🔔</span>
          <span style={{ cursor: 'pointer' }} onClick={() => navigate('/perfil')}>👤</span>
        </div>
      </div>

      <div className="app-content">
        {/* Banner */}
        <div className="hero-banner">
          <div className="hero-badge">Olá, {nome} 👋</div>
          <h2>Treinamentos STM</h2>
          <p>Inscreva-se, confirme presença e avalie os eventos.</p>
        </div>

        {/* Atalhos */}
        <div className="grid-2" style={{ marginBottom: '20px' }}>
          <div className="stat-card" onClick={() => navigate('/eventos')} style={{ cursor: 'pointer' }}>
            <div style={{ fontSize: '26px', marginBottom: '6px' }}>📅</div>
            <div className="stat-label" style={{ fontWeight: 500 }}>Eventos</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Ver disponíveis</div>
          </div>
          <div className="stat-card" onClick={() => navigate('/meus-cursos')} style={{ cursor: 'pointer' }}>
            <div style={{ fontSize: '26px', marginBottom: '6px' }}>📚</div>
            <div className="stat-label" style={{ fontWeight: 500 }}>Meus cursos</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Minhas inscrições</div>
          </div>
          <div className="stat-card" onClick={() => navigate('/frequencia')} style={{ cursor: 'pointer' }}>
            <div style={{ fontSize: '26px', marginBottom: '6px' }}>📱</div>
            <div className="stat-label" style={{ fontWeight: 500 }}>Frequência</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Confirmar presença</div>
          </div>
          <div className="stat-card" onClick={() => navigate('/admin')} style={{ cursor: 'pointer' }}>
            <div style={{ fontSize: '26px', marginBottom: '6px' }}>⚙️</div>
            <div className="stat-label" style={{ fontWeight: 500 }}>Painel Admin</div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Gerenciar sistema</div>
          </div>
        </div>

        {/* Próximos eventos */}
        <div className="section-header">
          <span className="section-title">Próximos eventos</span>
          <span className="section-link" onClick={() => navigate('/eventos')}>Ver todos</span>
        </div>

        {carregando ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-secondary)' }}>
            Carregando...
          </div>
        ) : eventos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-secondary)', fontSize: '13px' }}>
            Nenhum evento disponível no momento.
          </div>
        ) : (
          eventos.map(ev => (
            <div key={ev.id} className="card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/eventos/${ev.id}`)}>
              <div className="card-header">
                <div>
                  <div className="card-title">{ev.titulo}</div>
                  <div className="card-subtitle">{ev.tipo}</div>
                </div>
                <span className="pill pill-success">Abertas</span>
              </div>
              <div className="card-meta">
                <span>📅 {ev.data ? new Date(ev.data).toLocaleDateString('pt-BR') : '—'}</span>
                {ev.horarioInicio && <span>🕐 {ev.horarioInicio}</span>}
                {ev.local         && <span>📍 {ev.local}</span>}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="app-bottom-nav">
        <button className="nav-item active"  onClick={() => navigate('/')}>🏠 Início</button>
        <button className="nav-item"         onClick={() => navigate('/eventos')}>📅 Eventos</button>
        <button className="nav-item"         onClick={() => navigate('/meus-cursos')}>📚 Meus cursos</button>
        <button className="nav-item"         onClick={() => navigate('/perfil')}>👤 Perfil</button>
      </div>
    </div>
  );
}

export default Home;
