import React, { useState, useEffect } from 'react';
import { obtenerPromociones } from '../services/promocionesService';

const Promotions = () => {
  const [promotion, setPromotion] = useState(null);

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const data = await obtenerPromociones(); // Espera la resolución de la promesa
        setPromotion(data);
      } catch (error) {
        console.error("Error al obtener la promoción:", error);
      }
    };
    
    fetchPromotion();
  }, []);

  return (
    <div>
      {promotion ? (
        <div className="promotion-container">
          <h3>Promoción Activa</h3>
          <p>{promotion.descripcion}</p>
          <p>Descuento: {promotion.percentaje}%</p>
          <p>Fecha: {promotion.date}</p>
        </div>
      ) : (
        <p>No hay promociones disponibles.</p>
      )}
    </div>
  );
};

export default Promotions;
