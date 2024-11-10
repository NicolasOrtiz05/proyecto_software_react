import { dbRef, database, get, ref, getDownloadURL, storage } from './firebase-config';

export const getProductos = async () => {
	try {
		const dbReference = dbRef(database, 'productos');
		const snapshot = await get(dbReference);
		if (snapshot.exists()) {
			const productos = Object.values(snapshot.val());
			const productosConImagenes = await Promise.all(productos.map(async producto => {
				const storageRef = ref(storage, `/${producto.tipo}/${producto.imagen}`);
				const url = await getDownloadURL(storageRef);
				return { ...producto, url };
			}));
			console.log("Productos obtenidos:", productosConImagenes);
			return productosConImagenes;
		} else {
			console.log("No hay productos disponibles en Firebase");
			return [];
		}
	} catch (error) {
		console.error("Error al obtener productos:", error);
		return [];
	}
};