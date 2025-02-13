import { writeFile, readFile } from "node:fs/promises";
import { v4 as uuidv4 } from "uuid";
import path from "node:path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const searchHistoryPath = path.join(__dirname, "../../db/searchHistory.json");
// TODO: Define a City class with name and id properties
class City {
    constructor(name) {
        this.name = name;
        this.id = uuidv4();
    }
}
// TODO: Complete the HistoryService class
class HistoryService {
    // TODO: Define a read method that reads from the searchHistory.json file
    async read() {
        try {
            return await readFile(searchHistoryPath, {
                flag: "a+",
                encoding: "utf8",
            });
        }
        catch (error) {
            console.log("Error reading search history file");
            console.error(error);
            return "[]"; // Return an empty array string in case of error
        }
    }
    // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
    async write(cities) {
        return await writeFile(searchHistoryPath, JSON.stringify(cities, null, "\t"));
    }
    // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
    async getCities() {
        const cities = await this.read();
        let parsedCities;
        try {
            parsedCities = [].concat(JSON.parse(cities || "[]"));
        }
        catch (error) {
            parsedCities = [];
            console.log("Error parsing cities");
            console.error(error);
        }
        return parsedCities;
    }
    // TODO Define an addCity method that adds a city to the searchHistory.json file
    async addCity(cityName) {
        if (!cityName) {
            throw new Error("City name is required");
        }
        const newCity = new City(cityName);
        const cities = await this.getCities();
        const updatedCities = [...cities, newCity];
        await this.write(updatedCities);
        return newCity;
    }
    // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
    async removeCity(id) {
        const cities = await this.getCities();
        const updatedCities = cities.filter((city) => city.id !== id);
        await this.write(updatedCities);
    }
}
export default new HistoryService();
