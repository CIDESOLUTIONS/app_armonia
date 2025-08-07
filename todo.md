# TODO - Plan Optimizado Pruebas E2E Armonía

## FASE 1: Corregir pruebas E2E - Selectores y URLs ✅
- [x] Revisar archivo e2e/app.e2e-spec.ts actual
- [x] Comparar con especificaciones en e2e/Pruebas_totales_armonia.md
- [x] Identificar problemas críticos (URLs, selectores, flujos)
- [x] Crear documento de validación lógica VALIDACION_LOGICA_PRUEBAS.md
- [x] Corregir URLs base (/admin/ → /es/complex-admin/)
- [x] Revisar y corregir selectores de formularios (react-hook-form)
- [x] Ajustar flujos de autenticación con parámetros correctos
- [x] Actualizar validaciones de redirección
- [x] Corregir timeouts y esperas (networkidle)
- [x] Crear pruebas para portales adicionales (resident, reception)

## FASE 2: Ejecutar pruebas sistemáticamente ⏳
- [ ] Iniciar backend y frontend
- [ ] Ejecutar pruebas individuales por módulo
- [ ] CP-100: Registro de conjunto
- [ ] CP-200: Login administrador
- [ ] CP-201-206: Gestión de inventario
- [ ] CP-207-209: Comunicaciones
- [ ] CP-210-214: Finanzas
- [ ] CP-300+: Portal residentes
- [ ] CP-400+: Portal seguridad
- [ ] CP-500+: Portal empresarial
- [ ] Documentar errores específicos encontrados

## FASE 3: Corregir bugs encontrados ⏳
- [ ] Analizar errores de selectores
- [ ] Corregir campos de formularios faltantes
- [ ] Ajustar validaciones de datos
- [ ] Resolver problemas de navegación
- [ ] Hacer commits de correcciones

## FASE 4: Validación final y despliegue ⏳
- [ ] Ejecutar suite completa de pruebas E2E
- [ ] Confirmar 100% de funcionalidades
- [ ] Generar reporte final
- [ ] Push final al repositorio
- [ ] Confirmar listo para producción

## ESTADO ACTUAL
- ✅ Aplicación 100% desarrollada (backend + frontend)
- ✅ Prisma Client corregido
- ✅ URLs básicas de internacionalización corregidas
- ⏳ Iniciando corrección sistemática de pruebas E2E

