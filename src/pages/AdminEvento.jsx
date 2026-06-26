import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { obterDetalhesEvento, obterFrequenciaDoEvento, obterTodosOsUsuarios } from '../services/firestore';
import '../styles/App.css';

function gerarCSVParaExcel(linhasDados, nomeEvento, totalDias) {
  const BOM = '\uFEFF';
  const sep = ';';
  const header = ['Nome', 'Matrícula', 'Lotação', 'E-mail', 'Vínculo JMU', 'Dias Presentes', 'Total Dias', '% Presença', 'Situação'].join(sep);
  const linhas = linhasDados.map(p => {
    const presentes = p.diasPresentes || 0;
    const pct = totalDias > 0 ? Math.round((presentes / totalDias) * 100) : 0;
    return [
      p.nome ?? '', p.matricula ?? '', p.lotacao ?? '', p.email ?? '', p.ligacaoJMU ?? '',
      presentes, totalDias, pct + '%', pct >= 80 ? 'Aprovado' : 'Reprovado',
    ].join(sep);
  });
  const csv = BOM + [header, ...linhas].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `frequencia_${nomeEvento.replace(/\s+/g, '_')}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function getIniciais(nome = '') {
  return nome.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

function AdminEvento() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [evento, setEvento] = useState(null);
  const [frequencias, setFrequencias] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState('');
  const [exportando, setExportando] = useState(false);
  const [filtro, setFiltro] = useState('todos');     // todos | aprovados | reprovados
  const [ordem, setOrdem] = useState('maior');         // maior | menor

  useEffect(() => {
    if (!id) return;
    Promise.all([
      obterDetalhesEvento(id),
      obterFrequenciaDoEvento(id),
      obterTodosOsUsuarios(),
    ]).then(([ev, freqs, users]) => {
      setEvento(ev);
      setFrequencias(freqs);
      setUsuarios(users);
    }).catch(console.error)
      .finally(() => setCarregando(false));
  }, [id]);

  if (carregando) {
    return <div className="splash-loading"><p>Carregando dados do evento...</p></div>;
  }

  if (!evento) {
    return (
      <div className="app-container">
        <div className="tbar">
          <button className="back-btn" onClick={() => navigate('/admin')}>←</button>
          <h3>Evento não encontrado</h3>
        </div>
        <div className="app-content">
          <div className="alert alert-danger">Evento não encontrado.</div>
          <button className="btn btn-secondary" onClick={() => navigate('/admin')}>Voltar ao painel</button>
        </div>
        <div className="app-bottom-nav">
          <button className="nav-item" onClick={() => navigate('/')}><span>🏠</span>Início</button>
          <button className="nav-item" onClick={() => navigate('/eventos')}><span>📅</span>Eventos</button>
          <button className="nav-item active"><span>⚙️</span>Admin</button>
          <button className="nav-item" onClick={() => navigate('/perfil')}><span>👤</span>Perfil</button>
        </div>
      </div>
    );
  }

  const totalDias = evento.totalDias || 1;
  const idsInscritos = evento.inscritos || [];

  const listaInscritos = idsInscritos.map(uid => {
    const u = usuarios.find(x => x.id === uid) || {};
    const f = frequencias.find(x => x.usuarioId === uid);
    const presentes = f?.diasPresentes || 0;
    const pct = totalDias > 0 ? Math.round((presentes / totalDias) * 100) : 0;
    return {
      usuarioId: uid,
      nome: u.nome || f?.nome || 'Usuário',
      matricula: u.matricula || f?.matricula || '',
      lotacao: u.lotacao || f?.lotacao || '',
      email: u.email || f?.email || '',
      ligacaoJMU: u.ligacaoJMU || f?.ligacaoJMU || '',
      diasPresentes: presentes,
      pct,
      aprovado: pct >= 80,
      confirmou: !!f,
    };
  });

  const totalInscritos = listaInscritos.length;
  const totalPresentes = listaInscritos.filter(p => p.confirmou).length;
  const totalAprovados = listaInscritos.filter(p => p.aprovado).length;
  const taxaPresenca = totalInscritos > 0 ? Math.round((totalPresentes / totalInscritos) * 100) : 0;

  // 1) Filtra por situação
  let lista = listaInscritos.filter(p => {
    if (filtro === 'aprovados') return p.aprovado;
    if (filtro === 'reprovados') return !p.aprovado;
    return true;
  });

  // 2) Filtra por busca
  lista = lista.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.matricula.toLowerCase().includes(busca.toLowerCase()) ||
    p.lotacao.toLowerCase().includes(busca.toLowerCase())
  );

  // 3) Ordena
  lista = [...lista].sort((a, b) => ordem === 'maior' ? b.pct - a.pct : a.pct - b.pct);

  const handleExportar = () => {
    setExportando(true);
    try {
      gerarCSVParaExcel(listaInscritos, evento.titulo, totalDias);
    } finally {
      setTimeout(() => setExportando(false), 600);
    }
  };

  const btnFiltro = (valor, texto) => (
    <button
      onClick={() => setFiltro(valor)}
      style={{
        padding: '5px 12px', borderRadius: '20px', border: '0.5px solid', fontSize: '12px',
        cursor: 'pointer', fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap',
        fontWeight: filtro === valor ? 500 : 400,
        background: filtro === valor ? 'var(--color-primary)' : 'transparent',
        color: filtro === valor ? '#fff' : 'var(--color-text-secondary)',
        borderColor: filtro === valor ? 'var(--color-primary)' : 'var(--color-border)',
      }}
    >{texto}</button>
  );

  return (
    <div className="app-container">
      <div className="admin-evento-header">
        <button
          onClick={() => navigate('/admin')}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.75)', fontSize: '20px', cursor: 'pointer', marginBottom: '8px', padding: 0 }}
        >← Painel Admin</button>
        <h2>{evento.titulo}</h2>
        <p>
          {evento.data ? new Date(evento.data + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' }) : '—'}
          {totalDias > 1 ? ` · ${totalDias} dias` : ''}
          {evento.local ? ` · ${evento.local}` : ''}
        </p>
      </div>

      <div className="app-content">
        <div className="admin-stat-row">
          <div className="admin-stat-box">
            <div className="admin-stat-box-value">{totalInscritos}</div>
            <div className="admin-stat-box-label">Inscritos</div>
          </div>
          <div className="admin-stat-box">
            <div className="admin-stat-box-value">{totalAprovados}</div>
            <div className="admin-stat-box-label">Aprovados</div>
          </div>
          <div className="admin-stat-box">
            <div className="admin-stat-box-value">{taxaPresenca}%</div>
            <div className="admin-stat-box-label">Compareceram</div>
          </div>
        </div>

        <button
          className="btn-export"
          onClick={handleExportar}
          disabled={exportando || listaInscritos.length === 0}
        >
          {exportando ? '⏳ Gerando arquivo...' : '📥 Exportar lista (.csv para Excel)'}
        </button>

        <div className="divider" />

        {/* Filtros */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', overflowX: 'auto', paddingBottom: '2px' }}>
          {btnFiltro('todos', `Todos (${listaInscritos.length})`)}
          {btnFiltro('aprovados', `Aprovados (${totalAprovados})`)}
          {btnFiltro('reprovados', `Reprovados (${listaInscritos.length - totalAprovados})`)}
        </div>

        {/* Ordenação */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Ordenar:</span>
          <button
            onClick={() => setOrdem('maior')}
            style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', border: '0.5px solid var(--color-border)', background: ordem === 'maior' ? 'var(--color-background-secondary)' : 'transparent', color: 'var(--color-text-primary)', fontFamily: 'var(--font-sans)' }}
          >↓ Maior presença</button>
          <button
            onClick={() => setOrdem('menor')}
            style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', border: '0.5px solid var(--color-border)', background: ordem === 'menor' ? 'var(--color-background-secondary)' : 'transparent', color: 'var(--color-text-primary)', fontFamily: 'var(--font-sans)' }}
          >↑ Menor presença</button>
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

        <div className="section-header">
          <span className="section-title">Inscritos</span>
          <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>{lista.length} pessoa(s)</span>
        </div>

        {lista.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-secondary)', fontSize: '13px' }}>
            Nenhum resultado para esse filtro.
          </div>
        ) : (
          lista.map((p, i) => (
            <div key={p.usuarioId ?? i} className="card" style={{ cursor: 'default', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: p.confirmou ? '8px' : '0' }}>
                <div className="participante-avatar">{getIniciais(p.nome)}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="participante-nome">{p.nome}</div>
                  <div className="participante-sub">{[p.matricula, p.lotacao].filter(Boolean).join(' · ') || '—'}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{[p.email, p.ligacaoJMU].filter(Boolean).join(' · ')}</div>
                </div>
                {p.confirmou ? (
                  <span className="pill" style={{ fontSize: '10px', padding: '2px 8px', flexShrink: 0, background: p.aprovado ? '#EAF3DE' : '#FCEBEB', color: p.aprovado ? '#27500A' : '#791F1F' }}>
                    {p.aprovado ? '✓ Aprovado' : '✗ Reprovado'}
                  </span>
                ) : (
                  <span className="pill pill-info" style={{ fontSize: '10px', padding: '2px 8px', flexShrink: 0 }}>Inscrito</span>
                )}
              </div>

              {p.confirmou && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                    <span>Presença: {p.diasPresentes}/{totalDias} dia(s)</span>
                    <span style={{ color: p.aprovado ? 'var(--color-success)' : '#791F1F', fontWeight: 500 }}>{p.pct}%</span>
                  </div>
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${p.pct}%`, background: p.aprovado ? 'var(--color-success)' : '#C0392B' }} />
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="app-bottom-nav">
        <button className="nav-item" onClick={() => navigate('/')}><span>🏠</span>Início</button>
        <button className="nav-item" onClick={() => navigate('/eventos')}><span>📅</span>Eventos</button>
        <button className="nav-item" onClick={() => navigate('/admin')}><span>⚙️</span>Admin</button>
        <button className="nav-item" onClick={() => navigate('/perfil')}><span>👤</span>Perfil</button>
      </div>
    </div>
  );
}

export default AdminEvento;