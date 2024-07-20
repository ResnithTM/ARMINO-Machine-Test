import React, { useState, useEffect } from "react";
import axios from "axios";
import "./WeatherWidget.css";

// Define types for WeatherAPI response
interface WeatherAPIResponse {
  location: {
    name: string;
    region: string;
    country: string;
    localtime: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
    };
    feelslike_c: number;
    sunset: string;
  };
  forecast: {
    forecastday: {
      hour: {
        time: string;
        temp_c: number;
      }[];
    }[];
  };
}

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherAPIResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState<string>("Kozhikode");

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = "29a47f9f89744c69bc480038242007"; // Replace with your WeatherAPI key
        const response = await axios.get(
          `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=1&aqi=no&alerts=no`
        );
        setWeather(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching the weather data", error);
        setError(
          "Failed to fetch weather data. Please check your API key and try again."
        );
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!weather) {
    return <div className="no-data">No weather data available</div>;
  }

  // Format date
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString();

  return (
    <>
      <div className="container">
        <div className="main-info">
          <div>Today</div>
          <div className="temperature">
            {Math.round(weather.current.temp_c)}°
          </div>
          <div className="weather-description">
            {weather.current.condition.text}
          </div>
          <div>
            {weather.location.name}, {weather.location.region}
          </div>
          <div>{formatDate(weather.location.localtime)}</div>
          <div>
            Feels like {Math.round(weather.current.feelslike_c)}° | Sunrise{" "}
            {new Date(weather.current.feelslike_c).toLocaleTimeString()}
          </div>
        </div>
        <div className="additional-info">
          
          <div className="hourly-forecast">
            {weather.forecast.forecastday[0].hour.map((hour, index) => (
              <div className="hour-info" key={index}>
                {new Date(hour.time).getHours()}:00 - {Math.round(hour.temp_c)}°
              </div>
            ))}
          </div>
          <div className="random-text">Random Text</div>
          <div className="random-text">
            Improve him believe opinion offered met and end cheered forbade.
            Friendly as stronger speedily by recurred. Son interest wandered sir
            addition end say. Manners beloved affixed picture men ask.
          </div>
        </div>
      </div>
    </>
  );
};

export default WeatherWidget;
