import React, { useState, useEffect } from 'react';

const FlightDelayPredictor = () => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    carrier: '',
    origin: '',
    destination: '',
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [carriers, setCarriers] = useState([]);
  const [airports, setAirports] = useState([]);

  useEffect(() => {
    // In a real application, you might fetch these from an API
    setCarriers(['AA', 'DL', 'UA', 'WN', 'B6', 'AS', 'NK', 'F9', 'G4', 'HA']);
    setAirports(['ATL', 'LAX', 'ORD', 'DFW', 'DEN', 'JFK', 'SFO', 'SEA', 'LAS', 'MCO', 'EWR', 'CLT', 'PHX', 'IAH', 'MIA']);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setPrediction(data);
    } catch (error) {
      console.error('Error making prediction:', error);
      setError('Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-2xl font-bold mb-6">Flight Delay Predictor</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time</label>
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>
        <div>
          <label htmlFor="carrier" className="block text-sm font-medium text-gray-700">Airline</label>
          <select
            id="carrier"
            name="carrier"
            value={formData.carrier}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Select an airline</option>
            {carriers.map((carrier) => (
              <option key={carrier} value={carrier}>{carrier}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="origin" className="block text-sm font-medium text-gray-700">Origin Airport</label>
          <select
            id="origin"
            name="origin"
            value={formData.origin}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Select origin airport</option>
            {airports.map((airport) => (
              <option key={airport} value={airport}>{airport}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="destination" className="block text-sm font-medium text-gray-700">Destination Airport</label>
          <select
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Select destination airport</option>
            {airports.map((airport) => (
              <option key={airport} value={airport}>{airport}</option>
            ))}
          </select>
        </div>
        <button 
          type="submit" 
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={loading}
        >
          {loading ? 'Predicting...' : 'Predict Delay'}
        </button>
      </form>
      {error && (
        <div className="mt-4 p-4 bg-red-100 rounded-md">
          <p className="text-center text-red-800">{error}</p>
        </div>
      )}
      {prediction && (
        <div className="mt-4 p-4 bg-green-100 rounded-md">
          <p className="text-center text-green-800">
            Regression Prediction: <span className="font-bold">{prediction.regression_prediction.toFixed(2)} minutes</span>
          </p>
          <p className="text-center text-green-800">
            Classification Prediction: <span className="font-bold">{prediction.classification_prediction}</span>
          </p>
          <p className="text-center text-green-800">
            Cluster: <span className="font-bold">{prediction.cluster}</span>
          </p>
          <p className="text-center text-green-800">
            Cluster Interpretation: <span className="font-bold">{prediction.cluster_interpretation}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default FlightDelayPredictor;