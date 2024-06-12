const { Firestore } = require('@google-cloud/firestore');

const storePredictionData = async (id, data) => {
    const predictCollection = db.collection('predictions');
    await predictCollection.doc(id).set(data);
};

const storeUserData = async (id, data) => {
    const userCollection = db.collection('users');
    await userCollection.doc(id).set(data);
};

module.exports = { storePredictionData, storeUserData };