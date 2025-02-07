import React, { useState, useEffect } from "react";
import { trainModel, predictFutureValues } from "../MLModel";
import PredictionChart from "./PredictionChart";
import HistogramChart from "./HistogramChart";
import PieChart from "./PieChart";

function ProjectionSelection({ states, years, mlData }) {
  const [selectedState, setSelectedState] = useState("");
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [accuracy, setAccuracy] = useState({ Auto: null, Bus: null, Truck: null, Motorcycle: null });
  const [selectedTab, setSelectedTab] = useState("data");
  // Store histogram data
  const [stateNames, setStateNames] = useState([]);
  const [stateRegistrations, setStateRegistrations] = useState([]);

  useEffect(() => {
    if (selectedState && mlData[selectedState]) {
      const { years: historicalYears, Auto, Bus, Truck, Motorcycle } = mlData[selectedState];

      setLoading(true);

      (async () => {
        const futureYears = [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];

        try {
          console.log("Training models...");
          const autoModel = await trainModel(historicalYears, Auto);
          const busModel = await trainModel(historicalYears, Bus);
          const truckModel = await trainModel(historicalYears, Truck);
          const motorcycleModel = await trainModel(historicalYears, Motorcycle);

          console.log("Models trained.");

          const minYear = Math.min(...historicalYears);
          const maxYear = Math.max(...historicalYears);

          setPredictions({
            years: [...historicalYears, ...futureYears],
            Auto: [...Auto, ...(autoModel ? await predictFutureValues(autoModel, futureYears, minYear, maxYear) : [])],
            Bus: [...Bus, ...(busModel ? await predictFutureValues(busModel, futureYears, minYear, maxYear) : [])],
            Truck: [...Truck, ...(truckModel ? await predictFutureValues(truckModel, futureYears, minYear, maxYear) : [])],
            Motorcycle: [...Motorcycle, ...(motorcycleModel ? await predictFutureValues(motorcycleModel, futureYears, minYear, maxYear) : [])],
          });

          // Save accuracy/loss metrics
          setAccuracy({
            Auto: autoModel.mseLoss,
            Bus: busModel.mseLoss,
            Truck: truckModel.mseLoss,
            Motorcycle: motorcycleModel.mseLoss
          });

          // Compute histogram data (total registrations per state)
          const stateData = Object.keys(mlData).map(state => {
            const stateRecords = mlData[state];
            return {
              state,
              total: stateRecords.Auto.reduce((sum, value) => sum + value, 0),
            };
          });

          setStateNames(stateData.map(d => d.state));
          setStateRegistrations(stateData.map(d => d.total));

          console.log("Predictions set.");
        } catch (error) {
          console.error("Error during prediction process:", error);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [selectedState]);

  return (
    <div className="p-6 rounded-lg shadow-lg w-full">
      <h2 className="text-2xl font-bold mb-4 text-center">Projected Vehicle Registrations</h2>
      <p className="p-3 max-w-2xl mx-auto text-center">By selecting a state you will be triggering our machine learning algorithm powered by TensorFlow.js to initiate. Our application will import 31 years of vehicle registration data for your state from Data.gov and run it through the predictive algorithm.</p>

      <label className="block font-medium text-white-700 text-lg mb-2">Select a State:</label>
      <select
        className="w-96 p-3 border rounded-md"
        value={selectedState}
        onChange={(e) => setSelectedState(e.target.value)}
      >
        <option value="">Select a State</option>
        {states.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>

      {loading && (
        <div className="flex justify-center mt-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white-900"></div>
        </div>
      )}

      {!loading && selectedState && predictions && (
        <div className="mt-6">
          <div className="flex justify-center space-x-6 mb-6">
            <button
              className={`px-6 py-3 rounded-md text-lg font-semibold ${selectedTab === "data" ? "bg-blue-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-400 opacity-50"}`}
              onClick={() => setSelectedTab("data")}
            >
              Data View
            </button>
            <button
              className={`px-6 py-3 rounded-md text-lg font-semibold ${selectedTab === "chart" ? "bg-blue-800 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-400 opacity-50"}`}
              onClick={() => setSelectedTab("chart")}
            >
              Chart View
            </button>
          </div>
          <p className="p-3 max-w-3xl mx-auto text-center">The Data View will display the Predictive Methods while the Chart View will display the Descriptive Methods.</p>
          <hr className="border-t border-gray-400 w-3/4 mx-auto" />

          {selectedTab === "data" && (
            <div>
              {accuracy.Auto !== null && (
                <div className="mt-6">
                  <h3 className="text-3xl font-semibold text-center mb-4">Model Accuracy (Mean Squared Error)</h3>
                  <p className="p-3 max-w-3xl mx-auto text-center">We value the accuracy of our algorithms and want to be transparent about our numbers up front. Here we have our Accuracy table which shows the Mean Squared Error (MSE) for each prediction the algorithm makes. The MSE is calculated when the prediction is ran and stored in the TensorFlow Loss History. TensorFlow generates this value by finding the difference between actual values and predicted values and then squaring the result to prevent negative results. It then computes the mean of all squared errors which gives us the final value seen in the table below. </p>
                  <p className="p-3 max-w-3xl mx-auto text-center">The lower the number, the more accurate the prediction is. <a target="_blank" href="https://machinelearningmastery.com/loss-functions-in-tensorflow/">Read More Here</a></p>
                  <table className="w-full border-collapse border border-gray-400">
                    <thead>
                      <tr className="bg-gray-800 text-white">
                        <th className="border border-gray-400 px-6 py-3">Vehicle Type</th>
                        <th className="border border-gray-400 px-6 py-3">MSE Loss</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr><td className="border px-6 py-2 text-center">Auto</td><td className="border px-6 py-2 text-center">{accuracy.Auto.toFixed(6)}</td></tr>
                      <tr><td className="border px-6 py-2 text-center">Bus</td><td className="border px-6 py-2 text-center">{accuracy.Bus.toFixed(6)}</td></tr>
                      <tr><td className="border px-6 py-2 text-center">Truck</td><td className="border px-6 py-2 text-center">{accuracy.Truck.toFixed(6)}</td></tr>
                      <tr><td className="border px-6 py-2 text-center">Motorcycle</td><td className="border px-6 py-2 text-center">{accuracy.Motorcycle.toFixed(6)}</td></tr>
                    </tbody>
                  </table>
                </div>
              )}
              
              <h3 className="text-3xl font-semibold text-center mt-8">Predicted Vehicle Registration Numbers (And Historical for Reference)</h3>
              <p className="p-3 max-w-3xl mx-auto text-center">The table below contains all of the historical records for the number of registered vehicles in the selected state over 1990 to 2020 and predictions for the future 10 years of 2021-2030. The results of the machine learning prediction are below between the years of 2021-2030 highlighted with the light gray background. All the data from 2020 down is actual data that we used to train the model to predict 2021-2030.</p>

              <h3 className="text-2xl font-semibold text-center mt-4">How Does the Machine Learning Work?</h3>
              <p className="p-3 max-w-3xl mx-auto text-center">There is quite a bit that goes on under the hood but TensorFlow offers algorithms to help with the training and prediction, you can view their open source code <a target="_blank" href="https://github.com/tensorflow/tfjs">Here</a>. This is a high level summary about the Time Series Forecasting which is a type of Supervised Machine Learning. First, the application validates and normalizes our loaded data to make it transferable into tensors which are mathematical objects used to represent data in machine learning. Next the data creates layers of learning patterns which is essentially a neural network and captures different trends for each layer and applies it to a model. This model is then compiled, optimized, and trained which helps minimize the loss (MSE) and predicts outputs many times, in this case 500 epochs. Now we can perform the predictions, the steps are similar. The model will be validated, then normalized, and the future years will then be converted to tensors. Predictions will be made in the future years and then returned back into the original scale which are the results that you see below.</p>

              <div className="overflow-x-auto mt-8">
                <table className="w-full border-collapse border border-gray-400">
                  <thead>
                    <tr className="bg-gray-800 text-white">
                      <th className="border px-6 py-3">Year</th>
                      <th className="border px-6 py-3">Auto</th>
                      <th className="border px-6 py-3">Bus</th>
                      <th className="border px-6 py-3">Truck</th>
                      <th className="border px-6 py-3">Motorcycle</th>
                    </tr>
                  </thead>
                  <tbody>
                  {predictions.years
                      .map((_, i) => i) // Create an index array
                      .reverse() // Reverse the index array
                      .map((reversedIndex) => {
                        const year = predictions.years[reversedIndex];
                        const isPrediction = year >= 2021;
                        return (
                          <tr key={year} className={`${isPrediction ? "bg-gray-600" : "bg-gray"}`}>
                                    <td className="border px-6 py-2 text-center font-semibold">{year}</td>
                                    <td className={`border px-6 py-2 text-center ${isPrediction ? "bg-gray-600" : "bg-gray"}`}>
                                      {Math.round(predictions.Auto[reversedIndex])}
                                    </td>
                                    <td className={`border px-6 py-2 text-center ${isPrediction ? "bg-gray-600" : "bg-gray"}`}>
                                      {Math.round(predictions.Bus[reversedIndex])}
                                    </td>
                                    <td className={`border px-6 py-2 text-center ${isPrediction ? "bg-gray-600" : "bg-gray"}`}>
                                      {Math.round(predictions.Truck[reversedIndex])}
                                    </td>
                                    <td className={`border px-6 py-2 text-center ${isPrediction ? "bg-gray-600" : "bg-gray"}`}>
                                      {Math.round(predictions.Motorcycle[reversedIndex])}
                                    </td>
                                  </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {selectedTab === "chart" && (
            <div>
              <div className="w-full lg:w-5/6 mx-auto mt-20 h-[500px]">
                <h3 className="text-xl font-semibold text-center mb-4">Vehicle Registrations in {selectedState}</h3>
                <p className="p-3 max-w-3xl mx-auto text-center">The Line Chart/Time Series Chart below is a representation of the prediction table in the Data View. It shows how many vehicles were registered each year in the selected state from 1990 to 2020. Everything after the white dotted line is predicted values from 2021-2030.</p>
                <p className="p-3 max-w-3xl mx-auto text-center">The chart is important because it helps users see trends over the years and have a visual representation of what they may need to do in order to allocate their business resources.</p>
                <PredictionChart
                  years={predictions.years}
                  auto={predictions.Auto}
                  bus={predictions.Bus}
                  truck={predictions.Truck}
                  motorcycle={predictions.Motorcycle}
                />
              </div>

              <div className="w-full lg:w-5/6 mx-auto mt-60 h-[500px]">
                <h3 className="text-xl font-semibold text-center mb-4">Vehicle Registrations by State</h3>
                <p className="p-3 max-w-3xl mx-auto text-center">The Histogram below takes a step back and lets the user look at all of the total vehicle registrations per state from 1990 to 2030. This visual is provided because it can help users determine which states are the most important to look to for expansion.</p>
                <HistogramChart states={stateNames} registrations={stateRegistrations} />
              </div>

              <div className="w-full lg:w-5/6 mx-auto mt-40">
                <h3 className="text-xl font-semibold text-center mb-4">Vehicle Distribution in {selectedState}</h3>
                <p className="p-3 max-w-3xl mx-auto text-center">For the final visual we have a Pie Chart which gives the total of each vehicle per state. This again is a simple metric but portrays important data to the user by showcasing which vehicle types are the most important to invest their time and resources into.</p>
                <PieChart
                auto={predictions.Auto.reduce((sum, v) => sum + v, 0)}
                bus={predictions.Bus.reduce((sum, v) => sum + v, 0)}
                truck={predictions.Truck.reduce((sum, v) => sum + v, 0)}
                motorcycle={predictions.Motorcycle.reduce((sum, v) => sum + v, 0)} 
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProjectionSelection;
