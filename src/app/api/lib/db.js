import mongoose from 'mongoose';

const connectDB = async () => {
    if (mongoose.connection.readyState >=1) {
        console.log('Already connected to DB');
        return;
        }
    try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to Database');
  } catch (error) {
    console.log('Error connecting to DB:', error);
  }
};

export default connectDB;