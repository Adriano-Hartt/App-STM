import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { obterDetalhesEvento } from '../services/firestore';
import '../styles/App.css';

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

  if (carregando) {
    return (
      <div className="app-container">
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
          Carregando evento...
        </div>
      </div>
    );
  }

  if (!evento) {
    return (
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
  }

  // Suporte a múltiplos dias — se não tiver array, usa a data única
  const dias = evento.dias && evento.dias.length > 0 ? evento.dias : [evento.data];

  // QR de avaliação — único por evento
  const payloadAvaliacao = JSON.stringify({
    eventoId: evento.id,
    tipo: 'avaliacao',
    titulo: evento.titulo,
    formsUrl: evento.formsUrl || '',
  });

  return (
    <div className="app-container">
      <div className="tbar">
        <button className="back-btn" onClick={() => navigate('/admin')}>←</button>
        <h3>QR Codes do Evento</h3>
      </div>

      <div className="app-content">
        <div className="alert alert-info" style={{ fontSize: '12px', marginBottom: '16px' }}>
          💡 Imprima um QR de Frequência para cada dia e coloque na entrada. O QR de Avaliação é único, exibido ao final.
        </div>

        {/* QR de Frequência — um por dia */}
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
                📋 QR FREQUÊNCIA — Dia {index + 1}{dias.length > 1 ? ` de ${dias.length}` : ''}
              </div>
              <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '10px' }}>
                {dataFormatada}
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                <QRCodeSVG value={payloadFrequencia} size={200} level="H" includeMargin={true} style={{ border: '2px solid #1B3A6B', borderRadius: '8px' }} />
              </div>
              <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '4px' }}>{evento.titulo}</div>
              <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Lista de Frequência · Dia {index + 1}</div>
            </div>
          );
        })}

        {/* QR de Avaliação — único */}
        <div className="card" style={{ cursor: 'default', textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ background: '#3C3489', color: 'white', padding: '8px 12px', borderRadius: '8px 8px 0 0', margin: '-12px -14px 12px', fontSize: '12px', fontWeight: '500' }}>
            ⭐ QR AVALIAÇÃO — único
          </div>
          <p style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '10px' }}>
            Exibir no telão ao final do último dia
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
            <QRCodeSVG value={payloadAvaliacao} size={200} level="H" includeMargin={true} style={{ border: '2px solid #3C3489', borderRadius: '8px' }} />
          </div>
          <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '4px' }}>{evento.titulo}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>Formulário de Avaliação</div>
        </div>

        <button className="btn btn-primary" onClick={imprimir}>🖨️ Imprimir QR Codes</button>
        <button className="btn btn-secondary" onClick={() => navigate('/admin')}>Voltar ao painel</button>
      </div>
    </div>
  );
}

export default GerarQRCode;