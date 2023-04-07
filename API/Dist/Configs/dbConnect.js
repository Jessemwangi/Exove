import mongoose from "mongoose";
import * as dotenv from 'dotenv';
dotenv.config();
const dbuser = process.env.DBUSERNAME;
const dbpass = process.env.DBPASSWORD;
const uri = `mongodb+srv://${dbuser}:${dbpass}@cluster0.hounq81.mongodb.net/?retryWrites=true&w=majority`;
const options = { useNewUrlParser: true, useUnifiedTopology: true, };
export const dbconnect = async () => {
    try {
        await mongoose.connect(uri, options);
        console.log('Connected to MongoDB');
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