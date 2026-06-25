import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cadastroUsuario } from '../services/auth';
import ProgressBar from '../components/ProgressBar';
import '../styles/App.css';

const STEPS = ['Dados Pessoais', 'Dados Profissionais', 'Confirmação'];

// FORA do componente — evita recriar o input a cada letra
function CampoTexto({ label, name, type, placeholder, value, onChange }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        className="form-input"
        type={type || 'text'}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete="off"
      />
    </div>
  );
}

function CampoSelect({ label, name, value, onChange, options }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <select className="form-select" name={name} value={value} onChange={onChange}>
        <option value="">Selecione...</option>
        {options.map(op => <option key={op} value={op}>{op}</option>)}
      </select>
    </div>
  );
}

function Cadastro() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [form, setForm] = useState({
    nome: '', email: '', cpf: '', senha: '',
    matricula: '', ligacaoJMU: '', lotacao: '',
  });

  const handle = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const validarStep = () => {
    if (step === 0) {
      if (!form.nome.trim()) return 'Informe seu nome completo.';
      if (!form.email.includes('@')) return 'E-mail inválido.';
      if (form.cpf.replace(/\D/g,'').length !== 11) return 'CPF deve ter 11 dígitos.';
      if (form.senha.length < 8) return 'Senha deve ter no mínimo 8 caracteres.';
    }
    if (step === 1) {
      if (!form.ligacaoJMU) return 'Selecione sua ligação com a JMU.';
      if (!form.lotacao) return 'Selecione sua lotação.';
    }
    return null;
  };

  const avancar = (e) => {
    e.preventDefault();
    const msg = validarStep();
    if (msg) { setErro(msg); return; }
    setErro('');
    setStep(s => s + 1);
  };

  const voltar = () => {
    setErro('');
    if (step === 0) navigate('/');
    else setStep(s => s - 1);
  };

  const finalizar = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      await cadastroUsuario(form.email, form.senha, form);
      navigate('/');
    } catch (error) {
      setErro(error.message || 'Erro ao cadastrar. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="app-container">
      <div style={{ background:'var(--color-primary)', padding:'16px 18px 0', color:'white', flexShrink:0 }}>
        <button onClick={voltar} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.75)', fontSize:'22px', cursor:'pointer', padding:'0 0 12px' }}>←</button>
        <h2 style={{ color:'white', fontSize:'20px', paddingBottom:'14px' }}>
          {step === 2 ? 'Confirme seus dados' : 'Criar conta'}
        </h2>
      </div>

      <ProgressBar steps={STEPS} current={step} />

      <div className="app-content">
        {erro && <div className="alert alert-danger" style={{ marginBottom:'14px' }}>{erro}</div>}

        {step === 0 && (
          <form onSubmit={avancar}>
            <CampoTexto label="Nome completo" name="nome" placeholder="João da Silva" value={form.nome} onChange={handle} />
            <CampoTexto label="E-mail" name="email" type="email" placeholder="joao@email.com" value={form.email} onChange={handle} />
            <CampoTexto label="CPF" name="cpf" placeholder="000.000.000-00" value={form.cpf} onChange={handle} />
            <CampoTexto label="Senha" name="senha" type="password" placeholder="Mínimo 8 caracteres" value={form.senha} onChange={handle} />
            <button type="submit" className="btn btn-primary">Próximo →</button>
          </form>
        )}

        {step === 1 && (
          <form onSubmit={avancar}>
            <CampoTexto label="Matrícula STM (se servidor)" name="matricula" placeholder="Deixe em branco se não aplicável" value={form.matricula} onChange={handle} />
            <CampoSelect label="Ligação com a JMU" name="ligacaoJMU" value={form.ligacaoJMU} onChange={handle}
              options={['Servidor civil','Militar','Estagiário','Prestador de serviço','Outro']} />
            <CampoSelect label="Lotação" name="lotacao" value={form.lotacao} onChange={handle}
              options={['Secretaria do STM','Gabinete da Presidência','Corregedoria','Diretoria de Gestão de Pessoas','Assessoria de Comunicação','Outro']} />
            <button type="submit" className="btn btn-primary">Próximo →</button>
            <button type="button" className="btn btn-secondary" onClick={voltar}>← Voltar</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={finalizar}>
            <div className="card" style={{ cursor:'default', marginBottom:'16px' }}>
              <div style={{ fontSize:'12px', color:'var(--color-text-secondary)', marginBottom:'12px', fontWeight:500 }}>Dados Pessoais</div>
              {[['Nome',form.nome],['E-mail',form.email],['CPF',form.cpf]].map(([k,v]) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between', fontSize:'13px', marginBottom:'8px' }}>
                  <span style={{ color:'var(--color-text-secondary)' }}>{k}</span>
                  <span style={{ fontWeight:500 }}>{v}</span>
                </div>
              ))}
              <div className="divider" />
              <div style={{ fontSize:'12px', color:'var(--color-text-secondary)', marginBottom:'12px', fontWeight:500 }}>Dados Profissionais</div>
              {[['Matrícula',form.matricula||'—'],['Vínculo JMU',form.ligacaoJMU],['Lotação',form.lotacao]].map(([k,v]) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between', fontSize:'13px', marginBottom:'8px' }}>
                  <span style={{ color:'var(--color-text-secondary)' }}>{k}</span>
                  <span style={{ fontWeight:500 }}>{v}</span>
                </div>
              ))}
            </div>
            <div className="alert alert-info" style={{ fontSize:'12px' }}>Revise seus dados antes de finalizar.</div>
            <button type="submit" className="btn btn-primary" disabled={carregando}>
              {carregando ? 'Criando conta...' : '✓ Finalizar cadastro'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={voltar}>← Voltar e editar</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Cadastro;