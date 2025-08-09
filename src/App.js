import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  MapPin, 
  Calendar, 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Cloud,
  CloudRain,
  CloudLightning,
  Sun,
  Moon,
  Snowflake
} from "lucide-react";
import { Helmet } from "react-helmet";
import "./App.css";

const api = {
  key: "4c8170b8bb33c8c8df8f388ef377d20b",
  base: "https://api.openweathermap.org/data/2.5/",
};

const weatherIcons = {
  Clear: { day: Sun, night: Moon },
  Clouds: { day: Cloud, night: Cloud },
  Rain: { day: CloudRain, night: CloudRain },
  Drizzle: { day: CloudRain, night: CloudRain },
  Thunderstorm: { day: CloudLightning, night: CloudLightning },
  Snow: { day: Snowflake, night: Snowflake },
  Mist: { day: Cloud, night: Cloud },
  Smoke: { day: Cloud, night: Cloud },
  Haze: { day: Cloud, night: Cloud },
  Dust: { day: Cloud, night: Cloud },
  Fog: { day: Cloud, night: Cloud },
  Sand: { day: Cloud, night: Cloud },
  Ash: { day: Cloud, night: Cloud },
  Squall: { day: Wind, night: Wind },
  Tornado: { day: Wind, night: Wind }
};

