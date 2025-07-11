var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
;
export class ManualPrismaClient extends BasePrismaClient {
    constructor(tenantSchema = 'public') {
        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) {
            throw new Error('DATABASE_URL no está definida en las variables de entorno');
        }
        super({
            datasources: {
                db: {
                    url: `${databaseUrl.split('?')[0]}?schema=${tenantSchema}`,
                },
            },
        });
        this.manualTenant = {
            create: (data) => __awaiter(this, void 0, void 0, function* () {
                return this.$executeRawUnsafe(`INSERT INTO "${this.tenantSchema}"."Tenant" (name, "schemaName", "createdAt") VALUES ($1, $2, NOW()) RETURNING *`, data.data.name, data.data.schemaName);
            }),
            findMany: () => __awaiter(this, void 0, void 0, function* () {
                return this.$executeRawUnsafe(`SELECT * FROM "${this.tenantSchema}"."Tenant"`);
            }),
            findUnique: (data) => __awaiter(this, void 0, void 0, function* () {
                return this.$executeRawUnsafe(`SELECT * FROM "${this.tenantSchema}"."Tenant" WHERE id = $1 LIMIT 1`, data.where.id);
            }),
        };
        this.manualResidentialComplex = {
            create: (data) => __awaiter(this, void 0, void 0, function* () {
                return this.$executeRawUnsafe(`INSERT INTO "${this.tenantSchema}"."ResidentialComplex" (name, "totalUnits", "createdAt") VALUES ($1, $2, NOW()) RETURNING *`, data.data.name, data.data.totalUnits);
            }),
            findMany: () => __awaiter(this, void 0, void 0, function* () {
                return this.$executeRawUnsafe(`SELECT * FROM "${this.tenantSchema}"."ResidentialComplex"`);
            }),
        };
        this.manualAssembly = {
            create: (data) => __awaiter(this, void 0, void 0, function* () {
                return this.$executeRawUnsafe(`INSERT INTO "${this.tenantSchema}"."Assembly" (title, type, date, description, status, quorum, agenda, "organizerId", "complexId", "createdAt") 
         VALUES ($1, $2, $3, $4, 'PENDING', 0, $5::jsonb, $6, $7, NOW()) RETURNING *`, data.data.title, data.data.type, data.data.date, data.data.description, JSON.stringify(data.data.agenda), data.data.organizerId, data.data.complexId);
            }),
            findMany: () => __awaiter(this, void 0, void 0, function* () {
                return this.$queryRawUnsafe(`SELECT * FROM "${this.tenantSchema}"."Assembly"`);
            }),
        };
        this.tenantSchema = tenantSchema;
    }
    setTenantSchema(schema) {
        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) {
            throw new Error('DATABASE_URL no está definida en las variables de entorno');
        }
        this.tenantSchema = schema;
        this.$disconnect().then(() => {
            // @ts-ignore
            this._engineConfig.datasources = {
                db: {
                    url: `${databaseUrl.split('?')[0]}?schema=${schema}`,
                },
            };
            // @ts-ignore
            this.$connect();
        });
    }
}
export const prisma = new ManualPrismaClient();
