const Hapi = require('@hapi/hapi');
const routes = require('./routes');

const init = async () => {
    const server = Hapi.server({
        port: 3000,
        host: "localhost",
        routes: {
            cors: {
                origin: ["*"],
            },
        },
    })

    server.route(routes)

    server.ext("onPreResponse", (request, h) => {
        const response = request.response

        if (response.isBoom) {
            const newResponse = h.response({
                status: "fail",
                message: response.message,
            })
            newResponse.code(response.output.statusCode)
            return newResponse
        }

        return h.continue
    })

    await server.start()
    console.log(`Server running at: ${server.info.uri}`)
}

init()