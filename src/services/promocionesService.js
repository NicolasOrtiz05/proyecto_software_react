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
