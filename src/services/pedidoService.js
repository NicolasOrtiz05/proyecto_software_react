import axios from 'axios';

// Configura la URL base del backend
const API_URL = 'http://localhost:8084/pedidos'; // Asegúrate de que esta URL coincida con tu configuración

// Crear pedido
export const createPedido = async (pedidoData) => {
  try {
    const response = await axios.post(`${API_URL}/crear`, pedidoData);
    return response.data; // Devuelve el mensaje de confirmación
  } catch (error) {
    console.error('Error al crear el pedido:', error);
    throw error;
  }
};

// Obtener todos los pedidos
export const getAllPedidos = async () => {
  try {
    const response = await axios.get(`${API_URL}/todos`);
    return response.data; // Devuelve la lista de pedidos
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    throw error;
  }
};

// Obtener pedido por ID
export const getPedidoById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/buscar/${id}`);
    return response.data; // Devuelve el pedido específico
  } catch (error) {
    console.error(`Error al obtener el pedido con ID ${id}:`, error);
    throw error;
  }
};

// Actualizar pedido
export const updatePedido = async (pedidoData) => {
  try {
    const response = await axios.put(`${API_URL}/editar`, pedidoData);
    return response.data; // Devuelve el mensaje de confirmación
  } catch (error) {
    console.error('Error al actualizar el pedido:', error);
    throw error;
  }
};

// Eliminar pedido
export const deletePedido = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/eliminar/${id}`);
    return response.data; // Devuelve el mensaje de confirmación
  } catch (error) {
    console.error(`Error al eliminar el pedido con ID ${id}:`, error);
    throw error;
  }
};
