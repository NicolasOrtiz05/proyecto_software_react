
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ user, handleClick, actualizarNumerito }) => {
	const navigate = useNavigate();
	const [activeCategory, setActiveCategory] = useState('todos'); 

	
	const handleCategoryClick = (category, path) => {
		setActiveCategory(category); 
		handleClick(category, path); 
	};

	return (
		<header className="header-desktop">
			<h1 className="logo">TechShop</h1>
			<nav>
				<ul className="menu">
					<li>
						<button
							id="todos"
							onClick={() => handleCategoryClick('', '/')}
							className={`boton-menu boton-categoria ${activeCategory === 'todos' ? 'active' : ''}`}
						>
							<i className="bi bi-hand-index-thumb-fill"></i> Todos los productos
						</button>
					</li>
					<li>
						<button
							onClick={() => handleCategoryClick('celulares', '/category/celulares')}
							className={`boton-menu boton-categoria ${activeCategory === 'celulares' ? 'active' : ''}`}
						>
							<i className="bi bi-phone"></i> Celulares
						</button>
					</li>
					<li>
						<button
							onClick={() => handleCategoryClick('computadores', '/category/computadores')}
							className={`boton-menu boton-categoria ${activeCategory === 'computadores' ? 'active' : ''}`}
						>
							<i className="bi bi-laptop"></i> Computadores
						</button>
					</li>
					<li>
						<button
							onClick={() => handleCategoryClick('audifonos', '/category/audifonos')}
							className={`boton-menu boton-categoria ${activeCategory === 'audifonos' ? 'active' : ''}`}
						>
							<i className="bi bi-headphones"></i> Audífonos
						</button>
					</li>
					<li>
						<button onClick={() => navigate('/cart')} className="boton-menu boton-carrito">
							<i className="bi bi-cart-fill"></i> Carrito <span id="numerito" className="numerito">{actualizarNumerito()}</span>
						</button>
					</li>
					<li>
						{user ? (
							<span onClick={() => navigate('/auth')} className="boton-menu">{user.email}</span>
						) : (
							<button onClick={() => navigate('/auth')} className="boton-menu">
								<i className="bi bi-person-circle"></i> Iniciar sesión
							</button>
						)}
					</li>
				</ul>
			</nav>
		</header>
	);
};

export default Header;