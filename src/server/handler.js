const predictClassification = require('../services/inferenceService');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { storePredictionData, storeUserData } = require('../services/storeData');
const InputError = require('../exceptions/InputError');
const { Firestore } = require('@google-cloud/firestore');
require('dotenv').config(); // Load environment variables from .env file

async function postPredict(request, h) {
    const { inputData } = request.payload;
    const model = request.server.app.model; // Get the model from the server's context

    // Initialize Firestore
    const db = new Firestore({
        databaseId: 'healhub',
        projectId: process.env.GCLOUD_PROJECT,
        keyFilename: process.env.GCLOUD_KEY_FILE,
    });

    // Validate inputData
    if (!Array.isArray(inputData) || inputData.length !== 70) {
        throw new InputError('Invalid input data. Please provide an array of 70 numerical values.');
    }

    // Perform prediction using the loaded model
    const { classResult, label } = await predictClassification(model, inputData);
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const data = {
        id,
        classResult,
        label,
        createdAt
    };

    await storePredictionData(id, data);

    const response = h.response({
        status: 'success',
        message: 'Model is predicted successfully',
        data: data
    });

    response.code(201);
    return response;
}

async function getPredictHistories(request, h) {
    // Initialize Firestore
    const db = new Firestore({
        databaseId: 'healhub',
        projectId: process.env.GCLOUD_PROJECT,
        keyFilename: process.env.GCLOUD_KEY_FILE,
    });

    const predictCollection = db.collection('predictions');
    const predictSnapshot = await predictCollection.get();

    const data = [];

    predictSnapshot.forEach((doc) => {
        const history = {
            id: doc.id,
            history: doc.data()
        };
        data.push(history);
    });

    const response = h.response({
        status: 'success',
        data: data
    });
    response.code(200);
    return response;
}

const registerHandler = async (request, h) => {
    const { username, email, password } = request.payload;
    const db = new Firestore({
        databaseId: 'healhub',
        projectId: process.env.GCLOUD_PROJECT,
        keyFilename: process.env.GCLOUD_KEY_FILE,
    });
    // Check if the email already exists
    const userRef = db.collection('users').where('email', '==', email);
    const snapshot = await userRef.get();

    if (!snapshot.empty) {
        return h.response({ status: 'fail', message: 'Email is already in use' }).code(409);
    }

    // Proceed with registration if the email does not exist
    const hashedPassword = await bcrypt.hash(password, 10);
    const userData = {
        username,
        email,
        password: hashedPassword,
    };
    const id = crypto.randomUUID();
    await storeUserData(id, userData); // Store user data in the database

    return h.response({ status: 'success', message: 'User registered successfully' }).code(201);
};

const loginHandler = async (request, h) => {
    const { email, password } = request.payload;
    const db = new Firestore({
        databaseId: 'healhub',
        projectId: process.env.GCLOUD_PROJECT,
        keyFilename: process.env.GCLOUD_KEY_FILE,
    });
    const userRef = db.collection('users').where('email', '==', email);
    const snapshot = await userRef.get();

    if (snapshot.empty) {
        return h.response({ status: 'fail', message: 'Invalid email or password' }).code(401);
    }

    const user = snapshot.docs[0].data();
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        return h.response({ status: 'fail', message: 'Invalid email or password' }).code(401);
    }

    return h.response({ status: 'success', message: 'Login successful' }).code(200);
};

module.exports = { postPredict, getPredictHistories, registerHandler, loginHandler, storePredictionData, storeUserData };
