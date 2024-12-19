"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeData = normalizeData;
function normalizeData(data) {
    try {
        if (data.origin) {
            return {
                assentosDisponiveis: data.availableSeats || 0,
                assentosReservados: 0,
                dataChegada: new Date(data.arrivalDate),
                dataPartida: new Date(data.departureDate),
                destino: data.destination,
                empresaId: "empresa02",
                facilidades: [],
                localChegada: data.arrivalLocation,
                localPartida: data.departureLocation,
                origem: data.origin,
                preco: data.price,
                tipoTransporte: data.transportType,
            };
        }
        if (data.origem) {
            return {
                assentosDisponiveis: data.assentosDisponiveis,
                assentosReservados: 0,
                dataChegada: new Date(data.dataChegada),
                dataPartida: new Date(data.dataPartida),
                destino: data.destino,
                empresaId: "empresa01",
                facilidades: [],
                localChegada: data.localChegada,
                localPartida: data.localPartida,
                origem: data.origem,
                preco: data.preco,
                tipoTransporte: data.tipoTransporte,
            };
        }
        ;
        return data;
    }
    catch (_a) {
        return null;
    }
}
