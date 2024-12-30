const express = require('express');
const fs = require('fs');
const csvParser = require('csv-parser');
const app = express();

app.use(express.static('assets')); // Para servir archivos estáticos

// Leer datos del archivo CSV
app.get('/productos', (req, res) => {
    const productos = [];
    fs.createReadStream('datos.csv')
        .pipe(csvParser())
        .on('data', (row) => productos.push(row))
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
