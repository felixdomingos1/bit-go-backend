import { Request, Response } from 'express';
import { ApiService } from '../services/ApiService';
import { mapApiToViagem } from '../utils/dataMapper';
import { ViagemService } from '../services/ViagemService';
import { normalizeData } from '../utils/normalizeData';
import { ApiServiceFirebase } from '../services/ApiServiceFirebase';

export class ViagemController {
  static async processApis(req: Request, res: Response): Promise<Response> {
    try {
      const urls: string[] = req.body.urls;

      await ApiServiceFirebase.saveApis(urls);

      const alreadyRegistered = await ApiServiceFirebase.saveApis(urls);

      if (alreadyRegistered.length > 0) {
        console.warn('APIs já cadastradas:', alreadyRegistered);
      }

      const apiData = await ApiService.fetchApiData(urls);
      const viagens = mapApiToViagem(apiData);

      await ViagemService.saveToFirebaseInBatches(viagens);

      return res.status(200).json({ message: 'Viagens e APIs salvas com sucesso.', alreadyRegistered });
    } catch (error) {
      console.error('Erro ao processar APIs:', error);
      return res.status(500).json({ error: 'Erro ao processar APIs.' });
    }
  }

  static async fetchById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;

      const urls = await ApiServiceFirebase.getApis();

      if (!urls.length) {
        return res.status(404).json({ message: 'Nenhuma API registrada.' });
      }

      const apiData = await ApiService.fetchApiData(
        urls.map((url) => `${url}/${id}`)
      );
      const viagem = apiData.find((data) => data !== null);

      if (!viagem) {
        return res.status(404).json({ message: 'Viagem não encontrada.' });
      }

      const normalizedViagem = normalizeData(viagem);
      return res.status(200).json(normalizedViagem);
    } catch (error) {
      console.error('Erro ao buscar viagem:', error);
      return res.status(500).json({ error: 'Erro ao buscar viagem.' });
    }
  }
  
  static async fetchAll(req: Request, res: Response): Promise<Response> {
    try {
      const urls = await ApiServiceFirebase.getApis();
      
      if (!urls.length) {
        return res.status(404).json({ message: 'Nenhuma API registrada.' });
      }
      
      const apiData = await ApiService.fetchApiData(
        urls.map((url) => `${url}/`)
      );

      console.log("API DATA", apiData);
      
      const viagem = apiData.find((data) => data !== null);
      
      if (!viagem) {
        return res.status(404).json({ message: 'Viagens não encontradas.' });
      }

      const normalizedViagem = normalizeData(viagem);
      
      return res.status(200).json(normalizedViagem);
    } catch (error) {
      console.error('Erro ao buscar viagem:', error);
      return res.status(500).json({ error: 'Erro ao buscar viagem.' });
    }
  }
}
