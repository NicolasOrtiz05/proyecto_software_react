import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ onCategoryChange }) => {
	const navigate = useNavigate();

	const handleClick = (category, path) => {
		onCategoryChange(category);
		navigate(path);
	};

	return (
		<header className="header-desktop">
			<h1 className="logo">TechShop</h1>
			<nav>
				<ul className="menu">
					<li>
						<button id="todos" onClick={() => handleClick('', '/')} className="boton-menu boton-categoria disabled">
							<i className="bi bi-hand-index-thumb-fill"></i> Todos los productos
						</button>
					</li>
					<li>
						<button onClick={() => handleClick('celulares', '/category/celulares')} className="boton-menu boton-categoria">
							<i className="bi bi-phone"></i> Celulares
						</button>
					</li>
					<li>
						<button onClick={() => handleClick('computadores', '/category/computadores')} className="boton-menu boton-categoria">
							<i className="bi bi-laptop"></i> Computadores
						</button>
					</li>
					<li>
						<button onClick={() => handleClick('audifonos', '/category/audifonos')} className="boton-menu boton-categoria">
							<i className="bi bi-headphones"></i> Audífonos
						</button>
					</li>
					<li>
						<button onClick={() => navigate('/cart')} className="boton-menu boton-carrito">
							<i className="bi bi-cart-fill"></i> Carrito <span id="numerito" className="numerito">0</span>
						</button>
					</li>
					<li>
						<button onClick={() => navigate('/auth')} className="boton-menu">
							<i className="bi bi-person-circle"></i> Iniciar sesión
						</button>
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default Header;