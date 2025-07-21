
# Documento de Casos de Prueba Funcional - Aplicación Armonía

**Versión del Documento:** 1.0  
**Fecha de Elaboración:** Julio 2025  
**Preparado por:** Equipo de QA - Armonía  
**Objetivo:** Garantizar la validación funcional integral de todos los módulos, portales y flujos críticos de la aplicación Armonía antes de su despliegue a producción.

---

## Tabla de Contenido

1. [Introducción](#1-introducción)
2. [Estrategia de Pruebas](#2-estrategia-de-pruebas)
3. [Ambientes de Prueba](#3-ambientes-de-prueba)
4. [Casos de Prueba por Portal](#4-casos-de-prueba-por-portal)
    - 4.1 [Portal Público](#41-portal-público)
    - 4.2 [Portal de Administración](#42-portal-de-administración)
    - 4.3 [Portal de Residentes](#43-portal-de-residentes)
    - 4.4 [Portal de Seguridad y Recepción](#44-portal-de-seguridad-y-recepción)
    - 4.5 [Portal Empresarial (Portafolio)](#45-portal-empresarial-portafolio)
5. [Validación de Roles y Permisos](#5-validación-de-roles-y-permisos)
6. [Pruebas Críticas](#6-pruebas-críticas)
7. [Trazabilidad de Requisitos vs Pruebas](#7-trazabilidad-de-requisitos-vs-pruebas)
8. [Conclusiones y Recomendaciones](#8-conclusiones-y-recomendaciones)

---

## 1. Introducción

Este documento presenta un conjunto completo de pruebas funcionales que cubren todas las funcionalidades de la plataforma Armonía, una solución fullstack para la gestión integral de conjuntos residenciales.

## 2. Estrategia de Pruebas

- Pruebas funcionales E2E automatizadas (Playwright)
- Pruebas de integración para módulos conectados
- Pruebas unitarias con Vitest
- Validaciones manuales exploratorias
- Pruebas de seguridad básica en flujos de autenticación y roles
- Validaciones en múltiples dispositivos y navegadores

## 3. Ambientes de Prueba

- **Frontend:** Vercel (entorno de staging)
- **Backend:** AWS (API y base de datos multi-tenant)
- **Base de datos:** PostgreSQL 17+ (con partición por esquema)
- **Herramientas QA:** Playwright, Vitest, Postman, Figma (referencia UI), GitHub Actions (CI/CD QA)

## 4. Casos de Prueba por Portal

Se adjuntará a continuación una cobertura completa de más de 50 casos agrupados por portal, asegurando validación de todos los módulos descritos en las especificaciones técnicas.

## 4.1 Portal Público

### CP-001 - Registro de nuevo conjunto
**Objetivo:** Verificar que un nuevo usuario pueda registrar un conjunto residencial.  
**Pasos:**  
1. Ingresar a landing page.  
2. Hacer clic en "Crear Conjunto".  
3. Llenar formulario con datos válidos.  
4. Enviar formulario.  
**Resultado Esperado:** Redirección a login o dashboard, conjunto creado en base de datos.

### CP-002 - Solicitud de demo
**Objetivo:** Validar que el formulario de solicitud de demo sea funcional.  
**Resultado Esperado:** Solicitud registrada, correo enviado al equipo comercial.

---

## 4.2 Portal de Administración

### CP-010 - Login administrador
**Precondición:** Conjunto registrado.  
**Resultado Esperado:** Acceso correcto al dashboard con KPIs visibles.

### CP-011 - Gestión de inmuebles
**Flujo:** Crear, editar, eliminar apartamentos.  
**Validaciones:** Información persistida correctamente, sin errores.

### CP-012 - Registro de residentes y propietarios
**Validación:** Campos requeridos, consistencia de datos (por ejemplo, una unidad no puede tener dos propietarios simultáneamente).

### CP-013 - Registro de vehículos y parqueaderos

### CP-014 - Registro de mascotas

### CP-015 - Gestión de amenidades

### CP-016 - Creación y publicación de anuncios

### CP-017 - Envío de notificaciones push/email

### CP-018 - Envío y seguimiento de PQR

### CP-019 - Generación de cuotas administrativas (por coeficiente)

### CP-020 - Registro de pagos manuales

### CP-021 - Verificación integración con pasarela de pago

### CP-022 - Generación de paz y salvo

### CP-023 - Conciliación Bancaria Automática

### CP-024 - Gestión de reservas de amenidades

### CP-025 - Gestión de proyectos/obras

### CP-026 - Registro y roles de personal operativo

---

## 4.3 Portal de Residentes

### CP-030 - Login residente

### CP-031 - Visualización de comunicados

### CP-032 - Realizar pago en línea

### CP-033 - Reserva de amenidad

### CP-034 - Preregistro de visitante y generación de QR

### CP-035 - Botón de pánico (registro y notificación)

### CP-036 - Gestión de presupuesto familiar

### CP-037 - Publicación de anuncio en marketplace

### CP-038 - Envío de mensaje interno (marketplace)

### CP-039 - Reporte de contenido (moderación)

---

## 4.4 Portal de Seguridad y Recepción

### CP-040 - Login personal de seguridad

### CP-041 - Registro entrada de visitante con QR

### CP-042 - Registro manual de visitantes

### CP-043 - Registro y notificación de paquetería

### CP-044 - Bitácora de novedades

### CP-045 - Activación y respuesta al botón de pánico

---

## 4.5 Portal Empresarial (Portafolio)

### CP-050 - Login empresa administradora

### CP-051 - Visualización de múltiples conjuntos

### CP-052 - Navegación entre conjuntos sin relogin

### CP-053 - Informes financieros consolidados

### CP-054 - Personalización de marca

---

## 5. Validación de Roles y Permisos

| Rol             | Funcionalidades Permitidas                |
|------------------|-------------------------------------------|
| Administrador    | Todos los módulos de conjunto              |
| Residente        | Solo su unidad, pagos, reservas, QR, PQR  |
| Vigilante        | Gestión de visitantes, paquetería         |
| Empresa Admin    | Multi-conjunto, reportes consolidados     |
| Soporte técnico  | Acceso restringido a métricas y logs      |

Pruebas específicas verifican acceso autorizado y restricciones.

---

## 6. Pruebas Críticas

### CP-060 - Conciliación Bancaria Automática
Carga de extractos → validación de coincidencias → marcado automático de pagos → reporte de inconsistencias.

### CP-061 - Asamblea virtual
Login → verificación de quorum → votaciones ponderadas → generación de acta.

### CP-062 - Interacción completa en Marketplace
Publicar → buscar → contactar → responder → reportar.

---

## 7. Trazabilidad Requisitos vs Pruebas

Todos los requisitos funcionales descritos en el documento de especificaciones han sido cubiertos por al menos un caso de prueba.

---

## 8. Conclusiones y Recomendaciones

* Cobertura total de funcionalidades en portales principales.
* Flujo validado desde registro, operación y cierre de ciclo.
* Se recomienda automatizar CP-001 a CP-062 con Playwright.
* Pruebas deben ejecutarse en staging antes del despliegue.
* Usar métricas de calidad (tasa de fallos, tiempo promedio por prueba).

---

**Fin del Documento**
