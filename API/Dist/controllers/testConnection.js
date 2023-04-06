import { dbclose, dbconnect } from "../Configs/dbConnect.js";
export const testDb = async (req, res) => {
    try {
        const testresult = await dbconnect();
        // perform actions on the collection object
        res.status(200).json(testresult);
    }
    catch (error) {
        console.log(error);
        res.status(200).json(error);
    }
    await dbclose();
};
export const testDb2 = async (req, res) => {
    res.status(200).json("test2");
};
//# sourceMappingURL=testConnection.js.map