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
      p.nome ?? '',
      p.matricula ?? '',
      p.lotacao ?? '',
      p.email ?? '',
      p.ligacaoJMU ?? '',
      presentes,
      totalDias,
      pct + '%',
      pct >= 80 ? 'Aprovado' : 'Reprovado',
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
    return (
      <div className="splash-loading">
        <p>Carregando dados do evento...</p>
      </div>
    );
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

  // Junta dados do usuário inscrito com a frequência dele (se houver)
  const listaInscritos = idsInscritos.map(uid => {
    const u = usuarios.find(x => x.id === uid) || {};
    const f = frequencias.find(x => x.usuarioId === uid);
    return {
      usuarioId: uid,
      nome: u.nome || f?.nome || 'Usuário',
      matricula: u.matricula || f?.matricula || '',
      lotacao: u.lotacao || f?.lotacao || '',
      email: u.email || f?.email || '',
      ligacaoJMU: u.ligacaoJMU || f?.ligacaoJMU || '',
      diasPresentes: f?.diasPresentes || 0,
      confirmou: !!f,
    };
  });

  const totalInscritos = listaInscritos.length;
  const totalPresentes = listaInscritos.filter(p => p.confirmou).length;
  const taxaPresenca = totalInscritos > 0 ? Math.round((totalPresentes / totalInscritos) * 100) : 0;

  const listaFiltrada = listaInscritos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.matricula.toLowerCase().includes(busca.toLowerCase()) ||
    p.lotacao.toLowerCase().includes(busca.toLowerCase())
  );

  const handleExportar = () => {
    setExportando(true);
    try {
      gerarCSVParaExcel(listaInscritos, evento.titulo, totalDias);
    } finally {
      setTimeout(() => setExportando(false), 600);
    }
  };

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
            <div className="admin-stat-box-value">{totalPresentes}</div>
            <div className="admin-stat-box-label">Compareceram</div>
          </div>
          <div className="admin-stat-box">
            <div className="admin-stat-box-value">{taxaPresenca}%</div>
            <div className="admin-stat-box-label">Taxa presença</div>
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

        <div className="section-header">
          <span className="section-title">Inscritos</span>
          <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            {listaFiltrada.length} pessoa(s)
          </span>
        </div>

        <div style={{ marginBottom: '12px' }}>
          <input
            className="form-input"
            placeholder="🔍  Buscar por nome, matrícula ou lotação..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            style={{ fontSize: '13px' }}
          />
        </div>

        {listaFiltrada.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--color-text-secondary)', fontSize: '13px' }}>
            {busca ? 'Nenhum resultado para essa busca.' : 'Nenhum inscrito ainda.'}
          </div>
        ) : (
          listaFiltrada.map((p, i) => {
            const pct = totalDias > 0 ? Math.round((p.diasPresentes / totalDias) * 100) : 0;
            const aprovado = pct >= 80;
            return (
              <div key={p.usuarioId ?? i} className="card" style={{ cursor: 'default', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: p.confirmou ? '8px' : '0' }}>
                  <div className="participante-avatar">{getIniciais(p.nome)}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="participante-nome">{p.nome}</div>
                    <div className="participante-sub">
                      {[p.matricula, p.lotacao].filter(Boolean).join(' · ') || '—'}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>
                      {[p.email, p.ligacaoJMU].filter(Boolean).join(' · ')}
                    </div>
                  </div>
                  {p.confirmou ? (
                    <span className="pill pill-success" style={{ fontSize: '10px', padding: '2px 8px', flexShrink: 0 }}>
                      {aprovado ? '✓ Aprovado' : 'Presente'}
                    </span>
                  ) : (
                    <span className="pill pill-info" style={{ fontSize: '10px', padding: '2px 8px', flexShrink: 0 }}>
                      Inscrito
                    </span>
                  )}
                </div>

                {p.confirmou && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                      <span>Presença: {p.diasPresentes}/{totalDias} dia(s)</span>
                      <span style={{ color: aprovado ? 'var(--color-success)' : 'var(--color-text-secondary)', fontWeight: 500 }}>{pct}%</span>
                    </div>
                    <div className="progress-bar-track">
                      <div className="progress-bar-fill" style={{ width: `${pct}%`, background: aprovado ? 'var(--color-success)' : 'var(--color-primary)' }} />
                    </div>
                  </div>
                )}
              </div>
            );
          })
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