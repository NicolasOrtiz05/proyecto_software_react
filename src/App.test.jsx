import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// Prueba Unitaria: Verifica que el logo de TechShop se renderiza correctamente
test('renders TechShop logo', () => {
	render(<App />);
	const logoElement = screen.getByText(/TechShop/i);
	expect(logoElement).toBeInTheDocument();
});

// Prueba Unitaria: Verifica que se renderizan todos los productos por defecto
test('renders all products by default', async () => {
	render(<App />);
	const titleElement = await screen.findByText(/Todos los productos/i);
	expect(titleElement).toBeInTheDocument();
});

// Prueba Unitaria: Verifica la navegación a la página del carrito
test('navigates to cart page', () => {
	render(<App />);
	const cartButton = screen.getByRole('button', { name: /Carrito/i });
	fireEvent.click(cartButton);
	const cartTitle = screen.getByText(/Carrito/i);
	expect(cartTitle).toBeInTheDocument();
});

// Prueba Unitaria: Verifica la navegación a la página de autenticación
test('navigates to auth page', () => {
	render(<App />);
	const authButton = screen.getByRole('button', { name: /Iniciar sesión/i });
	fireEvent.click(authButton);
	const authTitle = screen.getByText(/Iniciar sesión/i);
	expect(authTitle).toBeInTheDocument();
});