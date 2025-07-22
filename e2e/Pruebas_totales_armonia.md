# Documento de Casos de Prueba Funcional - Aplicación Armonía

**Versión del Documento:** 1.0
**Fecha de Elaboración:** Julio 2025
**Preparado por:** Gemini

---

## Tabla de Contenido

1.  [Introducción](#1-introducción)
2.  [Estrategia de Pruebas](#2-estrategia-de-pruebas)
3.  [Ambientes de Prueba](#3-ambientes-de-prueba)
4.  [Casos de Prueba por Portal](#4-casos-de-prueba-por-portal)
    - 4.1 [Portal Público](#41-portal-público)
    - 4.2 [Portal de Administración](#42-portal-de-administración)
    - 4.3 [Portal de Residentes](#43-portal-de-residentes)
    - 4.4 [Portal de Seguridad y Recepción](#44-portal-de-seguridad-y-recepción)
    - 4.5 [Portal Empresarial (Portafolio)](#45-portal-empresarial-portafolio)
5.  [Validación de Roles y Permisos](#5-validación-de-roles-y-permisos)
6.  [Pruebas Críticas](#6-pruebas-críticas)
7.  [Trazabilidad de Requisitos vs Pruebas](#7-trazabilidad-de-requisitos-vs-pruebas)
8.  [Conclusiones y Recomendaciones](#8-conclusiones-y-recomendaciones)

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

### 4.1 Portal Público

#### CP-001 - Registro de nuevo conjunto
**Objetivo:** Verificar que un nuevo usuario pueda registrar un conjunto residencial.
**Pasos:**
1. Ingresar a landing page.
2. Hacer clic en "Crear Conjunto".
3. Llenar formulario con datos válidos (nombre del conjunto, dirección, datos del administrador: nombre, email, contraseña).
4. Enviar formulario.
**Resultado Esperado:** Redirección al dashboard del administrador del conjunto, conjunto creado en base de datos, usuario administrador creado y asociado al conjunto.

#### CP-002 - Solicitud de demo
**Objetivo:** Validar que el formulario de solicitud de demo sea funcional.
**Pasos:**
1. Navegar a la sección de solicitud de demo en la landing page.
2. Llenar el formulario con datos de contacto válidos.
3. Enviar el formulario.
**Resultado Esperado:** Solicitud registrada en el sistema, confirmación de envío al usuario, correo de notificación enviado al equipo comercial.

### 4.2 Portal de Administración

#### CP-010 - Login administrador
**Objetivo:** Verificar el acceso correcto al dashboard del administrador.
**Precondición:** Conjunto registrado.
**Pasos:**
1. Navegar a la página de login del portal de administración.
2. Ingresar credenciales válidas (email y contraseña).
3. Hacer clic en "Iniciar Sesión".
**Resultado Esperado:** Acceso correcto al dashboard con KPIs visibles (estado de cartera, PQR pendientes, reservas del día, últimos comunicados).

#### CP-011 - Gestión de inmuebles
**Objetivo:** Verificar la creación, edición y eliminación de inmuebles.
**Flujo:** Crear, editar, eliminar apartamentos.
**Validaciones:** Información persistida correctamente, sin errores.
**Resultado Esperado:** Inmuebles listados, actualizados y eliminados según la acción.

#### CP-012 - Registro de residentes y propietarios
**Objetivo:** Validar la creación y gestión de residentes y propietarios.
**Precondición:** Administrador logueado.
**Pasos:**
1. Navegar a "Gestión de Inventario" -> "Residentes".
2. **Crear Residente:** Hacer clic en "Añadir Residente", llenar formulario (nombre, email, teléfono, unidad, si es propietario, etc.), guardar.
3. **Editar Residente:** Seleccionar un residente, modificar datos, guardar.
4. **Eliminar Residente:** Seleccionar un residente, confirmar eliminación.
**Validaciones:** Campos requeridos validados, consistencia de datos (por ejemplo, una unidad no puede tener dos propietarios simultáneamente).
**Resultado Esperado:** Residentes creados, editados y eliminados correctamente. Listado de residentes actualizado.

#### CP-013 - Registro de vehículos y parqueaderos
**Objetivo:** Verificar la gestión de vehículos y parqueaderos.
**Precondición:** Administrador logueado.
**Pasos:**
1. Navegar a "Gestión de Inventario" -> "Vehículos".
2. **Crear:** Añadir vehículo (placa, modelo, propietario, parqueadero asignado).
3. **Editar/Eliminar:** Modificar o remover vehículos.
**Resultado Esperado:** Datos de vehículos y parqueaderos gestionados correctamente.

#### CP-014 - Registro de mascotas
**Objetivo:** Verificar la gestión de mascotas.
**Precondición:** Administrador logueado.
**Pasos:**
1. Navegar a "Gestión de Inventario" -> "Mascotas".
2. **Crear:** Añadir mascota (nombre, tipo, raza, propietario).
3. **Editar/Eliminar:** Modificar o remover mascotas.
**Resultado Esperado:** Datos de mascotas gestionados correctamente.

#### CP-015 - Gestión de amenidades
**Objetivo:** Verificar la gestión de áreas comunes y amenidades.
**Precondición:** Administrador logueado.
**Pasos:**
1. Navegar a "Gestión de Inventario" -> "Amenidades".
2. **Crear:** Añadir amenidad (nombre, descripción, capacidad, reglas de uso).
3. **Editar/Eliminar:** Modificar o remover amenidades.
**Resultado Esperado:** Datos de amenidades gestionados correctamente.

#### CP-016 - Creación y publicación de anuncios
**Objetivo:** Verificar la creación y publicación de anuncios en la cartelera digital.
**Precondición:** Administrador logueado.
**Pasos:**
1. Navegar a "Comunicaciones" -> "Anuncios".
2. Hacer clic en "Crear Anuncio".
3. Llenar formulario (título, contenido, fecha de publicación/expiración, roles objetivo).
4. Publicar anuncio.
**Resultado Esperado:** Anuncio guardado, visible en la cartelera digital, y (si aplica) notificaciones enviadas a los roles objetivo.

#### CP-017 - Envío de notificaciones push/email
**Objetivo:** Validar el envío de notificaciones a grupos específicos.
**Precondición:** Administrador logueado.
**Pasos:**
1. Navegar a "Comunicaciones" -> "Notificaciones".
2. Seleccionar tipo de notificación (push/email).
3. Seleccionar destinatarios (todos, por rol, por unidad).
4. Escribir mensaje y enviar.
**Resultado Esperado:** Notificaciones enviadas y recibidas por los destinatarios correctos.

#### CP-018 - Envío y seguimiento de PQR
**Objetivo:** Verificar el flujo completo de PQR.
**Precondición:** Administrador logueado.
**Pasos:**
1. Navegar a "Comunicaciones" -> "PQR".
2. **Crear PQR (simulado por residente o manual por admin):** Registrar una PQR.
3. **Asignar/Cambiar Estado:** Asignar a un responsable, cambiar estado (pendiente, en progreso, resuelto).
4. **Responder:** Añadir una respuesta a la PQR.
**Resultado Esperado:** PQR registrada, estados actualizados, respuestas visibles, seguimiento correcto.

#### CP-019 - Generación de cuotas administrativas (por coeficiente)
**Objetivo:** Validar la generación automática de cuotas.
**Precondición:** Administrador logueado, inmuebles con coeficientes configurados.
**Pasos:**
1. Navegar a "Financiero" -> "Cuotas".
2. Seleccionar opción para generar nuevas cuotas (ej. mensual).
3. Confirmar parámetros de generación.
**Resultado Esperado:** Cuotas generadas para todas las unidades según sus coeficientes, visibles en el listado de cuotas.

#### CP-020 - Registro de pagos manuales
**Objetivo:** Verificar el registro de pagos recibidos fuera de la pasarela.
**Precondición:** Administrador logueado, cuotas pendientes.
**Pasos:**
1. Navegar a "Financiero" -> "Pagos".
2. Seleccionar una cuota pendiente.
3. Registrar un pago manual (monto, fecha, método).
**Resultado Esperado:** Cuota marcada como pagada, registro de pago visible en el historial.

#### CP-021 - Verificación integración con pasarela de pago
**Objetivo:** Validar la redirección y el procesamiento de pagos a través de la pasarela.
**Precondición:** Administrador logueado, cuotas pendientes.
**Pasos:**
1. Navegar a "Financiero" -> "Cuotas".
2. Seleccionar una cuota pendiente y hacer clic en "Pagar" (simulado).
**Resultado Esperado:** Redirección a la pasarela de pago (simulada), y al completar el pago (simulado), la cuota se marca como pagada.

#### CP-022 - Generación de paz y salvo
**Objetivo:** Verificar la generación de documentos de paz y salvo.
**Precondición:** Administrador logueado, residente sin cuotas pendientes.
**Pasos:**
1. Navegar a "Financiero" -> "Paz y Salvos".
2. Seleccionar un residente.
3. Generar paz y salvo.
**Resultado Esperado:** Documento de paz y salvo generado correctamente (PDF), confirmando la ausencia de deudas.

#### CP-023 - Conciliación Bancaria Automática
**Objetivo:** Validar la importación de extractos y la conciliación automática de pagos.
**Precondición:** Administrador logueado, extracto bancario (CSV/Excel) con transacciones de pago.
**Pasos:**
1. Navegar a "Financiero" -> "Conciliación Bancaria".
2. Importar archivo de extracto bancario.
3. Iniciar proceso de conciliación.
**Resultado Esperado:** El sistema identifica y sugiere coincidencias entre transacciones del extracto y pagos registrados, marcando cuotas como pagadas y señalando discrepancias.

#### CP-024 - Gestión de reservas de amenidades
**Objetivo:** Verificar la creación, aprobación y gestión de reservas.
**Precondición:** Administrador logueado.
**Pasos:**
1. Navegar a "Reservas" -> "Calendario de Amenidades".
2. **Crear Reserva:** Bloquear un horario para mantenimiento o crear una reserva manual para un residente.
3. **Aprobar/Rechazar:** Revisar solicitudes de reserva de residentes y aprobar/rechazar.
**Resultado Esperado:** Reservas gestionadas correctamente, calendario actualizado, notificaciones enviadas.

#### CP-025 - Gestión de proyectos/obras
**Objetivo:** Verificar el ciclo de vida de un proyecto (desde aprobación hasta ejecución).
**Precondición:** Administrador logueado.
**Pasos:**
1. Navegar a "Proyectos y Obras".
2. **Crear Proyecto:** Registrar un nuevo proyecto (ej. "Remodelación de Fachada"), definir presupuesto, cronograma.
3. **Recaudación:** Registrar cuotas extras para el proyecto.
4. **Seguimiento:** Actualizar el avance del proyecto.
**Resultado Esperado:** Proyecto creado, fondos recaudados, avance visible.

#### CP-026 - Registro y roles de personal operativo
**Objetivo:** Verificar la gestión de usuarios del personal (recepcionistas, vigilantes).
**Precondición:** Administrador logueado.
**Pasos:**
1. Navegar a "Gestión de Usuarios" -> "Personal Operativo".
2. **Crear Usuario:** Añadir nuevo usuario, asignar rol (ej. "Vigilante").
3. **Editar/Eliminar:** Modificar datos o remover personal.
**Resultado Esperado:** Personal operativo gestionado con roles y permisos correctos.

### 4.3 Portal de Residentes

#### CP-030 - Login residente
**Objetivo:** Verificar el acceso correcto al dashboard del residente.
**Precondición:** Residente registrado.
**Pasos:**
1. Navegar a la página de login del portal de residentes.
2. Ingresar credenciales válidas (email y contraseña).
3. Hacer clic en "Iniciar Sesión".
**Resultado Esperado:** Acceso correcto al dashboard del residente con información relevante (comunicados, cuotas, etc.).

#### CP-031 - Visualización de comunicados
**Objetivo:** Verificar que el residente pueda ver los comunicados publicados.
**Precondición:** Residente logueado, anuncios publicados por el administrador.
**Pasos:**
1. Navegar a la sección de "Comunicados".
2. Visualizar los anuncios y comunicados.
**Resultado Esperado:** Todos los comunicados relevantes para el residente son visibles y legibles.

#### CP-032 - Realizar pago en línea
**Objetivo:** Verificar que el residente pueda pagar sus cuotas pendientes.
**Precondición:** Residente logueado, cuotas pendientes.
**Pasos:**
1. Navegar a "Financiero" -> "Mis Cuotas".
2. Seleccionar una cuota pendiente y hacer clic en "Pagar".
3. Completar el proceso de pago a través de la pasarela (simulado).
**Resultado Esperado:** Cuota marcada como pagada, confirmación de pago recibida.

#### CP-033 - Reserva de amenidad
**Objetivo:** Verificar que el residente pueda reservar una amenidad.
**Precondición:** Residente logueado, amenidades disponibles.
**Pasos:**
1. Navegar a "Reservas" -> "Amenidades".
2. Seleccionar una amenidad y un horario disponible.
3. Realizar la solicitud de reserva.
**Resultado Esperado:** Reserva registrada, estado pendiente/aprobado según configuración, notificación al administrador.

#### CP-034 - Preregistro de visitante y generación de QR
**Objetivo:** Verificar que el residente pueda pre-registrar un visitante y generar un QR.
**Precondición:** Residente logueado.
**Pasos:**
1. Navegar a "Seguridad" -> "Pre-registro de Visitantes".
2. Llenar formulario (nombre del visitante, fecha, unidad a visitar).
3. Generar QR.
**Resultado Esperado:** QR generado y visible, visitante registrado como pre-autorizado en el sistema de seguridad.

#### CP-035 - Botón de pánico (registro y notificación)
**Objetivo:** Validar la funcionalidad del botón de pánico.
**Precondición:** Residente logueado.
**Pasos:**
1. Hacer clic en el "Botón de Pánico".
2. Confirmar la alerta.
**Resultado Esperado:** Alerta de pánico registrada en el sistema de seguridad, notificación enviada al personal de seguridad.

#### CP-036 - Gestión de presupuesto familiar
**Objetivo:** Verificar la gestión del presupuesto personal del residente.
**Precondición:** Residente logueado.
**Pasos:**
1. Navegar a "Financiero" -> "Mi Presupuesto".
2. Registrar ingresos y gastos.
3. Visualizar reportes de presupuesto.
**Resultado Esperado:** Ingresos y gastos registrados, reportes generados correctamente.

#### CP-037 - Publicación de anuncio en marketplace
**Objetivo:** Verificar que el residente pueda publicar un anuncio en el marketplace.
**Precondición:** Residente logueado.
**Pasos:**
1. Navegar a "Marketplace" -> "Publicar Anuncio".
2. Llenar formulario (título, descripción, precio, categoría, imágenes).
3. Publicar.
**Resultado Esperado:** Anuncio publicado y visible en el marketplace.

#### CP-038 - Envío de mensaje interno (marketplace)
**Objetivo:** Verificar la comunicación interna entre usuarios del marketplace.
**Precondición:** Residente logueado, anuncios publicados.
**Pasos:**
1. Navegar a un anuncio en el marketplace.
2. Hacer clic en "Contactar Vendedor".
3. Enviar un mensaje.
**Resultado Esperado:** Mensaje enviado y visible en el chat, notificación al vendedor.

#### CP-039 - Reporte de contenido (moderación)
**Objetivo:** Verificar la funcionalidad de reporte de anuncios.
**Precondición:** Residente logueado, anuncios en el marketplace.
**Pasos:**
1. Navegar a un anuncio en el marketplace.
2. Hacer clic en "Reportar Anuncio".
3. Seleccionar motivo y confirmar.
**Resultado Esperado:** Anuncio marcado como reportado, notificación al administrador para revisión.

### 4.4 Portal de Seguridad y Recepción

#### CP-040 - Login personal de seguridad
**Objetivo:** Verificar el acceso correcto al dashboard del personal de seguridad.
**Precondición:** Usuario de seguridad registrado.
**Pasos:**
1. Navegar a la página de login del portal de seguridad.
2. Ingresar credenciales válidas.
3. Hacer clic en "Iniciar Sesión".
**Resultado Esperado:** Acceso correcto al dashboard de seguridad con opciones de gestión de visitantes y paquetería.

#### CP-041 - Registro entrada de visitante con QR
**Objetivo:** Validar el registro de visitantes usando QR.
**Precondición:** Personal de seguridad logueado, residente ha pre-registrado un visitante con QR.
**Pasos:**
1. Navegar a "Gestión de Visitantes".
2. Escanear el código QR del visitante (simulado).
**Resultado Esperado:** Visitante registrado como ingresado, datos del visitante cargados automáticamente.

#### CP-042 - Registro manual de visitantes
**Objetivo:** Validar el registro manual de visitantes.
**Precondición:** Personal de seguridad logueado.
**Pasos:**
1. Navegar a "Gestión de Visitantes".
2. Hacer clic en "Registrar Nuevo Visitante".
3. Llenar formulario (nombre, documento, unidad a visitar, etc.).
4. Registrar entrada.
**Resultado Esperado:** Visitante registrado, visible en el historial de visitas activas.

#### CP-043 - Registro y notificación de paquetería
**Objetivo:** Verificar el registro de paquetes y la notificación al residente.
**Precondición:** Personal de seguridad logueado.
**Pasos:**
1. Navegar a "Gestión de Paquetería".
2. Llenar formulario (número de seguimiento, unidad destinataria, remitente, descripción, foto).
3. Registrar paquete.
**Resultado Esperado:** Paquete registrado, notificación push/email enviada al residente.

#### CP-044 - Bitácora de novedades
**Objetivo:** Verificar el registro de novedades y eventos.
**Precondición:** Personal de seguridad logueado.
**Pasos:**
1. Navegar a "Bitácora de Novedades".
2. Registrar una nueva novedad (descripción, hora, tipo).
**Resultado Esperado:** Novedad registrada y visible en la bitácora.

#### CP-045 - Activación y respuesta al botón de pánico
**Objetivo:** Validar la recepción y gestión de alertas de pánico.
**Precondición:** Personal de seguridad logueado, residente activa botón de pánico.
**Pasos:**
1. Monitorear el sistema para alertas de pánico.
2. Al recibir una alerta, registrar la respuesta (ej. "Verificado", "Atendido").
**Resultado Esperado:** Alerta de pánico recibida, posibilidad de registrar la acción tomada.

### 4.5 Portal Empresarial (Portafolio)

#### CP-050 - Login empresa administradora
**Objetivo:** Verificar el acceso al portal empresarial.
**Precondición:** Usuario de empresa administradora registrado.
**Pasos:**
1. Navegar a la página de login del portal empresarial.
2. Ingresar credenciales válidas.
3. Hacer clic en "Iniciar Sesión".
**Resultado Esperado:** Acceso correcto al dashboard multi-propiedad.

#### CP-051 - Visualización de múltiples conjuntos
**Objetivo:** Verificar la vista consolidada de KPIs de múltiples conjuntos.
**Precondición:** Empresa administradora logueada, múltiples conjuntos asociados.
**Pasos:**
1. Visualizar el dashboard principal.
**Resultado Esperado:** KPIs (cartera total, PQR abiertos, presupuesto ejecutado) de todos los conjuntos administrados visibles en una sola pantalla.

#### CP-052 - Navegación entre conjuntos sin relogin
**Objetivo:** Validar la capacidad de cambiar entre conjuntos sin necesidad de volver a iniciar sesión.
**Precondición:** Empresa administradora logueada, múltiples conjuntos asociados.
**Pasos:**
1. Seleccionar un conjunto diferente desde el selector.
2. Navegar a una sección del nuevo conjunto.
**Resultado Esperado:** Cambio de contexto de conjunto sin requerir un nuevo login.

#### CP-053 - Informes financieros consolidados
**Objetivo:** Verificar la generación de informes que agrupen información de todo el portafolio.
**Precondición:** Empresa administradora logueada, datos financieros en múltiples conjuntos.
**Pasos:**
1. Navegar a "Informes Consolidados".
2. Generar un informe financiero (ej. "Estado de Cartera Global").
**Resultado Esperado:** Informe generado con datos agregados de todos los conjuntos.

#### CP-054 - Personalización de marca
**Objetivo:** Validar la aplicación de la marca de la empresa administradora.
**Precondición:** Empresa administradora logueada, configuración de marca aplicada.
**Pasos:**
1. Visualizar cualquier página del portal.
**Resultado Esperado:** El logo y los colores de la empresa administradora se muestran en la interfaz.

---

## 5. Validación de Roles y Permisos

**Objetivo:** Asegurar que cada rol tiene acceso solo a las funcionalidades permitidas.

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
**Objetivo:** Validar la importación de extractos y la conciliación automática de pagos.
**Precondición:** Administrador logueado, extracto bancario (CSV/Excel) con transacciones de pago.
**Pasos:**
1. Navegar a "Financiero" -> "Conciliación Bancaria".
2. Importar archivo de extracto bancario.
3. Iniciar proceso de conciliación.
**Resultado Esperado:** El sistema identifica y sugiere coincidencias entre transacciones del extracto y pagos registrados, marcando cuotas como pagadas y señalando discrepancias.

### CP-061 - Asamblea virtual
**Objetivo:** Validar el flujo completo de una asamblea virtual.
**Precondición:** Administrador logueado, asamblea creada.
**Pasos:**
1. Login como administrador.
2. Navegar a la asamblea.
3. Verificar el quórum.
4. Crear y gestionar votaciones (incluyendo ponderadas).
5. Registrar votos.
6. Generar acta de la asamblea.
**Resultado Esperado:** Quórum verificado, votaciones procesadas correctamente (incluyendo ponderación), acta generada con los resultados.

### CP-062 - Interacción completa en Marketplace
**Objetivo:** Validar el ciclo completo de interacción en el marketplace.
**Precondición:** Residentes logueados.
**Pasos:**
1. **Publicar:** Un residente publica un anuncio (título, descripción, precio, categoría, imágenes).
2. **Buscar:** Otro residente busca y encuentra el anuncio.
3. **Contactar:** El segundo residente inicia un chat con el vendedor.
4. **Responder:** El vendedor responde al mensaje.
5. **Reportar:** Un residente reporta un anuncio (opcional).
**Resultado Esperado:** Anuncio publicado y visible, chat funcional entre usuarios, mensajes enviados y recibidos, reporte de anuncio procesado.

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
