
import db from "../config/db.js";
export const Nota = {
    // Crear una nota.
    async create(datos) {
        const [result] = await db.execute(
            `INSERT INTO notas (titulo, contenido, categoria)
             VALUES (?, ?, ?)`,
            [datos.titulo, datos.contenido, datos.categoria]
        );

        return this.findById(result.insertId);
    },

    // Obtener todas las notas, ordenadas.
    find() {
        return {
            sort: async (criterio) => {
                const direccion = Object.values(criterio)[0] === 1
                    ? "ASC"
                    : "DESC";

                const [rows] = await db.execute(
                    `SELECT * FROM notas ORDER BY created_at ${direccion}`
                );

                return rows;
            }
        };
    },

    // Buscar una nota por su ID.
    async findById(id) {
        const [rows] = await db.execute(
            "SELECT * FROM notas WHERE id = ?",
            [id]
        );

        return rows[0] ?? null;
    },

    // Actualizar una nota por su ID.
    async findByIdAndUpdate(id, datos, opciones = {}) {
        const campos = ["titulo", "contenido", "categoria"]
            .filter(campo => datos[campo] !== undefined);

        if (campos.length === 0) {
            return this.findById(id);
        }

        const asignaciones = campos
            .map(campo => `${campo} = ?`)
            .join(", ");

        const valores = campos.map(campo => datos[campo]);

        await db.execute(
            `UPDATE notas SET ${asignaciones} WHERE id = ?`,
            [...valores, id]
        );

        return this.findById(id);
    },

    // Eliminar una nota por su ID.
    async findByIdAndDelete(id) {
        const nota = await this.findById(id);

        if (!nota) {
            return null;
        }

        await db.execute(
            "DELETE FROM notas WHERE id = ?",
            [id]
        );

        return nota;
    },

    // Alias para que tu servicio actual no tenga que modificarse.
    findByIdAnUpdate(id, datos, opciones) {
        return this.findByIdAndUpdate(id, datos, opciones);
    },

    findByIdAnDelete(id) {
        return this.findByIdAndDelete(id);
    }
};
