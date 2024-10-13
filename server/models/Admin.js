import { model, Schema } from 'mongoose';
import School from './School.js';
import User from './User.js';

const refType = Schema.Types.ObjectId;

const AdminSchema = new Schema({});

const Admin = User.discriminator('Admin', AdminSchema);

export default Admin;
