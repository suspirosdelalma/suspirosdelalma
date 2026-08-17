# Suspiros del Alma — Web v1

Primera versión de tienda pública + catálogo + carrito + ficha individual + maqueta del panel administrativo.

## Archivos principales

- `index.html`: tienda pública.
- `producto.html`: ficha dinámica de producto (`?id=...`).
- `admin.html`: primera maqueta del panel de administración.
- `assets/styles.css`: diseño general.
- `assets/app.js`: catálogo, filtros, carrito y WhatsApp.
- `assets/producto.js`: ficha individual.
- `assets/admin.js`: indicadores iniciales del panel.
- `data/products.js`: catálogo maestro inicial.
- `assets/logo-suspiros.jpg`: logo.

## IMPORTANTE

El repositorio es público. No guardar aquí:

- datos de clientes;
- teléfonos o direcciones;
- claves;
- contraseñas;
- tokens;
- costos privados si no querés que sean visibles;
- base real de pedidos.

El panel `admin.html` es por ahora una maqueta local. La administración segura debe conectarse en una siguiente etapa a una base de datos con autenticación.

## Cómo cargar productos

En esta versión los productos están en `data/products.js`.

Cada producto tiene:

- id
- nombre
- marca
- categorías
- precio
- costo
- stock
- stock mínimo
- destacado
- novedad
- oferta
- imagen
- descripción
- variantes
- aroma
- presentación
- uso
- cuidados
- etiquetas

Los productos con precio `null` muestran “Precio a cargar”.

## Fotos

Crear una carpeta `assets/productos/` y subir allí las imágenes.

Ejemplo:

`assets/productos/piedra-alumbre.jpg`

Luego, en `data/products.js`:

`image:"assets/productos/piedra-alumbre.jpg"`

## WhatsApp

Número configurado:

`+54 9 11 3938-4518`

## Publicación con GitHub Pages

Configuración recomendada:

- Branch: `main`
- Folder: `/(root)`

## Próxima etapa

1. Migrar los ~200 productos del catálogo de WhatsApp.
2. Cargar precios, stock y costos.
3. Crear variantes reales.
4. Agregar fotografías.
5. Conectar autenticación y base segura.
6. Registrar pedidos, ventas, clientes y proveedores.
7. Control de stock/reservas.
8. Carritos abandonados identificados con consentimiento.
9. Estadísticas y sugerencias de reposición.
