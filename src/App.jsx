import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useParams } from 'react-router-dom';
import Cart from './pages/Cart';
import Auth from './pages/Auth';
import Admin from './pages/Admin';
import Header from './components/Header';
import Producto from './components/Producto';
import { getProductos } from './services/firebaseService';
import './index.css';

function App() {
  const { category } = useParams();
  const [productos, setProductos] = useState([]);
  const [filteredProductos, setFilteredProductos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

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

  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory);
    if (newCategory) {
      setFilteredProductos(productos.filter(producto => producto.tipo === newCategory));
    } else {
      setFilteredProductos(productos);
    }
  };

  return (
    <Router>
      <div className="wrapper">
        <Header onCategoryChange={handleCategoryChange} />
        <main>
          <Routes>
            <Route path="/" element={
              <div>
                <h2 className="titulo-principal">{selectedCategory ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) : 'Todos los productos'}</h2>
                <div id="contenedor-productos" className="contenedor-productos">
                  {filteredProductos.map(producto => (
                    <Producto key={producto.id} producto={producto} />
                  ))}
                </div>
              </div>
            } />
            <Route path="/cart" element={<Cart />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/category/:category" element={
              <div>
                <h2 className="titulo-principal">{selectedCategory ? selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1) : 'Todos los productos'}</h2>
                <div id="contenedor-productos" className="contenedor-productos">
                  {filteredProductos.map(producto => (
                    <Producto key={producto.id} producto={producto} />
                  ))}
                </div>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;