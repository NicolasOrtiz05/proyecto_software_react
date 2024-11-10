import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ onCategoryChange }) => {
	const handleClick = (category) => {
		onCategoryChange(category);
	};

	return (
		<header className="header-desktop">
			<h1 className="logo">TechShop</h1>
			<nav>
				<ul className="menu">
					<li>
						<Link to="/" onClick={() => handleClick('')} className="boton-menu boton-categoria">
							<i className="bi bi-hand-index-thumb-fill"></i> Todos los productos
						</Link>
					</li>
					<li>
						<Link to="/category/celulares" onClick={() => handleClick('celulares')} className="boton-menu boton-categoria">
							<i className="bi bi-phone"></i> Celulares
						</Link>
					</li>
					<li>
						<Link to="/category/computadores" onClick={() => handleClick('computadores')} className="boton-menu boton-categoria">
							<i className="bi bi-laptop"></i> Computadores
						</Link>
					</li>
					<li>
						<Link to="/category/audifonos" onClick={() => handleClick('audifonos')} className="boton-menu boton-categoria">
							<i className="bi bi-headphones"></i> Audífonos
						</Link>
					</li>
					<li>
						<Link to="/cart" className="boton-menu boton-carrito">
							<i className="bi bi-cart-fill"></i> Carrito <span id="numerito" className="numerito">0</span>
						</Link>
					</li>
					<li>
						<Link to="/auth" className="boton-menu">
							<i className="bi bi-person-circle"></i> Iniciar sesión
						</Link>
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default Header;