import axios from 'axios';

const BASE_URL = 'http://localhost:8084/promociones'; 

// Crear una promoción
export const crearPromocion = async (promocion) => {
  try {
    const response = await axios.post(`${BASE_URL}/crear`, promocion);
    return response.data;
  } catch (error) {
    console.error('Error al crear la promoción:', error);
    throw error;
  }
};

// Obtener todas las promociones
export const obtenerPromociones = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/todas`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener promociones:', error);
    throw error;
  }
};

// Obtener una promoción por ID
export const obtenerPromocionPorId = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/buscar/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener la promoción por ID:', error);
    throw error;
  }
};

// Actualizar una promoción
export const editarPromocion = async (promocion) => {
  try {
    const response = await axios.put(`${BASE_URL}/editar`, promocion);
    return response.data;
  } catch (error) {
    console.error('Error al editar la promoción:', error);
    throw error;
  }
};

// Eliminar una promoción
export const eliminarPromocion = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/eliminar/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar la promoción:', error);
    throw error;
  }
};
