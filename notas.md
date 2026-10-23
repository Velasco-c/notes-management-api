# Notas de construcción: API de notas

Este documento describe paso a paso cómo se creó la estructura del proyecto `notes-management-api`, qué hace cada archivo y cómo queda configurado el proyecto. Para el uso de la API consulta el [README](README.md).

## 1. Creación de la estructura del proyecto

El siguiente comando crea los directorios necesarios para organizar la API REST de notas por responsabilidades.

```bash
mkdir -p src src/config src/services src/dtos src/models src/validators src/routes src/middlewares src/controllers database
```

Descripción de los directorios:

| Directorio         | Responsabilidad                                                                                       |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| `src/`             | Contiene el código fuente de la aplicación.                                                           |
| `src/config/`      | Contiene la configuración externa, como la conexión a la base de datos.                               |
| `src/services/`    | Implementa la lógica de negocio y coordina las operaciones de datos.                                  |
| `src/dtos/`        | Define los objetos de transferencia de datos (DTO) para crear y actualizar notas.                     |
| `src/models/`      | Gestiona el acceso y las operaciones sobre los datos de las notas.                                    |
| `src/validators/`  | Define las reglas de validación de las solicitudes.                                                   |
| `src/routes/`      | Declara los endpoints y los asocia con sus controladores.                                             |
| `src/middlewares/` | Contiene funciones intermedias para procesar solicitudes, gestionar errores y aplicar reglas comunes. |
| `src/controllers/` | Recibe las solicitudes HTTP, coordina la respuesta y delega la lógica al servicio correspondiente.    |
| `database/`        | Contiene los scripts SQL para crear la base de datos y sus tablas.                                    |

La opción `-p` permite crear directorios intermedios y evita errores si alguno de ellos ya existe.

## 2. Creación de los archivos iniciales

El siguiente comando crea los archivos que conforman las principales capas de la API, además de la configuración y el script de base de datos.

```bash
touch src/server.js src/app.js src/config/db.js src/services/nota.service.js src/dtos/crear-nota.dto.js src/dtos/actualizar-nota.dto.js src/models/nota.model.js src/validators/nota.validator.js src/routes/nota.routes.js src/middlewares/error.middleware.js src/controllers/nota.controller.js database/schema.sql
```

Función de cada archivo:

| Archivo                               | Descripción                                                              |
| ------------------------------------- | ------------------------------------------------------------------------ |
| `src/server.js`                       | Carga la configuración, verifica la conexión con MySQL e inicia el servidor HTTP. |
| `src/app.js`                          | Configura Express, los middlewares generales y las rutas.                |
| `src/config/db.js`                    | Crea el pool de conexiones a MySQL a partir de las variables de entorno. |
| `src/services/nota.service.js`        | Contiene la lógica de negocio relacionada con las notas.                 |
| `src/dtos/crear-nota.dto.js`          | Define la estructura de los datos admitidos al crear una nota.           |
| `src/dtos/actualizar-nota.dto.js`     | Define la estructura de los datos admitidos al actualizar una nota.      |
| `src/models/nota.model.js`            | Ejecuta las operaciones de persistencia sobre las notas mediante MySQL.  |
| `src/validators/nota.validator.js`    | Establece las reglas para validar los datos recibidos.                   |
| `src/routes/nota.routes.js`           | Define las rutas HTTP del recurso de notas.                              |
| `src/middlewares/error.middleware.js` | Centraliza el tratamiento de errores de la aplicación.                   |
| `src/controllers/nota.controller.js`  | Gestiona las solicitudes y respuestas HTTP del recurso de notas.         |
| `database/schema.sql`                 | Crea la base de datos `notes_api` y la tabla `notas`.                    |

El comando `touch` crea archivos vacíos si no existen. Si ya existen, actualiza sus marcas de tiempo sin borrar su contenido.

## 3. Inicialización del proyecto Node.js

```bash
npm init -y
```

Este comando genera el archivo `package.json` con una configuración inicial. Dicho archivo contiene los metadatos del proyecto, los scripts de ejecución y las dependencias necesarias para instalar y ejecutar la aplicación.

