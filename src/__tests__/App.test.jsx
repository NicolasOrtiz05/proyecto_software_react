import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';
import '@testing-library/jest-dom/extend-expect';

// Prueba Unitaria: Verifica que el logo de TechShop se renderiza correctamente
test('renders TechShop logo', () => {
	render(<App />);
	const logoElement = screen.getByText(/TechShop/i);
	expect(logoElement).toBeInTheDocument();
});

// Prueba Unitaria: Verifica la navegación a la página del carrito
test('navigates to cart page', () => {
	render(<App />);
	const cartButton = screen.getByRole('button', { name: /Carrito/i });
	fireEvent.click(cartButton);
	const cartTitles = screen.getAllByText(/Carrito/i);
	expect(cartTitles.length).toBeGreaterThan(0);
	expect(cartTitles[0]).toBeInTheDocument();
});


