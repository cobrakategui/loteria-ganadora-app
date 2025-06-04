
export interface LotteryResult {
  id: number;
  nombre: string;
  numero_total: number;
  cantidad_premios: number;
  codigo?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  isLoto: number;
  busquedad: number;
  image: string;
  company_id: number;
  hora: string;
  quinielaDom: number;
  titulo: string;
  descripcion: string;
  orden?: string | null;
  img2: string;
  posicion?: number | null;
  pais: string;
  ultimo_sorteo?: {
    id: number;
    premios: string;
    numero_sorteo?: string | null;
    fecha_sorteo: string;
    loteria_id: number;
    created_at: string;
    updated_at: string;
    loto1?: number | null;
    loto2?: number | null;
  };
}

export interface LotteryApiResponse {
  loteria: LotteryResult[];
  loto?: LotteryResult[];
  atrasados: string;
}

export interface LotteryHistory {
  id: number;
  premios: string;
  numero_sorteo?: string | null;
  fecha_sorteo: string;
  loteria_id: number;
  created_at: string;
  updated_at: string;
  loto1?: number | null;
  loto2?: number | null;
}

export interface LotteryHistoryResponse {
  historial: LotteryHistory[];
  numerosRepetidos: number[];
}

export interface LotteryPrediction {
  id: number;
  fecha: string;
  loteria_id: number;
  tipo: string;
  numeros: string;
  created_at: string;
  updated_at: string;
  dias: string;
}

export interface LotteryPredictionResponse {
  prediccion: LotteryPrediction[];
  loteria: LotteryResult;
  sorteo: LotteryHistory;
}

export interface HotNumber {
  ultimaFecha: string;
  diasTranscurridos: number;
  numero: string;
  retrasoMax: number;
}

export interface LotteryCategory {
  id: number;
  nombre: string;
  numero_total: number;
  cantidad_premios: number;
  isLoto: number;
}
