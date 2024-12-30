const express = require('express');
const fs = require('fs');
const csvParser = require('csv-parser');
const app = express();

app.use(express.static('assets')); // Para servir archivos estáticos

// Leer datos del archivo CSV
app.get('/productos', (req, res) => {
    const productos = [];
    const { categoria, precio_min, precio_max } = req.query;  // Recibe los filtros

    fs.createReadStream('datos.csv')
        .pipe(csvParser())
        .on('data', (row) => {
            // Filtrar por categoría
            if (categoria && row.Categoría !== categoria) return;
            // Filtrar por rango de precios
            if (precio_min && parseFloat(row.Precio) < parseFloat(precio_min)) return;
            if (precio_max && parseFloat(row.Precio) > parseFloat(precio_max)) return;
            productos.push(row);
        })
        .on('end', () => {
            res.json(productos);
        });
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

app.post('/actualizar', express.json(), (req, res) => {
    const { id, stock, precio } = req.body;
    // Aquí deberías actualizar los datos en el archivo CSV o base de datos
    res.send({ success: true });
});
