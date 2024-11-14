/* global Swal, Toastify */
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams, useNavigate, useLocation } from 'react-router-dom';
import Cart from './pages/Cart';
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import Producto from './components/Producto';
import Header from './components/Header';
import { getProductos } from './services/firebaseService';
import { onAuthStateChanged, auth, ref, storage, getDownloadURL} from './services/firebase-config';
import Promotions from './components/Promotions';
import './index.css';
import { getAllProductos } from './services/productoServise';

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
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    getAllProductos().then(productos => {
      cargarProductosConImagenes(productos);
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
			setFilteredProductos(productosConImagenes.filter(producto => producto !== null));
		});
	};

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
    Toastify({
      text: "Producto agregado",
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
      },
      offset: {
        x: '1.5rem',
        y: '1.5rem'
      },
    }).showToast();
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
    } else if (location.pathname === '/admin') {
      return (
        <header className="header-desktop">
          <h1 className="logo">TechShop - Admin</h1>
          <nav>
            <ul className="menu">
              <li>
                <button onClick={() => navigate('/')} className="boton-menu boton-volver">
                  <i className="bi bi-arrow-return-left"></i> Volver
                </button>
              </li>
              <li>
                <button className="boton-menu active">
                  <i className="bi bi-gear-fill"></i> Administración
                </button>
              </li>
            </ul>
          </nav>
        </header>
      );
    } else {
      return (
        <Header user={user} handleClick={handleClick} actualizarNumerito={actualizarNumerito} />
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
              <Promotions /> {/* Agregamos el componente de Promociones */}
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