import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { criarEvento } from '../services/firestore';
import '../styles/App.css';

function CriarEvento() {
  const navigate = useNavigate();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [form, setForm] = useState({
    titulo: '', tipo: '', descricao: '',
    horarioInicio: '', horarioFim: '',
    local: '', cargaHoraria: '', capacidade: '',
  });
  const [datas, setDatas] = useState(['']);

  const handle = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleData = (index, value) => {
    setDatas(prev => {
      const novas = [...prev];
      novas[index] = value;
      return novas;
    });
  };

  const adicionarData = () => setDatas(prev => [...prev, '']);

  const removerData = (index) => {
    if (datas.length === 1) return;
    setDatas(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const datasValidas = datas.filter(d => d.trim() !== '');
    if (!form.titulo || datasValidas.length === 0 || !form.local) {
      setErro('Preencha ao menos título, uma data e local.');
      return;
    }
    setErro('');
    setCarregando(true);
    try {
      await criarEvento({
        ...form,
        data: datasValidas[0],
        dias: datasValidas,
        totalDias: datasValidas.length,
        cargaHoraria: Number(form.cargaHoraria) || 0,
        capacidade: Number(form.capacidade) || 0,
        inscritos: [],
        minimoPresenca: 80,
      });
      navigate('/admin');
    } catch (error) {
      setErro('Erro ao criar evento. Tente novamente.');
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  const diasValidos = datas.filter(d => d).length;
  const minimoComparecer = Math.ceil(diasValidos * 0.8);

  return (
    <div className="app-container">
      <div className="tbar">
        <button className="back-btn" onClick={() => navigate('/admin')}>←</button>
        <h3>Criar novo evento</h3>
      </div>

      <div className="app-content">
        {erro && <div className="alert alert-danger" style={{ marginBottom: '14px' }}>{erro}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Título do evento *</label>
            <input className="form-input" name="titulo" placeholder="Ex: Gestão de Pessoas" value={form.titulo} onChange={handle} />
          </div>

          <div className="form-group">
            <label className="form-label">Tipo</label>
            <select className="form-select" name="tipo" value={form.tipo} onChange={handle}>
              <option value="">Selecione...</option>
              <option>Capacitação presencial</option>
              <option>Palestra</option>
              <option>Workshop</option>
              <option>Curso EAD</option>
              <option>Seminário</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Descrição</label>
            <textarea className="form-input" name="descricao" placeholder="Descreva o evento..." value={form.descricao} onChange={handle} rows={3} style={{ resize: 'vertical' }} />
          </div>

          <div className="form-group">
            <label className="form-label">Dias do evento * — cada dia terá seu próprio QR Code</label>
            {datas.map((data, index) => (
              <div key={index} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--color-primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '600', flexShrink: 0 }}>
                  {index + 1}
                </div>
                <input className="form-input" type="date" value={data} onChange={(e) => handleData(index, e.target.value)} style={{ flex: 1 }} />
                {datas.length > 1 && (
                  <button type="button" onClick={() => removerData(index)} style={{ background: '#FCEBEB', color: '#791F1F', border: '0.5px solid #F09595', borderRadius: 'var(--border-radius-md)', padding: '8px 12px', cursor: 'pointer', fontSize: '13px', flexShrink: 0 }}>✕</button>
                )}
              </div>
            ))}
            <button type="button" onClick={adicionarData} style={{ background: 'var(--color-background-secondary)', border: '0.5px dashed var(--color-border)', borderRadius: 'var(--border-radius-md)', padding: '8px 14px', cursor: 'pointer', fontSize: '13px', color: 'var(--color-primary)', width: '100%', marginTop: '4px' }}>
              + Adicionar outro dia
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group">
              <label className="form-label">Horário início</label>
              <input className="form-input" type="time" name="horarioInicio" value={form.horarioInicio} onChange={handle} />
            </div>
            <div className="form-group">
              <label className="form-label">Horário fim</label>
              <input className="form-input" type="time" name="horarioFim" value={form.horarioFim} onChange={handle} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Local *</label>
            <input className="form-input" name="local" placeholder="Ex: Auditório A" value={form.local} onChange={handle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div className="form-group">
              <label className="form-label">Carga horária (h)</label>
              <input className="form-input" type="number" name="cargaHoraria" placeholder="Ex: 3" value={form.cargaHoraria} onChange={handle} />
            </div>
            <div className="form-group">
              <label className="form-label">Capacidade (vagas)</label>
              <input className="form-input" type="number" name="capacidade" placeholder="Ex: 40" value={form.capacidade} onChange={handle} />
            </div>
          </div>

          {diasValidos > 0 && (
            <div className="alert alert-info" style={{ fontSize: '12px' }}>
              📊 Presença mínima: <strong>80%</strong> — com {diasValidos} dia(s), o participante precisa comparecer em pelo menos <strong>{minimoComparecer}</strong> dia(s).
            </div>
          )}

          <button type="submit" className="btn btn-primary" disabled={carregando}>
            {carregando ? 'Salvando...' : '✓ Criar evento'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin')}>Cancelar</button>
        </form>
      </div>
    </div>
  );
}

export default CriarEvento;