import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebase';


// ============ EVENTOS ============

export const obterEventos = async () => {
  try {
    const q = query(collection(db, 'eventos'), orderBy('data', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Erro ao obter eventos:', error);
    throw error;
  }
};

export const obterDetalhesEvento = async (eventoId) => {
  try {
    const docRef = doc(db, 'eventos', eventoId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error) {
    console.error('Erro ao obter evento:', error);
    throw error;
  }
};

export const inscreverEmEvento = async (usuarioId, eventoId) => {
  try {
    const eventoRef = doc(db, 'eventos', eventoId);
    
    // Adicionar usuário à lista de inscritos
    await updateDoc(eventoRef, {
      inscritos: arrayUnion(usuarioId),
    });

    // Adicionar evento à lista do usuário
    const usuarioRef = doc(db, 'usuarios', usuarioId);
    await updateDoc(usuarioRef, {
      eventosInscritos: arrayUnion(eventoId),
    });

    return true;
  } catch (error) {
    console.error('Erro ao inscrever:', error);
    throw error;
  }
};

export const obterEventosDoUsuario = async (usuarioId) => {
  try {
    const q = query(
      collection(db, 'eventos'),
      where('inscritos', 'array-contains', usuarioId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Erro ao obter eventos do usuário:', error);
    throw error;
  }
};

// ============ FREQUÊNCIA ============

export const registrarFrequencia = async (usuarioId, eventoId, dados) => {
  try {
    // Salvar no Firestore
    const frequenciaRef = doc(collection(db, 'frequencia'));
    await setDoc(frequenciaRef, {
      usuarioId,
      eventoId,
      nome: dados.nome,
      matricula: dados.matricula,
      lotacao: dados.lotacao,
      dataHora: serverTimestamp(),
      qrCodeData: dados.qrCodeData,
    });

    // Enviar para Google Sheets
    await enviarParaGoogleSheets({
      tipo: 'frequencia',
      nome: dados.nome,
      matricula: dados.matricula,
      lotacao: dados.lotacao,
      evento: dados.evento,
      dataHora: new Date().toLocaleString('pt-BR'),
    });

    return true;
  } catch (error) {
    console.error('Erro ao registrar frequência:', error);
    throw error;
  }
};

export const obterFrequenciaDoUsuario = async (usuarioId) => {
  try {
    const q = query(
      collection(db, 'frequencia'),
      where('usuarioId', '==', usuarioId),
      orderBy('dataHora', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Erro ao obter frequência:', error);
    throw error;
  }
};

// ============ GOOGLE SHEETS ============

export const enviarParaGoogleSheets = async (dados) => {
  try {
    const url = process.env.REACT_APP_SHEETS_WEBHOOK_URL;
    if (!url) {
      console.warn('URL do Google Sheets não configurada.');
      return;
    }
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(dados),
    });
    console.log('Dados enviados para Google Sheets com sucesso!');
  } catch (error) {
    console.error('Erro ao enviar para Google Sheets:', error);
  }
};

export const abrirGoogleForms = (usuarioId, eventoId, usuarioNome, matricula) => {
  try {
    // Montar URL do Google Forms com pré-preenchimento
    const formsId = process.env.REACT_APP_GOOGLE_FORMS_ID;
    const baseURL = `https://docs.google.com/forms/d/${formsId}/viewform`;
    
    const params = new URLSearchParams({
      'entry.NOME': usuarioNome,
      'entry.MATRICULA': matricula,
      'entry.EVENTO_ID': eventoId,
    });

    const url = `${baseURL}?${params.toString()}`;
    window.open(url, '_blank');
  } catch (error) {
    console.error('Erro ao abrir Google Forms:', error);
    throw error;
  }
};

// ============ ADMIN ============

export const criarEvento = async (dadosEvento) => {
  try {
    const eventoRef = doc(collection(db, 'eventos'));
    await setDoc(eventoRef, {
      ...dadosEvento,
      dataCriacao: serverTimestamp(),
      inscritos: [],
    });
    return eventoRef.id;
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    throw error;
  }
};

export const obterFrequenciaDoEvento = async (eventoId) => {
  try {
    const q = query(
      collection(db, 'frequencia'),
      where('eventoId', '==', eventoId),
      orderBy('dataHora', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Erro ao obter frequência do evento:', error);
    throw error;
  }
};

export const obterTodosOsUsuarios = async () => {
  try {
    const q = query(collection(db, 'usuarios'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Erro ao obter usuários:', error);
    throw error;
  }
};

export const promoverParaAdmin = async (usuarioId) => {
  try {
    const usuarioRef = doc(db, 'usuarios', usuarioId);
    await updateDoc(usuarioRef, {
      isAdmin: true,
    });
    return true;
  } catch (error) {
    console.error('Erro ao promover usuário:', error);
    throw error;
  }
};
