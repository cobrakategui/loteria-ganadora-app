
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

  // Utility methods for correct categorization
  static getCategoryByName(nombre: string): string {
    const name = nombre.toLowerCase();
    
    // Lotería Nacional
    if (name.includes('gana mas') || name.includes('gana más') || 
        name.includes('juega') || name.includes('pega') || 
        name.includes('loteria nacional') || name.includes('lotería nacional')) {
      return 'Loteria Nacional';
    }
    
    // Leidsa
    if (name.includes('leidsa') || name.includes('loto pool') || 
        name.includes('super kino') || name.includes('quiniela leidsa') ||
        name.includes('loto leidsa') || name.includes('pega 3 mas') || name.includes('pega 3 más')) {
      return 'Leidsa';
    }
    
    // Real
    if (name.includes('real')) {
      return 'Real';
    }
    
    // Loteka
    if (name.includes('loteka') || name.includes('mega')) {
      return 'Loteka';
    }
    
    // Americanas
    if (name.includes('new york') || name.includes('florida') || 
        name.includes('powerball') || name.includes('mega millions') || 
        name.includes('cash4life')) {
      return 'Americanas';
    }
    
    // Primera
    if (name.includes('primera') || name.includes('loto 5')) {
      return 'Primera';
    }
    
    // La Suerte
    if (name.includes('suerte')) {
      return 'La Suerte';
    }
    
    // LoteDom
    if (name.includes('lotedom') || name.includes('quemaito')) {
      return 'LoteDom';
    }
    
    // King Lottery
    if (name.includes('king lottery') || name.includes('king')) {
      return 'King Lottery';
    }
    
    // Anguila
    if (name.includes('anguila')) {
      return 'Anguila';
    }
    
    return 'Otras';
  }

  static getCategoryByCompanyId(companyId: number): string {
    switch (companyId) {
      case 1: return 'Loteria Nacional';
      case 2: return 'Leidsa';
      case 3: return 'Loteka';
      case 4: return 'Primera';
      case 5: return 'LoteDom';
      case 6: return 'Real';
      case 7: return 'Anguila';
      case 8: return 'La Suerte';
      case 9: return 'King Lottery';
      case 10: return 'Americanas';
      case 1000: return 'Loterías Dominicanas';
      default: return 'Otras';
    }
  }

  static filterLotteriesByCategory(lotteries: LotteryResult[], category: string): LotteryResult[] {
    return lotteries.filter(lottery => {
      const lotteryCategory = this.getCategoryByName(lottery.nombre);
      
      if (lotteryCategory === 'Otras') {
        const categoryByCompany = this.getCategoryByCompanyId(lottery.company_id);
        return categoryByCompany === category;
      }
      
      return lotteryCategory === category;
    });
  }
}
