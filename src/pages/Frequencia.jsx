import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obterEventosDoUsuario, obterFrequenciaDoUsuario } from '../services/firestore';
import { auth } from '../services/firebase';
import '../styles/App.css';

function Frequencia() {
  const navigate = useNavigate();
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const freqDoEvento = (eventoId) => frequencias.find(f => f.eventoId === eventoId);

  return (
    <div className="app-container">
      <div className="app-header">
        <span className="app-header-title">STM — Frequência</span>
      </div>

      <div className="app-content">
        {/* Botão grande e direto no topo */}
        <button
          className="btn btn-primary"
          style={{ marginBottom: '20px', fontSize: '15px', padding: '14px' }}
          onClick={() => navigate('/camera-qr')}
        >
          📷 Escanear QR Code e confirmar presença
        </button>

        <div className="section-title" style={{ marginBottom: '12px' }}>
          Meus eventos inscritos
        </div>

        {carregando ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-secondary)' }}>
            Carregando...
          </div>
        ) : eventosInscritos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-secondary)', fontSize: '13px' }}>
            Você ainda não está inscrito em nenhum evento.
            <br />
            <button
              className="btn btn-secondary"
              style={{ marginTop: '12px' }}
              onClick={() => navigate('/eventos')}
            >
              Ver eventos disponíveis
            </button>
          </div>
        ) : (
          eventosInscritos.map(ev => {
            const freq = freqDoEvento(ev.id);
            const totalDias = ev.totalDias || 1;
            const presentes = freq?.diasPresentes || 0;
            const pct = totalDias > 0 ? Math.round((presentes / totalDias) * 100) : 0;
            const aprovado = pct >= 80;

            return (
              <div key={ev.id} className="card" style={{ marginBottom: '10px' }}>
                <div style={{ marginBottom: '8px' }}>
                  <div className="card-title">{ev.titulo}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '3px' }}>
                    {ev.horarioInicio && `🕐 ${ev.horarioInicio}`}
                    {ev.local && ` · 📍 ${ev.local}`}
                    {totalDias > 1 && ` · 📅 ${totalDias} dias`}
                  </div>
                </div>

                {freq ? (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '5px' }}>
                      <span style={{ color: 'var(--color-text-secondary)' }}>
                        Presença: {presentes}/{totalDias} dia(s)
                      </span>
                      <span style={{ color: aprovado ? 'var(--color-success)' : 'var(--color-text-secondary)', fontWeight: 500 }}>
                        {pct}%
                      </span>
                    </div>
                    <div className="progress-bar-track">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${pct}%`, background: aprovado ? 'var(--color-success)' : 'var(--color-primary)' }}
                      />
                    </div>
                    {totalDias > 1 && (
                      <button
                        className="btn btn-secondary"
                        style={{ marginTop: '10px' }}
                        onClick={() => navigate('/camera-qr')}
                      >
                        📷 Registrar presença de outro dia
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: '4px' }}
                    onClick={() => navigate('/camera-qr')}
                  >
                    📷 Confirmar presença
                  </button>
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