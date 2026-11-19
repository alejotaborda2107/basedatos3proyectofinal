const { MongoClient } = require('mongodb');

// URI conectada al Replica Set completo
const uri = "mongodb://127.0.0.1:27017,127.0.0.1:27018,127.0.0.1:27019/TiendaLD?replicaSet=rs0";
const client = new MongoClient(uri);

async function ejecutarTransaccion() {
    await client.connect();
    const db = client.db("TiendaLD");
    
    // 1. Instanciamos la sesión para encapsular las operaciones
    const session = client.startSession();

    try {
        // 2. Iniciamos la transacción ACID
        session.startTransaction();

        // Operación A: Restar stock (Se pasa la sesión como parámetro)
        const productoActualizado = await db.collection("productos").updateOne(
            { nombre: "iPhone 14 Pro" },
            { $inc: { stock: -1 } },
            { session }
        );

        if (productoActualizado.modifiedCount === 0) {
            throw new Error("Producto sin stock o inexistente.");
        }

        // Operación B: Registrar la venta
        await db.collection("ventas").insertOne(
            { producto: "iPhone 14 Pro", cantidad: 1, fecha: new Date() },
            { session }
        );
    throw new Error("Stock insuficiente - fallo provocado para prueba de rollback");
        // 3. Si A y B son exitosas, confirmamos los cambios (COMMIT)
        await session.commitTransaction();
        console.log("Transacción confirmada en todos los nodos (COMMIT).");

    } catch (error) {
        // 4. Ante cualquier error, deshacemos todos los cambios (ROLLBACK)
        console.error("Error en la operación. Ejecutando ROLLBACK...", error);
        await session.abortTransaction();
    } finally {
        session.endSession();
        await client.close();
    }
}
ejecutarTransaccion();