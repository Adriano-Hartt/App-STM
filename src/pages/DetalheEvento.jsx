import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obterDetalhesEvento, inscreverEmEvento } from '../services/firestore';
import { auth } from '../services/firebase';
import '../styles/App.css';

function DetalheEvento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [inscrevendo, setInscrevendo] = useState(false);

  useEffect(() => {
    const carregar = async () => {
      try {
        const data = await obterDetalhesEvento(id);
        setEvento(data);
      } catch (error) {
        console.error('Erro:', error);
      } finally {
        setCarregando(false);
      }
    };
    carregar();
  }, [id]);

  const handleInscrever = async () => {
    setInscrevendo(true);
    try {
      await inscreverEmEvento(auth.currentUser.uid, id);
      navigate('/');
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setInscrevendo(false);
    }
  };

  if (carregando) return <div className="splash-loading">Carregando...</div>;
  if (!evento) return <div className="splash-loading">Evento não encontrado</div>;

  return (
    <div className="app-container">
      <div className="top-bar">
        <button className="back-btn" onClick={() => navigate('/eventos')}>←</button>
        <h3>Detalhes do evento</h3>
      </div>

      <div className="app-content">
        <div style={{ marginBottom: '16px' }}>
          <span className="pill pill-success" style={{ marginBottom: '10px', display: 'inline-block' }}>
            Inscrições abertas
          </span>
          <h2 style={{ color: 'var(--color-text-primary)', lineHeight: 1.4, marginBottom: '8px' }}>
            {evento.titulo}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
            {evento.descricao}
          </p>
        </div>

        <div className="card" style={{ cursor: 'default', marginBottom: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
            <div>
              <span style={{ color: 'var(--color-text-secondary)', display: 'block', fontSize: '11px', marginBottom: '3px' }}>
                📅 Data
              </span>
              {new Date(evento.data).toLocaleDateString('pt-BR')}
            </div>
            <div>
              <span style={{ color: 'var(--color-text-secondary)', display: 'block', fontSize: '11px', marginBottom: '3px' }}>
                🕐 Horário
              </span>
              {evento.horarioInicio} – {evento.horarioFim}
            </div>
            <div>
              <span style={{ color: 'var(--color-text-secondary)', display: 'block', fontSize: '11px', marginBottom: '3px' }}>
                📍 Local
              </span>
              {evento.local}
            </div>
            <div>
              <span style={{ color: 'var(--color-text-secondary)', display: 'block', fontSize: '11px', marginBottom: '3px' }}>
                ⏱️ Carga horária
              </span>
              {evento.cargaHoraria} horas
            </div>
          </div>
        </div>

        <div className="alert alert-info">
          A confirmação de presença será feita no dia do evento via QR Code. Chegue com antecedência.
        </div>

        <button
          className="btn btn-primary"
          onClick={handleInscrever}
          disabled={inscrevendo}
        >
          {inscrevendo ? 'Inscrevendo...' : 'Inscrever-se neste evento'}
        </button>
        <button className="btn btn-secondary" onClick={() => navigate('/eventos')}>
          Voltar para eventos
        </button>
      </div>
    </div>
  );
}

export default DetalheEvento;