function App() {
  const [query, setQuery] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isNight, setIsNight] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    document.title = "Ventra - Weather Experience";
    checkTimeOfDay();
    
    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
      checkTimeOfDay();
    }, 60000);

    return () => clearInterval(timeInterval);
  }, []);

  const checkTimeOfDay = () => {
    const hour = new Date().getHours();
    setIsNight(hour < 6 || hour > 18);
  };

  const search = async (evt) => {
    if ((evt.key === "Enter" || evt.type === "click") && query.trim()) {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `${api.base}weather?q=${query.trim()}&units=metric&APPID=${api.key}`
        );
        const result = await response.json();
        
        if (result.cod === "404") {
          setError("City not found. Please try again.");
          setWeather(null);
        } else if (result.cod === "400") {
          setError("Please enter a valid city name.");
          setWeather(null);
        } else {
          setWeather(result);
          setQuery("");
        }
      } catch (err) {
        setError("Failed to fetch weather data. Please check your internet connection.");
        setWeather(null);
      } finally {
        setLoading(false);
      }
    }
  };

  const getWeatherIcon = (weatherMain) => {
    const iconSet = weatherIcons[weatherMain] || weatherIcons.Clouds;
    const IconComponent = isNight ? iconSet.night : iconSet.day;
    return IconComponent;
  };

  const getBackgroundClass = () => {
    if (!weather) return "app-default";
    const temp = weather.main.temp;
    if (temp > 25) return "app-hot";
    if (temp > 15) return "app-warm";
    if (temp > 5) return "app-cool";
    return "app-cold";
  };

  const formatDate = (date) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  return (
    <div className={`app ${getBackgroundClass()}`}>
      <Helmet>
        <title>Ventra - Weather Experience</title>
        <meta name="description" content="Experience weather like never before with Ventra" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>
      
      <div className="app-container">

        {/* Search Section */}
        <motion.section 
          className="search-section"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="search-container">
            <motion.div 
              className="search-box"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <Search className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search for a city..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={search}
              />
              <motion.button
                className="search-button"
                onClick={search}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!query.trim() || loading}
              >
                Search
              </motion.button>
            </motion.div>
            
            {error && (
              <motion.div 
                className="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {error}
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* Main Content */}
        <main className="main-content">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div 
                className="loading-container"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div 
                  className="loading-spinner"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <p>Fetching weather data...</p>
              </motion.div>
            )}

            {weather && !loading && (
              <motion.div 
                className="weather-container"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
              >
                {/* Left Side - Weather Info */}
                <motion.div 
                  className="weather-info"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  {/* Location and Date */}
                  <div className="location-section">
                    <div className="location-info">
                      <MapPin className="location-icon" />
                      <h2 className="location-name">
                        {weather.name}, {weather.sys.country}
                      </h2>
                    </div>
                    <div className="date-info">
                      <Calendar className="date-icon" />
                      <p className="date-text">{formatDate(new Date())}</p>
                    </div>
                    <div className="time-info">
                      <p className="time-text">
                        {currentTime.toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Weather Details */}
                  <div className="weather-details">
                    <motion.div 
                      className="detail-card"
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Thermometer className="detail-icon" />
                      <div className="detail-content">
                        <span className="detail-label">Feels Like</span>
                        <span className="detail-value">{Math.round(weather.main.feels_like)}°C</span>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="detail-card"
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Droplets className="detail-icon" />
                      <div className="detail-content">
                        <span className="detail-label">Humidity</span>
                        <span className="detail-value">{weather.main.humidity}%</span>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="detail-card"
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Wind className="detail-icon" />
                      <div className="detail-content">
                        <span className="detail-label">Wind Speed</span>
                        <span className="detail-value">{weather.wind.speed} m/s</span>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="detail-card"
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Eye className="detail-icon" />
                      <div className="detail-content">
                        <span className="detail-label">Visibility</span>
                        <span className="detail-value">{(weather.visibility / 1000).toFixed(1)} km</span>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="detail-card"
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Thermometer className="detail-icon" />
                      <div className="detail-content">
                        <span className="detail-label">Min Temp</span>
                        <span className="detail-value">{Math.round(weather.main.temp_min)}°C</span>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="detail-card"
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Thermometer className="detail-icon" />
                      <div className="detail-content">
                        <span className="detail-label">Max Temp</span>
                        <span className="detail-value">{Math.round(weather.main.temp_max)}°C</span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Right Side - Main Weather Display */}
                <motion.div 
                  className="weather-main"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="weather-icon-container">
                    {(() => {
                      const IconComponent = getWeatherIcon(weather.weather[0].main);
                      return IconComponent ? (
                        <motion.div
                          className="weather-icon"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          <IconComponent size={100} />
                        </motion.div>
                      ) : (
                        <motion.div
                          className="weather-icon"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Cloud size={100} />
                        </motion.div>
                      );
                    })()}
                  </div>
                  
                  <motion.div 
                    className="temperature-display"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <h1 className="temperature">
                      {Math.round(weather.main.temp)}°C
                    </h1>
                    <p className="weather-description">
                      {weather.weather[0].description}
                    </p>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}

            {/* Welcome Message */}
            {!weather && !loading && (
              <motion.div 
                className="welcome-container"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div 
                  className="welcome-content"
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  {/* Brand Section */}
                  <motion.div 
                    className="brand-section"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <div className="brand-logo">
                      <Cloud className="brand-icon" />
                      <span className="brand-name">Ventra</span>
                    </div>
                    <p className="brand-tagline">Weather Experience</p>
                  </motion.div>

                  {/* Hero Section */}
                  <motion.div 
                    className="hero-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <h1 className="hero-title">
                      Discover Weather Like Never Before
                    </h1>
                    <p className="hero-subtitle">
                      Get real-time weather insights with stunning visuals and detailed analytics. 
                      From temperature to wind patterns, experience weather data in a whole new way.
                    </p>
                  </motion.div>

                  {/* Features Grid */}
                  <motion.div 
                    className="features-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <motion.div 
                      className="feature-card"
                      whileHover={{ scale: 1.02, y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="feature-icon-wrapper">
                        <Cloud className="feature-icon" />
                      </div>
                      <h3 className="feature-title">Real-time Data</h3>
                      <p className="feature-description">
                        Get instant weather updates from anywhere in the world
                      </p>
                    </motion.div>
                    
                    <motion.div 
                      className="feature-card"
                      whileHover={{ scale: 1.02, y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="feature-icon-wrapper">
                        <Thermometer className="feature-icon" />
                      </div>
                      <h3 className="feature-title">Detailed Analytics</h3>
                      <p className="feature-description">
                        Comprehensive temperature, humidity, and wind information
                      </p>
                    </motion.div>
                    
                    <motion.div 
                      className="feature-card"
                      whileHover={{ scale: 1.02, y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="feature-icon-wrapper">
                        <Wind className="feature-icon" />
                      </div>
                      <h3 className="feature-title">Wind Patterns</h3>
                      <p className="feature-description">
                        Track wind speed and direction with precision
                      </p>
                    </motion.div>
                    
                    <motion.div 
                      className="feature-card"
                      whileHover={{ scale: 1.02, y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="feature-icon-wrapper">
                        <Eye className="feature-icon" />
                      </div>
                      <h3 className="feature-title">Visibility Info</h3>
                      <p className="feature-description">
                        Check visibility conditions for your location
                      </p>
                    </motion.div>
                  </motion.div>

                  {/* CTA Section */}
                  <motion.div 
                    className="cta-section"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <p className="cta-text">Ready to explore the weather?</p>
                    <div className="cta-hint">
                      <Search className="cta-icon" />
                      <span>Search for any city above to get started</span>
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;
