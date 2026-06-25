import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/App.css';

function Avaliacao() {
  const navigate = useNavigate();
  const { state } = useLocation();

  // Dados vindos do QR Code de avaliação
  const eventoTitulo = state?.eventoTitulo || 'Evento';
  const formsUrl = state?.formsUrl || null;

  const abrirFormulario = () => {
    if (formsUrl) {
      window.open(formsUrl, '_blank');
    } else {
      alert('URL do formulário não encontrada. Contate o administrador.');
    }
    // Marcar como avaliado e voltar
    setTimeout(() => navigate('/'), 1000);
  };

  return (
    <div className="app-container">
      <div className="top-bar">
        <button className="back-btn" onClick={() => navigate('/frequencia')}>←</button>
        <h3>Avaliação de Reação</h3>
      </div>

      <div className="app-content" style={{ textAlign: 'center', paddingTop: '20px' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>📝</div>
        <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>
          Avalie o treinamento!
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '20px' }}>
          Sua opinião é muito importante para melhorarmos os próximos eventos.
        </p>

        <div className="card" style={{ cursor: 'default', textAlign: 'left', marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>Evento</div>
          <div style={{ fontWeight: '500' }}>{eventoTitulo}</div>
        </div>

        <div className="alert alert-info" style={{ textAlign: 'left' }}>
          O formulário será aberto no Google Forms com seus dados já preenchidos.
          Leva menos de 2 minutos!
        </div>

        <button className="btn btn-primary" onClick={abrirFormulario}>
          📋 Abrir formulário de avaliação
        </button>
        <button className="btn btn-secondary" onClick={() => navigate('/')}>
          Avaliar depois
        </button>
      </div>
    </div>
  );
}

export default Avaliacao;
