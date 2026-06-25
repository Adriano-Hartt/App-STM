import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obterEventosDoUsuario, obterFrequenciaDoUsuario } from '../services/firestore';
import { auth } from '../services/firebase';
import '../styles/App.css';

const FILTROS = [
  { key: 'todos',    label: 'Todos' },
  { key: 'inscrito', label: 'Inscritos' },
  { key: 'presente', label: 'Com presença' },
];

function getIniciais(titulo = '') {
  return titulo
    .split(' ')
    .filter(w => w.length > 2)
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase() || '??';
}

function MeusCursos() {
  const navigate = useNavigate();
  const [eventos,     setEventos]     = useState([]);
  const [frequencias, setFrequencias] = useState([]);
  const [filtro,      setFiltro]      = useState('todos');
  const [carregando,  setCarregando]  = useState(true);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    Promise.all([
      obterEventosDoUsuario(uid),
      obterFrequenciaDoUsuario(uid),
    ])
      .then(([evts, freqs]) => {
        setEventos(evts);
        setFrequencias(freqs);
      })
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, []);

  // Enriquecer com status
  const lista = eventos.map(ev => ({
    ...ev,
    status: frequencias.some(f => f.eventoId === ev.id) ? 'presente' : 'inscrito',
  }));

  const listaFiltrada = filtro === 'todos'
    ? lista
    : lista.filter(e => e.status === filtro);

  const total     = lista.length;
  const presentes = lista.filter(e => e.status === 'presente').length;
  const horas     = lista.reduce((acc, e) => acc + (Number(e.cargaHoraria) || 0), 0);

  return (
    <div className="app-container">
      <div className="app-header">
        <span className="app-header-title">Meus Cursos</span>
        <span style={{ cursor: 'pointer' }} onClick={() => navigate('/perfil')}>👤</span>
      </div>

      <div className="app-content">

        {/* Banner */}
        <div className="meus-cursos-header">
          <h2>Minha Trilha</h2>
          <p>Cursos e eventos nos quais você está inscrito</p>
        </div>

        {/* Estatísticas */}
        <div className="meus-cursos-stats">
          <div className="stat-mini">
            <div className="stat-mini-value">{total}</div>
            <div className="stat-mini-label">Inscrições</div>
          </div>
          <div className="stat-mini">
            <div className="stat-mini-value">{presentes}</div>
            <div className="stat-mini-label">Presenças confirmadas</div>
          </div>
          <div className="stat-mini">
            <div className="stat-mini-value">{horas}h</div>
            <div className="stat-mini-label">Carga horária total</div>
          </div>
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
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
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
            Carregando seus cursos...
          </div>
        ) : listaFiltrada.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
              {filtro === 'todos'
                ? 'Você ainda não está inscrito em nenhum evento.'
                : 'Nenhum evento neste filtro.'}
            </p>
            {filtro === 'todos' && (
              <button
                className="btn btn-primary"
                style={{ marginTop: '16px' }}
                onClick={() => navigate('/eventos')}
              >
                Ver eventos disponíveis
              </button>
            )}
          </div>
        ) : (
          listaFiltrada.map(ev => {
            const isPresente = ev.status === 'presente';
            const data = ev.data
              ? new Date(ev.data).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
              : '—';

            return (
              <div
                key={ev.id}
                className="curso-card"
                onClick={() => navigate(`/eventos/${ev.id}`)}
              >
                <div className="curso-card-top">
                  {/* Ícone de iniciais */}
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    background: 'var(--color-primary-light)',
                    color: 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '13px',
                    flexShrink: 0,
                    marginRight: '10px',
                  }}>
                    {getIniciais(ev.titulo)}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="curso-card-title">{ev.titulo}</div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                      {ev.tipo}
                    </div>
                  </div>

                  <span
                    className="pill"
                    style={{
                      flexShrink: 0,
                      background: isPresente ? '#EAF3DE' : '#E6F1FB',
                      color: isPresente ? '#27500A' : '#0C447C',
                    }}
                  >
                    {isPresente ? 'Presente' : 'Inscrito'}
                  </span>
                </div>

                <div className="curso-card-meta">
                  <span>📅 {data}</span>
                  {ev.horarioInicio && <span>🕐 {ev.horarioInicio}</span>}
                  {ev.local         && <span>📍 {ev.local}</span>}
                  {ev.cargaHoraria  && <span>⏱ {ev.cargaHoraria}h</span>}
                </div>

                {/* Barra de progresso */}
                <div className="curso-card-progress">
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '10px',
                    color: 'var(--color-text-tertiary)',
                    marginBottom: '3px',
                  }}>
                    <span>Progresso</span>
                    <span>{isPresente ? '100%' : '50%'}</span>
                  </div>
                  <div className="curso-card-progress-bar">
                    <div
                      className="curso-card-progress-fill"
                      style={{
                        width: isPresente ? '100%' : '50%',
                        background: isPresente ? '#3B6D11' : 'var(--color-primary)',
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="app-bottom-nav">
        <button className="nav-item" onClick={() => navigate('/')}>
          <span>🏠</span>Início
        </button>
        <button className="nav-item" onClick={() => navigate('/eventos')}>
          <span>📅</span>Eventos
        </button>
        <button className="nav-item active">
          <span>📚</span>Meus cursos
        </button>
        <button className="nav-item" onClick={() => navigate('/perfil')}>
          <span>👤</span>Perfil
        </button>
      </div>
    </div>
  );
}

export default MeusCursos;
