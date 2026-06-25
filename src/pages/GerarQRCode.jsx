import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import '../styles/App.css';

// ──────────────────────────────────────────────────────────────────
// Página usada pelo ADMIN para gerar e imprimir QR Codes de evento.
// Os QR Codes ficam na entrada do auditório (frequência) ou são 
// exibidos no telão ao final (avaliação).
// ──────────────────────────────────────────────────────────────────

function GerarQRCode() {
  const navigate = useNavigate();

  // Exemplo: em produção estes dados vêm de props/params/Firestore
  const [evento] = useState({
    id: 'evento-abc-123',
    titulo: 'Gestão de Pessoas no Setor Público',
    data: '2025-06-15',
    formsUrl: 'https://docs.google.com/forms/d/SEU_FORM_ID/viewform',
  });

  // Payload que será codificado dentro do QR Code
  const payloadFrequencia = JSON.stringify({
    eventoId: evento.id,
    tipo: 'frequencia',
    titulo: evento.titulo,
    data: evento.data,
  });

  const payloadAvaliacao = JSON.stringify({
    eventoId: evento.id,
    tipo: 'avaliacao',
    titulo: evento.titulo,
    formsUrl: evento.formsUrl,
  });

  const imprimir = () => window.print();

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

        {/* ── QR Code de Frequência ── */}
        <div
          className="card"
          style={{ cursor: 'default', textAlign: 'center', marginBottom: '20px' }}
        >
          <div
            style={{
              background: '#1B3A6B',
              color: 'white',
              padding: '8px 12px',
              borderRadius: '8px 8px 0 0',
              margin: '-14px -16px 16px',
              fontSize: '13px',
              fontWeight: '500',
            }}
          >
            📋 QR Code de FREQUÊNCIA
          </div>
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
            Colocar na entrada do auditório
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
            <QRCodeSVG
              value={payloadFrequencia}
              size={220}
              level="H"
              includeMargin={true}
              style={{ border: '2px solid #1B3A6B', borderRadius: '8px' }}
            />
          </div>
          <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
            {evento.titulo}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            {new Date(evento.data).toLocaleDateString('pt-BR')} · Lista de Frequência
          </div>
        </div>

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
          <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>
            {evento.titulo}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            {new Date(evento.data).toLocaleDateString('pt-BR')} · Formulário de Avaliação
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
