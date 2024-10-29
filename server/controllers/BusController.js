import Bus from "../models/Bus.js";
import Driver from "../models/Driver.js";
import School from "../models/School.js";

export const postAddBus = async (req, res) => {
    const { schoolCode } = req.user;
    try {
        const { plate } = req.body;

        const existingBus = await Bus.findOne({ plate });
        if (existingBus) {
            return res.status(400).json({ message: 'Bus plate is already exist.' });
        }

        const newBus = await new Bus({ ...req.body });
        const school = await School.findOne({ code: schoolCode }).lean().exec();
        newBus.school = school._id;

        await School.findOneAndUpdate(
            { code: schoolCode },
            { $addToSet: { buses: newBus._id } }, // Use $addToSet to avoid duplicates
            { new: true, lean: true } // Return the updated document
        );
        await newBus.save();

        const buses = await Bus.find({ school: school._id }).select('-__v').lean().exec();

        const paginatedBuses = buses.slice(0, 10);

        return res.status(200).json({
            message: 'Bus added successfully',
            code: 200,
            data: {
                buses: paginatedBuses,
                totalBuses: buses.length,
                currentPage: 1,
                totalPages: Math.ceil(buses.length / 10),
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};

export const deleteBus = async (req, res) => {
    const { schoolCode } = req.user;
    try {
        const { plate } = req.body;
        const deletedBus = await Bus.findOneAndDelete({ plate }).lean().exec();
        if (!deletedBus) {
            return res.status(404).json({ message: 'Bus not found', code: 404 });
        }
        const school = await School.findOne({ code: schoolCode }).lean().exec();
        const buses = await Bus.find({ school: school._id }).select('-__v').lean().exec();
        const paginatedBuses = buses.slice(0, 10);
        return res.status(200).json({
            message: 'Bus deleted successfully',
            code: 200,
            data: {
                buses: paginatedBuses,
                totalBuses: buses.length,
                currentPage: 1,
                totalPages: Math.ceil(buses.length / 10),
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};

export const postAssignBusDriver = async (req, res) => {
    try {
        const { plate, driverLicense } = req.body;
        const driver = await Driver.findOne({ license: driverLicense }).exec();
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found', code: 404 });
        }
        const bus = await Bus.findOne({ plate }).exec();
        if (!bus) {
            return res.status(404).json({ message: 'Bus not found', code: 404 });
        }
        bus.assignedDriver = driver._id;
        driver.assignedBus = bus._id;
        console.log(bus, driver);
        
        await bus.save();
        await driver.save();

        return res.status(200).json({ message: 'Bus assigned successfully', code: 200 });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};
