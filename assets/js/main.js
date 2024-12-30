let carrito = [];

// Función para cargar productos con los filtros aplicados
const cargarProductos = (filtros = {}) => {
    const url = new URL('/productos', window.location.origin);
    Object.keys(filtros).forEach(key => url.searchParams.append(key, filtros[key]));

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const contenedor = document.getElementById('productos');
            contenedor.innerHTML = ''; // Limpiar los productos actuales
            data.forEach(producto => {
                const div = document.createElement('div');
                div.classList.add('producto');
                div.innerHTML = `
                    <h2>${producto.Nombre}</h2>
                    <p>${producto.Descripción}</p>
                    <p>Precio: $${producto.Precio}</p>
                    <p>Stock: ${producto.Stock}</p>
                    <img src="images/${producto.Imagen}" alt="${producto.Nombre}">
                    <button class="btn-agregar" onclick="agregarAlCarrito(${JSON.stringify(producto)})">Agregar al carrito</button>
                `;
                contenedor.appendChild(div);
            });
        })
        .catch(error => {
            console.error('Error al cargar los productos:', error);
        });
};

// Cargar productos al inicio
document.addEventListener('DOMContentLoaded', () => {
    const cargarProductos = (filtros = {}) => {
        const url = new URL('/productos', window.location.origin);

        // Agregar los filtros a la URL
        Object.keys(filtros).forEach(key => url.searchParams.append(key, filtros[key]));

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const contenedor = document.getElementById('productos');
                contenedor.innerHTML = ''; // Limpiar los productos actuales

                if (data.length === 0) {
                    contenedor.innerHTML = '<p>No se encontraron productos.</p>';
                    return;
                }

                data.forEach(producto => {
                    const div = document.createElement('div');
                    div.classList.add('producto');
                    div.innerHTML = `
                        <h2>${producto.Nombre}</h2>
                        <p>${producto.Descripción}</p>
                        <p>Precio: $${producto.Precio}</p>
                        <p>Stock: ${producto.Stock}</p>
                        <img src="images/${producto.Imagen}" alt="${producto.Nombre}">
                        <button class="btn-agregar" onclick="agregarAlCarrito(${JSON.stringify(producto)})">Agregar al carrito</button>
                    `;
                    contenedor.appendChild(div);
                });
            })
            .catch(error => console.error('Error al cargar productos:', error));
    };

    // Cargar los productos por defecto
    cargarProductos();

    // Filtro de búsqueda por nombre o descripción
    const inputBuscar = document.getElementById('buscar');
    inputBuscar.addEventListener('input', (e) => {
        const query = e.target.value.trim(); // Capturar el valor ingresado
        cargarProductos({ search: query }); // Enviar el filtro search
    });

    // Filtro de categoría
    document.getElementById('filtro-categoria').addEventListener('change', (e) => {
        const categoria = e.target.value;
        cargarProductos({ categoria });
    });

    // Filtro de rango de precios
    document.getElementById('filtro-precio').addEventListener('change', (e) => {
        const [min, max] = e.target.value.split('-');
        cargarProductos({ precio_min: min, precio_max: max });
    });
});

