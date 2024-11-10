import React, { useEffect, useState } from 'react';
import { getDownloadURL, ref, storage } from '../services/firebase-config';

const Cart = () => {
	const [productosEnCarrito, setProductosEnCarrito] = useState(JSON.parse(localStorage.getItem('productos-en-carrito')) || []);

	useEffect(() => {
		cargarProductosCarrito();
	}, [productosEnCarrito]);

	const cargarProductosCarrito = () => {
		if (productosEnCarrito.length > 0) {
			const imagePromises = productosEnCarrito.map(producto => {
				const storageRef = ref(storage, `/${producto.tipo}/${producto.imagen}`);
				return getDownloadURL(storageRef).then(url => ({ ...producto, url })).catch(error => console.error(error));
			});

			Promise.all(imagePromises).then(productosConImagenes => {
				setProductosEnCarrito(productosConImagenes);
			});
		}
	};

	const eliminarDelCarrito = (id) => {
		const nuevosProductos = productosEnCarrito.filter(producto => producto.id !== id);
		setProductosEnCarrito(nuevosProductos);
		localStorage.setItem('productos-en-carrito', JSON.stringify(nuevosProductos));
	};

	const vaciarCarrito = () => {
		setProductosEnCarrito([]);
		localStorage.setItem('productos-en-carrito', JSON.stringify([]));
	};

	const comprarCarrito = () => {
		// Lógica para comprar
	};

	const total = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);

	return (
		<div>
			<h2 className="titulo-principal">Carrito</h2>
			{productosEnCarrito.length > 0 ? (
				<div>
					{productosEnCarrito.map(producto => (
						<div key={producto.id} className="producto">
							<img className="producto-imagen" src={producto.url} alt={producto.titulo} />
							<div className="producto-detalles">
								<h3 className="producto-titulo">{producto.titulo}</h3>
								<p className="producto-precio">${producto.precio}</p>
								<button onClick={() => eliminarDelCarrito(producto.id)}>Eliminar</button>
							</div>
						</div>
					))}
					<div className="carrito-acciones">
						<button onClick={vaciarCarrito}>Vaciar carrito</button>
						<div className="carrito-total">
							<p>Total: ${total}</p>
							<button onClick={comprarCarrito}>Comprar ahora</button>
						</div>
					</div>
				</div>
			) : (
				<p>Tu carrito está vacío.</p>
			)}
		</div>
	);
};

export default Cart;