import { HTTP_CODES } from "../../lib/http_error_codes.js";
import { listAllCollections } from "../../utils/ListChromaBDCollection.js";

export const listAllCollectionsController = async (req, res) => {
    try {
        const allCollections = await listAllCollections();
        res.json(allCollections);
    } catch (error) {
        console.error(error.message || error);
        res.status(HTTP_CODES._500_INTERNAL_SERVER_ERROR).json({ error: "Error obteniendo las colecciones" });

    };
};