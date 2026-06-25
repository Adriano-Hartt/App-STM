import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { obterDetalhesEvento } from '../services/firestore';
import '../styles/App.css';

// ──────────────────────────────────────────────────────────────────
// Página usada pelo ADMIN para gerar e imprimir QR Codes de evento.
// Os QR Codes ficam na entrada do auditório (frequência) ou são 
// exibidos no telão ao final (avaliação).
// ──────────────────────────────────────────────────────────────────

function GerarQRCode() {
  const navigate = useNavigate();

  const { eventoId } = useParams();
  const [evento, setEvento] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    obterDetalhesEvento(eventoId)
      .then(setEvento)
      .catch(console.error)
      .finally(() => setCarregando(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const imprimir = () => window.print();

  if (carregando) return (
    <div className="app-container">
      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
        Carregando evento...
      </div>
    </div>
  );

  if (!evento) return (
    <div className="app-container">
      <div className="tbar">
        <button className="back-btn" onClick={() => navigate('/admin')}>←</button>
        <h3>QR Codes do Evento</h3>
      </div>
      <div className="app-content">
        <div className="alert alert-danger">Evento não encontrado.</div>
        <button className="btn btn-secondary" onClick={() => navigate('/admin')}>Voltar</button>
      </div>
    </div>
  );

  const dias = evento.dias && evento.dias.length > 0 ? evento.dias : [evento.data];

  const payloadAvaliacao = JSON.stringify({
    eventoId: evento.id,
    tipo: 'avaliacao',
    titulo: evento.titulo,
    formsUrl: evento.formsUrl || '',
  });
  return (
    <div className="app-container">
      <div className="top-bar">
        <button className="back-btn" onClick={() => navigate('/admin')}>←</button>
        <h3>QR Codes do Evento</h3>
      </div>

      <div className="app-content">
        <div className="alert alert-info" style={{ fontSize: '12px', marginBottom: '20px' }}>
          💡 Imprima esta página e coloque o <strong>QR de Frequência</strong> na entrada do
          auditório. Exiba o <strong>QR de Avaliação</strong> no telão ao final do evento.
        </div>

        {/* ── QR Codes de Frequência — um por dia ── */}
        {dias.map((dia, index) => {
          const payloadFrequencia = JSON.stringify({
            eventoId: evento.id,
            tipo: 'frequencia',
            titulo: evento.titulo,
            data: dia,
            diaIndex: index,
            totalDias: dias.length,
          });
          const dataFormatada = dia
            ? new Date(dia + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })
            : '—';
          return (
            <div key={dia + index} className="card" style={{ cursor: 'default', textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ background: '#1B3A6B', color: 'white', padding: '8px 12px', borderRadius: '8px 8px 0 0', margin: '-12px -14px 12px', fontSize: '12px', fontWeight: '500' }}>
                📋 QR Code de FREQUÊNCIA — Dia {index + 1}{dias.length > 1 ? ` de ${dias.length}` : ''}
              </div>
              <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '10px' }}>{dataFormatada}</p>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                <QRCodeSVG value={payloadFrequencia} size={200} level="H" includeMargin={true} style={{ border: '2px solid #1B3A6B', borderRadius: '8px' }} />
              </div>
              <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '4px' }}>{evento.titulo}</div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Lista de Frequência · Dia {index + 1}</div>
            </div>
          );
        })}
        {/* ── QR Code de Avaliação ── */}
        <div
          className="card"
          style={{ cursor: 'default', textAlign: 'center', marginBottom: '20px' }}
        >
          <div
            style={{
              background: '#3C3489',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '8px 8px 0 0',
              margin: '-14px -16px 16px',
              fontSize: '13px',
              fontWeight: '500',
            }}
          >
            ⭐ QR Code de AVALIAÇÃO
          </div>
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
            Exibir no telão ao final do evento
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <QRCodeSVG
              value={payloadAvaliacao}
              size={220}
              level="H"
              includeMargin={true}
              style={{ border: '2px solid #3C3489', borderRadius: '8px' }}
            />
          </div>
          <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '4px' }}>
            {evento.titulo}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
            Formulário de Avaliação de Reação
          </div>
        </div>

        {/* Dados técnicos (útil para debug) */}
        <details style={{ marginBottom: '16px' }}>
          <summary style={{ fontSize: '12px', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
            Ver dados codificados nos QR Codes
          </summary>
          <div style={{
            background: 'var(--color-background-secondary)',
            borderRadius: '8px',
            padding: '10px',
            marginTop: '8px',
            fontSize: '11px',
            fontFamily: 'monospace',
            wordBreak: 'break-all',
          }}>
            <div><strong>Frequência:</strong></div>
            <div style={{ color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
              {payloadFrequencia}
            </div>
            <div><strong>Avaliação:</strong></div>
            <div style={{ color: 'var(--color-text-secondary)' }}>
              {payloadAvaliacao}
            </div>
          </div>
        </details>

        <button className="btn btn-primary" onClick={imprimir}>
          🖨️ Imprimir QR Codes
        </button>
        <button className="btn btn-secondary" onClick={() => navigate('/admin')}>
          Voltar ao painel
        </button>
      </div>
    </div>
  );
}

export default GerarQRCode;
