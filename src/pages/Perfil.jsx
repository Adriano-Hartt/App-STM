import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUsuario, obterDadosUsuario } from '../services/auth';
import { auth } from '../services/firebase';
import '../styles/App.css';

function getIniciais(nome) {
  if (!nome) return '?';
  return nome.split(' ').filter(p => p.length > 0).slice(0,2).map(p => p[0].toUpperCase()).join('');
}

function Perfil() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Dados imediatos do Firebase Auth (não precisam esperar Firestore)
  const authUser = auth.currentUser;
  const nomeAuth  = authUser?.displayName || '';
  const emailAuth = authUser?.email || '';

  useEffect(() => {
    const uid = authUser?.uid;
    if (!uid) { setCarregando(false); return; }
    obterDadosUsuario(uid)
      .then(dados => setUserData(dados))
      .catch(err => console.error('Erro ao carregar perfil:', err))
      .finally(() => setCarregando(false));
  }, []);

  // Firestore primeiro, auth como fallback
  const nome      = userData?.nome       || nomeAuth  || 'Usuário';
  const email     = userData?.email      || emailAuth || '';
  const cpf       = userData?.cpf        || '';
  const matricula = userData?.matricula  || '';
  const lotacao   = userData?.lotacao    || '';
  const ligacao   = userData?.ligacaoJMU || '';

  const handleLogout = async () => {
    try { await logoutUsuario(); navigate('/'); }
    catch (error) { console.error('Erro ao sair:', error); }
  };

  return (
    <div className="app-container">
      <div className="app-header">
        <span className="app-header-title">STM — Perfil</span>
      </div>

      <div className="app-content">
        <div style={{ display:'flex', alignItems:'center', gap:'14px', marginBottom:'20px',
          padding:'16px', background:'var(--color-background-secondary)', borderRadius:'var(--border-radius-lg)' }}>
          <div style={{ width:'54px', height:'54px', borderRadius:'50%', background:'var(--color-primary)',
            color:'#fff', display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'18px', fontWeight:'500', flexShrink:0 }}>
            {getIniciais(nome)}
          </div>
          <div>
            <div style={{ fontSize:'16px', fontWeight:'500', color:'var(--color-text-primary)' }}>{nome}</div>
            <div style={{ fontSize:'13px', color:'var(--color-text-secondary)', marginTop:'2px' }}>{email}</div>
            {ligacao && <span className="pill pill-info" style={{ marginTop:'6px', display:'inline-block' }}>{ligacao}</span>}
          </div>
        </div>

        {carregando ? (
          <div style={{ textAlign:'center', padding:'20px', color:'var(--color-text-secondary)' }}>Carregando dados...</div>
        ) : (
          <>
            <div style={{ marginBottom:'8px', fontSize:'13px', fontWeight:'500', color:'var(--color-text-primary)' }}>Dados cadastrais</div>
            <div className="card" style={{ cursor:'default', marginBottom:'20px' }}>
              {[['CPF',cpf||'—'],['Matrícula',matricula||'—'],['Lotação',lotacao||'—'],['Vínculo JMU',ligacao||'—']].map(([k,v]) => (
                <div key={k} style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
                  fontSize:'14px', padding:'8px 0', borderBottom:'0.5px solid var(--color-border)' }}>
                  <span style={{ color:'var(--color-text-secondary)' }}>{k}</span>
                  <span style={{ fontWeight:'500', color:'var(--color-text-primary)' }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ marginBottom:'8px', fontSize:'13px', fontWeight:'500', color:'var(--color-text-primary)' }}>Meus treinamentos</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'24px' }}>
              <div className="stat-card"><div className="stat-value">0</div><div className="stat-label">Inscrições</div></div>
              <div className="stat-card"><div className="stat-value">0</div><div className="stat-label">Concluídos</div></div>
            </div>
            <button className="btn btn-secondary" onClick={() => navigate('/meus-cursos')} style={{ marginBottom:'8px' }}>
              📚 Ver meus cursos
            </button>
            <button className="btn btn-danger" onClick={handleLogout}>Sair da conta</button>
          </>
        )}
      </div>

      <div className="app-bottom-nav">
        <button className="nav-item" onClick={() => navigate('/')}><span>🏠</span>Início</button>
        <button className="nav-item" onClick={() => navigate('/eventos')}><span>📅</span>Eventos</button>
        <button className="nav-item" onClick={() => navigate('/meus-cursos')}><span>📚</span>Meus cursos</button>
        <button className="nav-item active"><span>👤</span>Perfil</button>
      </div>
    </div>
  );
}

export default Perfil;