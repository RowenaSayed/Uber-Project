/* eslint-disable no-unused-vars */
import L from "leaflet";
import { useState, useRef, useEffect, useContext } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png"; // Path to the marker icon
import markerShadow from "leaflet/dist/images/marker-shadow.png"; // Path to the marker shadow
import { getDistance } from 'geolib'; // Import geolib for distance calculation
import { useLocation } from 'react-router-dom';

// Custom marker icon configuration
const customMarkerIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41], // Size of the icon
  iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
  shadowSize: [41, 41], // Size of the shadow
});

const RideRequestMap = () => {
  const mapRef = useRef(null); // Ref to hold the Leaflet map instance
  const [pickup, setPickup] = useState(""); // State for Pickup Location
  const [dropoff, setDropoff] = useState(""); // State for Dropoff Location
  const [message, setMessage] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [price, setPrice] = useState('');
  const [userMessage, setUserMessage] = useState("");
  const location = useLocation();
  useEffect(() => {
    // Initialize map when component mounts
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([30.0444, 31.2357], 6); // Initial view coordinates (London)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(mapRef.current);
    }
  }, []);

  // Geocode function to fetch lat/lon from OpenStreetMap API
  const geocodeLocation = async (location) => {
    const url = `https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=1`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.length > 0) {
      return {
        lat: data[0].lat,
        lon: data[0].lon,
      };
    } else {
      throw new Error("Location not found");
    }
  };

  const calculateETA = async (pickup, dropoff) => {
    try {
      const geocodeLocation = async (location) => {
        const url = `https://nominatim.openstreetmap.org/search?q=${location}&format=json&limit=1`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.length > 0) {
          return {
            lat: data[0].lat,
            lon: data[0].lon,
          };
        } else {
          throw new Error("Location not found");
        }
      };
      // Get coordinates for pickup and dropoff locations
      const pickupCoords = await geocodeLocation(pickup);
      const dropoffCoords = await geocodeLocation(dropoff);

      // Calculate distance between the two locations (in meters)
      const distance = getDistance(
        { latitude: pickupCoords.lat, longitude: pickupCoords.lon },
        { latitude: dropoffCoords.lat, longitude: dropoffCoords.lon }
      );

      // Assume an average speed of 30 km/h (or adjust as needed)
      const averageSpeed = 30; // in km/h
      const timeInHours = distance / 1000 / averageSpeed; // Convert distance to kilometers and divide by speed
      const timeInMinutes = Math.round(timeInHours * 60); // Convert hours to minutes
      let price = timeInMinutes
      if (location.pathname == "/car/rideRequest") {
        price = Math.round(price * 0.1)
      }
      else if (location.pathname == "/fancycar/rideRequest") {
        price = Math.round(price * 0.2)
      }
      else if (location.pathname == "/moto/rideRequest") {
        price = Math.round(price * 0.05)
      }

      setPrice(`Price = ${price}$`)
      setEstimatedTime(`Estimated time: ${timeInMinutes} minutes`);
    } catch (error) {
      console.error("Error calculating ETA:", error);
      setEstimatedTime('Error calculating time');
    }
  };

  // Function to handle form submission
  const handlePath = async (e) => {
    e.preventDefault();

    try {
      // Geocode both pickup and dropoff locations
      const pickupCoords = await geocodeLocation(pickup);
      const dropoffCoords = await geocodeLocation(dropoff);
      // Call calculateETA function
      await calculateETA(pickup, dropoff);
      setMessage(`Ride requested from ${pickup} to ${dropoff}`);
      setPickup('');
      setDropoff('');

      
      // Clear any existing markers and polylines
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
          mapRef.current.removeLayer(layer);
        }
      });

      // Add pickup and dropoff markers to the map with the custom marker icon
      const pickupMarker = L.marker([pickupCoords.lat, pickupCoords.lon], {
        icon: customMarkerIcon,
      })
        .addTo(mapRef.current)
        .bindPopup("Pickup Location")
        .openPopup();

      const dropoffMarker = L.marker([dropoffCoords.lat, dropoffCoords.lon], {
        icon: customMarkerIcon,
      })
        .addTo(mapRef.current)
        .bindPopup("Dropoff Location")
        .openPopup();

      // Fit the map view to the markers
      const bounds = L.latLngBounds(
        [pickupCoords.lat, pickupCoords.lon],
        [dropoffCoords.lat, dropoffCoords.lon]
      );
      mapRef.current.fitBounds(bounds);

      // Add polyline between pickup and dropoff markers
      const polyline = L.polyline(
        [
          [pickupCoords.lat, pickupCoords.lon],
          [dropoffCoords.lat, dropoffCoords.lon],
        ],
        { color: "blue" }
      ).addTo(mapRef.current);
    } catch (error) {
      console.error("Error fetching location:", error);
      
    }
  };




  return (
    <Container>
      <br />
      <h1  className="styled-header"><center>{location.pathname.split('/')[1]}</center></h1>
      <br />
      <Row>
        <Col>
          <div id="map" style={{ height: "400px", width: "100%" }}></div>
        </Col>
      </Row>
      <Row className="mt-4">
        <Col md={6} className="mx-auto">
        
          <Form>
            <Form.Group className="mb-3" controlId="pickupLocation">
              <Form.Label>Pickup Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter pickup location"
                value={pickup}
                onChange={(e) => setPickup(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="dropoffLocation">
              <Form.Label>Dropoff Location</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter dropoff location"
                value={dropoff}
                onChange={(e) => setDropoff(e.target.value)}
              />
            </Form.Group>
            <center>
              <Button variant="success" block className="me-4" onClick={handlePath}>
                Show Path
              </Button>
              <br /> <br />
        {estimatedTime && <Alert variant="success">{estimatedTime}</Alert>}
        {price && <Alert variant="dark">{price} </Alert>}
        {userMessage && <Alert variant="info">{userMessage}</Alert>}

            </center>
            <br /><br /><br />
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RideRequestMap;
