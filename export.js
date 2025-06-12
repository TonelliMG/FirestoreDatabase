const admin = require("firebase-admin");
const fs = require("fs");

// Caminho para a chave JSON do seu projeto Firebase
const serviceAccount = require("./portifolio");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function exportAllCollections() {
  const collections = await db.listCollections();
  let backupData = {};

  for (const collection of collections) {
    const snapshot = await collection.get();
    backupData[collection.id] = [];

    snapshot.forEach((doc) => {
      backupData[collection.id].push(doc.data());
    });
  }

  fs.writeFileSync("backup-all.json", JSON.stringify(backupData, null, 2));
  console.log("Backup de todas as collections concluído!");
}

exportAllCollections();
