import React, { useState, useEffect } from 'react';
import { dbRef, database, onValue } from '../services/firebase-config';

const Promotions = () => {
  const [promotion, setPromotion] = useState('');

  useEffect(() => {
    const promotionsRef = dbRef(database, 'promotions');
    const unsubscribe = onValue(promotionsRef, (snapshot) => {
      if (snapshot.exists()) {
        setPromotion(snapshot.val());
      } else {
        setPromotion('');
      }
    });

    return unsubscribe;
  }, []);

  return (
    <div>
      {promotion && (
        <div className="promotion-container">
          <h3>Promoción Activa</h3>
          <p>{promotion}</p>
        </div>
      )}
    </div>
  );
};

export default Promotions;