const tf = require('@tensorflow/tfjs-node');
require('dotenv').config(); // Load environment variables from .env file

const loadModel = async () => {
    try {
        console.log('Loading model from URL:', process.env.MODEL_URL);
        const model = await tf.loadLayersModel(process.env.MODEL_URL);
        console.log('Model loaded successfully');
        return model;
    } catch (error) {
        console.error('Error loading model:', error);
        throw new Error('Failed to load model');
    }
};

module.exports = loadModel;
