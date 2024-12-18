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
exports.ViagemService = void 0;
const firebase_1 = require("../config/firebase");
const firestore_1 = require("firebase/firestore");
class ViagemService {
    static saveToFirebaseInBatches(viagens) {
        return __awaiter(this, void 0, void 0, function* () {
            const batchSize = 10;
            const viagensRef = (0, firestore_1.collection)(firebase_1.db, 'viagens');
            for (let i = 0; i < viagens.length; i += batchSize) {
                const batch = viagens.slice(i, i + batchSize);
                const savePromises = batch.map((viagem) => (0, firestore_1.addDoc)(viagensRef, viagem));
                yield Promise.all(savePromises);
                console.log(`Salvas ${i + batch.length} viagens até agora.`);
            }
            console.log('Todas as viagens foram salvas.');
        });
    }
}
exports.ViagemService = ViagemService;
