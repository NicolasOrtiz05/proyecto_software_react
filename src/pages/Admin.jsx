/* global Swal, Toastify */
import React, { useEffect, useState } from 'react';
import { onAuthStateChanged, auth, dbRef, database, set, ref, uploadBytes, getDownloadURL, storage, signOut } from '../services/firebase-config';
import { createProducto, getAllProductos, updateProducto, deleteProducto, getProductoById } from '../services/productoServise';
import { getAllPedidos, getPedidoById, createPedido, deletePedido, updatePedido } from '../services/pedidoService';

const Admin = () => {
	const [productos, setProductos] = useState([]);
	const [editingProductId, setEditingProductId] = useState(null);
	const [promotion, setPromotion] = useState('');
	const [pedidos, setPedidos] = useState([]);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (user) => { // Añadido async aquí
			if (!user) {
				window.location.href = '/auth';
			} else {
				try {
					// Esperamos a que se resuelva la promesa de getAllPedidos
					const todosLosPedidos = await getAllPedidos(); 
					
					if (todosLosPedidos.length > 0) {
						console.log("llega?");
						// Ordenamos por fecha
						todosLosPedidos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
						setPedidos(todosLosPedidos); // Actualizamos el estado
					} else {
						setPedidos([]); // Si no hay pedidos, se setea un array vacío
					}
				} catch (error) {
					console.error("Error al cargar los pedidos:", error);
				}
			}
		});
		cargarProductos();
		return () => unsubscribe(); // Limpiar el listener
	}, []);
	

	const handleSendPromotion = () => {
		if (promotion.trim() !== '') {
			set(dbRef(database, 'promotions'), promotion.trim())
				.then(() => {
					Toastify({
						text: 'Promoción enviada exitosamente',
						style: {
							background: 'linear-gradient(to right, #00b09b, #96c93d)',
						},
					}).showToast();
					setPromotion('');
				})
				.catch((error) => {
					console.error('Error al enviar la promoción:', error);
					Toastify({
						text: 'Error al enviar la promoción',
						style: {
							background: 'linear-gradient(to right, #ff0000, #ff5555)',
						},
					}).showToast();
				});
		}
	};

	const cargarProductos = () => {
		getAllProductos().then(productos => {
			if (productos && productos.length > 0) {
				cargarProductosConImagenes(productos);
			} else {
				setProductos([]);
			}
		}).catch((error) => {
			console.error('Error al obtener productos:', error);
			Toastify({
				text: "Error al cargar productos",
				style: {
					background: "linear-gradient(to right, #ff0000, #ff5555)",
				}
			}).showToast();
		});
	};

	const cargarProductosConImagenes = (productos) => {
		const imagePromises = productos.map(producto => {
			const storageReference = ref(storage, `/${producto.tipo}/${producto.imagen}`);
			return getDownloadURL(storageReference).then(url => {
				return { ...producto, url };
			}).catch(error => {
				console.warn(`No se encontró imagen para el producto ${producto.id}`, error);
				return null;
			});
		});

		Promise.all(imagePromises).then(productosConImagenes => {
			setProductos(productosConImagenes.filter(producto => producto !== null));
		});
	};

	const añadirProducto = () => {
		const titulo = document.getElementById('producto-titulo').value;
		const precio = document.getElementById('producto-precio').value;
		const tipo = document.getElementById('producto-tipo').value;
		const imagenI = document.getElementById('producto-imagen').files[0];

		if (!titulo || !precio || !tipo || !imagenI) {
			Toastify({
				text: "Por favor completa todos los campos",
				style: {
					background: "linear-gradient(to right, #ff0000, #ff5555)",
				}
			}).showToast();

			return;
		}
		const id = 'producto_' + new Date().getTime(); // igual en el back lo reescribo
		const imagen = `${imagenI.name.split('.')[0]}_${new Date().getTime()}.${imagenI.name.split('.').pop()}`;
		const nuevoProducto = JSON.stringify({ id, titulo, precio, imagen, tipo });

		createProducto(nuevoProducto, imagenI);
		cargarProductos();
		
	};

	const editarProducto = (productoId) => {
		setEditingProductId(productoId);
		
		// Obtener el producto actual desde el backend
		getProductoById(productoId)
		  .then((producto) => {
			if (producto) {
			  Swal.fire({
				title: 'Editar Producto',
				html: `
				  <input 
					  type="text" 
					  id="edit-titulo" 
					  class="swal2-input" 
					  placeholder="Título del producto" 
					  value="${producto.titulo}"
				  >
				  <input 
					  type="number" 
					  id="edit-precio" 
					  class="swal2-input" 
					  placeholder="Precio del producto" 
					  value="${producto.precio}"
				  >
				  <select id="edit-tipo" class="swal2-input">
					  <option value="celulares" ${producto.tipo === 'celulares' ? 'selected' : ''}>Celulares</option>
					  <option value="computadores" ${producto.tipo === 'computadores' ? 'selected' : ''}>Computadores</option>
					  <option value="audifonos" ${producto.tipo === 'audifonos' ? 'selected' : ''}>Audífonos</option>
				  </select>
				  <input 
					  type="file" 
					  id="edit-imagen" 
					  class="swal2-input"
				  >
				`,
				showCancelButton: true,
				confirmButtonText: 'Guardar',
				cancelButtonText: 'Cancelar',
				preConfirm: () => {
				  const titulo = document.getElementById('edit-titulo').value;
				  const precio = document.getElementById('edit-precio').value;
				  const tipo = document.getElementById('edit-tipo').value;
				  const imagenI = document.getElementById('edit-imagen').files[0];
	  
				  if (!titulo || !precio || !tipo) {
					Swal.showValidationMessage('Por favor completa todos los campos');
					return false;
				  }
	  
				  return { titulo, precio, tipo, imagenI };
				}
			  }).then((result) => {
				if (result.isConfirmed) {
				  const { titulo, precio, tipo, imagenI } = result.value;
	  
				  // Crear el nuevo objeto producto
				  const productoActualizado = {
					...producto,
					titulo,
					precio,
					tipo,
				  };
	  
				  // Llamar a la función updateProducto con los datos actualizados
				  updateProducto(productoActualizado, imagenI)
					.then(() => {
					  Toastify({
						text: "Producto actualizado exitosamente",
						style: {
						  background: "linear-gradient(to right, #00b09b, #96c93d)",
						}
					  }).showToast();
					  cargarProductos(); // Recargar la lista de productos
					})
					.catch((error) => {
					  console.error('Error al actualizar producto:', error);
					  Toastify({
						text: "Error al actualizar producto",
						style: {
						  background: "linear-gradient(to right, #ff0000, #ff5555)",
						}
					  }).showToast();
					});
				}
			  });
			}
		  })
		  .catch((error) => {
			console.error('Error al obtener producto:', error);
			Toastify({
			  text: "Error al cargar datos del producto",
			  style: {
				background: "linear-gradient(to right, #ff0000, #ff5555)",
			  }
			}).showToast();
		  });
	  };
	  

	const eliminarProducto = (productoId) => {
				Swal.fire({
					title: '¿Estás seguro?',
					text: 'Esta acción no se puede deshacer',
					icon: 'warning',
					showCancelButton: true,
					confirmButtonText: 'Sí, eliminar',
					cancelButtonText: 'Cancelar'
				}).then((result) => {
					if (result.isConfirmed) {
						deleteProducto(productoId).then(() => {
							Toastify({
								text: "Producto eliminado exitosamente",
								style: {
									background: "linear-gradient(to right, #00b09b, #96c93d)",
								}
							}).showToast();
							cargarProductos();
						}).catch((error) => {
							console.error('Error al eliminar producto:', error);
							Toastify({
								text: "Error al eliminar producto",
								style: {
									background: "linear-gradient(to right, #ff0000, #ff5555)",
								}
							}).showToast();
						});
					}})
	};

	const handleLogout = () => {
		Swal.fire({
			title: '¿Estás seguro?',
			text: '¿Deseas cerrar sesión?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Sí',
			cancelButtonText: 'No'
		}).then((result) => {
			if (result.isConfirmed) {
				signOut(auth)
					.then(() => {
						window.location.href = '/auth';
					})
					.catch((error) => {
						console.error('Error al cerrar sesión:', error);
						Toastify({
							text: "Error al cerrar sesión",
							style: {
								background: "linear-gradient(to right, #ff0000, #ff5555)",
							}
						}).showToast();
					});
			}
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
						<div key={producto.id} className="producto-card">
							<img src={producto.url} alt={producto.titulo} className="producto-imagen-admin" />
							<div className="producto-info">
								<h4>{producto.titulo}</h4>
								<p>${producto.precio}</p>
								<p>{producto.tipo}</p>
							</div>
							<div className="producto-acciones">
								<button onClick={() => editarProducto(producto.id)} className="btn-edit">Editar</button>
								<button onClick={() => eliminarProducto(producto.id)} className="btn-delete">Eliminar</button>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="admin-actions">
				<h3>Enviar Promoción</h3>
				<textarea
					id="promotion-text"
					className="input-estilo"
					placeholder="Escribe la promoción aquí"
					value={promotion}
					onChange={(e) => setPromotion(e.target.value)}
				></textarea>
				<button
					id="btn-send-promotion"
					className="boton-admin"
					onClick={handleSendPromotion}
				>
					<i className="bi bi-megaphone-fill"></i> Enviar Promoción
				</button>
			</div>

			<div className="admin-actions">
				<h3>Pedidos de Todos los Usuarios</h3>
				{pedidos && pedidos.length > 0 ? (
					<div className="pedidos-container">
						{pedidos.map((pedido) => (
							<div key={pedido.id} className="pedido-card">
								<h4 className="pedido-titulo">Pedido #{pedido.id}</h4>
								<p><strong>ID Usuario:</strong> {pedido.userId}</p>
								<p><strong>Fecha:</strong> {pedido.fecha}</p>
								<p><strong>Estado:</strong> {pedido.estado || 'pendiente'}</p>
								<p><strong>Total:</strong> ${pedido.total}</p>
								<div className="productos-pedido">
									<h5>Productos:</h5>
									{pedido.productos && pedido.productos.length > 0 ? (
										<ul>
											{pedido.productos.map((producto, index) => (
												<li key={index} className="producto-pedido-item">
													<div className="producto-info">
														<span className="producto-titulo">{producto.titulo}</span>


													</div>
												</li>
											))}
										</ul>
									) : (
										<p>No hay productos en este pedido.</p>
									)}
								</div>
							</div>
						))}
					</div>
				) : (
					<p>No hay pedidos registrados.</p>
				)}
			</div>


			<button onClick={handleLogout} className="boton-aut">Cerrar Sesión</button>
		</div>
	);
};

export default Admin;