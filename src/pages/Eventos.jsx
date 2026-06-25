import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obterEventos } from '../services/firestore';
import '../styles/App.css';

const FILTROS = [
  { key: 'todos',   label: 'Todos' },
  { key: 'abertas', label: 'Inscrições abertas' },
  { key: 'breve',   label: 'Em breve' },
];

function statusEvento(evento) {
  const agora = new Date();
  const dataEv = evento.data ? new Date(evento.data) : null;
  if (!dataEv) return 'abertas';
  return dataEv > agora ? 'abertas' : 'breve';
}

function pillClasse(status) {
  return status === 'abertas' ? 'pill pill-success' : 'pill pill-info';
}

function pillTexto(status) {
  return status === 'abertas' ? 'Abertas' : 'Em breve';
}

function Eventos() {
  const navigate = useNavigate();
  const [eventos,    setEventos]    = useState([]);
  const [filtro,     setFiltro]     = useState('todos');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    obterEventos()
      .then(setEventos)
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, []);

  const listaFiltrada = filtro === 'todos'
    ? eventos
    : eventos.filter(ev => statusEvento(ev) === filtro);

  return (
    <div className="app-container">
      <div className="app-header">
        <span className="app-header-title">STM — Eventos</span>
        <div className="app-header-icons">
          <span>🔔</span>
        </div>
      </div>

      <div className="app-content">
        {/* Filtros */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto' }}>
          {FILTROS.map(f => (
            <button
              key={f.key}
              onClick={() => setFiltro(f.key)}
              style={{
                padding: '5px 13px',
                borderRadius: '20px',
                border: '0.5px solid',
                fontSize: '12px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontWeight: filtro === f.key ? 500 : 400,
                background: filtro === f.key ? 'var(--color-primary)' : 'transparent',
                color: filtro === f.key ? '#fff' : 'var(--color-text-secondary)',
                borderColor: filtro === f.key ? 'var(--color-primary)' : 'var(--color-border)',
                transition: 'all 0.15s',
                fontFamily: 'var(--font-sans)',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Lista */}
        {carregando ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-secondary)' }}>
            Carregando eventos...
          </div>
        ) : listaFiltrada.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
            <p style={{ fontSize: '14px' }}>Nenhum evento encontrado neste filtro.</p>
          </div>
        ) : (
          listaFiltrada.map(evento => {
            const status = statusEvento(evento);
            return (
              <div
                key={evento.id}
                className="card"
                onClick={() => navigate(`/eventos/${evento.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-header">
                  <div>
                    <div className="card-title">{evento.titulo}</div>
                    <div className="card-subtitle">{evento.tipo}</div>
                  </div>
                  <span className={pillClasse(status)}>{pillTexto(status)}</span>
                </div>
                <div className="card-meta">
                  <span>📅 {evento.data ? new Date(evento.data).toLocaleDateString('pt-BR') : '—'}</span>
                  {evento.horarioInicio && <span>🕐 {evento.horarioInicio}</span>}
                  {evento.inscritos && <span>👥 {evento.inscritos.length}/{evento.capacidade || '—'}</span>}
                </div>
                {(evento.local || evento.cargaHoraria) && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                    {[evento.local, evento.cargaHoraria ? `${evento.cargaHoraria}h` : null].filter(Boolean).join(' · ')}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="app-bottom-nav">
        <button className="nav-item" onClick={() => navigate('/')}>
          <span>🏠</span>Início
        </button>
        <button className="nav-item active" onClick={() => navigate('/eventos')}>
          <span>📅</span>Eventos
        </button>
        <button className="nav-item" onClick={() => navigate('/meus-cursos')}>
          <span>📚</span>Meus cursos
        </button>
        <button className="nav-item" onClick={() => navigate('/perfil')}>
          <span>👤</span>Perfil
        </button>
      </div>
    </div>
  );
}

export default Eventos;
