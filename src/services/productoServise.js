import axios from 'axios';

// URL base del backend
const API_URL = 'http://localhost:8084/catalogo';

// Función para crear un producto con imagen
export const createProducto = async (producto, imagen) => {
  const formData = new FormData();
  formData.append('producto', producto);
  formData.append('imagen', imagen);

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
export const updateProducto = async (producto, nuevaImagen = null) => {
  const formData = new FormData();
  formData.append('producto', JSON.stringify(producto));
  
  if (nuevaImagen) {
    formData.append('imagen', nuevaImagen);
  }

  try {
    const response = await axios.put(`${API_URL}/editar`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
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
