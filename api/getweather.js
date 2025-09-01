export default async function handler(req, resp) {
  const city = req.query.city;
  const type = req.query.type || "current";

  const apiKey = process.env.WEATHER_API_KEY;

  if (!apiKey) {
    console.error("Missing WEATHER_API_KEY environment variable");
    return resp.status(500).json({ error: "Server configuration error: missing API key" });
  }

  const q = encodeURIComponent(city || "");
  let apiUrl;
  if (type === "forecast") {
    apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${q}&days=1&aqi=no&alerts=no`;
  } else {
    apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${q}&aqi=no`;
  }

  try {
    console.log(`Calling weather API for city='${city}' type='${type}' url='${apiUrl}'`);
    const apidata = await fetch(apiUrl);
    const text = await apidata.text(); 
    if (!apidata.ok) {
      console.error("Weather API returned error", apidata.status, text);
      try {
        const parsed = JSON.parse(text);
        return resp.status(apidata.status).json(parsed);
      } catch (e) {
        return resp.status(apidata.status).json({ error: "City not found" });
      }
    }
    const data = JSON.parse(text);
    return resp.status(200).json(data);
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
    return resp.status(500).json({ error: "Failed to fetch weather data." });
  }
}