import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import '../styles/App.css';

function CameraQR() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const modo = searchParams.get('modo') || 'frequencia'; // 'frequencia' ou 'avaliacao'

  const [erro, setErro] = useState('');
  const [iniciando, setIniciando] = useState(true);
  const scannerRef = useRef(null);
  const divId = 'qr-reader';

  useEffect(() => {
    let html5QrCode = null;

    const iniciarScanner = async () => {
      try {
        html5QrCode = new Html5Qrcode(divId);
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: 'environment' }, // câmera traseira
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
          },
          (decodedText) => {
            // QR Code lido com sucesso!
            processarQRCode(decodedText);
          },
          (errorMessage) => {
            // Ignorar erros de leitura (câmera buscando o código)
          }
        );

        setIniciando(false);
      } catch (err) {
        setErro(
          'Não foi possível acessar a câmera. Verifique as permissões do navegador.'
        );
        setIniciando(false);
      }
    };

    iniciarScanner();

    // Cleanup: parar câmera ao sair da tela
    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .catch(() => {});
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const processarQRCode = (texto) => {
    // Parar câmera antes de navegar
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {});
    }

    try {
      // O QR Code deve conter um JSON com dados do evento
      // Formato esperado: {"eventoId":"abc123","tipo":"frequencia","titulo":"Gestão de Pessoas","data":"2025-06-15"}
      const dados = JSON.parse(texto);

      if (!dados.eventoId || !dados.tipo) {
        setErro('QR Code inválido. Este código não pertence ao STM App.');
        return;
      }

      if (dados.tipo === 'frequencia') {
        // Vai para tela de confirmar presença passando os dados do evento
        navigate('/confirmar-presenca', {
          state: {
            eventoId: dados.eventoId,
            eventoTitulo: dados.titulo,
            eventoData: dados.data,
          },
        });
      } else if (dados.tipo === 'avaliacao') {
        // Vai para tela de avaliação (abre Google Forms)
        navigate('/avaliacao', {
          state: {
            eventoId: dados.eventoId,
            eventoTitulo: dados.titulo,
            formsUrl: dados.formsUrl,
          },
        });
      } else {
        setErro('Tipo de QR Code desconhecido.');
      }
    } catch (e) {
      setErro('QR Code não reconhecido. Certifique-se de usar o código do STM App.');
    }
  };

  const voltarEtentarNovamente = () => {
    setErro('');
    setIniciando(true);
    // Reiniciar câmera
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {}).finally(() => {
        window.location.reload();
      });
    }
  };

  return (
    <div className="app-container">
      <div className="top-bar">
        <button
          className="back-btn"
          onClick={() => {
            if (scannerRef.current) scannerRef.current.stop().catch(() => {});
            navigate('/frequencia');
          }}
        >
          ←
        </button>
        <h3>
          {modo === 'avaliacao' ? 'QR Code de Avaliação' : 'Confirmar Presença'}
        </h3>
      </div>

      <div className="app-content">
        {erro ? (
          <div style={{ textAlign: 'center', paddingTop: '40px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
            <div className="alert alert-danger" style={{ textAlign: 'left' }}>
              {erro}
            </div>
            <button className="btn btn-primary" onClick={voltarEtentarNovamente}>
              Tentar novamente
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/frequencia')}
            >
              Voltar
            </button>
          </div>
        ) : (
          <>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--color-text-secondary)',
                marginBottom: '14px',
                textAlign: 'center',
              }}
            >
              {iniciando
                ? 'Iniciando câmera...'
                : modo === 'avaliacao'
                ? 'Aponte para o QR Code exibido pelo facilitador ao final do evento.'
                : 'Aponte para o QR Code fixado na entrada do auditório.'}
            </p>

            {/* Div onde o html5-qrcode renderiza a câmera */}
            <div
              id={divId}
              style={{
                borderRadius: '12px',
                overflow: 'hidden',
                marginBottom: '16px',
                minHeight: '300px',
                background: '#111',
              }}
            />

            {!iniciando && (
              <div className="alert alert-info" style={{ fontSize: '12px' }}>
                📷 Câmera ativa. Mantenha o QR Code centralizado na tela.
              </div>
            )}

            <button
              className="btn btn-secondary"
              onClick={() => {
                if (scannerRef.current) scannerRef.current.stop().catch(() => {});
                navigate('/frequencia');
              }}
            >
              Cancelar
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default CameraQR;
