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
exports.ApiServiceFirebase = void 0;
const firebase_1 = require("../config/firebase");
const firestore_1 = require("firebase/firestore");
class ApiServiceFirebase {
    static saveApis(urls) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingApis = yield this.getApis();
            const alreadyRegistered = [];
            const toSave = [];
            urls.forEach((url) => {
                if (existingApis.includes(url)) {
                    alreadyRegistered.push(url);
                }
                else {
                    toSave.push(url);
                }
            });
            const savePromises = toSave.map((url) => (0, firestore_1.addDoc)(this.apisCollection, { url }));
            yield Promise.all(savePromises);
            return alreadyRegistered;
        });
    }
    static getApis() {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield (0, firestore_1.getDocs)(this.apisCollection);
            return snapshot.docs.map((doc) => doc.data().url);
        });
    }
}
exports.ApiServiceFirebase = ApiServiceFirebase;
ApiServiceFirebase.apisCollection = (0, firestore_1.collection)(firebase_1.db, 'apis');
