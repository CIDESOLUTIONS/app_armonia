var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/lib/pdf/pdfGenerator.ts
// Este archivo ahora está vacío ya que la lógica de generación de PDF se ha centralizado en receipt-service.ts
export function generatePDF(template, data, outputPath) {
    return __awaiter(this, void 0, void 0, function* () {
        console.warn('generatePDF en pdfGenerator.ts es un stub. Usa generateReceipt de receipt-service.ts en su lugar.');
        return outputPath;
    });
}
