import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { IViagem } from '../interfaces/IViagem';

export class ViagemService {
  static async saveToFirebaseInBatches(viagens: IViagem[]): Promise<void> {
    const batchSize = 10;
    const viagensRef = collection(db, 'viagens');

    for (let i = 0; i < viagens.length; i += batchSize) {
      const batch = viagens.slice(i, i + batchSize);

      const savePromises = batch.map((viagem) => addDoc(viagensRef, viagem));
      await Promise.all(savePromises);

      console.log(`Salvas ${i + batch.length} viagens até agora.`);
    }

    console.log('Todas as viagens foram salvas.');
  }
}
