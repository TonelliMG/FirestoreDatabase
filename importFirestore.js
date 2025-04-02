const admin = require("firebase-admin");
const fs = require("fs");

// Caminho para a chave JSON do novo projeto Firebase
const serviceAccount = require("./importjson");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function importFirestore() {
    const rawData = fs.readFileSync("backup.json");
    const backupData = JSON.parse(rawData);

    for (const [collection, documents] of Object.entries(backupData)) {
        for (const doc of documents) {
            if (!doc.id) {
                console.warn(`Documento sem ID na coleção "${collection}", ignorando...`);
                continue;
            }

            const { id, ...data } = doc;
            await db.collection(collection).doc(id).set(data);
        }
    }

    console.log("Importação concluída com sucesso!");
}

importFirestore();
