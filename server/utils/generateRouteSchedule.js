import axios from 'axios';
import Schedule from '../models/Schedule.js';
import config from '../config/config.js';
import { format } from 'date-fns';
import Route from '../models/Route.js';

const DIRECTIONS_API_URL = 'https://maps.googleapis.com/maps/api/directions/json';
const ROUTES_API_URL = 'https://routes.googleapis.com/directions/v2:computeRoutes';

const today = new Date();

function getNextDayTime(hour, minute) {
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + 1); // Move to the next day
    nextDay.setHours(hour, minute, 0, 0); // Set the specific time (hour:minute)
    return nextDay;
}

const SCHOOL_START_TIME = getNextDayTime(8, 30);
const SCHOOL_END_TIME = getNextDayTime(15, 30);

// export const createRouteSchedule = async (routeId, stops, direction) => {
//     try {
//         if (stops.length < 2) {
//             throw new Error('A route must have at least a start and end stop.');
//         }

//         // Define the travel time window
//         const isInbound = direction === 'inbound';
//         const baseTime = isInbound
//             ? new Date(SCHOOL_START_TIME.getTime() - 30 * 60 * 1000) // 30 minutes before school starts
//             : new Date(SCHOOL_END_TIME.getTime() + 30 * 60 * 1000); // 30 minutes after school ends
//         const baseTimeInSeconds = Math.floor(baseTime.getTime() / 1000);

//         // Prepare waypoints (all stops except start and end)
//         const waypoints =
//             stops.slice(1, -1)?.map((stop) => ({
//                 location: {
//                     latLng: {
//                         latitude: stop.address.coordinates.lat,
//                         longitude: stop.address.coordinates.lng,
//                     },
//                 },
//             })) || [];

//         // Build the request payload
//         const payload = {
//             origin: {
//                 location: {
//                     latLng: {
//                         latitude: stops[0].address.coordinates.lat,
//                         longitude: stops[0].address.coordinates.lng,
//                     },
//                 },
//             },
//             destination: {
//                 location: {
//                     latLng: {
//                         latitude: stops[stops.length - 1].address.coordinates.lat,
//                         longitude: stops[stops.length - 1].address.coordinates.lng,
//                     },
//                 },
//             },
//             travelMode: 'DRIVE',
//             routingPreference: 'TRAFFIC_AWARE',
//             computeAlternativeRoutes: false,
//             departureTime: baseTimeInSeconds,
//             intermediates: waypoints,
//             languageCode: 'en-US',
//             units: 'IMPERIAL',
//         };

//         // Define the field mask
//         const fieldMask =
//             'routes.duration,routes.distanceMeters,routes.legs.startLocation,routes.legs.endLocation,routes.legs.duration,routes.legs.distanceMeters,routes.legs.steps';

//         // Make the API request
//         const response = await axios.post(ROUTES_API_URL, payload, {
//             headers: {
//                 'Content-Type': 'application/json',
//                 'X-Goog-Api-Key': config.GOOGLE_MAPS_API_KEY,
//                 'X-Goog-FieldMask': fieldMask,
//             },
//         });

//         if (response.status !== 200) {
//             throw new Error('Error fetching route data from Google Routes API.');
//         }

//         const routeData = response.data.routes[0];
//         const legs = routeData.legs;

//         if (!legs || legs.length === 0) {
//             throw new Error('No legs data found in the response.');
//         }

//         // Generate the schedule
//         const legTimes = [];
//         let currentTime = new Date(baseTime);

//         if (isInbound) {
//             // Inbound: Last stop is school
//             legTimes.push({
//                 stop: stops[stops.length - 1]._id,
//                 arrivalTime: format(currentTime, 'hh:mm a'),
//             });

//             // Process legs in reverse order
//             for (let i = legs.length - 1; i >= 0; i--) {
//                 const leg = legs[i];
//                 currentTime = new Date(currentTime.getTime() - leg.duration.seconds * 1000);

//                 legTimes.unshift({
//                     stop: stops[i]._id,
//                     arrivalTime: format(currentTime, 'hh:mm a'),
//                 });

//                 // Account for stop duration
//                 currentTime = new Date(currentTime.getTime() - 5 * 60 * 1000); // 5 minutes stop duration
//             }
//         } else {
//             // Outbound: First stop is school
//             legTimes.push({
//                 stop: stops[0]._id,
//                 arrivalTime: format(currentTime, 'hh:mm a'),
//             });

//             // Process legs in order
//             for (let i = 0; i < legs.length; i++) {
//                 const leg = legs[i];
//                 currentTime = new Date(currentTime.getTime() + leg.duration.seconds * 1000);

