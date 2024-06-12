const tf = require('@tensorflow/tfjs-node');

async function predictClassification(model, inputData) {
    // Convert inputData to tensor
    const inputTensor = tf.tensor2d([inputData]);

    // Perform prediction
    const prediction = model.predict(inputTensor);

    // Process prediction result
    const result = prediction.dataSync();
    const suggestion = "Example suggestion based on result"; // Modify as needed

    return { result, suggestion };
}

module.exports = predictClassification;