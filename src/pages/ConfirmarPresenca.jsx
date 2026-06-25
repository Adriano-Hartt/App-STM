import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registrarFrequencia } from '../services/firestore';
import { auth, db } from '../services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import '../styles/App.css';

function ConfirmarPresenca() {
  const navigate = useNavigate();
  const [confirmando, setConfirmando] = useState(false);
  const [dados, setDados] = useState(null);

  React.useEffect(() => {
    const carregarDados = async () => {
      try {
        const userRef = doc(db, 'usuarios', auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setDados(userSnap.data());
        }
      } catch (error) {
        console.error('Erro:', error);
      }
    };
    carregarDados();
  }, []);

  const handleConfirmar = async () => {
    setConfirmando(true);
    try {
      await registrarFrequencia(auth.currentUser.uid, 'evento-id', {
        nome: dados?.nome,
        matricula: dados?.matricula,
        lotacao: dados?.lotacao,
        evento: 'Gestão de Pessoas',
        qrCodeData: 'qr-data'
      });
      navigate('/presenca-ok');
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setConfirmando(false);
    }
  };

  return (
    <div className="app-container">
      <div className="top-bar">
        <button className="back-btn" onClick={() => navigate('/camera-qr')}>←</button>
        <h3>Confirmar presença</h3>
      </div>

      <div className="app-content">
        <div className="alert alert-success">
          ✓ QR Code lido com sucesso!
        </div>

        <div className="card" style={{ cursor: 'default', marginBottom: '16px' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '10px' }}>
            Seus dados para registro
          </div>
          {dados && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Nome</span>
                <span>{dados.nome}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Matrícula</span>
                <span>{dados.matricula || '-'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Lotação</span>
                <span>{dados.lotacao}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Evento</span>
                <span>Gestão de Pessoas</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>Data/hora</span>
                <span>{new Date().toLocaleString('pt-BR')}</span>
              </div>
            </div>
          )}
        </div>

        <div className="alert alert-info">
          Ao confirmar, seus dados serão registrados automaticamente na planilha de frequência do Google Sheets.
        </div>

        <button
          className="btn btn-primary"
          onClick={handleConfirmar}
          disabled={confirmando}
        >
          {confirmando ? 'Confirmando...' : 'Confirmar presença'}
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => navigate('/frequencia')}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default ConfirmarPresenca;