> **Ojo:** `npm init -y` asigna `"main": "index.js"`. Como el punto de entrada de este proyecto es `src/server.js`, ese valor se corrige en el punto 5.

## 4. Instalación de dependencias

### Dependencias de producción

```bash
npm install cookie-parser express express-validator mysql2 dotenv
```

Estas bibliotecas proporcionan las funcionalidades necesarias para construir la API.

| Paquete             | Función                                                                      |
| ------------------- | ---------------------------------------------------------------------------- |
| `express`           | Gestiona el servidor HTTP, las rutas y el procesamiento de solicitudes.      |
| `cookie-parser`     | Interpreta las cookies recibidas en las solicitudes HTTP.                    |
| `express-validator` | Valida y permite sanitizar los datos de entrada.                             |
| `mysql2`            | Proporciona el controlador para conectarse a MySQL y ejecutar consultas SQL. |
| `dotenv`            | Carga variables de entorno desde un archivo `.env` en `process.env`.         |

### ¿Por qué `dotenv` es una dependencia de producción?

Aunque `dotenv` suele instalarse como dependencia de desarrollo en algunos proyectos, este proyecto lo importa en `src/server.js` para cargar su configuración al arrancar. Si estuviera en `devDependencies`, un despliegue con `npm install --omit=dev` (o `npm ci --omit=dev`) no lo instalaría y la aplicación fallaría al iniciar.

Si ya habías instalado `dotenv` como dependencia de desarrollo, ejecuta `npm install dotenv` (sin `-D`) para moverlo a `dependencies`.

## 5. Configuración del archivo `package.json`

Así queda el archivo `package.json` del proyecto:

```json
{
  "name": "api-notas",
  "version": "1.0.0",
  "description": "API REST para gestionar notas de clase, tareas e ideas con Express 5 y MySQL",
  "main": "src/server.js",
  "private": true,
  "type": "module",
  "scripts": {
    "start": "node src/server.js",
    "dev": "node --watch src/server.js"
  },
  "keywords": ["api", "rest", "notas", "express", "mysql", "nodejs"],
  "author": "Velasco-c",
  "license": "ISC",
  "engines": {
    "node": ">=20.0.0"
  },
  "dependencies": {
    "cookie-parser": "^1.4.7",
    "dotenv": "^18.0.9",
    "express": "^5.3.0",
    "express-validator": "^7.3.2",
    "mysql2": "^3.24.6"
  }
}
```

Descripción de las propiedades principales:

- `name`: identifica el proyecto mediante un nombre de paquete.
- `version`: indica la versión actual de la aplicación.
- `description`: resume el propósito del proyecto. `npm init` la deja vacía, así que conviene completarla.
- `main`: indica el archivo de entrada del proyecto, en este caso `src/server.js`.
- `private`: impide publicar el paquete por accidente en el registro de npm.
- `type: "module"`: habilita el uso de módulos ES, como `import` y `export`, en los archivos `.js`.
- `scripts`: define los comandos que se pueden ejecutar mediante npm.
- `keywords`: ayuda a identificar el proyecto si se publica o se busca en GitHub.
- `author`: identifica al autor del proyecto.
- `license`: especifica la licencia del software.
- `engines`: indica la versión mínima de Node.js necesaria. Express 5 requiere Node.js 18 o superior, y se usa 20 como mínimo para asegurar compatibilidad con las dependencias actuales.
- `dependencies`: contiene las bibliotecas requeridas durante la ejecución, incluida `dotenv`.

### Scripts disponibles

| Comando       | Descripción                                                                                                              |
| ------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `npm start`   | Inicia el servidor con Node.js.                                                                                          |
| `npm run dev` | Inicia el servidor con el modo de observación `--watch`, que reinicia el proceso cuando detecta cambios en los archivos. Requiere Node.js 18.11 o superior. |

## 6. Configuración de la base de datos

El archivo `database/schema.sql` crea la base de datos y la tabla `notas`:

```bash
mysql -u root -p < database/schema.sql
```

> **Advertencia:** el script comienza con `DROP DATABASE IF EXISTS notes_api`, por lo que borra la base de datos y todos sus datos si ya existe. Úsalo solo en desarrollo. En producción, las tablas deben crearse con migraciones.

La tabla `notas` tiene estos campos:

