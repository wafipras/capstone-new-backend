const tf = require('@tensorflow/tfjs-node');

async function predictClassification(model, inputData) {
    // Convert inputData to tensor
    const inputTensor = tf.tensor2d([inputData]);

    // Perform prediction
    const class_name = [
        'AIDS',
        'Alergi',
        'Asam Lambung',
        'Asma',
        'Diabetes',
        'Cacar Air',
        'Demam Berdarah',
        'Hepatitis A',
        'Hepatitis B',
        'Hepatitis C',
        'Hipertensi',
        'Infeksi Jamur',
        'Infeksi Saluran Kemih',
        'Malaria',
        'Muntaber',
        'Paru-Paru Basah',
        'Reaksi Obat',
        'Tipes',
        'Tuberkulosis',
        'Vertigo'
    ];
    const prediction = model.predict(inputTensor);

    // Process prediction result
    const classResult = tf.argMax(prediction, 1).dataSync()[0];
    const label = class_name[classResult]

    return { classResult, label };
}

module.exports = predictClassification;