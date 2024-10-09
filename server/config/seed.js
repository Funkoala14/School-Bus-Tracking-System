import connection from './connection.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as argon2 from 'argon2';
import Address from '../models/Address.js';
import School from '../models/School.js';
import Admin from '../models/Admin.js';
import Driver from '../models/Driver.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const password = await argon2.hash('password123');

const seedSchoolsAndAddress = async () => {
    const filePath = path.join(__dirname, 'dummyData.json');
    fs.readFile(filePath, 'utf8', async (err, data) => {
        if (err) {
            console.error('Error reading the JSON file:', err);
            return;
        }
        const jsonData = await JSON.parse(data);
        console.log(jsonData);

        try {
            await Address.deleteMany();
            await School.deleteMany();
            await Admin.deleteMany();
            await Driver.deleteMany();

            const addresses = await Address.insertMany(jsonData.addresses);
            // console.log('Addresses inserted:', addresses);
            console.log('Addresses inserted');

            const schoolsWithAddressIds = jsonData.schools.map((school, i) => ({
                ...school,
                address: addresses[i]._id,
            }));

            const schools = await School.insertMany(schoolsWithAddressIds);
            // console.log('Schools inserted:', schools);
            console.log('Schools inserted');

            const AdminsWithSchoolIds = jsonData.admins.map((admin, i) => ({
                ...admin,
                password: password,
                school: schools[i]._id,
            }));
            const admins = await Admin.insertMany(AdminsWithSchoolIds, { ordered: true, rawResult: false });
            // console.log('Admins inserted:', admins);
            console.log('Admins inserted');

            const DriversWithSchoolIds = jsonData.drivers.map((driver, i) => ({
                ...driver,
                password: password,
                school: schools[i]._id,
            }));
            const drivers = await Driver.insertMany(DriversWithSchoolIds, { ordered: true, rawResult: false });
            // console.log('Drivers inserted:', drivers);
            console.log('Drivers inserted');
        } catch (error) {
            console.error('Error inserting data:', error);
        }
    });
};

// Run the connection and then import products
const run = async () => {
    try {
        await connection;
        console.log('MongoDB connected successfully');
        await seedSchoolsAndAddress();
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

run();
