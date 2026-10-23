# notes-management-api

API REST para gestionar notas organizadas en tres categorías: **clase**, **tarea** e **idea**. Está construida con Node.js, Express 5 y MySQL.

## Características

- CRUD completo de notas: crear, listar, consultar, actualizar parcialmente y eliminar.
- Validación de los datos de entrada con `express-validator`.
- Separación por capas: rutas, controladores, servicios, modelos y DTOs.
- Cookie `ultimaCategoria` que recuerda la última categoría usada al crear una nota.
- Endpoint de estado (`/health`) para comprobar que el servicio está en funcionamiento.

## Tecnologías

| Tecnología          | Uso                                                    |
| ------------------- | ------------------------------------------------------ |
| Node.js (ES Modules)| Entorno de ejecución                                   |
| Express 5           | Servidor HTTP, rutas y middlewares                     |
| MySQL 8             | Almacenamiento de las notas                            |
| mysql2              | Conexión a MySQL con consultas parametrizadas          |
| express-validator   | Validación y saneamiento de las peticiones             |
| cookie-parser       | Lectura de cookies                                     |
| dotenv              | Carga de variables de entorno desde `.env`             |

## Requisitos

- Node.js 20 o superior
- npm
- MySQL 8.0 o superior

## Estructura del proyecto

```
notes-management-api/
├── database/
│   └── schema.sql                  # Creación de la base de datos y la tabla notas
├── src/
│   ├── app.js                      # Configuración de Express y rutas generales
│   ├── server.js                   # Punto de entrada: verifica la BD e inicia el servidor
│   ├── config/
│   │   └── db.js                   # Pool de conexiones a MySQL
│   ├── controllers/
│   │   └── nota.controller.js      # Gestión de solicitudes y respuestas HTTP
│   ├── dtos/
│   │   ├── crear-nota.dto.js       # Datos admitidos al crear una nota
│   │   └── actualizar-nota.dto.js  # Datos admitidos al actualizar una nota
│   ├── middlewares/
│   │   └── error.middleware.js     # Manejo de rutas no encontradas y errores
│   ├── models/
│   │   └── nota.model.js           # Consultas SQL sobre la tabla notas
│   ├── routes/
│   │   └── nota.routes.js          # Definición de los endpoints de notas
│   ├── services/
│   │   └── nota.service.js         # Lógica de negocio
│   └── validators/
│       └── nota.validator.js       # Reglas de validación de las peticiones
├── .env.example
├── notas.md                        # Notas del proceso de creación del proyecto
└── package.json
```

## Instalación

1. Clona el repositorio e instala las dependencias:

   ```bash
   git clone https://github.com/Velasco-c/notes-management-api.git
   cd notes-management-api
   npm install
   ```

2. Crea la base de datos y la tabla:

   ```bash
   mysql -u root -p < database/schema.sql
   ```

   > **Advertencia:** `schema.sql` elimina la base de datos `notes_api` si ya existe. Úsalo solo en un entorno de desarrollo.

3. Crea el archivo de configuración a partir de la plantilla y ajusta los valores:

   ```bash
   cp .env.example .env
   ```

## Variables de entorno

| Variable      | Descripción                                    | Valor de ejemplo |
| ------------- | ---------------------------------------------- | ---------------- |
| `APP_PORT`    | Puerto en el que escucha la API                | `3000`           |
| `DB_HOST`     | Host del servidor MySQL                        | `127.0.0.1`      |
| `DB_PORT`     | Puerto del servidor MySQL                      | `3306`           |
| `DB_NAME`     | Nombre de la base de datos                     | `notes_api`      |
| `DB_USER`     | Usuario de MySQL                               | `root`           |
| `DB_PASSWORD` | Contraseña del usuario de MySQL                | `********`       |

El archivo `.env` contiene credenciales, por lo que está excluido del control de versiones.

## Ejecución

```bash
# Modo producción
npm start

# Modo desarrollo (reinicia el servidor al detectar cambios)
npm run dev
```

Si la conexión con MySQL falla, el servidor muestra un error y se detiene.

Para comprobar que la API funciona:

```bash
curl http://localhost:3000/health
```

```json
{ "estado": "ok", "version": "1.0.0" }
```

## Modelo de datos

Tabla `notas`:

| Campo        | Tipo                              | Restricciones                          |
| ------------ | --------------------------------- | -------------------------------------- |
| `id`         | `INT UNSIGNED`                    | Clave primaria, autoincremental        |
| `titulo`     | `VARCHAR(60)`                     | Obligatorio, entre 3 y 60 caracteres   |
| `contenido`  | `VARCHAR(280)`                    | Obligatorio, entre 1 y 280 caracteres  |
| `categoria`  | `ENUM('clase', 'tarea', 'idea')`  | Obligatorio                            |
| `created_at` | `TIMESTAMP`                       | Se asigna al crear la nota             |
| `updated_at` | `TIMESTAMP`                       | Se actualiza automáticamente           |

