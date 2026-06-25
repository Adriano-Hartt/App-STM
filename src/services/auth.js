import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

// Cadastro
export const cadastroUsuario = async (email, senha, dadosPerfil) => {
  try {
    // Criar usuário no Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    const user = userCredential.user;

    // Atualizar perfil com nome
    await updateProfile(user, {
      displayName: dadosPerfil.nome,
    });

    // Salvar dados completos no Firestore
    await setDoc(doc(db, 'usuarios', user.uid), {
      uid: user.uid,
      nome: dadosPerfil.nome,
      email: email,
      cpf: dadosPerfil.cpf,
      matricula: dadosPerfil.matricula || null,
      ligacaoJMU: dadosPerfil.ligacaoJMU,
      lotacao: dadosPerfil.lotacao,
      isAdmin: false,
      dataCadastro: new Date(),
      fotoURL: null,
    });

    return user;
  } catch (error) {
    console.error('Erro ao cadastrar:', error);
    throw error;
  }
};

// Login
export const loginUsuario = async (email, senha) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, senha);
    return userCredential.user;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};

// Logout
export const logoutUsuario = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
};

// Obter dados do usuário
export const obterDadosUsuario = async (uid) => {
  try {
    const docRef = doc(db, 'usuarios', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log('Usuário não encontrado');
      return null;
    }
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error);
    throw error;
  }
};
