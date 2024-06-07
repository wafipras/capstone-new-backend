const tf = require('@tensorflow/tfjs-node');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

console.log('Environment Variables:', process.env); // Debugging: Print all environment variables

async function loadModel() {
    const modelUrl = process.env.MODEL_URL;
    console.log('Model URL:', modelUrl); // Debugging: Print the model URL
    if (!modelUrl) {
        throw new Error('MODEL_URL is not set');
    }
    return tf.loadLayersModel(modelUrl);
}

loadModel()
    .then(model => {
        console.log('Model loaded successfully');
    })
    .catch(err => {
        console.error('Error loading model:', err);
        console.error('Error stack:', err.stack);
    });


module.exports = loadModel;
