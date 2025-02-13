import { Router } from "express";
const router = Router();
import HistoryService from "../../service/historyService.js";
import WeatherService from "../../service/weatherService.js";
// TODO: POST Request with city name to retrieve weather data
router.post("/", (req, res) => {
    try {
        // TODO: GET weather data from city name
        const cityName = req.body.cityName;
        console.log("Here is my city name", cityName);
        WeatherService.getWeatherForCity(cityName).then((data) => {
            HistoryService.addCity(cityName);
            res.json(data);
        });
    }
    catch (error) {
        res.status(500).json({ message: "Unable to fetch weather data" });
    }
});
// TODO: GET search history
router.get("/history", async (_req, res) => {
    try {
        const history = await HistoryService.getCities();
        res.status(200).json(history);
    }
    catch (error) {
        res.status(500).json({ message: "Unable to fetch city history", error });
    }
});
// * BONUS TODO: DELETE city from search history
router.delete("/history/:id", async (req, res) => {
    try {
        const id = req.params.id;
        await HistoryService.removeCity(id);
        res.status(200).json({ message: `City ID ${id} removed from history` });
    }
    catch (error) {
        res.status(500).json({ message: "Unable to remove city ID", error });
    }
});
export default router;
