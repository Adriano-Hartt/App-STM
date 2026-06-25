import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';

function Splash() {
  const navigate = useNavigate();

  return (
    <div className="app-container">
      <div style={{
        background: 'var(--color-primary)',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        color: 'white',
        padding: '32px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '8px' }}>🛡️</div>
        <div style={{ fontSize: '48px', fontWeight: 'bold', letterSpacing: '4px' }}>
          STM
        </div>
        <div style={{ fontSize: '14px', opacity: 0.85, lineHeight: 1.5 }}>
          Sistema de Treinamento e Monitoramento<br />
          da Justiça Militar da União
        </div>
        
        <div style={{ marginTop: '40px', width: '100%' }}>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/login')}
            style={{ marginBottom: '10px' }}
          >
            Entrar
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/cadastro')}
            style={{
              borderColor: 'rgba(255, 255, 255, 0.4)',
              color: 'white'
            }}
          >
            Primeiro acesso — Cadastrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Splash;