//                 legTimes.push({
//                     stop: stops[i + 1]._id,
//                     arrivalTime: format(currentTime, 'hh:mm a'),
//                 });

//                 // Account for stop duration
//                 currentTime = new Date(currentTime.getTime() + 5 * 60 * 1000); // 5 minutes stop duration
//             }
//         }

//         // Save the schedule in the database
//         const newSchedule = await Schedule.create({
//             route: routeId,
//             stopTimes: legTimes,
//             startTime: isInbound ? legTimes[0].arrivalTime : legTimes[legTimes.length - 1].arrivalTime,
//         });

//         // Update the route with the schedule
//         const route = await Route.findById(routeId);
//         if (route.schedule) {
//             await Schedule.findByIdAndDelete(route.schedule);
//         }
//         await Route.findByIdAndUpdate(routeId, { schedule: newSchedule._id });

//         return newSchedule;
//     } catch (error) {
//         console.error('Error creating route schedule:', error.message);
//         throw new Error(error.message);
//     }
// };

export const updateLiveRoute = async (driverLocation, remainingStops, socket) => {
    try {
        if (remainingStops.length < 2) {
            throw new Error('There must be at least two remaining stops (current and next).');
        }

        // Prepare waypoints (remaining stops except the last one)
        const waypoints = remainingStops.slice(1, -1).map((stop) => ({
            location: {
                latLng: {
                    latitude: stop.address.coordinates.lat,
                    longitude: stop.address.coordinates.lng,
                },
            },
        }));

        // Build the request payload
        const payload = {
            origin: {
                location: {
                    latLng: {
                        latitude: driverLocation.lat,
                        longitude: driverLocation.lng,
                    },
                },
            },
            destination: {
                location: {
                    latLng: {
                        latitude: remainingStops[remainingStops.length - 1].address.coordinates.lat,
                        longitude: remainingStops[remainingStops.length - 1].address.coordinates.lng,
                    },
                },
            },
            travelMode: 'DRIVE',
            routingPreference: 'TRAFFIC_AWARE',
            computeAlternativeRoutes: false,
            intermediates: waypoints,
            languageCode: 'en-US',
            units: 'IMPERIAL',
        };

        // Define the field mask to reduce response size
        const fieldMask =
            'routes.duration,routes.legs.duration,routes.legs.distanceMeters,routes.legs.startLocation,routes.legs.endLocation';

        // Make the API request
        const response = await axios.post(ROUTES_API_URL, payload, {
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': config.GOOGLE_MAPS_API_KEY,
                'X-Goog-FieldMask': fieldMask,
            },
        });

        if (response.status !== 200) {
            throw new Error('Failed to fetch live route data from Google Routes API.');
        }

        const routeData = response.data.routes[0];
        const legs = routeData.legs;

        if (!legs || legs.length === 0) {
            throw new Error('No leg data returned from Google Routes API.');
        }

        // Calculate updated arrival times
        const legTimes = [];
        let currentTime = new Date(); // Use the current time as the starting point

        for (let i = 0; i < legs.length; i++) {
            const legDuration = legs[i].duration.seconds * 1000; // Duration in milliseconds

            // Calculate arrival time for this stop
            currentTime = new Date(currentTime.getTime() + legDuration);
            legTimes.push({
                stop: remainingStops[i]._id,
                arrivalTime: format(currentTime, 'hh:mm a'), // Format time as needed
            });

            // Add a fixed stop duration (optional, e.g., 5 minutes)
            currentTime = new Date(currentTime.getTime() + 5 * 60 * 1000);
        }

        // Broadcast updated data through WebSocket
        const updateData = {
            routeId: remainingStops[0].route, // Assuming all stops share the same route ID
            updatedStopTimes: legTimes,
        };

        socket.emit('routeUpdate', updateData);

        return updateData; // Optional: Return the data for additional processing
    } catch (error) {
        console.error('Error updating live route:', error.message);
        throw new Error(error.message);
    }
};

// Helper function to calculate distance between two lat-lng points
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

// Function to get the remaining stops based on current location
export const getRemainingStops = async (driverLocation, allStops) => {
  const remainingStops = [];
  
  let currentStopIndex = null;

  // Loop through all stops and check the distance to find the current stop
  for (let i = 0; i < allStops.length; i++) {
    const stop = allStops[i];
    const distance = getDistance(
      driverLocation.lat,
      driverLocation.lng,
      stop.address.coordinates.lat,
      stop.address.coordinates.lng
    );

    // You can define a threshold distance to determine if the driver has passed a stop
    if (distance < 0.5) { // 0.5 km threshold, adjust as needed
      currentStopIndex = i;
      break;
    }
  }

  // If a current stop is found, add the remaining stops
  if (currentStopIndex !== null) {
    remainingStops.push(...allStops.slice(currentStopIndex + 1)); // Get stops after the current one
  }

  return remainingStops;
};


