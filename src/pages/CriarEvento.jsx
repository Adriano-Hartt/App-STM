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
    data: '', horarioInicio: '', horarioFim: '',
    local: '', cargaHoraria: '', capacidade: '',
  });

  const handle = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.titulo || !form.data || !form.local) {
      setErro('Preencha ao menos título, data e local.');
      return;
    }
    setErro('');
    setCarregando(true);
    try {
      await criarEvento({
        ...form,
        cargaHoraria: Number(form.cargaHoraria) || 0,
        capacidade: Number(form.capacidade) || 0,
        inscritos: [],
      });
      navigate('/admin');
    } catch (error) {
      setErro('Erro ao criar evento. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

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
            <label className="form-label">Data *</label>
            <input className="form-input" type="date" name="data" value={form.data} onChange={handle} />
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

          <button type="submit" className="btn btn-primary" disabled={carregando}>
            {carregando ? 'Salvando...' : '✓ Criar evento'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin')}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}

export default CriarEvento;