import { HTTP_CODES } from "../../lib/http_error_codes.js";
import { deleteCollection } from "../../utils/DeleteChromaBDCollection.js";

export const deleteCollectionController = async (req, res) => {
    try {
        const collectionName = req.params.name;
        if (!collectionName) return res.status(HTTP_CODES._400_BAD_REQUEST).json({ error: "Falta el nombre de la colección" });

        const resultDeleteCollection = await deleteCollection(collectionName);
        res.json(resultDeleteCollection);
    } catch (error) {
        console.error(error.message || error);
        res.status(HTTP_CODES._500_INTERNAL_SERVER_ERROR).json({ error: "Error obteniendo las colecciones" });

    };
};