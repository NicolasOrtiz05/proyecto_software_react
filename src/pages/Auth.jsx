/* global Swal, Toastify */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, database, dbRef, onValue } from '../services/firebase-config';
import '../index.css';

const Auth = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [user, setUser] = useState(null);
	const [promotion, setPromotion] = useState('');
	const navigate = useNavigate();
	const [pedidos, setPedidos] = useState([]);
	const adminEmail = "admin@example1.com";

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				setUser(user);
				if (user.email === adminEmail) {
					navigate('/admin');
				} else {
					const pedidosRef = dbRef(database, 'pedidos/' + user.uid);
					onValue(pedidosRef, (snapshot) => {
						const data = snapshot.val();
						if (data) {
							setPedidos(Array.isArray(data) ? data : Object.values(data));
						} else {
							setPedidos([]);
						}
					});
				}
			} else {
				setUser(null);
			}
		});

		return () => unsubscribe();
	}, [navigate]);

	useEffect(() => {
		const promotionsRef = dbRef(database, 'promotions');
		const unsubscribe = onValue(promotionsRef, (snapshot) => {
			if (snapshot.exists()) {
				const data = snapshot.val();
				// Asegúrate de que los datos sean del tipo correcto
				if (typeof data === 'string') {
					setPromotion(data);
				} else {
					console.error('Datos de promoción no válidos:', data);
					setPromotion('');
				}
			} else {
				setPromotion('');
			}
		});

		return () => unsubscribe();
	}, []);

	const handleLogin = (e) => {
		e.preventDefault();
		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				Swal.fire({
					title: 'Sesión iniciada',
					text: `Bienvenido, ${userCredential.user.email}!`,
					icon: 'success',
					confirmButtonText: 'Ok'
				});
				if (userCredential.user.email === adminEmail) {
					navigate('/admin');
				}
			})
			.catch((error) => {
				Swal.fire({
					title: 'Error',
					text: 'Error al iniciar sesión: ' + error.message,
					icon: 'error',
					confirmButtonText: 'Ok'
				});
			});
	};

	const handleSignUp = () => {
		Swal.fire({
			title: 'Registro',
			html: `
                <input type="email" id="swal-input1" class="swal2-input" placeholder="Correo electrónico">
                <input type="password" id="swal-input2" class="swal2-input" placeholder="Contraseña">
            `,
			showCancelButton: true,
			confirmButtonText: 'Registrar',
			cancelButtonText: 'Cancelar',
			preConfirm: () => {
				const email = document.getElementById('swal-input1').value;
				const password = document.getElementById('swal-input2').value;
				if (!email || !password) {
					Swal.showValidationMessage('Por favor ingresa ambos campos');
				}
				return { email, password };
			}
		}).then((result) => {
			if (result.isConfirmed) {
				const { email, password } = result.value;
				createUserWithEmailAndPassword(auth, email, password)
					.then((userCredential) => {
						Swal.fire({
							title: 'Registro exitoso',
							text: 'Ahora puedes iniciar sesión.',
							icon: 'success',
							confirmButtonText: 'Ok'
						});
					})
					.catch((error) => {
						Swal.fire({
							title: 'Error',
							text: 'Error al registrarte: ' + error.message,
							icon: 'error',
							confirmButtonText: 'Ok'
						});
					});
			}
		});
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
						Toastify({
							text: "Has cerrado sesión",
							duration: 3000,
							close: true,
							gravity: "top",
							position: "right",
							stopOnFocus: true,
							style: {
								background: "linear-gradient(to right, #2F579C, #617ebd)",
								borderRadius: "2rem",
								textTransform: "uppercase",
								fontSize: ".75rem"
							}
						}).showToast();
					})
					.catch((error) => {
						console.error('Error al cerrar sesión:', error.message);
					});
			}
		});
	};

	return (
		<main>
			<h2 className="titulo-principal">Iniciar Sesión</h2>
			{user ? (
				<div>
					<p>Usuario: {user.email}</p>
					<button onClick={handleLogout} className="boton-aut">Cerrar Sesión</button>
					{user.email !== adminEmail && promotion && (
						<div className="promotion-container">
							<h3>Promoción Activa</h3>
							<p>{promotion}</p>
						</div>
					)}
					{user.email !== adminEmail && (
						<div>
							<h3>Mis Pedidos</h3>
							{pedidos && pedidos.length > 0 ? (
								pedidos.map((pedido, index) => (
									<div key={index} className="pedido-item">
										<h4>Pedido {index + 1}</h4>
										<p><strong>Total:</strong> ${pedido.total}</p>
										<p><strong>Estado:</strong> {pedido.estado || 'No disponible'}</p> {/* Asumiendo que cada pedido puede tener un estado */}
										<ul>
											{pedido.productos && pedido.productos.length > 0 ? (
												pedido.productos.map((producto, i) => (
													<li key={i}>
														{producto.titulo} - {producto.cantidad} x ${producto.precio} = ${producto.subtotal}
													</li>
												))
											) : (
												<p>No hay productos en este pedido.</p>
											)}
										</ul>
									</div>
								))
							) : (
								<p>No has realizado ningún pedido.</p>
							)}
						</div>
					)}
				</div>
			) : (
				<div className="login-container">
					<form onSubmit={handleLogin} id="login-form">
						<div>
							<label htmlFor="email">Correo Electrónico</label>
							<input type="email" id="email" className="input-estilo" value={email} onChange={(e) => setEmail(e.target.value)} required />
						</div>
						<div>
							<label htmlFor="password">Contraseña</label>
							<input type="password" id="password" className="input-estilo" value={password} onChange={(e) => setPassword(e.target.value)} required />
						</div>
						<button type="submit" className="boton-aut">Iniciar Sesión</button>
					</form>
					<p id="registro">¿No tienes una cuenta? <a href="#" onClick={handleSignUp}>Regístrate aquí</a></p>
				</div>
			)}
		</main>
	);
};

export default Auth;