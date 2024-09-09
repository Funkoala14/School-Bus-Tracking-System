const faker = require('faker');
const mongoose = require('mongoose');
const Parent = require('../models/parent');
const Student = require('../models/student');
// const Bus = require('../models/bus');
// const Route = require('../models/route');
// const Location = require('../models/location');

const uri = process.env.MONGO_URI; // 根据实际情况修改
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
    console.log('Connected to MongoDB');

    // 生成 Mock 数据
    const generateMockData = () => {
        const mockParents = Array.from({ length: 10 }, () => ({
            parent_id: faker.datatype.uuid(),
            name: faker.name.findName(),
            phone_number: faker.phone.phoneNumber(),
            address: faker.address.streetAddress(),
            email: faker.internet.email(),
            children,
        }));

        const mockStudents = Array.from({ length: 10 }, () => ({
            student_id: faker.datatype.uuid(),
            name: faker.name.findName(),
            parent: faker.datatype.uuid(), // 假设你有父母的 ID
            route: faker.datatype.uuid(), // 假设你有路线的 ID
        }));

        // const mockBuses = Array.from({ length: 5 }, () => ({
        //     bus_id: faker.datatype.uuid(),
        //     route: faker.datatype.uuid(), // 假设你有路线的 ID
        //     capacity: faker.datatype.number({ min: 20, max: 50 }),
        // }));

        // const mockRoutes = Array.from({ length: 5 }, () => ({
        //     route_id: faker.datatype.uuid(),
        //     start_location: faker.address.city(),
        //     end_location: faker.address.city(),
        //     schedule: Array.from({ length: 7 }, () => ({
        //         day: faker.date.weekday(),
        //         time: faker.date.recent().toTimeString().slice(0, 5),
        //     })),
        // }));

        // const mockLocations = Array.from({ length: 5 }, () => ({
        //     location_id: faker.datatype.uuid(),
        //     address: faker.address.streetAddress(),
        //     type: faker.random.arrayElement(['home', 'school']),
        // }));

        return { mockParents, mockStudents, mockBuses, mockRoutes, mockLocations };
    };

    // 插入 Mock 数据
    const seedDatabase = async () => {
        try {
            const { mockParents, mockStudents, mockBuses, mockRoutes, mockLocations } = generateMockData();

            await Parent.insertMany(mockParents);
            await Student.insertMany(mockStudents);
            await Bus.insertMany(mockBuses);
            await Route.insertMany(mockRoutes);
            await Location.insertMany(mockLocations);

            console.log('Mock data inserted successfully');
        } catch (err) {
            console.error('Error inserting mock data:', err);
        } finally {
            mongoose.connection.close();
        }
    };

    seedDatabase();
});
