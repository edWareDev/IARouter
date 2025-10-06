const API_DEFAULT_PORT = 3001;

export const startServer = (app) => {

    return new Promise((resolve, reject) => {
        const PORT = process.env.SERVER_PORT || API_DEFAULT_PORT;

        const server = app.listen(PORT, async () => {
            const MESSAGE = `Conectado al servidor mediante el puerto: ${PORT}`;
            console.log(new Date(), MESSAGE);
            resolve(server);
            return;
        });

        server.on('error', async (error) => {
            let errorMessage;

            switch (error.code) {
                case 'EADDRINUSE':
                    errorMessage = `El puerto ${PORT} está ocupado`;
                    break;
                case 'EACCES':
                    errorMessage = `No se tienen permisos para usar el puerto ${PORT}`;
                    break;
                default:
                    errorMessage = `Error al iniciar el servidor: ${error.message}`;
            }

            console.error(new Date(), errorMessage);
            reject(error);
            return;
        });
    });
};