import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'data', 'db.json');

app.use(express.json());

async function leerDB() {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return { motos: [] };
    }
}

async function guardarDB(data) {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
}

app.get('/api/motos', async (req, res) => {
    try {
        const db = await leerDB();
        res.status(200).json(db.motos);
    } catch (error) {
        res.status(500).json({ error: 'Error al leer la base de datos' });
    }
});

app.post('/api/motos', async (req, res) => {
    try {
        const { marca, modelo, kilometraje } = req.body;
        if (!marca || !modelo) {
            return res.status(400).json({ error: 'Marca y modelo son obligatorios' });
        }
        const db = await leerDB();
        const nuevaMoto = {
            id: Date.now().toString(),
            marca,
            modelo,
            kilometraje: kilometraje || 0,
            historial_mantenimiento: []
        };
        db.motos.push(nuevaMoto);
        await guardarDB(db);
        res.status(201).json({ mensaje: 'Moto registrada con éxito', moto: nuevaMoto });
    } catch (error) {
        res.status(500).json({ error: 'Error al guardar la motocicleta' });
    }
});

app.post('/api/motos/:id/mantenimiento', async (req, res) => {
    try {
        const { id } = req.params;
        const { servicio, km_realizado } = req.body;
        if (!servicio || km_realizado === undefined) {
            return res.status(400).json({ error: 'Faltan datos del servicio' });
        }
        const db = await leerDB();
        const motoIndex = db.motos.findIndex(m => m.id === id);
        if (motoIndex === -1) {
            return res.status(404).json({ error: 'Motocicleta no encontrada' });
        }
        const nuevoServicio = {
            fecha: new Date().toISOString().split('T')[0],
            servicio,
            km_realizado
        };
        db.motos[motoIndex].historial_mantenimiento.push(nuevoServicio);
        if (km_realizado > db.motos[motoIndex].kilometraje) {
            db.motos[motoIndex].kilometraje = km_realizado;
        }
        await guardarDB(db);
        res.status(200).json({ mensaje: 'Mantenimiento registrado', moto: db.motos[motoIndex] });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el historial' });
    }
});

app.listen(PORT, () => {
    console.log(`🏍️ MotoCare API corriendo en http://localhost:${PORT}`);
});