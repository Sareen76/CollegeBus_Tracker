import Bus from "../models/busSchema.js";
import Route from "../models/routesSchema.js"; // Import the Route model
import Stop from "../models/stopsSchema.js";
const addNewBus = async (request, response, next) => {
    try{
        const {busNumber, driverId, capacity, routeId} = request.body();

        const bus = await Bus.findOne({busNumber});

        if(bus.busNumber){
            return response.status(400).json({message: "Bus Number already exists"});
        }

        const addBus = await Bus.create({busNumber, driverId, capacity, routeId});
        if(addBus){
            
        }
    }catch(error){
        console.log(error);
    }
}


// ✅ ADD A NEW ROUTE
export const addRoute = async (req, res) => {
    try {
        const { routeName, source, destination, totalDistance, estimatedTime } = req.body;

        // Create a new Route with an empty stops array
        const newRoute = new Route({
            routeName,
            source,
            destination,
            stops: [], // Initially empty
            totalDistance,
            estimatedTime,
        });

        await newRoute.save();

        return res.status(201).json({ message: "Route added successfully!", route: newRoute });
    } catch (error) {
        console.error("Error adding route:", error);
        return res.status(500).json({ error: "Failed to add route" });
    }
};

// ✅ ADD A NEW STOP TO A SPECIFIC ROUTE
export const uploadStops = async (req, res) => {
    try {
        const { routeId, stops } = req.body; // Expect stops as an array

        // ✅ Validate if stops is an array and contains valid data
        if (!Array.isArray(stops) || stops.length === 0) {
            return res.status(400).json({ error: "Invalid stops data. Must be a non-empty array." });
        }

        // ✅ Find the route by ID
        const route = await Route.findById(routeId);
        if (!route) {
            return res.status(404).json({ error: "Route not found" });
        }

        // ✅ Transform stops to match the schema
        const formattedStops = stops.map((stop) => ({
            name: stop.stopName, // Convert `stopName` to `name`
            location: {
                type: "Point",
                coordinates: [parseFloat(stop.longitude), parseFloat(stop.latitude)], // Ensure correct order
            },
            landmark: stop.landmark || "",
        }));

        // ✅ Insert new stops into the database
        const newStops = await Stop.insertMany(formattedStops);

        // ✅ Map new stops with their sequence order
        const stopEntries = newStops.map((stop, index) => ({
            stopId: stop._id,
            order: index + 1, // Assigning order automatically based on array index
        }));

        // ✅ Push stops with order into the route
        route.stops.push(...stopEntries);
        await route.save();

        return res.status(201).json({ message: "Stops added successfully!", stops: stopEntries });
    } catch (error) {
        console.error("Error adding stops:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
