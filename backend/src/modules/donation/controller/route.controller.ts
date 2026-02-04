import { Request, Response } from "express";
import axios from "axios";

export const getRoute = async (req: Request, res: Response) => {
  try {
    const { fromLat, fromLng, toLat, toLng } = req.query;

    const url = `https://router.project-osrm.org/route/v1/driving/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=geojson`;

    const response = await axios.get(url);

    const route = response.data.routes[0];

    res.json({
      distance: route.distance / 1000,
      geometry: route.geometry.coordinates,
    });
  } catch (error) {
    res.status(500).json({ message: "Route error" });
  }
};
