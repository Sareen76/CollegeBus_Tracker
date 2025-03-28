import React, { useState } from "react";
import {
    Box, TextField, Typography, Button, IconButton, MenuItem, Select, InputAdornment
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const URL = import.meta.env.VITE_SERVER_URL;

const AddNewRoute = () => {
    const [status, setStatus] = useState(false);
    const [routeId, setRouteId] = useState(null); // Store route ID
    const [routeData, setRouteData] = useState({
        routeName: "",
        source: "",
        destination: "",
        totalDistance: "",
        distanceUnit: "km", // New field for unit
        estimatedTime: "",
        timeUnit: "hours", // New field for unit
    });

    const navigate = useNavigate();
    const [stops, setStops] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRouteData((prev) => ({ ...prev, [name]: value }));
    };

    const addRoute = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${URL}/admin/addRoute`, routeData);
            if (response.data && response.data.route._id) {
                setRouteId(response.data.route._id);
                setStatus(true);
                alert("Route added successfully!");
            } else {
                alert("Route added, but failed to get route ID!");
            }
        } catch (error) {
            alert("Failed to add route!");
        }
    };

    const addStopAtIndex = (index) => {
        const newStop = { stopName: "", latitude: "", longitude: "", landmark: "" };
        const updatedStops = [...stops];
        updatedStops.splice(index, 0, newStop);
        setStops(updatedStops);
    };

    const handleStopChange = (index, e) => {
        const { name, value } = e.target;
        const newStops = [...stops];
        newStops[index][name] = value;
        setStops(newStops);
    };

    const removeStop = (index) => {
        setStops(stops.filter((_, i) => i !== index));
    };

    const uploadStops = async () => {
        if (!routeId) {
            alert("Route ID is missing. Please add a route first.");
            return;
        }

        try {
            await axios.post(`${URL}/admin/uploadStops`, { routeId, stops });
            alert("Stops uploaded successfully!");
            setStops([]);
            navigate(`/showDetails/${routeId}`);
        } catch (error) {
            alert("Failed to upload stops!");
        }
    };

    return (
        <Box component="form" sx={{ width: "100%" }} noValidate autoComplete="off" onSubmit={addRoute}>
            <Typography variant="h5" sx={{ mb: 2 }}>Add New Route</Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <TextField label="Route Name" name="routeName" value={routeData.routeName} onChange={handleChange} variant="outlined" required />
                <TextField label="Source" name="source" value={routeData.source} onChange={handleChange} variant="outlined" required />
                <TextField label="Destination" name="destination" value={routeData.destination} onChange={handleChange} variant="outlined" required />

                {/* Total Distance with Unit */}
                <Box sx={{ display: "flex", gap: 1, alignItems: "center", width: "100%" }}>
                    <TextField
                        label="Total Distance"
                        name="totalDistance"
                        type="number"
                        value={routeData.totalDistance}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{ flex: 1 }}
                        required
                        InputProps={{
                            endAdornment: <InputAdornment position="end">{routeData.distanceUnit}</InputAdornment>,
                        }}
                    />
                    <Select name="distanceUnit" value={routeData.distanceUnit} onChange={handleChange} sx={{ width: "100px" }}>
                        <MenuItem value="km">km</MenuItem>
                        <MenuItem value="m">m</MenuItem>
                    </Select>
                </Box>

                {/* Estimated Time with Unit */}
                <Box sx={{ display: "flex", gap: 1, alignItems: "center", width: "100%" }}>
                    <TextField
                        label="Estimated Time"
                        name="estimatedTime"
                        type="number"
                        value={routeData.estimatedTime}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{ flex: 1 }}
                        required
                        InputProps={{
                            endAdornment: <InputAdornment position="end">{routeData.timeUnit}</InputAdornment>,
                        }}
                    />
                    <Select name="timeUnit" value={routeData.timeUnit} onChange={handleChange} sx={{ width: "100px" }}>
                        <MenuItem value="hours">hours</MenuItem>
                        <MenuItem value="minutes">minutes</MenuItem>
                        <MenuItem value="seconds">seconds</MenuItem>
                    </Select>
                </Box>
            </Box>

            <Box sx={{ mt: 4 }}>
                <Button variant="contained" type="submit" disabled={status}>Add Route</Button>
            </Box>

            {status && (
                <Box sx={{ mt: 4, p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Add Stops</Typography>
                    <Box sx={{ maxHeight: "300px", overflowY: "auto", p: 1, border: "1px solid #ddd", borderRadius: 1 }}>
                        {stops.map((stop, index) => (
                            <Box key={index} sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
                                <IconButton onClick={() => addStopAtIndex(index)} color="primary">
                                    <AddIcon />
                                </IconButton>
                                <TextField label="Stop Name" name="stopName" value={stop.stopName} onChange={(e) => handleStopChange(index, e)} variant="outlined" required />
                                <TextField label="Latitude" name="latitude" value={stop.latitude} onChange={(e) => handleStopChange(index, e)} variant="outlined" required />
                                <TextField label="Longitude" name="longitude" value={stop.longitude} onChange={(e) => handleStopChange(index, e)} variant="outlined" required />
                                <TextField label="Landmark" name="landmark" value={stop.landmark} onChange={(e) => handleStopChange(index, e)} variant="outlined" />
                                <IconButton onClick={() => removeStop(index)} color="error"><DeleteIcon /></IconButton>
                            </Box>
                        ))}
                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Button variant="contained" onClick={() => addStopAtIndex(stops.length)}>Add Stop</Button>
                        <Button variant="contained" color="success" sx={{ ml: 2 }} onClick={uploadStops} disabled={stops.length === 0}>
                            Upload Stops
                        </Button>
                    </Box>
                </Box>
            )}
        </Box>
    );
};

export default AddNewRoute;
