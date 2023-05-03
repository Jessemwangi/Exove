import mongoose, { ConnectOptions } from "mongoose";
import * as dotenv from 'dotenv';
dotenv.config();
const dbuser = process.env.DBUSERNAME;
const dbpass = process.env.DBPASSWORD;



 const uri = `mongodb+srv://${dbuser}:${dbpass}@cluster0.hounq81.mongodb.net/?retryWrites=true&w=majority`;
//const uri = 'mongodb://localhost:27017/feedback'; // replace with your database name
 const options =  { useNewUrlParser: true, useUnifiedTopology: true, } as ConnectOptions;

 // cloud connection
export const  dbconnect = async () => {
    try {
        await mongoose.connect(uri,options);
    
        return 'Connected to MongoDB';
    } catch (err:any) {
        console.error(err);
        return err.message;
    }
}

export const dbclose = async () =>{
    try {
        await mongoose.connection.close()
        console.log('Closed connection to MongoDB');
    } catch (err) {
        console.error(err);
    }
}

//Local mongo db connection
// export const dbconnect = async () => {
//     try {
//       
//       await mongoose.connect(uri, options);
//       console.log('Connected to MongoDB');
//       return 'Connected to MongoDB';
//     } catch (err:any) {
//       console.error(err);
//       return err.message;
//     }
//   };

