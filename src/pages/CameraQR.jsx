import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import '../styles/App.css';

function CameraQR() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const modo = searchParams.get('modo') || 'frequencia';

  const [erro, setErro] = useState('');
  const [iniciando, setIniciando] = useState(true);
  const scannerRef = useRef(null);
  const jaLeuRef = useRef(false);
  const divId = 'qr-reader';

  useEffect(() => {
    const html5QrCode = new Html5Qrcode(divId);
    scannerRef.current = html5QrCode;

    html5QrCode.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
      (decodedText) => {
        if (jaLeuRef.current) return;
        jaLeuRef.current = true;
        processarQRCode(decodedText);
      },
      () => {}
    )
      .then(() => setIniciando(false))
      .catch(() => {
        setErro('Não foi possível acessar a câmera. Verifique as permissões do navegador.');
        setIniciando(false);
      });

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {});
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pararCamera = async () => {
    if (scannerRef.current) {
      try { await scannerRef.current.stop(); } catch (e) {}
    }
  };

  const processarQRCode = async (texto) => {
    await pararCamera();
    try {
      const dados = JSON.parse(texto);
      if (!dados.eventoId || !dados.tipo) {
        setErro('QR Code inválido. Este código não pertence ao STM App.');
        jaLeuRef.current = false;
        return;
      }

      if (dados.tipo === 'frequencia') {
        navigate('/confirmar-presenca', {
          state: {
            eventoId: dados.eventoId,
            eventoTitulo: dados.titulo,
            eventoData: dados.data,
            diaIndex: dados.diaIndex ?? 0,
            totalDias: dados.totalDias ?? 1,
          },
        });
      } else if (dados.tipo === 'avaliacao') {
        navigate('/avaliacao', {
          state: {
            eventoId: dados.eventoId,
            eventoTitulo: dados.titulo,
            formsUrl: dados.formsUrl,
          },
        });
      } else {
        setErro('Tipo de QR Code desconhecido.');
        jaLeuRef.current = false;
      }
    } catch (e) {
      setErro('QR Code não reconhecido. Use o código gerado pelo STM App.');
      jaLeuRef.current = false;
    }
  };

  const tentarNovamente = () => {
    setErro('');
    setIniciando(true);
    jaLeuRef.current = false;
    const html5QrCode = new Html5Qrcode(divId);
    scannerRef.current = html5QrCode;
    html5QrCode.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
      (decodedText) => {
        if (jaLeuRef.current) return;
        jaLeuRef.current = true;
        processarQRCode(decodedText);
      },
      () => {}
    )
      .then(() => setIniciando(false))
      .catch(() => {
        setErro('Não foi possível acessar a câmera.');
        setIniciando(false);
      });
  };

  const sair = async () => {
    await pararCamera();
    navigate('/frequencia');
  };

  return (
    <div className="app-container">
      <div className="tbar">
        <button className="back-btn" onClick={sair}>←</button>
        <h3>{modo === 'avaliacao' ? 'QR Code de Avaliação' : 'Confirmar Presença'}</h3>
      </div>

      <div className="app-content">
        {erro ? (
          <div style={{ textAlign: 'center', paddingTop: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <div className="alert alert-danger" style={{ textAlign: 'left' }}>{erro}</div>
            <button className="btn btn-primary" onClick={tentarNovamente}>Tentar novamente</button>
            <button className="btn btn-secondary" onClick={sair}>Voltar</button>
          </div>
        ) : (
          <>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '14px', textAlign: 'center' }}>
              {iniciando
                ? 'Iniciando câmera...'
                : modo === 'avaliacao'
                ? 'Aponte para o QR Code exibido ao final do evento.'
                : 'Aponte para o QR Code do dia do evento.'}
            </p>
            <div id={divId} style={{ borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', minHeight: '300px', background: '#111' }} />
            {!iniciando && (
              <div className="alert alert-info" style={{ fontSize: '12px' }}>
                📷 Câmera ativa. Mantenha o QR Code centralizado.
              </div>
            )}
            <button className="btn btn-secondary" onClick={sair}>Cancelar</button>
          </>
        )}
      </div>
    </div>
  );
}

export default CameraQR;