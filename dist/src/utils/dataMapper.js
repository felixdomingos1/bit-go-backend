"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapApiToViagem = mapApiToViagem;
const normalizeData_1 = require("./normalizeData");
function mapApiToViagem(apiData) {
    return apiData.flat().map((data) => (0, normalizeData_1.normalizeData)(data)).filter(Boolean);
}
