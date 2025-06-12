const admin = require("firebase-admin");
const fs = require("fs");

// Caminho para a chave JSON do novo projeto Firebase
const serviceAccount = require("./credenciais/marketplace.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function importAllCollections() {
  const rawData = fs.readFileSync("backup.json");
  const backupData = JSON.parse(rawData);

  for (const [collection, documents] of Object.entries(backupData)) {
    for (const data of documents) {
      await db.collection(collection).add(data);
    }
  }

  console.log("Importação de todas as collections concluída!");
}

importAllCollections();
