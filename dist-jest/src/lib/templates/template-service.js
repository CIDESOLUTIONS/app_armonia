import { ServerLogger } from '../logging/server-logger'; // Asumiendo que existe
const logger = new ServerLogger('TemplateService');
class TemplateService {
    constructor() {
        this.templates = new Map();
        this.defaultVariables = {
            appName: 'Armonía',
            supportEmail: 'soporte@armonia.app',
            supportPhone: '+57 300 123 4567',
            websiteUrl: 'https://armonia.app'
        };
        logger.info('TemplateService initialized');
    }
    registerTemplate(name, content, defaultVars = {}) {
        try {
            if (!name || !content) {
                throw new Error('Name and content are required');
            }
            this.templates.set(name, { content, defaultVars });
            logger.info(`Template registered: ${name}`);
            return true;
        }
        catch (error) {
            logger.error(`Error registering template: ${error.message}`, { error });
            return false;
        }
    }
    getTemplate(name) {
        const template = this.templates.get(name);
        if (!template) {
            logger.warn(`Template not found: ${name}`);
            return null;
        }
        return template;
    }
    renderTemplate(name, variables = {}) {
        const template = this.getTemplate(name);
        if (!template) {
            return null;
        }
        const mergedVars = Object.assign(Object.assign(Object.assign({}, this.defaultVariables), template.defaultVars), variables);
        let rendered = template.content;
        Object.entries(mergedVars).forEach(([key, value]) => {
            const regex = new RegExp(`{{\s*${key}\s*}}`, 'g');
            rendered = rendered.replace(regex, String(value));
        });
        return rendered;
    }
    getAllTemplateNames() {
        return Array.from(this.templates.keys());
    }
}
export const templateService = new TemplateService();
