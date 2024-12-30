document.addEventListener('DOMContentLoaded', () => {
    // Función para cargar productos con filtros
    function cargarProductos(filtros = {}) {
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
                    `;
                    contenedor.appendChild(div);
                });
            });
    }

    // Cargar productos al inicio
    cargarProductos();

    // Filtros de categoría y precio
    document.getElementById('filtro-categoria').addEventListener('change', (e) => {
        const categoria = e.target.value;
        cargarProductos({ categoria });
    });

    document.getElementById('filtro-precio').addEventListener('change', (e) => {
        const [min, max] = e.target.value.split('-');
        cargarProductos({ precio_min: min, precio_max: max });
    });
});

let carrito = [];

function agregarAlCarrito(producto) {
    carrito.push(producto);
    actualizarCarrito();
}

function actualizarCarrito() {
    const contenedorCarrito = document.getElementById('carrito');
    contenedorCarrito.innerHTML = ''; // Limpiar carrito

    carrito.forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = `
            <p>${item.Nombre} - $${item.Precio}</p>
        `;
        contenedorCarrito.appendChild(div);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('/productos')
        .then(response => response.json())
        .then(data => {
            const contenedor = document.getElementById('productos');
            data.forEach(producto => {
                const div = document.createElement('div');
                div.classList.add('producto');
                div.innerHTML = `
                    <h2>${producto.Nombre}</h2>
                    <p>${producto.Descripción}</p>
                    <p>Precio: $${producto.Precio}</p>
                    <p>Stock: ${producto.Stock}</p>
                    <img src="images/${producto.Imagen}" alt="${producto.Nombre}">
                    <button onclick="agregarAlCarrito(${JSON.stringify(producto)})">Agregar al carrito</button>
                `;
                contenedor.appendChild(div);
            });
        });
});


document.getElementById('buscar').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    fetch('/productos')
        .then(response => response.json())
        .then(data => {
            const filtered = data.filter(producto => 
                producto.Nombre.toLowerCase().includes(query) ||
                producto.Descripción.toLowerCase().includes(query)
            );
            cargarProductos(filtered);
        });
});
