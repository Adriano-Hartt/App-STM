import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import '../styles/App.css';

// Formulário padrão usado quando o evento não tem um Forms próprio.
// Troque pela URL do seu Google Forms padrão quando tiver.
const FORMS_PADRAO = 'https://docs.google.com/forms/d/e/SEU_FORMS_PADRAO/viewform';

function Avaliacao() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state || {};

  const eventoTitulo = state.eventoTitulo || 'Evento';
  const formsUrl = state.formsUrl && state.formsUrl.trim() !== ''
    ? state.formsUrl
    : FORMS_PADRAO;

  return (
    <div className="app-container">
      <div className="tbar">
        <button className="back-btn" onClick={() => navigate('/frequencia')}>←</button>
        <h3>Avaliação de Reação</h3>
      </div>

      <div className="app-content">
        <div className="alert alert-info" style={{ marginBottom: '16px' }}>
          ⭐ Avalie o evento <strong>{eventoTitulo}</strong>. Escaneie o QR Code abaixo ou toque no botão para abrir o formulário.
        </div>

        <div className="card" style={{ cursor: 'default', textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ background: '#3C3489', color: 'white', padding: '8px 12px', borderRadius: '8px 8px 0 0', margin: '-12px -14px 16px', fontSize: '12px', fontWeight: '500' }}>
            ⭐ QR Code de Avaliação
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
            <QRCodeSVG value={formsUrl} size={210} level="H" includeMargin={true} style={{ border: '2px solid #3C3489', borderRadius: '8px' }} />
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            Aponte a câmera de outro celular para este código
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => window.open(formsUrl, '_blank')}
        >
          📝 Abrir formulário de avaliação
        </button>
        <button className="btn btn-secondary" onClick={() => navigate('/frequencia')}>
          Voltar
        </button>
      </div>

      <div className="app-bottom-nav">
        <button className="nav-item" onClick={() => navigate('/')}><span>🏠</span>Início</button>
        <button className="nav-item" onClick={() => navigate('/eventos')}><span>📅</span>Eventos</button>
        <button className="nav-item" onClick={() => navigate('/meus-cursos')}><span>📚</span>Meus cursos</button>
        <button className="nav-item active"><span>🔍</span>Frequência</button>
      </div>
    </div>
  );
}

export default Avaliacao;