# Endpoints Implementados - Backend Armonía

## Autenticación (`/auth`)

| Método | Endpoint | Descripción | Autenticación | Roles |
|--------|----------|-------------|---------------|-------|
| POST | `/auth/login` | Iniciar sesión | ❌ | Público |
| POST | `/auth/register-complex` | Registrar complejo residencial | ❌ | Público |
| POST | `/auth/request-demo` | Solicitar demostración | ❌ | Público |
| POST | `/auth/profile` | Obtener perfil usuario | ✅ JWT | Todos |

## Visitantes (`/visitors`)

| Método | Endpoint | Descripción | Autenticación | Roles |
|--------|----------|-------------|---------------|-------|
| POST | `/visitors` | Crear visitante | ✅ JWT | SECURITY, RECEPTION |
| GET | `/visitors` | Listar visitantes | ✅ JWT | Todos |
| GET | `/visitors/pre-registered` | Visitantes pre-registrados | ✅ JWT | SECURITY, RECEPTION |
| POST | `/visitors/scan-qr` | Escanear código QR | ✅ JWT | SECURITY, RECEPTION |
| GET | `/visitors/:id` | Obtener visitante | ✅ JWT | Todos |
| PUT | `/visitors/:id` | Actualizar visitante | ✅ JWT | SECURITY, RECEPTION |
| DELETE | `/visitors/:id` | Eliminar visitante | ✅ JWT | SECURITY, RECEPTION |

## Finanzas (`/finances`)

### Cuotas
| Método | Endpoint | Descripción | Autenticación | Roles |
|--------|----------|-------------|---------------|-------|
| POST | `/finances/fees` | Crear cuota | ✅ JWT | COMPLEX_ADMIN, ADMIN |
| GET | `/finances/fees` | Listar cuotas | ✅ JWT | COMPLEX_ADMIN, ADMIN, RESIDENT |
| GET | `/finances/fees/:id` | Obtener cuota específica | ✅ JWT | COMPLEX_ADMIN, ADMIN, RESIDENT |
| PUT | `/finances/fees/:id` | Actualizar cuota | ✅ JWT | COMPLEX_ADMIN, ADMIN |
| DELETE | `/finances/fees/:id` | Eliminar cuota | ✅ JWT | COMPLEX_ADMIN, ADMIN |
| POST | `/finances/fees/generate-ordinary` | Generar cuotas ordinarias | ✅ JWT | COMPLEX_ADMIN, ADMIN |

### Pagos
| Método | Endpoint | Descripción | Autenticación | Roles |
|--------|----------|-------------|---------------|-------|
| POST | `/finances/payments` | Crear pago | ✅ JWT | COMPLEX_ADMIN, ADMIN |
| POST | `/finances/payments/manual` | Registrar pago manual | ✅ JWT | COMPLEX_ADMIN, ADMIN |
| GET | `/finances/payments` | Listar pagos | ✅ JWT | COMPLEX_ADMIN, ADMIN, RESIDENT |
| GET | `/finances/payments/:id` | Obtener pago específico | ✅ JWT | COMPLEX_ADMIN, ADMIN, RESIDENT |
| PUT | `/finances/payments/:id` | Actualizar pago | ✅ JWT | COMPLEX_ADMIN, ADMIN |
| DELETE | `/finances/payments/:id` | Eliminar pago | ✅ JWT | COMPLEX_ADMIN, ADMIN |
| POST | `/finances/payments/initiate` | Iniciar pago online | ✅ JWT | RESIDENT |
| POST | `/finances/payments/webhook` | Webhook pasarelas pago | ❌ | Webhook |

### Presupuestos
| Método | Endpoint | Descripción | Autenticación | Roles |
|--------|----------|-------------|---------------|-------|
| POST | `/finances/budgets` | Crear presupuesto | ✅ JWT | COMPLEX_ADMIN, ADMIN |
| GET | `/finances/budgets` | Listar presupuestos | ✅ JWT | COMPLEX_ADMIN, ADMIN |
| GET | `/finances/budgets/:id` | Obtener presupuesto | ✅ JWT | COMPLEX_ADMIN, ADMIN |
| PUT | `/finances/budgets/:id` | Actualizar presupuesto | ✅ JWT | COMPLEX_ADMIN, ADMIN |
| DELETE | `/finances/budgets/:id` | Eliminar presupuesto | ✅ JWT | COMPLEX_ADMIN, ADMIN |
| POST | `/finances/budgets/:id/approve` | Aprobar presupuesto | ✅ JWT | COMPLEX_ADMIN, ADMIN |

### Gastos
| Método | Endpoint | Descripción | Autenticación | Roles |
|--------|----------|-------------|---------------|-------|
| POST | `/finances/expenses` | Crear gasto | ✅ JWT | COMPLEX_ADMIN, ADMIN |
| GET | `/finances/expenses` | Listar gastos | ✅ JWT | COMPLEX_ADMIN, ADMIN |
| GET | `/finances/expenses/:id` | Obtener gasto | ✅ JWT | COMPLEX_ADMIN, ADMIN |
| PUT | `/finances/expenses/:id` | Actualizar gasto | ✅ JWT | COMPLEX_ADMIN, ADMIN |
| DELETE | `/finances/expenses/:id` | Eliminar gasto | ✅ JWT | COMPLEX_ADMIN, ADMIN |

