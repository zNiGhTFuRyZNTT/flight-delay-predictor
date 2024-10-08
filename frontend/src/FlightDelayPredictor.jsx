import React, { useState, useEffect } from 'react';

const FlightDelayPredictor = () => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    carrier: '',
    origin: '',
    destination: '',
    num_flights: '',
    weather_delays: '',
  }); // define the structure of the data we are going to use
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false); // for showing the spinner while loading the predictions
  const [error, setError] = useState(null);

  // define carriers
  const [carriers, setCarriers] = useState(['YV', 'YX', 'ZW', '9E', 'AA', 'AS', 'B6', 'DL', 'F9', 'G4', 'HA', 'NK', 'OH', 'OO', 'UA', 'WN']);
  // define airports
  const [airports, setAirports] = useState(['ATL', 'AUS', 'BNA', 'BOS', 'BWI', 'CLT', 'DCA', 'DEN', 'DFW', 'DTW', 'EWR', 'FLL', 'IAD', 'IAH', 'JFK', 'LAS', 'LAX', 'LGA', 'MCO', 'MDW', 'MIA', 'MSP', 'ORD', 'PHL', 'PHX', 'SAN', 'SEA', 'SFO', 'SLC', 'TPA']);

  const handleInputChange = (e) => {
    // when user selects options we update the formData state in order to submit to the server for prediction.
    const { name, value } = e.target; // deconstructing name and value from e.target
    setFormData({ ...formData, [name]: value }); // updating the formData by adding new values to its current data
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // prevents page from re-rendering on button click.
    setLoading(true); // show the spinner while we retrieve data from the server
    setError(null); // as we have no error at this moment its set to null, if we run into an error later we will update the state
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://bridge-flight-predictor-8bb28665269f.herokuapp.com'; // use url from .env if exists or use default
      const response = await fetch(`${API_URL}/predict`, { // send a post request to the bridge api
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // stringifying our data to be sent as a raw format
      });
      
      if (!response.ok) { // throw error if there was any
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json(); // get the jsonified fetched data
      setPrediction(data); // set the data as the prediction results
    } catch (error) {
      //  setting and showing the error if something went wrong
      console.error('Error making prediction:', error);
      if (error.message.includes('Failed to fetch')) {
        setError('Unable to connect to the server. Please check your internet connection and try again.');
      } else {
        setError('Failed to get prediction. Please try again later.');
      }
    } finally {
      setLoading(false); // hide the loading spinner after the operation was finished (either successfull or with an error).
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Flight Delay Predictor
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your flight details to predict potential delays
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="date" className="sr-only">Date</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Date"
              />
            </div>
            <div>
              <label htmlFor="time" className="sr-only">Time</label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Time"
              />
            </div>
            <div>
              <label htmlFor="carrier" className="sr-only">Airline</label>
              <select
                id="carrier"
                name="carrier"
                value={formData.carrier}
                onChange={handleInputChange}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              >
                <option value="">Select an airline</option>
                {carriers.map((carrier) => (
                  <option key={carrier} value={carrier}>{carrier}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="origin" className="sr-only">Origin Airport</label>
              <select
                id="origin"
                name="origin"
                value={formData.origin}
                onChange={handleInputChange}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              >
                <option value="">Select origin airport</option>
                {airports.map((airport) => (
                  <option key={airport} value={airport}>{airport}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="destination" className="sr-only">Destination Airport</label>
              <select
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              >
                <option value="">Select destination airport</option>
                {airports.map((airport) => (
                  <option key={airport} value={airport}>{airport}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="num_flights" className="sr-only">Number of Flights</label>
              <input
                type="number"
                id="num_flights"
                name="num_flights"
                value={formData.num_flights}
                onChange={handleInputChange}
                required
                min="1"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Number of Flights"
              />
            </div>
            <div>
              <label htmlFor="weather_delays" className="sr-only">Weather-related Delays</label>
              <input
                type="number"
                id="weather_delays"
                name="weather_delays"
                value={formData.weather_delays}
                onChange={handleInputChange}
                required
                min="0"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Weather-related Delays"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {loading ? 'Predicting...' : 'Predict Delay'}
            </button>
          </div>
        </form>
        
        {error && (
          <div className="rounded-md bg-red-50 p-4 mt-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {prediction && (
          <div className="rounded-md bg-green-50 p-4 mt-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Prediction Results
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p><strong>Regression Prediction:</strong> <span className="font-bold">{prediction.regression_prediction.toFixed(2)} minutes</span></p>
                  <p><i>This is the estimated delay time based on various factors such as weather conditions, carrier, and flight history.</i></p>

                  <p><strong>Classification Prediction:</strong> <span className="font-bold">{prediction.classification_prediction}</span></p>
                  <p><i>This prediction categorizes the delay into one of the predefined categories (e.g., No Delay, Short Delay, Long Delay).</i></p>

                  <p><strong>Gradient Boosting Prediction:</strong> <span className="font-bold">{prediction.gradient_boosting_prediction.toFixed(2)} minutes</span></p>
                  <p><i>This is an alternative estimate of the delay using a different model, providing another perspective on the possible delay time.</i></p>

                  <p><strong>Cluster:</strong> <span className="font-bold">{prediction.cluster}</span></p>
                  <p><i>Your flight belongs to a cluster of similar flights with comparable conditions. This helps identify patterns of delay based on similar flights.</i></p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightDelayPredictor;
