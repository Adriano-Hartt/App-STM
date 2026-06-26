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
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
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
    await setDoc(eventoRef, { inscritos: arrayUnion(usuarioId) }, { merge: true });
    const usuarioRef = doc(db, 'usuarios', usuarioId);
    await setDoc(usuarioRef, { eventosInscritos: arrayUnion(eventoId) }, { merge: true });
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
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Erro ao obter eventos do usuário:', error);
    throw error;
  }
};

// ============ FREQUÊNCIA ============

export const registrarFrequencia = async (usuarioId, eventoId, dados) => {
  try {
    const diaIndex = dados.diaIndex ?? 0;

    // ID determinístico: 1 registro por usuário+evento.
    // Se escanear vários dias, atualiza o mesmo registro contando os dias.
    const registroId = `${usuarioId}_${eventoId}`;
    const frequenciaRef = doc(db, 'frequencia', registroId);

    const existente = await getDoc(frequenciaRef);
    let diasPresentes = [diaIndex];

    if (existente.exists()) {
      const atual = existente.data().diasPresentesLista || [];
      diasPresentes = atual.includes(diaIndex) ? atual : [...atual, diaIndex];
    }

    await setDoc(frequenciaRef, {
      usuarioId,
      eventoId,
      nome: dados.nome || '',
      matricula: dados.matricula || '',
      lotacao: dados.lotacao || '',
      email: dados.email || '',
      ligacaoJMU: dados.ligacaoJMU || '',
      diasPresentesLista: diasPresentes,
      diasPresentes: diasPresentes.length,
      totalDias: dados.totalDias ?? 1,
      dataHora: serverTimestamp(),
      qrCodeData: dados.qrCodeData || '',
    }, { merge: true });

    // Envia para Google Sheets
    await enviarParaGoogleSheets({
      tipo: 'frequencia',
      nome: dados.nome || '',
      matricula: dados.matricula || '',
      lotacao: dados.lotacao || '',
      email: dados.email || '',
      evento: dados.evento || '',
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
      where('usuarioId', '==', usuarioId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
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
    const formsId = process.env.REACT_APP_GOOGLE_FORMS_ID;
    const baseURL = `https://docs.google.com/forms/d/${formsId}/viewform`;
    const params = new URLSearchParams({
      'entry.NOME': usuarioNome,
      'entry.MATRICULA': matricula,
      'entry.EVENTO_ID': eventoId,
    });
    window.open(`${baseURL}?${params.toString()}`, '_blank');
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
      where('eventoId', '==', eventoId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Erro ao obter frequência do evento:', error);
    throw error;
  }
};

export const obterTodosOsUsuarios = async () => {
  try {
    const q = query(collection(db, 'usuarios'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Erro ao obter usuários:', error);
    throw error;
  }
};

export const promoverParaAdmin = async (usuarioId) => {
  try {
    const usuarioRef = doc(db, 'usuarios', usuarioId);
    await updateDoc(usuarioRef, { isAdmin: true });
    return true;
  } catch (error) {
    console.error('Erro ao promover usuário:', error);
    throw error;
  }
};