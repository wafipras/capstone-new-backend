const { Firestore } = require('@google-cloud/firestore');

const storePredictionData = async (id, data) => {
    const db = new Firestore({
        databaseId: 'healhub',
        projectId: process.env.GCLOUD_PROJECT,
        keyFilename: process.env.GCLOUD_KEY_FILE,
        });

    const predictCollection = db.collection('predictions');
    await predictCollection.doc(id).set(data);
};

const storeUserData = async (id, data) => {
    const db = new Firestore({
        databaseId: 'healhub',
        projectId: process.env.GCLOUD_PROJECT,
        keyFilename: process.env.GCLOUD_KEY_FILE,
        });

    const userCollection = db.collection('users');
    await userCollection.doc(id).set(data);
};

module.exports = { storePredictionData, storeUserData };