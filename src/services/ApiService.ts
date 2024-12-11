import axios from 'axios';

export class ApiService {
  static async fetchApiData(urls: string[]): Promise<any[]> {
    const results = await Promise.all(
      urls.map((url) => axios.get(url).then((res) => res.data).catch(() => null))
    );
    return results.filter((data) => data !== null);
  }
}
