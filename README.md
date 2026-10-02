# MotoCare API 🏍️

Una API RESTful construida con Node.js y Express para gestionar el registro de motocicletas y su historial de mantenimiento. Ideal para trackear los servicios según el kilometraje.

## Requisitos
- Node.js (v14 o superior)

## Instalación y Ejecución

1. Clona este repositorio:
   ```bash
   git clone <TU_ENLACE_DE_GITHUB>
   cd motocare-api
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Ejecuta el servidor:
   ```bash
   npm start
   ```

El servidor se iniciará en `http://localhost:3000`.

## Ejemplos de Uso (Endpoints)

### 1. Obtener todas las motocicletas registradas
```bash
curl -X GET http://localhost:3000/api/motos
```

### 2. Registrar una nueva motocicleta
```bash
curl -X POST http://localhost:3000/api/motos \
-H "Content-Type: application/json" \
-d '{"marca": "CFMOTO", "modelo": "250NK", "kilometraje": 0}'
```

### 3. Registrar un mantenimiento
```bash
curl -X POST http://localhost:3000/api/motos/<ID_MOTO>/mantenimiento \
-H "Content-Type: application/json" \
-d '{"servicio": "Cambio de filtro de aire", "km_realizado": 8000}'
```
