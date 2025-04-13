import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";

const URL = import.meta.env.VITE_SERVER_URL; // API base URL

const ShowDetails = () => {
    const { routeId } = useParams(); // Get routeId from URL params
    const [route, setRoute] = useState(null);
    const [stops, setStops] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRouteDetails = async () => {
            try {
                const routeResponse = await axios.get(`${URL}/auth/getRouteById/${routeId}`);
                setRoute(routeResponse.data.route);

                const stopsResponse = await axios.get(`${URL}/auth/getStopsByRoute/${routeId}`);
                setStops(stopsResponse.data.stops);
            } catch (error) {
                console.error("Error fetching route details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRouteDetails();
    }, [routeId]);

    if (loading) return <Typography>Loading...</Typography>;

    if (!route) return <Typography>Route not found.</Typography>;

    return (
        <Box sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ mb: 2 }}>
                Route Details
            </Typography>
            <Typography variant="h6">Route Name: {route.routeName}</Typography>
            <Typography>Source: {route.source}</Typography>
            <Typography>Destination: {route.destination}</Typography>
            <Typography>Total Distance: {route.totalDistance} km</Typography>
            <Typography>Estimated Time: {route.estimatedTime} min</Typography>

            <Typography variant="h5" sx={{ mt: 3 }}>Stops</Typography>
            <List sx={{ border: "1px solid #ccc", borderRadius: 2, p: 2 }}>
                {stops.length === 0 ? (
                    <Typography>No stops added for this route.</Typography>
                ) : (
                    stops.map((stop, index) => (
                        <ListItem key={stop.stopId}>
                            <ListItemText
                                primary={`${index + 1}. ${stop.stopId?.name}`}
                                secondary={`Location: (${stop.stopId?.location.coordinates[1]}, ${stop.stopId?.location.coordinates[0]}) | Landmark: ${stop.stopId?.landmark}`}
                            />
                        </ListItem>
                    ))
                )}     
            </List>
        </Box>
    );
};

export default ShowDetails;
