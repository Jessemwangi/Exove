import { JesseM } from '../dbcontext/dbContext.js';
import { v4 as uuidv4 } from 'uuid';
import { dbclose, dbconnect } from '../Configs/dbConnect.js';
export const jesseGet = async (req, res, next) => {
    try {
        await dbconnect();
        const jesseData = await JesseM.find({}).sort({ createOn: 1, name: 1 }).limit(10).exec();
        await dbclose();
        res.status(200).json(jesseData);
    }
    catch (error) {
        next(error);
    }
};
export const jesseInsert = async (req, res) => {
    const jessedata = req.body;
    console.log(jessedata);
    const jzee = {
        _id: uuidv4(),
        name: jessedata.name,
        createOn: new Date(),
        age: 30,
    };
    const jesseInstance = new JesseM(jzee);
    try {
        await dbconnect();
        await jesseInstance.save();
        res.status(200).json('Data saved successfully!');
        await dbclose();
    }
    catch (error) {
        console.error(error);
        res.status(500).json('Error saving data!');
    }
};
//# sourceMappingURL=jesseController.js.map