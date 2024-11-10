import React, { useState } from 'react';
import { auth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '../services/firebase-config';

const Auth = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [user, setUser] = useState(null);

	onAuthStateChanged(auth, (user) => {
		if (user) {
			setUser(user);
		} else {
			setUser(null);
		}
	});

	const handleLogin = (e) => {
		e.preventDefault();
		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				console.log('Sesión iniciada', userCredential.user.email);
			})
			.catch((error) => {
				console.error('Error al iniciar sesión:', error.message);
			});
	};

	const handleSignUp = () => {
		createUserWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				console.log('Registro exitoso', userCredential.user.email);
			})
			.catch((error) => {
				console.error('Error al registrarte:', error.message);
			});
	};

	const handleLogout = () => {
		signOut(auth)
			.then(() => {
				console.log('Has cerrado sesión');
			})
			.catch((error) => {
				console.error('Error al cerrar sesión:', error.message);
			});
	};

	return (
		<div>
			<h2 className="titulo-principal">Iniciar Sesión</h2>
			{user ? (
				<div>
					<p>Usuario: {user.email}</p>
					<button onClick={handleLogout}>Cerrar Sesión</button>
				</div>
			) : (
				<form onSubmit={handleLogin}>
					<div>
						<label htmlFor="email">Correo Electrónico</label>
						<input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
					</div>
					<div>
						<label htmlFor="password">Contraseña</label>
						<input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
					</div>
					<button type="submit">Iniciar Sesión</button>
					<button type="button" onClick={handleSignUp}>Regístrate aquí</button>
				</form>
			)}
		</div>
	);
};

export default Auth;