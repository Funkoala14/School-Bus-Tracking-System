import mongoose from 'mongoose';
const { MONGO_URI } = process.env.MONGO_URI;

mongoose.set('strictQuery', false);
mongoose
    .connect(MONGO_URI)
    .then(() => console.log('Connected to Database'))
    .catch((err) => console.error('MongoDB connection failed:', err.message));

export default mongoose.connection;
