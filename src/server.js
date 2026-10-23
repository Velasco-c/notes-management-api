
import "dotenv/config";
import app from "./app.js";
import db from "./config/db.js";

const PORT = Number(process.env.APP_PORT) || 3000;

try {
    const conexion = await db.getConnection();
    conexion.release();
    app.listen(PORT, () => {
        console.log(`API lista en http://localhost:${PORT}`);
    });
} catch (error) {
    console.error("No fue posible conectar con MySQL:", error.message);
    process.exit(1);
}
