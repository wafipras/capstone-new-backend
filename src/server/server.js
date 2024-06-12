const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const loadModel = require('../services/loadModel'); // Assuming loadModel.js is in the same directory
const predictClassification = require('../services/inferenceService'); // Assuming inferenceService.js is in the same directory
const InputError = require('../exceptions/InputError'); // Assuming InputError.js is in the same directory


const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: 'localhost',
        routes: {
            cors: {
                origin: ["*"],
            },
        },
    });

    // Load the TensorFlow.js model
    let model;
    try {
        model = await loadModel();
    } catch (error) {
        console.error('Failed to load the model:', error);
        process.exit(1); // Terminate the process if model loading fails
    }

    // Attach the model to the server.app context
    server.app.model = model;

    // Define routes in the server

    server.route(routes);

    // Extend server with custom response handler
    server.ext("onPreResponse", (request, h) => {
        const response = request.response;

        if (response.isBoom) {
            const newResponse = h.response({
                status: "fail",
                message: response.message,
            });
            newResponse.code(response.output.statusCode);
            return newResponse;
        }

        return h.continue;
    });

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.error('Unhandled promise rejection:', err);
    process.exit(1); // Terminate the process on unhandled rejections
});

init();