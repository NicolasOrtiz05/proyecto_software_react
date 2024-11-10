import React from 'react';

const Producto = ({ producto, agregarAlCarrito }) => {
	console.log("agregarAlCarrito:", agregarAlCarrito); // Para confirmar si se recibe correctamente
	return (
		<div className="producto">
			<img className="producto-imagen" src={producto.url} alt={producto.titulo} />
			<div className="producto-detalles">
				<h3 className="producto-titulo">{producto.titulo}</h3>
				<p className="producto-precio">${producto.precio}</p>
				<button className="producto-agregar" onClick={() => agregarAlCarrito(producto)}>Agregar</button>
			</div>
		</div>
	);
};


export default Producto;