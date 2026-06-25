import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { promoverParaAdmin } from '../services/firestore';
import '../styles/App.css';

function CriarAdmin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      setErro('Digite um e-mail válido.');
      return;
    }
    setErro('');
    setSucesso('');
    setCarregando(true);

    try {
      // Busca o usuário pelo email no Firestore
      const q = query(collection(db, 'usuarios'), where('email', '==', email));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setErro('Usuário não encontrado. Ele precisa ter feito cadastro no app primeiro.');
        setCarregando(false);
        return;
      }

      const usuarioDoc = snapshot.docs[0];
      await promoverParaAdmin(usuarioDoc.id);

      setSucesso(`${email} agora é administrador!`);
      setEmail('');
    } catch (error) {
      setErro('Erro ao promover usuário. Tente novamente.');
      console.error(error);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="app-container">
      <div className="tbar">
        <button className="back-btn" onClick={() => navigate('/admin')}>←</button>
        <h3>Adicionar administrador</h3>
      </div>

      <div className="app-content">
        <div className="alert alert-info" style={{ marginBottom: '16px' }}>
          O usuário precisa ter feito cadastro no app antes de ser promovido a administrador.
        </div>

        {erro && <div className="alert alert-danger" style={{ marginBottom: '14px' }}>{erro}</div>}
        {sucesso && <div className="alert alert-success" style={{ marginBottom: '14px' }}>✓ {sucesso}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">E-mail do usuário</label>
            <input
              className="form-input"
              type="email"
              placeholder="email@stm.jus.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={carregando}>
            {carregando ? 'Promovendo...' : '👑 Tornar administrador'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/admin')}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}

export default CriarAdmin;