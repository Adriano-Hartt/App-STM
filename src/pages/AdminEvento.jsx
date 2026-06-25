import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { obterDetalhesEvento, obterFrequenciaDoEvento } from '../services/firestore';
import '../styles/App.css';

// ─── Exportação XLSX sem dependência de backend ───────────────────
// Usamos a API Blob + CSV simples que o Excel abre nativamente.
// Para XLSX real, instale a lib "xlsx" (SheetJS) e substitua gerarXLSX().
function gerarCSVParaExcel(participantes, nomeEvento) {
  const BOM   = '\uFEFF';                   // garante UTF-8 no Excel
  const sep   = ';';                        // separador ponto-e-vírgula (padrão PT-BR)
  const header = ['Nome', 'Matrícula', 'Lotação', 'E-mail', 'Vínculo JMU', 'Dias Presentes', 'Total Dias', '% Presença', 'Situação'].join(sep);

  const linhas = participantes.map(p => {
  const diasPresentes = p.diasPresentes || 1;
  const totalDias = evento?.totalDias || 1;
  const percentual = Math.round((diasPresentes / totalDias) * 100);
  return [
    p.nome ?? '',
    p.matricula ?? '',
    p.lotacao ?? '',
    p.email ?? '',
    p.ligacaoJMU ?? '',
    diasPresentes,
    totalDias,
    percentual + '%',
    percentual >= 80 ? 'Aprovado' : 'Reprovado',
  ].join(sep);
});

  const csv = BOM + [header, ...linhas].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href     = url;
  link.download = `frequencia_${nomeEvento.replace(/\s+/g, '_')}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

// Para XLSX real com SheetJS:
// import * as XLSX from 'xlsx';
// function gerarXLSX(participantes, nomeEvento) {
//   const ws = XLSX.utils.json_to_sheet(participantes.map(p => ({
//     Nome: p.nome, Matrícula: p.matricula, Lotação: p.lotacao,
//     'Data/Hora': new Date(p.dataHora?.seconds * 1000).toLocaleString('pt-BR'),
//   })));
//   const wb = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(wb, ws, 'Frequência');
//   XLSX.writeFile(wb, `frequencia_${nomeEvento}.xlsx`);
// }
// ──────────────────────────────────────────────────────────────────

function getIniciais(nome = '') {
  return nome.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function AdminEvento() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [evento,        setEvento]        = useState(null);
  const [participantes, setParticipantes] = useState([]);
  const [carregando,    setCarregando]    = useState(true);
  const [busca,         setBusca]         = useState('');
  const [exportando,    setExportando]    = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      obterDetalhesEvento(id),
      obterFrequenciaDoEvento(id),
    ]).then(([ev, freqs]) => {
      setEvento(ev);
      setParticipantes(freqs);
    }).catch(console.error)
      .finally(() => setCarregando(false));
  }, [id]);

  const participantesFiltrados = participantes.filter(p =>
    p.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    p.matricula?.toLowerCase().includes(busca.toLowerCase()) ||
    p.lotacao?.toLowerCase().includes(busca.toLowerCase())
  );

  const handleExportar = () => {
    setExportando(true);
    try {
      gerarCSVParaExcel(participantes, evento?.titulo ?? 'evento');
    } finally {
      setTimeout(() => setExportando(false), 800);
    }
  };

  if (carregando) {
    return (
      <div className="splash-loading">
        <p>Carregando dados do evento...</p>
      </div>
    );
  }

  if (!evento) {
    return (
      <div className="app-container">
        <div className="top-bar">
          <button className="back-btn" onClick={() => navigate('/admin')}>←</button>
          <h3>Evento não encontrado</h3>
        </div>
      </div>
    );
  }

  const totalInscritos = evento.inscritos?.length ?? 0;
  const totalPresentes = participantes.length;
  const taxaPresenca   = totalInscritos > 0
    ? Math.round((totalPresentes / totalInscritos) * 100)
    : 0;

  return (
    <div className="app-container">

      {/* ── Cabeçalho roxo ── */}
      <div className="admin-evento-header">
        <button
          onClick={() => navigate('/admin')}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.75)', fontSize: '20px', cursor: 'pointer', marginBottom: '8px', padding: 0 }}
        >← Painel Admin</button>
        <h2>{evento.titulo}</h2>
        <p>
          {evento.data ? new Date(evento.data).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' }) : '—'}
          {evento.horarioInicio ? ` · ${evento.horarioInicio}` : ''}
          {evento.local ? ` · ${evento.local}` : ''}
        </p>
      </div>

      <div className="app-content">

        {/* ── Métricas ── */}
        <div className="admin-stat-row">
          <div className="admin-stat-box">
            <div className="admin-stat-box-value">{totalInscritos}</div>
            <div className="admin-stat-box-label">Inscritos</div>
          </div>
          <div className="admin-stat-box">
            <div className="admin-stat-box-value">{totalPresentes}</div>
            <div className="admin-stat-box-label">Presentes</div>
          </div>
          <div className="admin-stat-box">
            <div className="admin-stat-box-value">{taxaPresenca}%</div>
            <div className="admin-stat-box-label">Taxa presença</div>
          </div>
        </div>

        {/* ── Barra presença ── */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
            <span>Presença confirmada</span>
            <span>{totalPresentes} / {totalInscritos}</span>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${taxaPresenca}%`, background: taxaPresenca >= 80 ? 'var(--color-success)' : 'var(--color-primary)' }} />
          </div>
        </div>

        {/* ── Exportar ── */}
        <button
          className="btn-export"
          onClick={handleExportar}
          disabled={exportando || participantes.length === 0}
        >
          {exportando ? '⏳ Gerando arquivo...' : '📥 Exportar lista de presença (.xlsx)'}
        </button>

        {participantes.length === 0 && (
          <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', textAlign: 'center', marginTop: '4px' }}>
            Nenhuma presença confirmada ainda.
          </div>
        )}

        <div className="divider" />

        {/* ── Lista de participantes ── */}
        <div className="section-header">
          <span className="section-title">Presenças confirmadas</span>
          <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            {participantesFiltrados.length} registros
          </span>
        </div>

        {/* Busca */}
        <div style={{ marginBottom: '12px' }}>
          <input
            className="form-input"
            placeholder="🔍  Buscar por nome, matrícula ou lotação..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            style={{ fontSize: '13px' }}
          />
        </div>

        {participantesFiltrados.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-secondary)', fontSize: '13px' }}>
            {busca ? 'Nenhum resultado para essa busca.' : 'Nenhuma presença registrada ainda.'}
          </div>
        ) : (
          participantesFiltrados.map((p, i) => {
            const hora = p.dataHora?.seconds
              ? new Date(p.dataHora.seconds * 1000).toLocaleString('pt-BR', { hour: '2-digit', minute: '2-digit' })
              : null;

            return (
              <div key={p.id ?? i} className="participante-row">
                <div className="participante-avatar">
                  {getIniciais(p.nome)}
                </div>
                <div className="participante-info">
                  <div className="participante-nome">{p.nome}</div>
                  <div className="participante-sub">
                    {[p.matricula, p.lotacao].filter(Boolean).join(' · ')}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {hora && (
                    <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                      {hora}
                    </div>
                  )}
                  <span className="pill pill-success" style={{ marginTop: '2px', display: 'inline-block', fontSize: '10px', padding: '2px 8px' }}>
                    ✓ Presente
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default AdminEvento;
