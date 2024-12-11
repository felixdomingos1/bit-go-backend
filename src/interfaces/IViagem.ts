export interface IViagem {
    assentosDisponiveis: number;
    assentosReservados: number;
    dataChegada: Date;
    dataPartida: Date;
    destino: string;
    empresaId: string;
    facilidades: string[];
    localChegada: string;
    localPartida: string;
    origem: string;
    preco: number;
    tipoTransporte: string;
  }
  