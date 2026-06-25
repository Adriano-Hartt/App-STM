import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUsuario } from '../services/auth';
import '../styles/App.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      await loginUsuario(email, senha);
      navigate('/');
    } catch (error) {
      setErro(error.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="app-container">
      <div style={{ background: 'var(--color-primary)', padding: '24px 18px 28px', color: 'white', flexShrink: 0 }}>
        <button
          onClick={() => navigate('/')}
          className="back-btn"
          style={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '12px' }}
        >
          ←
        </button>
        <div style={{ fontSize: '13px', opacity: 0.75, marginBottom: '4px' }}>
          Bem-vindo de volta
        </div>
        <h2 style={{ color: 'white' }}>Acesse sua conta</h2>
      </div>

      <div className="app-content">
        {erro && <div className="alert alert-danger">{erro}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <input
              className="form-input"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Senha</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
          Esqueceu a senha?{' '}
          <span style={{ color: 'var(--color-primary)', cursor: 'pointer' }}>
            Recuperar
          </span>
        </div>

        <div className="divider" />

        <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--color-text-secondary)' }}>
          Não tem conta?{' '}
          <span
            style={{ color: 'var(--color-primary)', cursor: 'pointer' }}
            onClick={() => navigate('/cadastro')}
          >
            Cadastre-se
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;
