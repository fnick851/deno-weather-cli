import Ask from "https://deno.land/x/ask@1.0.6/mod.ts";
import apiKey from "./api-key.ts";

const ask = new Ask();

const answers = await ask.prompt([
  {
    name: "zipcode",
    type: "number",
    message: "Zip Code:",
  },
]);

const { zipcode } = answers;

console.info(`Fetching current weather for zip code ${zipcode}...`);

const weatherRequest = fetch(
  `https://api.openweathermap.org/data/2.5/weather?zip=${zipcode}&appid=${apiKey}`
);

const convertToCelcius = (num: number) => Math.round((num - 273.15) * 10) / 10;

weatherRequest
  .then((response) => {
    return response.json();
  })
  .then((jsonData) => {
    if (jsonData.cod !== 200) {
      console.info("(error) " + jsonData.message);
    } else {
      const stats = {
        name: jsonData.name,
        weather: jsonData.weather[0].description,
        temperature: `${convertToCelcius(jsonData.main.temp)} celsius`,
        "feels like": `${convertToCelcius(jsonData.main.feels_like)} celsius`,
        visibility: jsonData.visibility + " meters",
        "wind speed": jsonData.wind.speed + " m/s",
        humidity: jsonData.main.humidity + "%",
      };
      console.table(stats);
    }
  })
  .catch((error) => {
    console.error("API error - ", error.message);
  });
