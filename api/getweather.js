export default async function handler(req, resp) {
  const city = req.query.city;
  const type = req.query.type;

  const apiKey = process.env.WEATHER_API_KEY;

  let apiUrl;
  if (type === "forecast") {
    apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=1&aqi=no&alerts=no`;
  } else {
    apiUrl = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;
  }

  try {
    const apidata = await fetch(apiUrl);
    if (!apidata.ok) {
      return resp.status(apidata.status).json({ error: "City not found" });
    }
    const data = await apidata.json();
    return resp.status(200).json(data);
  } catch (error) {
    return resp.status(500).json({ error: "Failed to fetch weather data." });
  }
}