export const createRouteSchedule = async (routeId, stops, direction) => {
    try {
        // Define waypoints (all stops except the start and end)
        const waypoints = stops
            .slice(1, stops.length - 1)
            .map((stop) => `${stop.address.coordinates.lat},${stop.address.coordinates.lng}`);

        // Determine the base time based on direction
        const isInbound = direction === 'inbound';
        const time = isInbound
            ? new Date(SCHOOL_START_TIME.getTime() - 60 * 60 * 1000) // 30 minutes before school start
            : new Date(SCHOOL_END_TIME.getTime() + 30 * 60 * 1000); // 30 minutes after school end
        const timeInSeconds = Math.floor(time.getTime() / 1000);

        // Set up API request parameters
        const params = {
            origin: `${stops[0].address.coordinates.lat},${stops[0].address.coordinates.lng}`,
            destination: `${stops[stops.length - 1].address.coordinates.lat},${stops[stops.length - 1].address.coordinates.lng}`,
            waypoints: waypoints.join('|'),
            traffic_model: 'best_guess',
            departure_time: timeInSeconds,
            key: config.GOOGLE_MAPS_API_KEY,
        };

        console.log(params);

        // Fetch schedule from Google Directions API
        const response = await axios.get(DIRECTIONS_API_URL, { params });

        if (response.statusText !== 'OK') throw new Error('Error fetching directions.');

        // Check for an empty routes array
        if (!response.data.routes || response.data.routes.length === 0) {
            throw new Error('No routes found for the given parameters.');
        }

        const legs = response.data.routes[0].legs;
        const legTimes = [];
        let currentArrivalTime;
        // Handle outbound and inbound directions separately
        if (!isInbound) {
            // Outbound case

            currentArrivalTime = new Date(time.getTime()); // Start with the base time

            // start stop is school
            legTimes.push({
                stop: stops[0]._id,
                arrivalTime: format(currentArrivalTime, 'hh:mm a'),
            });

            for (let i = 0; i < legs.length; i++) {
                const legDuration = legs[i].duration.value * 1000; // Duration in milliseconds
                const stopDuration = 300 * 1000; // Assuming a 5-minute stop (300 seconds) at each stop

                // Calculate arrival time for this stop
                currentArrivalTime = new Date(currentArrivalTime.getTime() + legDuration);
                const formattedTime = format(currentArrivalTime, 'hh:mm a');

                legTimes.push({
                    stop: stops[i + 1]._id,
                    arrivalTime: formattedTime, // Store as string in desired format
                });

                // Add stop duration for next leg calculation
                currentArrivalTime = new Date(currentArrivalTime.getTime() + stopDuration);
            }
        } else {
            // Inbound case
            // Set the initial arrival time to be 15 minutes before school starts
            currentArrivalTime = new Date(SCHOOL_START_TIME.getTime() - 15 * 60 * 1000); // 15 minutes before school start

            // last stop is school
            legTimes.push({
                stop: stops[stops.length - 1]._id,
                arrivalTime: format(currentArrivalTime, 'hh:mm a'),
            });

            for (let i = legs.length - 1; i >= 0; i--) {
                const legDuration = legs[i].duration.value * 1000; // Duration in milliseconds
                const stopDuration = 300 * 1000; // Assuming a 5-minute stop (300 seconds) at each stop

                // Calculate the arrival time for this stop
                currentArrivalTime = new Date(currentArrivalTime.getTime() - legDuration);

                const formattedTime = format(currentArrivalTime, 'hh:mm a');

                legTimes.unshift({
                    stop: stops[i]._id,
                    arrivalTime: formattedTime, // Store as string in desired format
                });

                // Add stop duration for next leg calculation (going backwards)
                currentArrivalTime = new Date(currentArrivalTime.getTime() - stopDuration);
            }

            // Ensure the first stop's arrival time is indeed 15 minutes before the school start time
            if (new Date(legTimes[0].arrivalTime) > SCHOOL_START_TIME) {
                throw new Error('Calculated arrival time exceeds the allowed schedule before school starts.');
            }
        }

        // Save the schedule to the database
        const newSchedule = await Schedule.create({
            route: routeId,
            stopTimes: legTimes,
            startTime: isInbound ? legTimes[0].arrivalTime : '16:00 PM',
        });
        const route = await Route.findById(routeId);
        if (route.schedule) await Schedule.findByIdAndDelete(route.schedule);
        await Route.findByIdAndUpdate(routeId, { $set: { schedule: newSchedule._id } });
        return newSchedule;
    } catch (error) {
        console.error('Error creating route schedule:', error);
        throw new Error(error.message);
    }
};
