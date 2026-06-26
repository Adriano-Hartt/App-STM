import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obterEventos } from '../services/firestore';
import '../styles/App.css';

function Admin() {
  const navigate = useNavigate();
  const [aba,      setAba]      = useState('eventos');
  const [eventos,  setEventos]  = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    obterEventos()
      .then(setEventos)
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, []);

  return (
    <div className="app-container">
      <div style={{
        background: '#3C3489', color: 'white',
        padding: '12px 18px 10px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: '15px', fontWeight: 500 }}>STM — Painel Admin</span>
        <span>⚙️</span>
      </div>

      <div className="tabs">
        <button className={`tab-btn ${aba === 'eventos'  ? 'active' : ''}`} onClick={() => setAba('eventos')}>Eventos</button>
        <button className={`tab-btn ${aba === 'usuarios' ? 'active' : ''}`} onClick={() => setAba('usuarios')}>Admins</button>
      </div>

      <div className="app-content">

        {/* ── ABA EVENTOS ── */}
        {aba === 'eventos' && (
          <>
            <button className="btn btn-primary" style={{ marginBottom: '16px' }} onClick={() => navigate('/admin/criar-evento')}>
            + Criar novo evento
            </button>

            {carregando && (
              <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '20px' }}>
                Carregando eventos...
              </div>
            )}

            {!carregando && eventos.length === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--color-text-secondary)', padding: '20px' }}>
                Nenhum evento cadastrado ainda.
              </div>
            )}

            {eventos.map(ev => (
              <div key={ev.id} className="card">
                <div className="card-header">
                  <div>
                    <div className="card-title" style={{ fontSize: '13px' }}>{ev.titulo}</div>
                    <div className="card-sub">
                      {ev.data ? new Date(ev.data).toLocaleDateString('pt-BR') : '—'} · {ev.horarioInicio ?? ''} · {ev.inscritos?.length ?? 0} inscritos
                    </div>
                  </div>
                  <span className="pill pill-success">Ativo</span>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
                  {/* Ver detalhes + frequência */}
                  <button
                    className="btn-sm"
                    onClick={() => navigate(`/admin/evento/${ev.id}`)}
                    style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)', fontWeight: 500 }}
                  >
                    📋 Ver presenças
                  </button>

                  {/* Gerar QR Codes */}
                  <button
                    className="btn-sm"
                    onClick={() => navigate(`/admin/qrcode/${ev.id}`)}
                    style={{ background: '#EAF3DE', color: '#3B6D11' }}
                  >
                    🔳 QR Codes
                  </button>

                  <button className="btn-sm" onClick={() => navigate(`/admin/editar-evento/${ev.id}`)}>✏️ Editar</button>
                </div>
              </div>
            ))}

            
          </>
        )}

        {/* ── ABA ADMINS ── */}
        {aba === 'usuarios' && (
          <>
            <div style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '14px' }}>
              Gerencie quem tem acesso administrativo ao sistema.
            </div>

            {[
              { iniciais: 'MS', nome: 'Maria Santos',  email: 'maria@stm.jus.br' },
              { iniciais: 'CL', nome: 'Carlos Lima',   email: 'carlos@stm.jus.br' },
              { iniciais: 'AP', nome: 'Ana Paula',     email: 'ana@stm.jus.br' },
              { iniciais: 'RF', nome: 'Roberto Faria', email: 'roberto@stm.jus.br' },
            ].map(u => (
              <div key={u.email} className="card" style={{ cursor: 'default', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'var(--color-primary-light)', color: 'var(--color-primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 600, flexShrink: 0,
                  }}>
                    {u.iniciais}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500 }}>{u.nome}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{u.email}</div>
                  </div>
                  <span className="pill pill-info">Admin</span>
                </div>
              </div>
            ))}

            <button className="btn btn-primary" style={{ marginTop: '8px' }} onClick={() => navigate('/admin/criar-admin')}>
              + Adicionar administrador
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Admin;
