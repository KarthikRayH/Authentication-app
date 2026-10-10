import mongoose from "mongoose";

const connectToDataBase = async () => {
    try{
        const conntectDb = await mongoose.connect(process.env.MONGO_URL);
        console.log("Data Base is Connected Successsfully");
    }catch(error){
        console.log("some Error has been Occured", error);
        process.exit(1);
    }
}

export default connectToDataBase;
