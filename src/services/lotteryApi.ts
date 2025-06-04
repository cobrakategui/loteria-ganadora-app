
import { LotteryApiResponse, LotteryHistoryResponse, LotteryPredictionResponse, HotNumber, LotteryCategory, LotteryResult } from '@/types/lottery';

const BASE_URL = 'https://api3.bolillerobingoonlinegratis.com/api';

export class LotteryAPI {
  private static async fetchWithHeaders(url: string) {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'Origin': 'https://elboletoganador.com',
        'Referer': 'https://elboletoganador.com/',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  static async getLotteryResults(date?: string, companies?: number): Promise<LotteryApiResponse> {
    let url = `${BASE_URL}/companies/loterias`;
    
    if (date || companies !== undefined) {
      url = `${BASE_URL}/companies/buscar/loterias`;
      const params = new URLSearchParams();
      if (date) params.append('fecha', date);
      if (companies !== undefined) params.append('companies', companies.toString());
      url += `?${params.toString()}`;
    }
    
    return this.fetchWithHeaders(url);
  }

  static async getLotteryById(id: number): Promise<LotteryResult> {
    return this.fetchWithHeaders(`${BASE_URL}/loterias/${id}`);
  }

  static async getLotteryHistory(id: number, date: string): Promise<LotteryHistoryResponse> {
    return this.fetchWithHeaders(`${BASE_URL}/sorteos/buscar/historial?id=${id}&fecha=${date}`);
  }

  static async getLotteryPredictions(lotteryId: number, date: string): Promise<LotteryPredictionResponse> {
    return this.fetchWithHeaders(`${BASE_URL}/predicciones?loteria_id=${lotteryId}&fecha=${date}`);
  }

  static async getHotNumbers(lotteryId: number, date: string, position: number = 0): Promise<HotNumber[]> {
    return this.fetchWithHeaders(`${BASE_URL}/tabla/create?loteria_id=${lotteryId}&fecha=${date}&posicion=${position}`);
  }

  static async getLotteryCategories(): Promise<LotteryCategory[]> {
    return this.fetchWithHeaders(`${BASE_URL}/loterias`);
  }

  static async getLotoResults(): Promise<LotteryResult[]> {
    return this.fetchWithHeaders(`${BASE_URL}/loto`);
  }
}
