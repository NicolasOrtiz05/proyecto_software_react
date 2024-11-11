import React, { useEffect } from 'react';
import { auth, onAuthStateChanged, set, dbRef, database, push } from '../services/firebase-config';
import '../index.css';
import Swal from 'sweetalert2';
import { Toastify } from 'toastify-js';
import 'sweetalert2/dist/sweetalert2.css';
import 'toastify-js/src/toastify.css';
const Cart = ({ productosEnCarrito, setProductosEnCarrito }) => {
    useEffect(() => {
        localStorage.setItem('productos-en-carrito', JSON.stringify(productosEnCarrito));
    }, [productosEnCarrito]);

    const eliminarDelCarrito = (id) => {
        Toastify({
            text: "Producto eliminado",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "linear-gradient(to right, #2F579C, #617ebd)",
                borderRadius: "2rem",
                textTransform: "uppercase",
                fontSize: ".75rem"
            },
            offset: {
                x: '1.5rem',
                y: '1.5rem'
            }
        }).showToast();
        const nuevosProductos = productosEnCarrito.filter(producto => producto.id !== id);
        setProductosEnCarrito(nuevosProductos);
    };

    const vaciarCarrito = () => {
        setProductosEnCarrito([]);
    };

    const comprarCarrito = () => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // Validar que todos los productos tengan los campos necesarios
                const productosValidados = productosEnCarrito.map(producto => {
                    return {
                        id: producto.id || '',
                        titulo: producto.titulo || '',
                        cantidad: producto.cantidad || 0,
                        precio: producto.precio || 0,
                        subtotal: (producto.precio || 0) * (producto.cantidad || 0)
                    };
                }).filter(producto => producto.id && producto.titulo);

                if (productosValidados.length === 0) {
                    Swal.fire({
                        title: 'Error',
                        text: 'No hay productos válidos en el carrito',
                        icon: 'error'
                    });
                    return;
                }

                const total = productosValidados.reduce((acc, producto) => acc + producto.subtotal, 0);
                const colombiaTime = new Date().toLocaleString("en-US", { timeZone: "America/Bogota" });

                // Crear una referencia para los pedidos del usuario
                const userOrdersRef = dbRef(database, `pedidos/${user.uid}`);
                
                // Generar una nueva entrada con ID único
                const newOrderRef = push(userOrdersRef);

                const pedido = {
                    uid: user.uid,
                    productos: productosValidados,
                    total: total,
                    fecha: colombiaTime,
                    estado: 'pendiente' // Agregamos un estado inicial al pedido
                };

                // Guardar el pedido con el ID único generado
                set(newOrderRef, pedido)
                    .then(() => {
                        Swal.fire({
                            title: '¡Compra realizada!',
                            text: 'Tu pedido ha sido guardado con éxito.',
                            icon: 'success'
                        });

                        // Limpiar carrito
                        setProductosEnCarrito([]);
                        localStorage.setItem('productos-en-carrito', JSON.stringify([]));

                        // Mostrar pantalla de "Compra realizada"
                        const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
                        const contenedorCarritoProductos = document.querySelector("#carrito-productos");
                        const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
                        const contenedorCarritoComprado = document.querySelector("#carrito-comprado");

                        if (contenedorCarritoVacio) contenedorCarritoVacio.classList.add("disabled");
                        if (contenedorCarritoProductos) contenedorCarritoProductos.classList.add("disabled");
                        if (contenedorCarritoAcciones) contenedorCarritoAcciones.classList.add("disabled");
                        if (contenedorCarritoComprado) contenedorCarritoComprado.classList.remove("disabled");
                    })
                    .catch(error => {
                        console.error("Error al guardar el pedido en Firebase:", error);
                        Swal.fire({
                            title: 'Error',
                            text: 'No se pudo completar la compra.',
                            icon: 'error'
                        });
                    });
            } else {
                Swal.fire({
                    title: 'Para comprar tienes que iniciar sesión',
                    icon: 'question',
                    html: `¿Quieres iniciar sesión?`,
                    showCancelButton: true,
                    focusConfirm: false,
                    confirmButtonText: 'Sí',
                    cancelButtonText: 'No'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/auth';
                    }
                });
            }
        });
    };

    const total = productosEnCarrito.reduce((acc, producto) => acc + (producto.precio * producto.cantidad), 0);

    return (
        <div>
            <h2 className="titulo-principal">Carrito</h2>
            {productosEnCarrito.length > 0 ? (
                <div className="contenedor-carrito">
                    {productosEnCarrito.map(producto => (
                        <div key={producto.id} className="carrito-producto">
                            <img className="carrito-producto-imagen" src={producto.url} alt={producto.titulo} />
                            <div className="carrito-producto-titulo">
                                <small>Título</small>
                                <h3>{producto.titulo}</h3>
                            </div>
                            <div className="carrito-producto-cantidad">
                                <small>Cantidad</small>
                                <p>{producto.cantidad}</p>
                            </div>
                            <div className="carrito-producto-precio">
                                <small>Precio</small>
                                <p>${producto.precio}</p>
                            </div>
                            <div className="carrito-producto-subtotal">
                                <small>Subtotal</small>
                                <p>${producto.precio * producto.cantidad}</p>
                            </div>
                            <button className="carrito-producto-eliminar" onClick={() => eliminarDelCarrito(producto.id)}><i className="bi bi-trash-fill"></i></button>
                        </div>
                    ))}
                    <div className="carrito-acciones">
                        <div className="carrito-acciones-izquierda">
                            <button onClick={vaciarCarrito} id="carrito-acciones-vaciar" className="carrito-acciones-vaciar">Vaciar carrito</button>
                        </div>
                        <div className="carrito-acciones-derecha">
                            <div className="carrito-acciones-total">
                                <p>Total:</p>
                                <p>${total}</p>
                            </div>
                            <button onClick={comprarCarrito} id="carrito-acciones-comprar" className="carrito-acciones-comprar">Comprar ahora</button>
                        </div>
                    </div>
                </div>
            ) : (
                <p className="carrito-vacio">Tu carrito está vacío. <i className="bi bi-emoji-frown"></i></p>
            )}
        </div> 
    );
};

export default Cart;