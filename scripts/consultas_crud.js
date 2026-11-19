// ==========================================
// PASO 3: CONSULTAS DE LECTURA (READ)
// ==========================================

// 1. Filtrado básico por coincidencia exacta
db.productos.find({ categoria: "Perifericos" });

// 2. Operadores de comparación en campos numéricos
db.productos.find({ precio: { $gt: 100, $lte: 500 } });

// 3. Notación de punto (dot notation) en objetos anidados
db.productos.find({ "especificaciones.ram": "16GB" });

// 4. Proyección de campos específica (excluyendo _id)
db.productos.find(
  { categoria: "Smartphones" },
  { _id: 0, nombre: 1, precio: 1 }
);

// 5. Filtrado de elementos dentro de un arreglo
db.productos.find({ tags: { $all: ["gaming", "teclado"] } });


// ==========================================
// PASO 4: ACTUALIZACIONES ATÓMICAS (UPDATE & DELETE)
// ==========================================

// 1. Actualización con $set (modificar un campo y añadir otro)
db.productos.updateOne(
  { nombre: "Tablet Lite" },
  { $set: { precio: 220, en_oferta: true } }
);

// 2. Incremento/Decremento con $inc
db.productos.updateOne(
  { nombre: "Laptop" },
  { $inc: { stock: -1 } }
);

// 3. Eliminación segura con deleteOne (filtro estricto)
db.productos.deleteOne(
  { nombre: "Cable HDMI 2.1", stock: { $gt: 150 } }
);