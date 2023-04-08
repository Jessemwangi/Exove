import { JesseM } from '../dbcontext/dbContext.js';
import { v4 as uuidv4 } from 'uuid';
import { dbclose, dbconnect } from '../Configs/dbConnect.js';
export const jesseGet = async (req, res) => {
    res.status(200).json('Hellow Jesse!!!');
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
    console.log(jzee);
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