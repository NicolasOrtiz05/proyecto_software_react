import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, auth, dbRef, database, get, set, ref, uploadBytes, getDownloadURL, storage } from '../services/firebase-config';
import Producto from '../components/Producto';

const Admin = () => {
	const [productos, setProductos] = useState([]);
	const [editingProductId, setEditingProductId] = useState(null);

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (!user) {
				window.location.href = './autenticacion.html';
			}
		});

		cargarProductos();
	}, []);

	const cargarProductos = () => {
		get(dbRef(database, 'productos')).then((snapshot) => {
			if (snapshot.exists()) {
				const productos = snapshot.val();
				setProductos(productos);
			} else {
				console.log('No hay productos disponibles');
			}
		}).catch((error) => {
			console.error('Error al obtener productos:', error);
		});
	};

	const añadirProducto = (producto) => {
		const productoId = 'producto_' + new Date().getTime();
		const uniqueImageName = `${producto.imagen.name.split('.')[0]}_${new Date().getTime()}.${producto.imagen.name.split('.').pop()}`;
		const storageReference = ref(storage, `/${producto.tipo}/${uniqueImageName}`);

		uploadBytes(storageReference, producto.imagen).then((snapshot) => {
			getDownloadURL(snapshot.ref).then((url) => {
				const nuevoProducto = new Producto(productoId, producto.titulo, Number(producto.precio), uniqueImageName, producto.tipo);

				set(dbRef(database, 'productos/' + productoId), {
					id: nuevoProducto.id,
					titulo: nuevoProducto.titulo,
					precio: nuevoProducto.precio,
					imagen: nuevoProducto.imagen,
					tipo: nuevoProducto.tipo
				}).then(() => {
					cargarProductos();
				}).catch((error) => {
					console.error('Error al añadir producto:', error);
				});
			});
		}).catch((error) => {
			console.error('Error al subir imagen:', error);
		});
	};

	return (
		<div>
			<h2 className="titulo-principal">Panel de Administración</h2>
			<div className="admin-actions">
				<h3>Añadir Producto</h3>
				<input type="text" id="producto-titulo" className="input-estilo" placeholder="Título del producto" />
				<input type="number" id="producto-precio" className="input-estilo" placeholder="Precio del producto" />
				<select id="producto-tipo" className="input-estilo">
					<option value="">Selecciona el tipo de producto</option>
					<option value="celulares">Celulares</option>
					<option value="computadores">Computadores</option>
					<option value="audifonos">Audífonos</option>
				</select>
				<input type="file" id="producto-imagen" className="input-estilo" accept=".jpg, .jpeg" />
				<button id="btn-add-product" className="boton-admin" onClick={añadirProducto}>
					<i className="bi bi-plus-circle"></i> Añadir Producto
				</button>
			</div>
			<div className="admin-actions">
				<h3>Productos Actuales</h3>
				<div id="productos-container" className="productos-container">
					{productos.map(producto => (
						<Producto key={producto.id} producto={producto} />
					))}
				</div>
			</div>
		</div>
	);
};

export default Admin;