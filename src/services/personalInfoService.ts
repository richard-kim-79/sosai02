import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.REACT_APP_ENCRYPTION_KEY || 'your-secret-key';

export const savePersonalInfo = async (data: { 
  name: string; 
  location: string; 
  contact: string;
  isChild: boolean;
}) => {
  try {
    const db = getFirestore();
    const auth = getAuth();
    
    // 개인정보 암호화
    const encryptedName = CryptoJS.AES.encrypt(data.name, SECRET_KEY).toString();
    const encryptedLocation = CryptoJS.AES.encrypt(data.location, SECRET_KEY).toString();
    const encryptedContact = CryptoJS.AES.encrypt(data.contact, SECRET_KEY).toString();
    
    // Firestore에 저장
    const docRef = await addDoc(collection(db, 'personalInfo'), {
      name: encryptedName,
      location: encryptedLocation,
      contact: encryptedContact,
      isChild: data.isChild,
      sessionId: localStorage.getItem('sessionId'),
      timestamp: new Date(),
      status: 'pending',
      userId: auth.currentUser?.uid || 'anonymous',
      contactType: data.contact.includes('@') ? 'email' : 'phone',
      priority: data.isChild ? 'high' : 'normal' // 어린이의 경우 우선순위를 높게 설정
    });
    
    return docRef.id;
  } catch (error) {
    console.error('개인정보 저장 중 오류 발생:', error);
    throw error;
  }
}; 