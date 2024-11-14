import axios from 'axios';

// URL base del backend
const API_URL = 'http://localhost:8084/catalogo';

// Función para crear un producto con imagen
export const createProducto = async (producto, imagen) => {
  const formData = new FormData();
  formData.append('producto', new Blob([JSON.stringify(producto)], { type: 'application/json' }));
  formData.append('imagen', imagen);
  console.log('producto', producto);
  console.log('imagen', imagen);

  try {
    const response = await axios.post(`${API_URL}/crear`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al crear el producto:', error);
    throw error;
  }
};

// Función para obtener todos los productos
export const getAllProductos = async () => {
  try {
    const response = await axios.get(`${API_URL}/todos`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los productos:', error);
    throw error;
  }
};

// Función para obtener un producto por ID
export const getProductoById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/buscar/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el producto con ID ${id}:`, error);
    throw error;
  }
};

// Función para actualizar un producto
export const updateProducto = async (producto) => {
  try {
    const response = await axios.put(`${API_URL}/editar`, producto, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el producto:', error);
    throw error;
  }
};

// Función para eliminar un producto por ID
export const deleteProducto = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/eliminar/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar el producto con ID ${id}:`, error);
    throw error;
  }
};
