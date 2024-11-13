import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Auth from '../pages/Auth';
import '@testing-library/jest-dom/extend-expect';

// Prueba Unitaria: Verifica la interacción con los campos de correo electrónico y contraseña en la página de autenticación
test('allows typing in email and password fields', async () => {
	render(
		<Router>
			<Auth />
		</Router>
	);

	const emailInput = screen.getByLabelText(/Correo Electrónico/i);
	const passwordInput = screen.getByLabelText(/Contraseña/i);

	fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
	fireEvent.change(passwordInput, { target: { value: 'password' } });

	expect(emailInput.value).toBe('test@example.com');
	expect(passwordInput.value).toBe('password');
});