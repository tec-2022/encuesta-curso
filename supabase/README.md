# Configuración de Supabase - Encuesta de Curso

Este documento describe paso a paso cómo configurar el proyecto de Supabase, aplicar el esquema de la base de datos, configurar la seguridad y habilitar la cuenta del docente.

---

## 1. Crear un proyecto en Supabase
1. Ingresa a [Supabase](https://supabase.com/) e inicia sesión.
2. Haz clic en **New Project** y selecciona tu organización.
3. Configura el nombre del proyecto (ej. `encuesta-curso`), define una contraseña segura para la base de datos y selecciona la región más cercana (ej. `us-east-1` o la correspondiente a México).
4. Espera a que se complete la provisión de la base de datos.

---

## 2. Ejecutar el esquema SQL
1. En el panel lateral izquierdo de Supabase, ve a **SQL Editor**.
2. Haz clic en **New query** (Consulta nueva).
3. Copia el contenido del archivo [schema.sql](file:///c:/Users/kdl_m/Desktop/encuestaweb/encuesta-curso/supabase/schema.sql) y pégalo en el editor.
4. Haz clic en **Run** (Ejecutar) en la esquina superior derecha.
5. Verifica que las tablas `survey_responses` y `admin_users`, la función `is_admin()`, y las políticas RLS se hayan creado sin errores.

---

## 3. Crear la cuenta de la Docente en Supabase Auth
1. En el panel lateral, ve a **Authentication** (Autenticación).
2. Selecciona la pestaña **Users** (Usuarios).
3. Haz clic en **Add user** -> **Create user**.
4. Introduce el correo electrónico y la contraseña de la docente. Desmarca la casilla "Auto-confirm user" si quieres probar la confirmación por correo, o déjala marcada para confirmar la cuenta inmediatamente (Recomendado para pruebas rápidas).
5. Guarda la cuenta.

---

## 4. Obtener el UUID del usuario y registrarlo como Administrador
Por razones de seguridad, **no existe una pantalla de registro pública** para administradores. La docente debe registrarse manualmente en la base de datos de la siguiente manera:
1. En la lista de usuarios de **Authentication**, copia el **User UID** de la cuenta recién creada (un identificador con formato `uuid` como `550e8400-e29b-41d4-a716-446655440000`).
2. Ve al **Table Editor** en el panel lateral.
3. Selecciona la tabla `admin_users`.
4. Haz clic en **Insert row** (Insertar fila).
5. Pega el **User UID** en el campo `user_id`.
6. Haz clic en **Save** (Guardar).

---

## 5. Verificar Políticas de Seguridad y Row Level Security (RLS)
La base de datos tiene habilitado RLS de forma estricta:

* **Para usuarios no autenticados (Anónimos):**
  * Pueden enviar respuestas al formulario utilizando la API pública (operación `INSERT`).
  * Tienen prohibido listar, leer, actualizar o borrar cualquier registro de la base de datos.
  * Para comprobar esto, realiza una consulta HTTP GET a la tabla `survey_responses` sin cabeceras de autorización; Supabase retornará una lista vacía o error de acceso.

* **Para el administrador (Docente):**
  * Únicamente las cuentas autenticadas que tengan su `user_id` registrado en `admin_users` pasarán la validación de la función `is_admin()`.
  * Solo estas cuentas autorizadas pueden leer las respuestas (`SELECT`), ver métricas en el panel y exportar datos.

---

## 6. Configuración Futura de Cloudflare Turnstile (Anti-Spam Avanzado)
Si en el futuro se detecta tráfico de bots o respuestas automatizadas maliciosas en la encuesta pública, se puede integrar Cloudflare Turnstile de la siguiente manera:

1. Registra el sitio en el panel de [Cloudflare Turnstile](https://dash.cloudflare.com/) para obtener una **Sitekey** pública y una **Secret Key** privada.
2. Agrega el script de Turnstile a la aplicación e incorpora el componente `<Turnstile sitekey="..." />` en el formulario de la encuesta.
3. Al enviar el formulario, el cliente obtendrá un token de verificación `cf-turnstile-response`.
4. En la Server Action que procesa el envío de la encuesta (`src/lib/actions/submit-survey.ts`), realiza una petición POST de validación hacia:
   `https://challenges.cloudflare.com/turnstile/v0/siteverify`
   Enviando la `Secret Key` y el token recibido.
5. Si Cloudflare responde con `success: false`, la Server Action rechazará el guardado en la base de datos.
