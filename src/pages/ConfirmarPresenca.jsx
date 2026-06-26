import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { registrarFrequencia } from '../services/firestore';
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import '../styles/App.css';

function ConfirmarPresenca() {
  const navigate = useNavigate();
  const location = useLocation();

  // Dados vindos do QR Code escaneado
  const qr = location.state || {};
  const eventoId     = qr.eventoId || null;
  const eventoTitulo = qr.eventoTitulo || 'Evento';
  const diaIndex     = qr.diaIndex ?? 0;
  const totalDias    = qr.totalDias ?? 1;

  const [confirmando, setConfirmando] = useState(false);
  const [erro, setErro] = useState('');
  const [dados, setDados] = useState(null);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const userRef = doc(db, 'usuarios', auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) setDados(userSnap.data());
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    carregarDados();
  }, []);

  const handleConfirmar = async () => {
    if (!eventoId) {
      setErro('Nenhum evento identificado. Escaneie o QR Code novamente.');
      return;
    }
    setConfirmando(true);
    setErro('');
    try {
      await registrarFrequencia(auth.currentUser.uid, eventoId, {
        nome: dados?.nome,
        matricula: dados?.matricula,
        lotacao: dados?.lotacao,
        email: dados?.email,
        ligacaoJMU: dados?.ligacaoJMU,
        evento: eventoTitulo,
        diaIndex,
        totalDias,
        qrCodeData: `${eventoId}-dia${diaIndex}`,
      });
      navigate('/presenca-ok');
    } catch (error) {
      console.error('Erro ao confirmar presença:', error);
      setErro('Erro ao confirmar presença. Tente novamente.');
    } finally {
      setConfirmando(false);
    }
  };

  // Se chegou aqui sem escanear QR
  if (!eventoId) {
    return (
      <div className="app-container">
        <div className="tbar">
          <button className="back-btn" onClick={() => navigate('/frequencia')}>←</button>
          <h3>Confirmar presença</h3>
        </div>
        <div className="app-content">
          <div className="alert alert-danger">
            Nenhum QR Code foi escaneado. Volte e use a câmera para ler o código do evento.
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/camera-qr')}>
            📷 Escanear QR Code
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/frequencia')}>
            Voltar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="tbar">
        <button className="back-btn" onClick={() => navigate('/frequencia')}>←</button>
        <h3>Confirmar presença</h3>
      </div>

      <div className="app-content">
        <div className="alert alert-success">✓ QR Code lido com sucesso!</div>

        <div className="card" style={{ cursor: 'default', marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '10px' }}>
            Seus dados para registro
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Nome</span>
              <span>{dados?.nome || '—'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Matrícula</span>
              <span>{dados?.matricula || '—'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Lotação</span>
              <span>{dados?.lotacao || '—'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Evento</span>
              <span style={{ textAlign: 'right', maxWidth: '60%' }}>{eventoTitulo}</span>
            </div>
            {totalDias > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Dia</span>
                <span>{diaIndex + 1} de {totalDias}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--color-text-secondary)' }}>Data/hora</span>
              <span>{new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>

        {erro && <div className="alert alert-danger">{erro}</div>}

        <div className="alert alert-info">
          Ao confirmar, sua presença é registrada no app e na planilha de frequência.
        </div>

        <button className="btn btn-primary" onClick={handleConfirmar} disabled={confirmando}>
          {confirmando ? 'Confirmando...' : 'Confirmar presença'}
        </button>
        <button className="btn btn-secondary" onClick={() => navigate('/frequencia')}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default ConfirmarPresenca;