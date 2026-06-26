import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obterEventosDoUsuario, obterFrequenciaDoUsuario } from '../services/firestore';
import { auth } from '../services/firebase';
import '../styles/App.css';

function Frequencia() {
  const navigate = useNavigate();
  const [aba, setAba] = useState('frequencia');
  const [eventosInscritos, setEventosInscritos] = useState([]);
  const [frequencias, setFrequencias] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) { setCarregando(false); return; }

    Promise.all([
      obterEventosDoUsuario(uid),
      obterFrequenciaDoUsuario(uid),
    ])
      .then(([evts, freqs]) => {
        setEventosInscritos(evts);
        setFrequencias(freqs);
      })
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, []);

  // Eventos de hoje ou futuros onde está inscrito
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const eventosAtivos = eventosInscritos.filter(ev => {
    if (!ev.data) return true;
    const dataEv = new Date(ev.data + 'T12:00:00');
    return dataEv >= hoje;
  });

  // Verifica se já confirmou presença em um evento
  const jaConfirmou = (eventoId) =>
    frequencias.some(f => f.eventoId === eventoId);

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

            {carregando ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-secondary)' }}>
                Carregando eventos...
              </div>
            ) : eventosAtivos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-secondary)', fontSize: '13px' }}>
                Você não está inscrito em nenhum evento ativo.
              </div>
            ) : (
              eventosAtivos.map(ev => (
                <div key={ev.id} className="card" style={{ marginBottom: '10px' }}>
                  <div style={{ marginBottom: '8px' }}>
                    <div className="card-title">{ev.titulo}</div>
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '3px' }}>
                      {ev.horarioInicio && `🕐 ${ev.horarioInicio}`}
                      {ev.horarioFim && ` – ${ev.horarioFim}`}
                      {ev.local && ` · 📍 ${ev.local}`}
                    </div>
                  </div>

                  {jaConfirmou(ev.id) ? (
                    <span className="pill pill-success">✓ Presença confirmada</span>
                  ) : (
                    <button
                      className="btn btn-primary"
                      style={{ marginTop: '4px' }}
                      onClick={() => navigate('/camera-qr')}
                    >
                      📷 Confirmar presença — escanear QR Code
                    </button>
                  )}
                </div>
              ))
            )}

            <div className="divider" />
            <div className="section-title" style={{ marginBottom: '12px' }}>Minha frequência</div>

            {frequencias.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '16px', color: 'var(--color-text-secondary)', fontSize: '13px' }}>
                Nenhuma presença confirmada ainda.
              </div>
            ) : (
              frequencias.map((f, i) => {
                const ev = eventosInscritos.find(e => e.id === f.eventoId);
                const dataHora = f.dataHora?.seconds
                  ? new Date(f.dataHora.seconds * 1000).toLocaleDateString('pt-BR')
                  : '—';
                return (
                  <div key={f.id ?? i} className="card" style={{ cursor: 'default', marginBottom: '10px' }}>
                    <div className="card-header">
                      <div>
                        <div className="card-title" style={{ fontSize: '13px' }}>
                          {ev?.titulo || 'Evento'}
                        </div>
                        <div className="card-sub">{dataHora}</div>
                      </div>
                      <span className="pill pill-success">✓ Presente</span>
                    </div>
                  </div>
                );
              })
            )}
          </>
        )}

        {aba === 'avaliacao' && (
          <>
            <div className="alert alert-warning">
              🔗 A avaliação de reação é liberada via QR Code apresentado ao final do evento.
            </div>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/camera-qr')}
            >
              📷 Escanear QR Code de avaliação
            </button>
            <div className="divider" />
            <div className="section-title" style={{ marginBottom: '12px' }}>Avaliações realizadas</div>

            {frequencias.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '16px', color: 'var(--color-text-secondary)', fontSize: '13px' }}>
                Nenhuma avaliação realizada ainda.
              </div>
            ) : (
              frequencias.map((f, i) => {
                const ev = eventosInscritos.find(e => e.id === f.eventoId);
                return (
                  <div key={f.id ?? i} className="card" style={{ cursor: 'default', marginBottom: '10px' }}>
                    <div className="card-header">
                      <div>
                        <div className="card-title" style={{ fontSize: '13px' }}>
                          {ev?.titulo || 'Evento'}
                        </div>
                      </div>
                      <span className="pill pill-info">Pendente</span>
                    </div>
                  </div>
                );
              })
            )}
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