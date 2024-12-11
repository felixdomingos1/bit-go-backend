import { normalizeData } from "./normalizeData";

export function mapApiToViagem(apiData: any[]): any[] {
    return apiData.flat().map((data) => normalizeData(data)).filter(Boolean);
}
  