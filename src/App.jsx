import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams, useNavigate, useLocation } from 'react-router-dom';
import Cart from './pages/Cart';
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import Producto from './components/Producto';
import { getProductos } from './services/firebaseService';
import './index.css';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

const AppContent = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [productosEnCarrito, setProductosEnCarrito] = useState(JSON.parse(localStorage.getItem('productos-en-carrito')) || []);

  useEffect(() => {
    getProductos().then(productos => {
      setProductos(productos);
      if (category) {
        setFilteredProductos(productos.filter(producto => producto.tipo === category));
      } else {
        setFilteredProductos(productos);
      }
    }).catch(error => {
      console.error("Error al obtener productos:", error);
    });
  }, [category]);

  useEffect(() => {
    localStorage.setItem('productos-en-carrito', JSON.stringify(productosEnCarrito));
  }, [productosEnCarrito]);

  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory);
    if (newCategory) {
      setFilteredProductos(productos.filter(producto => producto.tipo === newCategory));
    } else {
      setFilteredProductos(productos);
    }
  };

  const handleClick = (category, path) => {
    handleCategoryChange(category);
    navigate(path);
  };

  const agregarAlCarrito = (producto) => {
    const productoExistente = productosEnCarrito.find(item => item.id === producto.id);
    if (productoExistente) {
      setProductosEnCarrito(productosEnCarrito.map(item =>
        item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
      ));
    } else {
      setProductosEnCarrito([...productosEnCarrito, { ...producto, cantidad: 1 }]);
    }
  };

  const actualizarNumerito = () => {
    return productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
  };

  const renderHeader = () => {
    if (location.pathname === '/cart') {
      return (
        <header className="header-desktop">
          <h1 className="logo">TechShop</h1>
          <nav>
            <ul className="menu">
              <li>
                <button onClick={() => navigate('/')} className="boton-menu boton-volver">
                  <i className="bi bi-arrow-return-left"></i> Seguir comprando
                </button>
              </li>
              <li>
                <button className="boton-menu boton-carrito active">
                  <i className="bi bi-cart-fill"></i> Carrito
                </button>
              </li>
            </ul>
          </nav>
        </header>
      );
    } else if (location.pathname === '/auth') {
      return (
        <header className="header-desktop">
          <h1 className="logo">TechShop</h1>
          <nav>
            <ul className="menu">
              <li>
                <button onClick={() => navigate('/')} className="boton-menu boton-volver">
                  <i className="bi bi-arrow-return-left"></i> Volver
                </button>
              </li>
              <li>
                <button className="boton-menu active">
                  <i className="bi bi-person-circle"></i> Iniciar sesión
                </button>
              </li>
            </ul>
          </nav>
        </header>
      );
    } else {
      return (
        <header className="header-desktop">
          <h1 className="logo">TechShop</h1>
          <nav>
            <ul className="menu">
              <li>
                <button onClick={() => handleClick('', '/')} className="boton-menu boton-categoria active">
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
                  <i className="bi bi-cart-fill"></i> Carrito <span id="numerito" className="numerito">{actualizarNumerito()}</span>
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
    }
  };

  return (
    <div className="wrapper">
      {renderHeader()}
      <main>
        <Routes>
          <Route path="/" element={
            <div>
              <h2 className="titulo-principal">{selectedCategory ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) : 'Todos los productos'}</h2>
              <div id="contenedor-productos" className="contenedor-productos">
                {filteredProductos.map(producto => (
                  <Producto key={producto.id} producto={producto} agregarAlCarrito={agregarAlCarrito} />
                ))}
              </div>
            </div>
          } />
          <Route path="/cart" element={<Cart productosEnCarrito={productosEnCarrito} setProductosEnCarrito={setProductosEnCarrito} />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/category/:category" element={
            <div>
              <h2 className="titulo-principal">{selectedCategory ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) : 'Todos los productos'}</h2>
              <div id="contenedor-productos" className="contenedor-productos">
                {filteredProductos.map(producto => (
                  <Producto key={producto.id} producto={producto} agregarAlCarrito={agregarAlCarrito} />
                ))}
              </div>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
};

export default App;