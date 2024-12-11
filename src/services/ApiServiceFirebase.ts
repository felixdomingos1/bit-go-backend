import { db } from '../config/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export class ApiServiceFirebase {
  private static apisCollection = collection(db, 'apis');

  static async saveApis(urls: string[]): Promise<string[]> {
    const existingApis = await this.getApis();
    const alreadyRegistered: string[] = [];
    const toSave: string[] = [];

    urls.forEach((url) => {
        if (existingApis.includes(url)) {
          alreadyRegistered.push(url);
        } else {
          toSave.push(url);
        }
    });
    const savePromises = toSave.map((url) =>
        addDoc(this.apisCollection, { url })
      );
      await Promise.all(savePromises);
  
      return alreadyRegistered;
  }

  static async getApis(): Promise<string[]> {
    const snapshot = await getDocs(this.apisCollection);
    return snapshot.docs.map((doc) => doc.data().url);
  }
}
