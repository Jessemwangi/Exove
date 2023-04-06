import mongoose, { ConnectOptions } from "mongoose";

const dbuser = process.env.DBUSERNAME;
const dbpass = process.env.DBPASSWORD;
console.log('connect ... ',dbuser,dbpass)

const uri = `mongodb+srv://${dbuser}:${dbpass}@cluster0.hounq81.mongodb.net/?retryWrites=true&w=majority`;
 const options =  { useNewUrlParser: true, useUnifiedTopology: true, } as ConnectOptions;

export const  dbconnect = async () => {
    try {
        await mongoose.connect(uri,options);
        console.log('Connected to MongoDB');
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
