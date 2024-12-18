"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ViagemController = void 0;
const ApiService_1 = require("../services/ApiService");
const dataMapper_1 = require("../utils/dataMapper");
const ViagemService_1 = require("../services/ViagemService");
const normalizeData_1 = require("../utils/normalizeData");
const ApiServiceFirebase_1 = require("../services/ApiServiceFirebase");
class ViagemController {
    static processApis(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const urls = req.body.urls;
                yield ApiServiceFirebase_1.ApiServiceFirebase.saveApis(urls);
                const alreadyRegistered = yield ApiServiceFirebase_1.ApiServiceFirebase.saveApis(urls);
                if (alreadyRegistered.length > 0) {
                    console.warn('APIs já cadastradas:', alreadyRegistered);
                }
                const apiData = yield ApiService_1.ApiService.fetchApiData(urls);
                const viagens = (0, dataMapper_1.mapApiToViagem)(apiData);
                yield ViagemService_1.ViagemService.saveToFirebaseInBatches(viagens);
                return res.status(200).json({ message: 'Viagens e APIs salvas com sucesso.', alreadyRegistered });
            }
            catch (error) {
                console.error('Erro ao processar APIs:', error);
                return res.status(500).json({ error: 'Erro ao processar APIs.' });
            }
        });
    }
    static fetchById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const urls = yield ApiServiceFirebase_1.ApiServiceFirebase.getApis();
                if (!urls.length) {
                    return res.status(404).json({ message: 'Nenhuma API registrada.' });
                }
                const apiData = yield ApiService_1.ApiService.fetchApiData(urls.map((url) => `${url}/${id}`));
                const viagem = apiData.find((data) => data !== null);
                if (!viagem) {
                    return res.status(404).json({ message: 'Viagem não encontrada.' });
                }
                const normalizedViagem = (0, normalizeData_1.normalizeData)(viagem);
                return res.status(200).json(normalizedViagem);
            }
            catch (error) {
                console.error('Erro ao buscar viagem:', error);
                return res.status(500).json({ error: 'Erro ao buscar viagem.' });
            }
        });
    }
    static fetchAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const urls = yield ApiServiceFirebase_1.ApiServiceFirebase.getApis();
                if (!urls.length) {
                    return res.status(404).json({ message: 'Nenhuma API registrada.' });
                }
                const apiData = yield ApiService_1.ApiService.fetchApiData(urls.map((url) => `${url}/`));
                const viagem = apiData.find((data) => data !== null);
                if (!viagem) {
                    return res.status(404).json({ message: 'Viagens não encontradas.' });
                }
                const normalizedViagem = (0, normalizeData_1.normalizeData)(viagem);
                console.log(normalizedViagem);
                return res.status(200).json(normalizedViagem);
            }
            catch (error) {
                console.error('Erro ao buscar viagem:', error);
                return res.status(500).json({ error: 'Erro ao buscar viagem.' });
            }
        });
    }
}
exports.ViagemController = ViagemController;
