import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { prediction, flightDetails } = location.state || {};

  useEffect(() => {
    if (!prediction) {
      navigate('/');
    }
  }, [prediction, navigate]);

  if (!prediction) return null;

  // Format the prediction data for visualization
  const delayPredictions = [
    {
      name: 'Regression Model',
      delay: Math.round(prediction.regression_prediction * 10) / 10
    },
    {
      name: 'Gradient Boosting',
      delay: Math.round(prediction.gradient_boosting_prediction * 10) / 10
    }
  ];

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

  const getDelayStatus = (delay) => {
    if (delay < 15) return 'On Time';
    if (delay < 30) return 'Minor Delay';
    if (delay < 60) return 'Moderate Delay';
    return 'Severe Delay';
  };

  const averageDelay = (prediction.regression_prediction + prediction.gradient_boosting_prediction) / 2;
  const delayStatus = getDelayStatus(averageDelay);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header with Flight Details */}
        <div className="bg-white rounded-xl shadow-2xl p-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Flight Delay Prediction Results</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Date</p>
              <p className="text-lg font-semibold">{new Date(flightDetails.date).toLocaleDateString()}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Time</p>
              <p className="text-lg font-semibold">{flightDetails.time}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Carrier</p>
              <p className="text-lg font-semibold">{flightDetails.carrier}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Route</p>
              <p className="text-lg font-semibold">{flightDetails.origin} → {flightDetails.destination}</p>
            </div>
          </div>
        </div>

        {/* Delay Status Card */}
        <div className="bg-white rounded-xl shadow-2xl p-6">
          <h3 className="text-xl font-semibold mb-4">Predicted Delay Status</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Predicted Delay</p>
              <p className="text-4xl font-bold text-indigo-600">{Math.round(averageDelay)} minutes</p>
              <p className="text-lg font-medium text-gray-800 mt-2">{delayStatus}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Cluster Assignment</p>
              <p className="text-2xl font-bold text-indigo-600">Group {prediction.cluster + 1}</p>
            </div>
          </div>
        </div>

        {/* Model Predictions Chart */}
        <div className="bg-white rounded-xl shadow-2xl p-6">
          <h3 className="text-xl font-semibold mb-4">Model Predictions Comparison</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={delayPredictions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis label={{ value: 'Predicted Delay (minutes)', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="delay" fill="#4F46E5" name="Predicted Delay (minutes)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
          >
            Make Another Prediction
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results;