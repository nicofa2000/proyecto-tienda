const express = require('express');
const fs = require('fs');
const csvParser = require('csv-parser');
const path = require('path');
const app = express();

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'assets')));

// Ruta principal para servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API para productos
app.get('/productos', (req, res) => {
    const productos = [];
    const { categoria, precio_min, precio_max, search } = req.query;

    fs.createReadStream('datos.csv')
        .pipe(csvParser())
        .on('data', (row) => {
            const nombre = row.Nombre.toLowerCase();
            const descripcion = row.Descripción.toLowerCase();
            const precio = parseFloat(row.Precio);
            const categoriaProducto = row.Categoría;

            if (search && !nombre.includes(search.toLowerCase()) && !descripcion.includes(search.toLowerCase())) {
                return;
            }

            if (categoria && categoria !== categoriaProducto) {
                return;
            }

            if (precio_min && precio < parseFloat(precio_min)) {
                return;
            }
            if (precio_max && precio > parseFloat(precio_max)) {
                return;
            }

            productos.push(row);
        })
        .on('end', () => {
            res.json(productos);
        });
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
