const express = require('express');
const fs = require('fs');
const csvParser = require('csv-parser');
const app = express();

app.use(express.static('assets')); // Para servir archivos estáticos
app.use(express.json()); // Para manejar datos JSON enviados desde el frontend

// Leer datos del archivo CSV
app.get('/productos', (req, res) => {
    const productos = [];
    const { categoria, precio_min, precio_max, search } = req.query; // Recibe los filtros

    fs.createReadStream('datos.csv')
        .pipe(csvParser())
        .on('data', (row) => {
            // Convertir los datos relevantes a formato adecuado
            const nombre = row.Nombre.toLowerCase();
            const descripcion = row.Descripción.toLowerCase();
            const precio = parseFloat(row.Precio);
            const categoriaProducto = row.Categoría;

            // Filtro por búsqueda (search) en nombre y descripción
            if (search && !nombre.includes(search.toLowerCase()) && !descripcion.includes(search.toLowerCase())) {
                return;
            }

            // Filtro por categoría
            if (categoria && categoria !== categoriaProducto) {
                return;
            }

            // Filtro por rango de precios
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
