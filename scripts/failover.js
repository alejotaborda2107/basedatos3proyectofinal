const { MongoClient } = require('mongodb');

// La ruta apunta a tus tres nodos locales y a la base TiendaLD
const uri = "mongodb://127.0.0.1:27017,127.0.0.1:27018,127.0.0.1:27019/TiendaLD?replicaSet=rs0";
const client = new MongoClient(uri);

async function probarFailover() {
    try {
        await client.connect();
        console.log("¡Conectado exitosamente al clúster local!");
        const db = client.db("TiendaLD");
        const collection = db.collection("productos");

        console.log("Iniciando lectura continua. Apaga el Nodo 1 ahora...\n");

        // Este bucle intenta leer la base de datos cada 2 segundos
        setInterval(async () => {
            try {
                const productos = await collection.find().toArray();
                console.log(`[${new Date().toLocaleTimeString()}] Todo OK. Se leyeron ${productos.length} productos.`);
            } catch (err) {
                console.log(`[${new Date().toLocaleTimeString()}] ⚠️ Conexión perdida. Esperando al nuevo Primario...`);
            }
        }, 2000);

    } catch (error) {
        console.error("Error al arrancar:", error);
    }
}

probarFailover();