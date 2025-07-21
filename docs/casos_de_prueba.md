# Casos de Prueba para la Aplicación Armonía

Este documento detalla casos de prueba específicos para validar las características y funcionalidades clave de la aplicación Armonía, incluyendo los pasos para la ejecución y la respuesta esperada.

## 1. Flujo de Registro y Acceso al Portal de Administración

**Descripción:** Un nuevo usuario se registra en la landing page para crear un nuevo conjunto residencial y luego accede al portal de administración.

**Precondiciones:**
*   La aplicación está desplegada y accesible.
*   No existe un conjunto residencial con la información a registrar.

**Pasos:**
1.  Navegar a la landing page de la aplicación.
2.  Hacer clic en el botón o enlace de "Registrarse" o "Crear Conjunto".
3.  Completar el formulario de registro con la información del nuevo conjunto (nombre, dirección, etc.) y los datos del administrador (correo electrónico, contraseña).
4.  Enviar el formulario de registro.
5.  Verificar la redirección a la página de confirmación o login.
6.  Intentar iniciar sesión en el portal de administración con el correo electrónico y la contraseña del administrador recién creado.

**Respuesta Esperada:**
*   El sistema valida la información y crea un nuevo registro de conjunto residencial en la base de datos con la información proporcionada.
*   Se crea un nuevo usuario administrador asociado a ese conjunto con el correo y contraseña adecuados.
*   El usuario es redirigido a la página de login o a un mensaje de éxito.
*   Al iniciar sesión, el usuario administrador accede correctamente al dashboard del portal de administración.
*   El administrador puede navegar por todas las opciones del menú lateral (Gestión de Inventario, Comunicaciones, Financiero, etc.) sin errores de acceso o permisos.

## 2. Gestión de Residentes (Creación y Visualización)

**Descripción:** Un administrador crea un nuevo residente y verifica que se muestre correctamente en la lista de residentes.

**Precondiciones:**
*   El administrador ha iniciado sesión en el portal de administración.

**Pasos:**
1.  Navegar a la sección de "Gestión de Inventario" -> "Residentes".
2.  Hacer clic en el botón "Agregar Residente".
3.  Completar el formulario con los datos del nuevo residente (nombre, apellido, unidad, etc.).
4.  Guardar el residente.
5.  Buscar el residente recién creado en la tabla de residentes.

**Respuesta Esperada:**
*   El sistema valida los datos y crea el registro del nuevo residente en la base de datos.
*   El residente aparece en la lista de residentes con la información correcta.
*   No se muestran errores al guardar o al visualizar la lista.

## 3. Envío de Anuncios (Comunicación)

**Descripción:** Un administrador envía un anuncio a todos los residentes y verifica que se registre correctamente.

**Precondiciones:**
*   El administrador ha iniciado sesión en el portal de administración.

**Pasos:**
1.  Navegar a la sección de "Comunicaciones" -> "Cartelera Digital" o "Anuncios".
2.  Hacer clic en el botón "Crear Anuncio".
3.  Ingresar un título y contenido para el anuncio.
4.  Seleccionar la opción para enviar a "Todos los Residentes".
5.  Enviar el anuncio.
6.  Verificar que el anuncio aparezca en la lista de anuncios publicados.

**Respuesta Esperada:**
*   El anuncio se guarda en la base de datos.
*   El anuncio es visible en la cartelera digital del portal de administración.
*   (Opcional, si se implementa) Los residentes reciben una notificación push o por correo electrónico sobre el nuevo anuncio.

## 4. Registro de Visitas (Seguridad y Recepción)

**Descripción:** El personal de seguridad registra la entrada de un visitante.

**Precondiciones:**
*   El personal de seguridad ha iniciado sesión en el portal de seguridad/recepción.

**Pasos:**
1.  Navegar a la sección de "Gestión de Visitantes".
2.  Hacer clic en "Registrar Entrada de Visitante".
3.  Ingresar los datos del visitante (nombre, documento, unidad a visitar).
4.  Registrar la entrada.
5.  Verificar que la visita aparezca en el historial de visitas activas.

**Respuesta Esperada:**
*   La visita se registra correctamente en la base de datos.
*   La visita aparece en la lista de visitas activas.
*   (Opcional, si se implementa) El residente de la unidad visitada recibe una notificación sobre la llegada del visitante.

## 5. Pago de Cuotas de Administración (Financiero - Portal de Residentes)

**Descripción:** Un residente paga una cuota de administración pendiente a través del portal de residentes.

**Precondiciones:**
*   Un residente ha iniciado sesión en el portal de residentes.
*   Existe una cuota de administración pendiente para ese residente.

**Pasos:**
1.  Navegar a la sección "Financiero" -> "Mis Cuotas".
2.  Identificar una cuota pendiente y hacer clic en "Pagar".
3.  Seleccionar un método de pago (ej. tarjeta de crédito).
4.  Completar los datos de pago.
5.  Confirmar el pago.

**Respuesta Esperada:**
*   El sistema procesa el pago correctamente a través de la pasarela de pago.
*   El estado de la cuota cambia a "Pagada" en la base de datos y en el portal del residente.
*   El residente recibe una confirmación de pago.
*   El pago se refleja en los informes financieros del administrador.


