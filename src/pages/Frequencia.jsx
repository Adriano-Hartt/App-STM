import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';

function Frequencia() {
  const navigate = useNavigate();
  const [aba, setAba] = useState('frequencia');

  return (
    <div className="app-container">
      <div className="app-header">
        <span className="app-header-title">STM — Frequência</span>
      </div>

      <div className="tabs">
        <button
          className={`tab-btn ${aba === 'frequencia' ? 'active' : ''}`}
          onClick={() => setAba('frequencia')}
        >
          Lista de frequência
        </button>
        <button
          className={`tab-btn ${aba === 'avaliacao' ? 'active' : ''}`}
          onClick={() => setAba('avaliacao')}
        >
          Avaliação de reação
        </button>
      </div>

      <div className="app-content">
        {aba === 'frequencia' && (
          <>
            <div className="alert alert-info">
              📱 Aponte para o QR Code do evento para confirmar sua presença.
            </div>

            <div className="card" style={{ cursor: 'default', marginBottom: '16px' }}>
              <div className="card-title" style={{ marginBottom: '6px' }}>Evento ativo agora</div>
              <div style={{ fontSize: '14px', color: 'var(--color-text-primary)' }}>
                Gestão de Pessoas no Setor Público
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
                🕐 09h00 – 12h00 · 📍 Auditório A
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => navigate('/camera-qr')}
            >
              📷 Abrir câmera e escanear QR Code
            </button>

            <div className="divider" />
            <div className="section-title" style={{ marginBottom: '12px' }}>Minha frequência</div>

            <div className="card" style={{ cursor: 'default' }}>
              <div className="card-header">
                <div>
                  <div className="card-title" style={{ fontSize: '13px' }}>Introdução ao LGPD para Servidores</div>
                  <div className="card-sub">28 mai 2025</div>
                </div>
                <span className="pill pill-success">✓ Presente</span>
              </div>
            </div>
          </>
        )}

        {aba === 'avaliacao' && (
          <>
            <div className="alert alert-warning">
              <span style={{ color: 'var(--color-warning)' }}>
                🔗 A avaliação de reação é liberada via QR Code apresentado ao final do evento.
              </span>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/camera-qr')}
            >
              📷 Escanear QR Code de avaliação
            </button>
            <div className="divider" />
            <div className="section-title" style={{ marginBottom: '12px' }}>Avaliações realizadas</div>
            <div className="card" style={{ cursor: 'default' }}>
              <div className="card-header">
                <div>
                  <div className="card-title" style={{ fontSize: '13px' }}>Introdução ao LGPD para Servidores</div>
                  <div className="card-sub">28 mai 2025</div>
                </div>
                <span className="pill pill-success">✓ Avaliado</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="app-bottom-nav">
        <button className="nav-item" onClick={() => navigate('/')}>
          <span>🏠</span>Início
        </button>
        <button className="nav-item" onClick={() => navigate('/eventos')}>
          <span>📅</span>Eventos
        </button>
        <button className="nav-item" onClick={() => navigate('/meus-cursos')}>
          <span>📚</span>Meus cursos
        </button>
        <button className="nav-item active">
          <span>🔍</span>Frequência
        </button>
      </div>
    </div>
  );
}

export default Frequencia;
