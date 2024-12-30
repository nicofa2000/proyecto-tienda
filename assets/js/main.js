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
                `;
                contenedor.appendChild(div);
            });
        });
});
