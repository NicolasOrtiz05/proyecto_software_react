import React, { useState, useEffect } from 'react';
import { dbRef, database, onValue } from '../services/firebase-config';

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);

  useEffect(() => {
    const promotionsRef = dbRef(database, 'promotions');
    const unsubscribe = onValue(promotionsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const promotionsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setPromotions(promotionsArray);
      } else {
        setPromotions([]);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <div>
      {promotions.map((promotion) => (
        <div key={promotion.id} className="promotion-container">
          <h3>Promoción Activa</h3>
          <p>{promotion.descripcion}</p>
          <p>Descuento: {promotion.percentage}%</p>
          <p>Fecha: {promotion.date}</p>
        </div>
      ))}
    </div>
  );
};

export default Promotions;