### Reportes Financieros
| Método | Endpoint | Descripción | Autenticación | Roles |
|--------|----------|-------------|---------------|-------|
| GET | `/finances/summary` | Resumen financiero | ✅ JWT | COMPLEX_ADMIN, ADMIN, RESIDENT |
| GET | `/finances/transactions/recent` | Transacciones recientes | ✅ JWT | COMPLEX_ADMIN, ADMIN, RESIDENT |
| GET | `/finances/reports/generate` | Generar reporte financiero | ✅ JWT | COMPLEX_ADMIN, ADMIN |

## Paquetería (`/packages`)

| Método | Endpoint | Descripción | Autenticación | Roles |
|--------|----------|-------------|---------------|-------|
| POST | `/packages` | Registrar paquete | ✅ JWT | SECURITY, RECEPTION |
| GET | `/packages` | Listar paquetes | ✅ JWT | Todos (filtrado por rol) |
| GET | `/packages/:id` | Obtener paquete específico | ✅ JWT | Todos |
| PUT | `/packages/:id/status` | Actualizar estado paquete | ✅ JWT | SECURITY, RECEPTION |

## WebSocket Namespaces

### Assembly WebSocket (`/assembly`)

| Evento | Descripción | Datos Enviados | Datos Recibidos |
|--------|-------------|----------------|----------------|
| `joinAssembly` | Unirse a asamblea | `{assemblyId, schemaName, userId}` | Confirmación unión |
| `registerAttendance` | Registrar asistencia | `{assemblyId, userId, unitId}` | Estado quórum actualizado |
| `submitVote` | Enviar voto | `{voteId, userId, option}` | Resultados votación |
| `quorumUpdate` | Actualización quórum | - | `{currentAttendance, quorumMet}` |
| `voteResultsUpdate` | Resultados votación | - | `{voteId, results}` |

### Panic WebSocket (`/panic`)

| Evento | Descripción | Datos Enviados | Datos Recibidos |
|--------|-------------|----------------|----------------|
| `triggerPanic` | Activar alerta pánico | `{userId, location, description}` | Alerta creada |
| `resolvePanic` | Resolver alerta | `{alertId, status}` | Alerta actualizada |
| `newPanicAlert` | Nueva alerta pánico | - | Datos de alerta nueva |
| `panicAlertUpdated` | Alerta actualizada | - | Datos de alerta actualizada |

### Marketplace WebSocket (`/marketplace`)

| Evento | Descripción | Datos Enviados | Datos Recibidos |
|--------|-------------|----------------|----------------|
| `joinChat` | Unirse a chat producto | `{listingId, userId}` | Confirmación unión |
| `sendMessage` | Enviar mensaje | `{listingId, senderId, receiverId, content}` | Mensaje enviado |
| `receiveMessage` | Recibir mensaje | - | Datos del mensaje |

## Funcionalidades de Seguridad

### Guards Implementados
- ✅ `JwtAuthGuard` - Autenticación JWT
- ✅ `RolesGuard` - Control de roles
- ✅ `FeatureGuard` - Control por plan/funcionalidades

### Interceptors
- ✅ `TenantInterceptor` - Resolución automática de tenant

### Decorators Personalizados
- ✅ `@GetUser()` - Obtener usuario autenticado
- ✅ `@Roles()` - Definir roles requeridos
- ✅ `@Features()` - Definir funcionalidades requeridas

## Integraciones de Servicios Externos

### Twilio SMS
- ✅ Envío de SMS para notificaciones de emergencia
- ✅ Configuración via environment variables
- ✅ Fallback graceful si no está configurado

### Firebase Push Notifications
- ✅ Notificaciones push para alertas críticas
- ✅ Manejo de tokens de dispositivo
- ✅ Integración con Firebase Admin SDK

### Webhooks
- ✅ Webhook para pasarelas de pago
- ✅ Procesamiento asíncrono de callbacks

## Base de Datos Multi-Tenant

### Prisma Configuration
- ✅ PostgreSQL como base de datos
- ✅ Soporte multi-schema para aislamiento de tenants
- ✅ Más de 40 modelos de datos implementados
- ✅ Relaciones complejas bien definidas
- ✅ Índices y constraints apropiados

### Modelos Principales
- `User`, `ResidentialComplex`, `Property`, `Resident`
- `Fee`, `Payment`, `Budget`, `Expense`
- `Visitor`, `Package`, `Reservation`, `Amenity`
- `Assembly`, `AssemblyVote`, `Notification`, `Announcement`
- `PanicAlert`, `SecurityEvent`, `AccessAttempt`
- Y más de 30 modelos adicionales...

## Estado de Implementación por Módulo

| Módulo | Estado | Funcionalidades |
|--------|--------|----------------|
| Auth | ✅ Completo | Login, registro, JWT, roles |
| Visitors | ✅ Completo | CRUD, QR codes, pre-registro |
| Finances | ✅ Completo | Cuotas, pagos, presupuestos, reportes |
| Packages | ✅ Completo | Registro, tracking, notificaciones |
| Assembly | ✅ Completo | Votaciones tiempo real, quórum |
| Panic | ✅ Completo | Alertas tiempo real, resolución |
| Communications | ✅ Completo | SMS, Push, anuncios, mensajería |
| Marketplace | ✅ Completo | Listings, chat tiempo real |
| Multi-tenancy | ✅ Completo | Aislamiento por schema |
| WebSockets | ✅ Completo | 3 namespaces funcionales |

**Total de Endpoints REST**: 50+ endpoints  
**Total de Eventos WebSocket**: 15+ eventos  
**Cobertura de Funcionalidades**: ~90% completo