Antes de validar, `titulo` y `contenido` se recortan para eliminar los espacios al inicio y al final.

## Endpoints

Base URL: `http://localhost:3000`

| Método   | Ruta                     | Descripción                                          | Respuesta exitosa |
| -------- | ------------------------ | ---------------------------------------------------- | ----------------- |
| `GET`    | `/health`                | Estado del servicio                                  | `200`             |
| `GET`    | `/api/v1/preferencia`    | Devuelve la última categoría usada (desde la cookie) | `200`             |
| `POST`   | `/api/v1/notas`          | Crea una nota                                        | `201`             |
| `GET`    | `/api/v1/notas`          | Lista todas las notas, de la más reciente a la más antigua | `200`       |
| `GET`    | `/api/v1/notas/:id`      | Obtiene una nota por su ID                           | `200`             |
| `PATCH`  | `/api/v1/notas/:id`      | Actualiza uno o más campos de una nota               | `200`             |
| `DELETE` | `/api/v1/notas/:id`      | Elimina una nota                                     | `204`             |

Todas las peticiones con cuerpo deben enviarse como JSON, con la cabecera `Content-Type: application/json`.

### Crear una nota

Cuerpo de la petición:

| Campo       | Obligatorio | Reglas                                      |
| ----------- | ----------- | ------------------------------------------- |
| `titulo`    | Sí          | Entre 3 y 60 caracteres                     |
| `contenido` | Sí          | Entre 1 y 280 caracteres                    |
| `categoria` | Sí          | `clase`, `tarea` o `idea`                   |

```bash
curl -X POST http://localhost:3000/api/v1/notas \
  -H "Content-Type: application/json" \
  -d '{"titulo": "Repaso de SQL", "contenido": "Revisar JOIN y subconsultas", "categoria": "clase"}'
```

Respuesta `201 Created`:

```json
{
  "data": {
    "id": 1,
    "titulo": "Repaso de SQL",
    "contenido": "Revisar JOIN y subconsultas",
    "categoria": "clase",
    "created_at": "2026-10-23T15:30:00.000Z",
    "updated_at": "2026-10-23T15:30:00.000Z"
  }
}
```

Además, la respuesta incluye la cookie `ultimaCategoria=clase`, válida durante una hora.

### Listar notas

```bash
curl http://localhost:3000/api/v1/notas
```

Respuesta `200 OK`: `{ "data": [ ...notas ] }`, ordenadas por `created_at` de forma descendente.

### Obtener una nota

```bash
curl http://localhost:3000/api/v1/notas/1
```

Respuesta `200 OK`: `{ "data": { ...nota } }`.

### Actualizar una nota

Envía solo los campos que quieras cambiar. Las reglas son las mismas que al crear.

```bash
curl -X PATCH http://localhost:3000/api/v1/notas/1 \
  -H "Content-Type: application/json" \
  -d '{"categoria": "tarea"}'
```

Respuesta `200 OK`: `{ "data": { ...nota actualizada } }`.

Si el cuerpo está vacío (`{}`), la API devuelve la nota sin cambios.

### Eliminar una nota

```bash
curl -X DELETE http://localhost:3000/api/v1/notas/1
```

Respuesta `204 No Content`, sin cuerpo.

### Consultar la última categoría

```bash
curl http://localhost:3000/api/v1/preferencia
```

```json
{ "ultimaCategoria": "clase" }
```

Si todavía no se ha creado ninguna nota en el navegador o cliente que hace la petición, el valor es `null`.

## Respuestas de error

Errores de validación (`400 Bad Request`):

```json
{
  "errores": [
    {
      "type": "field",
      "value": "xy",
      "msg": "El título debe tener entre 3 y 60 caracteres",
      "path": "titulo",
      "location": "body"
    }
  ]
}
```

Otros códigos:

| Código | Cuándo ocurre                                             | Cuerpo                                     |
| ------ | --------------------------------------------------------- | ------------------------------------------ |
| `400`  | Datos inválidos o un `:id` que no es un entero positivo    | `{ "errores": [...] }`                     |
| `404`  | La nota no existe                                         | `{ "error": "Nota no encontrada" }`        |
| `404`  | La ruta no existe                                         | `{ "error": "Ruta no encontrada" }`        |
| `500`  | Error interno (por ejemplo, fallo en la base de datos)    | `{ "error": "..." }`                       |

## Scripts disponibles

| Comando       | Descripción                                             |
| ------------- | ------------------------------------------------------- |
| `npm start`   | Inicia el servidor                                      |
| `npm run dev` | Inicia el servidor y lo reinicia al detectar cambios    |

## Licencia

ISC. Autor: [Velasco-c](https://github.com/Velasco-c).