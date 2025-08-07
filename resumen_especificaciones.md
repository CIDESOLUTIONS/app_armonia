# Resumen de Especificaciones Técnicas - Aplicación Armonía

## Descripción General
Armonía es un ecosistema operativo integral para la gestión de conjuntos residenciales que trasciende el concepto tradicional de software de gestión. Se posiciona como el socio estratégico indispensable para toda la comunidad residencial, sirviendo a empresas de administración, administradores individuales, residentes y personal de seguridad.

## Stack Tecnológico
- **Frontend**: Next.js 15+, React 19+ con Server Components y Actions, TypeScript
- **Backend**: Node.js, NestJS
- **Base de Datos**: PostgreSQL 17.5+ con Prisma 6+ como ORM
- **Autenticación**: JWT (JSON Web Tokens)
- **Tiempo Real**: Socket.io
- **Comunicaciones**: Twilio
- **UI**: Shadcn/UI con paleta Índigo (#4f46e5) y blanco (#ffffff)
- **Pruebas**: Playwright (E2E), Vitest (Frontend), Jest (Backend)
- **Arquitectura**: Multi-tenant (esquema por conjunto)

## Portales y Módulos Principales

### 1. Portal Público
- Landing page optimizada para SEO y conversión
- Videos demostrativos de funcionalidades clave
- Información de planes y llamadas a la acción

### 2. Portal de Administración
- **Dashboard Principal**: KPIs, estado de cartera, PQR, reservas
- **Módulo de Inventario**: Inmuebles, residentes, vehículos, mascotas, amenidades
- **Módulo de Comunicaciones**: Cartelera digital, notificaciones, PQR, documentos
- **Módulo Financiero**: Cuotas automáticas, multas, pagos, conciliación bancaria
- **Módulo de Reservas**: Gestión de amenidades con calendario
- **Módulo de Proyectos**: Ciclo completo desde aprobación hasta entrega
- **Gestión de Usuarios**: Roles para personal operativo

### 3. Portal de Residentes (Web/Móvil)
- Acceso a comunicados y documentos
- Pagos en línea
- Reserva de amenidades
- Pre-registro de visitantes con QR
- Botón de pánico
- Gestión de presupuesto familiar
- **Marketplace Comunitario**: Compra/venta entre residentes

### 4. Portal de Seguridad
- Bitácora digital de incidentes
- Gestión avanzada de visitantes con QR
- Sistema de paquetería con notificaciones
- Monitor de acceso biométrico

### 5. Módulo de Democracia Digital
- Asambleas virtuales/híbridas
- Registro de asistencia y quórum
- Votaciones ponderadas
- Generación automática de actas

### 6. Portal Empresarial "Armonía Portafolio"
- Dashboard multi-propiedad
- Gestión centralizada de múltiples conjuntos
- Informes consolidados
- White-labeling

## Planes de Negocio
- **Básico (Freemium)**: Hasta 40 unidades - Inventario, PQR, cartelera
- **Estándar**: Hasta 150 unidades - Reservas, financiero básico, visitantes QR
- **Premium**: +150 unidades - Conciliación bancaria, API, marketplace, democracia digital
- **Empresarial**: Todo Premium + portafolio, white-labeling, soporte prioritario

## Características Técnicas Destacadas
- **Rendimiento**: LCP < 2.5s, INP < 200ms, CLS < 0.1
- **Seguridad**: Encriptación, protección CSRF/XSS/SQL, rate limiting, auditoría
- **Escalabilidad**: Arquitectura horizontal, caché estratégica, lazy loading
- **Accesibilidad**: WCAG 2.1 AA
- **Internacionalización**: Español, inglés, portugués
- **IoT Ready**: Integración con medidores inteligentes

## Funcionalidades Innovadoras
1. **Conciliación Bancaria Automática**: Importa extractos y cruza pagos automáticamente
2. **Marketplace Comunitario**: Comercio entre residentes con mensajería privada
3. **Gestión QR de Visitantes**: Códigos temporales para acceso seguro
4. **Democracia Digital**: Asambleas virtuales con votación ponderada
5. **Ecosistema de Alianzas**: Integración con servicios externos (seguros, fintech)
6. **Biometría Facial**: Para control de acceso de residentes

## Objetivo del Proyecto
Confirmar que todas las funcionalidades estén desarrolladas, validar el arranque de backend y frontend, ejecutar pruebas unitarias e integrales con cobertura del 100%, identificar y corregir problemas, y preparar la aplicación para despliegue en producción.

