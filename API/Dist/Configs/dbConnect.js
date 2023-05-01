import mongoose from "mongoose";
import * as dotenv from 'dotenv';
dotenv.config();
const dbuser = process.env.DBUSERNAME;
const dbpass = process.env.DBPASSWORD;
export const securityKey = process.env.API_KEY;
const uri = 'mongodb://localhost:27017/feedback';
const options = { useNewUrlParser: true, useUnifiedTopology: true, };
export const dbconnect = async () => {
    try {
        await mongoose.connect(uri, options);
        return 'Connected to MongoDB';
    }
    catch (err) {
        console.error(err);
        return err.message;
    }
};
export const dbclose = async () => {
    try {
        await mongoose.connection.close();
        console.log('Closed connection to MongoDB');
    }
    catch (err) {
        console.error(err);
    }
};
//# sourceMappingURL=dbConnect.js.map