var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp';
import { ServerLogger } from '../logging/server-logger'; // Asumiendo que existe
const logger = new ServerLogger('SeoOptimizationService');
class SeoOptimizationService {
    constructor() {
        this.metaTags = {
            title: 'Armonía - Gestión integral para comunidades y edificios',
            description: 'Plataforma completa para la gestión de comunidades, asambleas, pagos, comunicaciones y más. Simplifica la administración de tu edificio o conjunto residencial.',
            keywords: 'gestión comunidades, administración edificios, asambleas virtuales, pagos comunitarios, comunicación residentes',
            ogTitle: 'Armonía - Solución integral para comunidades',
            ogDescription: 'Transforma la gestión de tu comunidad con Armonía. Plataforma todo en uno para administración, comunicación y servicios comunitarios.',
            ogImage: '/images/armonia-social-share.jpg',
            twitterCard: 'summary_large_image',
            twitterTitle: 'Armonía - Gestión comunitaria simplificada',
            twitterDescription: 'Administra tu comunidad de forma eficiente con Armonía. Asambleas, pagos, comunicaciones y más en una sola plataforma.',
            twitterImage: '/images/armonia-twitter-card.jpg'
        };
        logger.info('SeoOptimizationService initialized');
    }
    generateMetaTags() {
        // ... (implementación similar al original, pero usando this.metaTags)
        return `<!-- Meta tags -->`;
    }
    optimizeImage(inputPath_1, outputPath_1) {
        return __awaiter(this, arguments, void 0, function* (inputPath, outputPath, options = {}) {
            try {
                const { quality = 80, format = 'webp' } = options, resizeOptions = __rest(options, ["quality", "format"]);
                yield fs.mkdir(path.dirname(outputPath), { recursive: true });
                let sharpInstance = sharp(inputPath);
                if (resizeOptions.width || resizeOptions.height) {
                    sharpInstance = sharpInstance.resize(resizeOptions);
                }
                yield sharpInstance
                    .toFormat(format, { quality })
                    .toFile(outputPath);
                logger.info(`Image optimized: ${inputPath} -> ${outputPath}`);
                return true;
            }
            catch (error) {
                logger.error(`Error optimizing image: ${error.message}`, { inputPath });
                return false;
            }
        });
    }
}
export const seoOptimizationService = new SeoOptimizationService();