| Campo        | Tipo                             | Descripción                                    |
| ------------ | -------------------------------- | ---------------------------------------------- |
| `id`         | `INT UNSIGNED`                   | Identificador autoincremental.                 |
| `titulo`     | `VARCHAR(60)`                    | Título de la nota.                             |
| `contenido`  | `VARCHAR(280)`                   | Texto de la nota.                              |
| `categoria`  | `ENUM('clase', 'tarea', 'idea')` | Categoría de la nota.                          |
| `created_at` | `TIMESTAMP`                      | Fecha de creación.                             |
| `updated_at` | `TIMESTAMP`                      | Fecha de la última modificación.               |

Las mismas categorías aparecen en `nota.validator.js`. Si añades una categoría nueva, cámbiala en el `ENUM` del esquema y en el validador.

## 7. Variables de entorno

Crea el archivo `.env` a partir de la plantilla:

```bash
cp .env.example .env
```

Después ajusta los valores. En particular, `DB_PORT` debe coincidir con el puerto de tu servidor MySQL (el valor por defecto es `3306`; la plantilla trae `3307`).

Las variables se leen en dos lugares: `src/server.js` carga `dotenv/config` antes de importar el resto de módulos, y `src/config/db.js` usa `process.env` para crear el pool de conexiones.

## 8. Control de versiones

El archivo `.gitignore` evita subir archivos que no deben estar en el repositorio:

```
node_modules/
.env
*.log
npm-debug.log*
.DS_Store
```

Sin esta regla, `.env` (que contiene la contraseña de la base de datos) quedaría publicado en GitHub. Si ya lo subiste por error, cambia la contraseña y elimina el archivo del historial.

Después de instalar las dependencias, incluye también el archivo `package-lock.json` en el repositorio. Así todas las instalaciones usan exactamente las mismas versiones.

## 9. Ejecución y verificación

```bash
npm install
npm run dev
```

Si la conexión con MySQL falla, el servidor muestra el error y se detiene. Si funciona, comprueba el estado de la API:

```bash
curl http://localhost:3000/health
```

La respuesta esperada es `{"estado":"ok","version":"1.0.0"}`. Los endpoints y ejemplos de uso están en el [README](README.md).

## 10. Consideraciones técnicas

Antes de continuar con la implementación, ten en cuenta lo siguiente:

1. Versiones de paquetes: las versiones indicadas en `package.json` deben corresponder a las realmente instaladas. Compruébalas con `npm ls --depth=0` y evita declarar versiones que no estén disponibles en tu entorno.
2. Variables de entorno: almacena credenciales y configuración sensible, como los datos de conexión a MySQL, en un archivo `.env`; no las escribas directamente en el código fuente.
3. Importación de variables: si utilizas `dotenv`, carga su configuración antes de acceder a `process.env`, por ejemplo mediante `import 'dotenv/config'` en el punto de entrada.
4. Separación de responsabilidades: mantén los controladores centrados en HTTP, los servicios en la lógica de negocio y los modelos en el acceso a la base de datos.
5. Nombre del middleware: utiliza `error.middleware.js`, no `error.middlesware.js`, para mantener una nomenclatura correcta y consistente.
6. Consultas SQL: usa siempre placeholders (`?`) en `db.execute`. Los nombres de columna del modelo están fijos en una lista blanca, así que no se construyen a partir de la entrada del usuario.

## 11. Pendientes conocidos

- **JSON mal formado:** si el cliente envía un cuerpo JSON no válido, la API responde `500` en lugar de `400`, porque `error.middleware.js` responde siempre con `500`. Se puede corregir comprobando `error.type === 'entity.parse.failed'` y respondiendo con `400`.
- **Mensaje de error con errata:** el mensaje del middleware dice «No fue pisble completar la peticion». Debe decir «No fue posible completar la petición».
- **Alias sin uso en el modelo:** `nota.model.js` contiene los métodos `findByIdAnUpdate` y `findByIdAnDelete`, con un nombre mal escrito y que nadie llama. Se pueden eliminar.
- **Sin pruebas automáticas:** el proyecto no tiene tests. Un buen primer paso sería probar los validadores y los endpoints con una herramienta como `node:test` y `supertest`.