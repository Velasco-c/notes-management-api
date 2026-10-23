## 1. Creación de la estructura del proyecto

El siguiente comando crea los directorios necesarios para organizar la API REST de notas por responsabilidades.

```
mkdir -p src src/services src/dtos src/models src/validators src/routes src/middlewares src/controllers
```

Descripción de los directorios:

| Directorio         | Responsabilidad                                                                                       |
| ------------------ | ----------------------------------------------------------------------------------------------------- |
| `src/`             | Contiene el código fuente de la aplicación.                                                           |
| `src/services/`    | Implementa la lógica de negocio y coordina las operaciones de datos.                                  |
| `src/dtos/`        | Define los objetos de transferencia de datos (DTO) para crear y actualizar notas.                     |
| `src/models/`      | Gestiona el acceso y las operaciones sobre los datos de las notas.                                    |
| `src/validators/`  | Define las reglas de validación de las solicitudes.                                                   |
| `src/routes/`      | Declara los endpoints y los asocia con sus controladores.                                             |
| `src/middlewares/` | Contiene funciones intermedias para procesar solicitudes, gestionar errores y aplicar reglas comunes. |
| `src/controllers/` | Recibe las solicitudes HTTP, coordina la respuesta y delega la lógica al servicio correspondiente.    |

La opción `-p` permite crear directorios intermedios y evita errores si alguno de ellos ya existe.

## 2. Creación de los archivos iniciales

El siguiente comando crea los archivos que conformarán las principales capas de la API.

```
touch src/server.js src/app.js src/services/nota.service.js src/dtos/crear-nota.dto.js src/dtos/actualizar-nota.dto.js src/models/nota.model.js src/validators/nota.validator.js src/routes/nota.routes.js src/middlewares/error.middleware.js src/controllers/nota.controller.js
```

Función de cada archivo:

| Archivo                               | Descripción                                                             |
| ------------------------------------- | ----------------------------------------------------------------------- |
| `src/server.js`                       | Inicia el servidor HTTP y establece el puerto de escucha.               |
| `src/app.js`                          | Configura Express, los middlewares generales y las rutas.               |
| `src/services/nota.service.js`        | Contiene la lógica de negocio relacionada con las notas.                |
| `src/dtos/crear-nota.dto.js`          | Define la estructura de los datos admitidos al crear una nota.          |
| `src/dtos/actualizar-nota.dto.js`     | Define la estructura de los datos admitidos al actualizar una nota.     |
| `src/models/nota.model.js`            | Ejecuta las operaciones de persistencia sobre las notas mediante MySQL. |
| `src/validators/nota.validator.js`    | Establece las reglas para validar los datos recibidos.                  |
| `src/routes/nota.routes.js`           | Define las rutas HTTP del recurso de notas.                             |
| `src/middlewares/error.middleware.js` | Centraliza el tratamiento de errores de la aplicación.                  |
| `src/controllers/nota.controller.js`  | Gestiona las solicitudes y respuestas HTTP del recurso de notas.        |

El comando `touch` crea archivos vacíos si no existen. Si ya existen, actualiza sus marcas de tiempo sin borrar su contenido.

## 3. Inicialización del proyecto Node.js

```
npm init -y
```

Este comando genera el archivo `package.json` con una configuración inicial predeterminada. Dicho archivo contiene los metadatos del proyecto, los scripts de ejecución y las dependencias necesarias para instalar y ejecutar la aplicación.

## 4. Instalación de dependencias

### Dependencias de producción

```
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

### ¿Por qué se utiliza `dotenv` en producción?

Aunque `dotenv` suele instalarse como dependencia de desarrollo en algunos proyectos, si la aplicación lo importa para cargar su configuración durante la ejecución, debe estar disponible en el entorno de producción. Por eso se incluye en el comando anterior.

## 5. Configuración del archivo `package.json`

Después de inicializar el proyecto e instalar las dependencias, el archivo `package.json` puede quedar configurado de la siguiente manera:

```

{
  "name": "api-notas",
  "version": "1.0.0",
  "description": "API REST para gestionar notas con Express y MySQL",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "node --watch src/server.js"
  },
  "keywords": [
    "api",
    "notas",
    "express",
    "mysql"
  ],
  "author": "Velasco-c",
  "license": "ISC",
  "type": "module",
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
- `description`: resume el propósito del proyecto.
- `main`: establece el archivo de entrada declarado para el paquete.
- `scripts`: define los comandos que se pueden ejecutar mediante npm.
- `author`: identifica al autor del proyecto.
- `license`: especifica la licencia del software.
- `type: "module"`: habilita el uso de módulos ES, como `import` y `export`, en los archivos `.js`.
- `dependencies`: contiene las bibliotecas requeridas durante la ejecución.

### Scripts disponibles

| Comando       | Descripción                                                                                                              |
| ------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `npm start`   | Inicia el servidor con Node.js.                                                                                          |
| `npm run dev` | Inicia el servidor con el modo de observación `--watch`, que reinicia el proceso cuando detecta cambios en los archivos. |

## 6. Consideraciones técnicas

Antes de continuar con la implementación, ten en cuenta lo siguiente:

1. Versiones de paquetes: las versiones indicadas en `package.json` deben corresponder a las realmente instaladas. Compruébalas con `npm ls --depth=0` y evita declarar versiones que no estén disponibles en tu entorno.
2. Variables de entorno: almacena credenciales y configuración sensible, como los datos de conexión a MySQL, en un archivo `.env`; no las escribas directamente en el código fuente.
3. Importación de variables: si utilizas `dotenv`, carga su configuración antes de acceder a `process.env`, por ejemplo mediante `import 'dotenv/config'` en el punto de entrada.
4. Separación de responsabilidades: mantén los controladores centrados en HTTP, los servicios en la lógica de negocio y los modelos en el acceso a la base de datos.
5. Nombre del middleware: utiliza `error.middleware.js`, no `error.middlesware.js`, para mantener una nomenclatura correcta y consistente.

