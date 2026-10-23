
import { Nota } from "../models/nota.model.js";

export const notaService = {
    // Crear una nota.
    crear: (datos) => Nota.create(datos),

    // Obtener todas las notas.
    listar: () => Nota.find().sort({ created_at: -1 }),

    // Buscar una nota por su ID.
    buscarPorId: (id) => Nota.findById(id),

    // Actualizar una nota por su ID.
    actualizar: (id, datos) =>
        Nota.findByIdAndUpdate(id, datos, {
            new: true,
            runValidators: true
        }),

    // Eliminar una nota por su ID.
    eliminar: (id) => Nota.findByIdAndDelete(id)
};
