const express = require('express');
const fs = require('fs');
const csvParser = require('csv-parser');
const app = express();

app.use(express.static('assets')); // Para servir archivos estáticos
app.use(express.json()); // Para manejar datos JSON enviados desde el frontend

// Leer datos del archivo CSV
app.get('/productos', (req, res) => {
    const productos = [];
    const { categoria, precio_min, precio_max, search } = req.query;  // Recibe los filtros

    fs.createReadStream('datos.csv')
        .pipe(csvParser())
        .on('data', (row) => {
            // Filtro por categoría
            if (categoria && row.Categoría !== categoria) return;
            // Filtro por rango de precios
            if (precio_min && parseFloat(row.Precio) < parseFloat(precio_min)) return;
            if (precio_max && parseFloat(row.Precio) > parseFloat(precio_max)) return;
            // Filtro por búsqueda (nombre del producto)
            if (search && !row.Nombre.toLowerCase().includes(search.toLowerCase())) return;
            productos.push(row);
        })
        .on('end', () => {
            res.json(productos);
        });
});

// Actualizar stock y precio de los productos (ejemplo de actualización)
app.post('/actualizar', (req, res) => {
    const { nombre, stock, precio } = req.body;
    // Aquí deberías actualizar los datos en el archivo CSV o en una base de datos
    res.send({ success: true, message: 'Producto actualizado correctamente' });
});

// Servir el archivo HTML principal
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
