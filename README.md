# Encuesta de Recomendaciones para Mejorar el Curso

Este proyecto es una aplicación web de producción diseñada para que los estudiantes universitarios envíen de manera 100% anónima recomendaciones sobre materias que cursaron. Cuenta además con un panel de administración privado y seguro para la docente, donde se pueden visualizar métricas agregadas (con gráficos interactivos), filtrar respuestas por curso, rango de fechas o palabra clave, exportar los resultados a CSV y generar reportes listos para imprimir a PDF.


## ✨ Lo que demuestra este proyecto
- Construcción de aplicaciones full-stack con Next.js, TypeScript y Supabase.
- Diseño de formularios anónimos con validación, privacidad y reglas de acceso.
- Panel administrativo con métricas, filtros, exportación CSV y reportes PDF.
- Cuidado por experiencia de usuario, seguridad básica y documentación reproducible.

## 🛠️ Stack Tecnológico
* **Framework**: Next.js (App Router, Server Actions, React 19)
* **Lenguaje**: TypeScript
* **Estilos**: Tailwind CSS con diseño responsivo y accesible
* **Manejo de Formularios**: React Hook Form y validación con Zod
* **Base de Datos y Seguridad**: Supabase (PostgreSQL, Row Level Security - RLS, Supabase Auth)
* **Visualizaciones**: Recharts para los gráficos del dashboard administrativo
* **Iconografía**: Lucide React
* **Mensajes / Toast**: Sonner
* **Gestor de Paquetes**: pnpm

---

## 🔒 Privacidad y Anonimato Estricto
La aplicación cumple rigurosamente con políticas de anonimato para proteger la confianza de los estudiantes:
1. **Sin Datos Identificativos**: No se solicita ni almacena el nombre, matrícula, correo, grupo, número de control, teléfono, IP, navegador ni dispositivo.
2. **Sólo Datos Académicos**: Únicamente se guardan las opciones de la encuesta, los comentarios de texto libre y la fecha/hora autogenerada por la base de datos al registrarse.
3. **Mensaje de Garantía**: La interfaz pública muestra discretamente en todo momento el aviso: *“No se solicita nombre, matrícula, correo ni grupo.”*

---

## 🚀 Instalación y Configuración Local

### Prerrequisitos
Tener instalado [Node.js](https://nodejs.org/) y [pnpm](https://pnpm.io/) (`npm i -g pnpm`).

### Paso 1: Clonar e instalar dependencias
Ingresa a la carpeta del proyecto e instala todas las dependencias requeridas:
```bash
cd encuesta-curso
pnpm install
```

### Paso 2: Configuración del proyecto en Supabase
1. Crea un proyecto en [Supabase](https://supabase.com/).
2. Ve a la pestaña **SQL Editor** en el panel de Supabase.
3. Abre una pestaña de consulta nueva y pega las sentencias SQL contenidas en el archivo `supabase/schema.sql`. Presiona **Run** para ejecutarlas. Esto creará las tablas `survey_responses` y `admin_users`, habilitará RLS e instalará la función de verificación `is_admin()`.
4. Ve a la sección **Authentication** -> **Users** y haz clic en **Add user** -> **Create user** para crear el correo y contraseña de la docente.
5. Copia el **User UID** de la docente creada.
6. Ve a la tabla `admin_users` en la sección **Table Editor** e inserta un nuevo registro colocando dicho UUID en el campo `user_id`. Guarda los cambios.

### Paso 3: Configurar Variables de Entorno
Copia el archivo de ejemplo para crear tu configuración local:
```bash
cp .env.local.example .env.local
```
Edita `.env.local` y asigna tus claves de Supabase:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anonima-publica
```

### Paso 4: Iniciar el servidor local
Arranca el servidor de desarrollo local:
```bash
pnpm dev
```
La aplicación estará disponible en `http://localhost:3000`.

---

## 📋 Rutas Implementadas
* `/` - Formulario público y anónimo para envío de encuestas.
* `/gracias` - Confirmación visual de recepción de respuestas.
* `/admin/login` - Inicio de sesión docente.
* `/admin/dashboard` - Métricas generales y gráficos analíticos.
* `/admin/respuestas` - Buscador, filtros avanzados y listado de respuestas.
* `/admin/respuestas/[id]` - Vista detallada de una respuesta individual.
* `/admin/respuestas/imprimir` - Reporte limpio optimizado para imprimir o guardar como PDF.

---

## 🛡️ Row Level Security (RLS) en Supabase
La base de datos tiene habilitado RLS por defecto:
* **Público (Anónimo)**: Sólo tiene permisos para insertar (`INSERT`) respuestas a través de la política `Allow public inserts`. Tiene prohibido leer, modificar o eliminar datos de la tabla.
* **Administrador**: La política `Allow admin select` valida que el usuario esté autenticado y que su identificador único (`auth.uid()`) exista dentro de la tabla `admin_users` mediante la función de base de datos `is_admin()`. Únicamente estos usuarios autorizados pueden ver los listados, gráficos y exportar datos.

---

## 🛡️ Protección Anti-Spam
La encuesta pública incluye un **campo honeypot** oculto. Si un robot o script automatizado intenta llenar este campo dummy, el servidor interceptará la solicitud y devolverá un mensaje simulado de éxito para disuadir la actividad de spam, pero ignorará silenciosamente el guardado en la base de datos para no alterar las métricas reales.

### Integración futura de Cloudflare Turnstile:
Si las respuestas automatizadas aumentan, se puede integrar de la siguiente manera:
1. Registra tu dominio en el panel de Cloudflare Turnstile.
2. Agrega el script de Turnstile a la aplicación y renderiza el widget en el formulario público.
3. En la Server Action `src/lib/actions/submit-survey.ts`, añade la validación del token `cf-turnstile-response` realizando una llamada POST a `https://challenges.cloudflare.com/turnstile/v0/siteverify` utilizando la clave secreta provista por Cloudflare. Si el resultado es inválido, rechaza la inserción en la base de datos.

---

## 📤 Despliegue en Vercel
1. Sube el código de tu repositorio a tu cuenta de GitHub.
2. Ingresa al panel de [Vercel](https://vercel.com/) y crea un nuevo proyecto apuntando a tu repositorio de GitHub.
3. Asegúrate de configurar la carpeta raíz o directorio del proyecto (en caso de que no esté en la raíz del repositorio).
4. Agrega las variables de entorno en la sección **Environment Variables**:
   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Haz clic en **Deploy**. Vercel configurará automáticamente el entorno de producción y te proporcionará una URL pública.

