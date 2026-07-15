/**
 * Centralized configuration module.
 * All environment variables should be accessed through this object to ensure
 * consistency and provide fallback values where appropriate.
 * 
 * Note: In Create React App, environment variables must be prefixed with REACT_APP_
 */

interface Config {
  apiUrl: string;
  appEnv: string;
  isProduction: boolean;
  isDevelopment: boolean;
}

const config: Config = {
  // Use REACT_APP_API_URL if defined, otherwise fallback to local dev server
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  
  // Track the environment
  appEnv: process.env.REACT_APP_APP_ENV || 'development',
  
  // Helper booleans
  isProduction: process.env.REACT_APP_APP_ENV === 'production',
  isDevelopment: process.env.REACT_APP_APP_ENV === 'development' || !process.env.REACT_APP_APP_ENV,
};

export default config;
