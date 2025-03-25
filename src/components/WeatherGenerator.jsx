import { useState } from "react";
import "./WeatherGenerator.css";

const SEASONS = ["Winter", "Spring", "Summer", "Fall"];

const WeatherGenerator = () => {
  const [selectedSeason, setSelectedSeason] = useState(null);
  const [weather, setWeather] = useState(null);

  const generateWeather = (season) => {
    // Temperature ranges for New England (in Fahrenheit)
    const tempRanges = {
      Winter: { min: 15, max: 35 },
      Spring: { min: 40, max: 65 },
      Summer: { min: 65, max: 90 },
      Fall: { min: 40, max: 70 },
    };

    // Generate random temperature within season range
    const temp = Math.floor(
      Math.random() * (tempRanges[season].max - tempRanges[season].min + 1) +
        tempRanges[season].min
    );

    // Generate wind speed (in mph)
    const windSpeed = Math.floor(Math.random() * 30); // 0-30 mph
    const windStrength =
      windSpeed < 5
        ? "calm"
        : windSpeed < 10
        ? "light breeze"
        : windSpeed < 20
        ? "moderate wind"
        : windSpeed < 30
        ? "strong wind"
        : "gale force";

    // Calculate wind chill for winter
    let windChill = null;
    if (season === "Winter" && windSpeed > 5) {
      // Simplified wind chill formula
      windChill = Math.round(
        35.74 +
          0.6215 * temp -
          35.75 * Math.pow(windSpeed, 0.16) +
          0.4275 * temp * Math.pow(windSpeed, 0.16)
      );
    }

    // Calculate heat index for summer
    let heatIndex = null;
    if (season === "Summer" && temp > 80) {
      // Simplified heat index formula
      heatIndex = Math.round(temp + 0.5 * (temp - 80));
    }

    // Generate precipitation chance (0-100%)
    const precipChance = Math.floor(Math.random() * 100);
    const hasPrecip = precipChance > 70; // 30% chance of precipitation

    // Determine precipitation type based on season and temperature
    let precipType = "none";
    let precipAmount = 0;
    if (hasPrecip) {
      if (season === "Winter" && temp <= 32) {
        precipType = "snow";
        // New England snowstorms typically range from 1-12 inches
        precipAmount = Math.floor(Math.random() * 12) + 1;
      } else if (season === "Winter" && temp > 32) {
        precipType = "sleet";
        // Sleet accumulation typically 0.1-0.5 inches
        precipAmount = (Math.random() * 0.4 + 0.1).toFixed(1);
      } else {
        precipType = "rain";
        // New England rain typically 0.1-2 inches
        precipAmount = (Math.random() * 1.9 + 0.1).toFixed(1);
      }
    }

    // Cloud coverage (correlated with precipitation)
    const cloudCoverage = hasPrecip
      ? Math.floor(Math.random() * 30) + 70 // 70-100% if precipitating
      : Math.floor(Math.random() * 100); // 0-100% if not precipitating

    // Road conditions
    let roadConditions = "clear";
    let whiteout = false;

    if (hasPrecip) {
      if (precipType === "snow") {
        roadConditions = "snow-covered";
        // 5% chance of whiteout conditions during snow
        whiteout = Math.random() * 100 < 5;
      } else if (precipType === "sleet") {
        roadConditions = "icy";
      } else {
        roadConditions = "wet";
      }
    }

    // Fog conditions (more likely in spring and fall, especially with precipitation)
    const fogChance =
      (season === "Spring" || season === "Fall") && hasPrecip ? 70 : 30;
    const hasFog = Math.random() * 100 < fogChance;

    // Thunderstorm chance (higher in summer)
    const thunderstormChance = season === "Summer" ? 20 : 5;
    const hasThunderstorm =
      hasPrecip && Math.random() * 100 < thunderstormChance;

    // Visibility range (affected by precipitation, fog, and time of day)
    let visibility = "clear";
    if (hasThunderstorm) {
      visibility = "very poor (100-500 feet)";
    } else if (whiteout) {
      visibility = "zero (whiteout conditions)";
    } else if (hasFog) {
      visibility = "poor (500-1000 feet)";
    } else if (hasPrecip) {
      visibility = "reduced (1000-3000 feet)";
    }

    setWeather({
      temperature: temp,
      wind: {
        speed: windSpeed,
        strength: windStrength,
      },
      windChill,
      heatIndex,
      precipitation: {
        chance: precipChance,
        type: precipType,
        amount: precipAmount,
      },
      cloudCoverage,
      roadConditions,
      fog: hasFog,
      whiteout,
      thunderstorm: hasThunderstorm,
      visibility,
    });
  };

  const handleSeasonSelect = (season) => {
    setSelectedSeason(season);
    generateWeather(season);
  };

  return (
    <div className="weather-generator">
      <h1>DND Weather Generator</h1>

      <div className="season-selector">
        <h2>Select a Season:</h2>
        <div className="season-buttons">
          {SEASONS.map((season) => (
            <button
              key={season}
              onClick={() => handleSeasonSelect(season)}
              className={selectedSeason === season ? "selected" : ""}
            >
              {season}
            </button>
          ))}
        </div>
      </div>

      {weather && (
        <div className="weather-display">
          <h2>Current Weather Conditions:</h2>
          <div className="weather-details">
            <p>
              <strong>Temperature:</strong> {weather.temperature}°F
              {weather.windChill && (
                <span> (Feels like {weather.windChill}°F with wind chill)</span>
              )}
              {weather.heatIndex && (
                <span> (Feels like {weather.heatIndex}°F with heat index)</span>
              )}
            </p>
            <p>
              <strong>Wind:</strong> {weather.wind.strength} (
              {weather.wind.speed} mph)
            </p>
            <p>
              <strong>Precipitation:</strong>{" "}
              {weather.precipitation.type === "none"
                ? "none"
                : `${weather.precipitation.chance}% chance of ${
                    weather.precipitation.type
                  } (${weather.precipitation.amount} ${
                    weather.precipitation.type === "snow" ? "inches" : "inches"
                  } of accumulation)`}
            </p>
            <p>
              <strong>Cloud Coverage:</strong> {weather.cloudCoverage}%
            </p>
            <p>
              <strong>Road Conditions:</strong> {weather.roadConditions}
            </p>
            <p>
              <strong>Fog:</strong> {weather.fog ? "Yes" : "No"}
            </p>
            <p>
              <strong>Visibility:</strong> {weather.visibility}
            </p>
            {weather.precipitation.type === "snow" && (
              <p>
                <strong>Whiteout Conditions:</strong>{" "}
                {weather.whiteout ? "Yes" : "No"}
              </p>
            )}
            {weather.thunderstorm && (
              <p>
                <strong>Thunderstorm:</strong> Yes
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherGenerator;
