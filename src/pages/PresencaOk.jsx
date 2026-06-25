import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';

function PresencaOk() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <div className="top-bar">
        <h3>Frequência registrada</h3>
      </div>

      <div className="app-content" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'var(--color-success-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '20px',
          fontSize: '36px'
        }}>
          ✓
        </div>

        <h2 style={{ fontSize: '20px', fontWeight: '500', marginBottom: '8px' }}>
          Presença confirmada!
        </h2>

        <p style={{
          fontSize: '13px',
          color: 'var(--color-text-secondary)',
          marginBottom: '16px',
          lineHeight: 1.6
        }}>
          Sua frequência foi registrada e<br />enviada para a planilha do evento.
        </p>

        <div className="alert alert-success" style={{ textAlign: 'left', width: '100%' }}>
          📊 Dados enviados ao Google Sheets com sucesso.
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate('/')}
          style={{ marginTop: '16px' }}
        >
          Voltar ao início
        </button>
      </div>
    </div>
  );
}

export default PresencaOk;
