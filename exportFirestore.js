const admin = require("firebase-admin");
const fs = require("fs");

// Caminho para a chave JSON do seu primeiro projeto Firebase
const serviceAccount = require("./exportjson");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function exportFirestore() {
    const collections = await db.listCollections();
    let backupData = {};

    for (const collection of collections) {
        const snapshot = await collection.get();
        backupData[collection.id] = [];

        snapshot.forEach((doc) => {
            // Pega o ID do Firestore
            let data = { id: doc.id, ...doc.data() };

            // Verifica se o campo 'id' no corpo está vazio, e se sim, substitui pelo ID do Firestore
            if (!data.id || data.id === "") {
                console.warn(`ID vazio no corpo do documento. Usando ID do Firestore: ${doc.id}`);
                data.id = doc.id;  // Atribui o ID correto do Firestore
            }

            // Adiciona o documento ao backup
            backupData[collection.id].push(data);
        });
    }

    // Salva o backup no arquivo
    fs.writeFileSync("backup.json", JSON.stringify(backupData, null, 2));
    console.log("Backup concluído com sucesso!");
}

exportFirestore();
