import { useEffect, useState } from "react";
import Papa from "papaparse";
import "./App.css";
import HistoricalSelection from "./components/HistoricalSelection";
import ProjectionSelection from "./components/ProjectionSelection";

function App() {
  const [data, setData] = useState([]);
  const [dataHash, setDataHash] = useState({});
  const [states, setStates] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedView, setSelectedView] = useState("projection");
  const [mlData, setMLData] = useState({});

  const projectedYears = [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];

  // Import CSV Data into App
  useEffect(() => {
    fetch("/Motor_Vehicle_Registrations_Dashboard_data.csv")
      .then(response => response.text())
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            setData(result.data);
            processCSVData(result.data);
            setMLData(prepareDataForML(result.data));
          },
        });
      })
      .catch(error => console.error("Error loading CSV:", error));
  }, []);

  // Process data for easy reading
  const processCSVData = (data) => {
    const stateSet = new Set();
    const yearSet = new Set();
    const tempDataHash = {};

    data.forEach((row) => {
      const { year, state, Auto, Bus, Truck, Motorcycle } = row;
      if (row.state) stateSet.add(row.state);
      if (row.year) yearSet.add(row.year);

      const key = `${year}_${state}`;
      tempDataHash[key] = {
        year,
        state,
        Auto: Number(Auto) || 0,
        Bus: Number(Bus) || 0,
        Truck: Number(Truck) || 0,
        Motorcycle: Number(Motorcycle) || 0,
      };
    });

    setStates([...stateSet]);
    setYears([...yearSet]);
    setDataHash(tempDataHash);
  };

  // Prepare data into format for machine learning
  const prepareDataForML = (data) => {
    const formattedData = {};
    
    data.forEach(row => {
      const { year, state, Auto, Bus, Truck, Motorcycle } = row;
      if (!formattedData[state]) {
        formattedData[state] = { years: [], Auto: [], Bus: [], Truck: [], Motorcycle: [] };
      }
      
      formattedData[state].years.push(Number(year));
      formattedData[state].Auto.push(Number(Auto));
      formattedData[state].Bus.push(Number(Bus));
      formattedData[state].Truck.push(Number(Truck));
      formattedData[state].Motorcycle.push(Number(Motorcycle));
    });

    return formattedData;
  };

  return (
    <div className="p-4 flex flex-col items-center w-full">
      <h1 className="text-2xl font-bold mb-1">Prediciting Vehicle Registration Numbers - C964 Capstone Project</h1>
      <h2 className="font-medium mb-1 text-xl">Benedetto Tamburrino</h2>
      <p className="m-3 text-lg mb-8">Have you ever needed to view past or future projections of vehicle registration numbers? What this tool does is allows users to analyze past historical registration numbers by state or utilize a machine learning algorithim to predict vehicle registration trends up to 10 years into the future. This can help with resource planning for government agencies along with businesses that coincide with vehicle registration. We provide unique data to help users get an idea on where to expect new vehicular trends.</p>
      <hr className="border-t border-gray-400 w-3/4 mx-auto" />
      <p className="text-xl p-6">Get Started Below. You can choose to generate future projected data or query past historical data.</p>

      <div className="mb-4 flex gap-6 justify-center items-center">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="projection"
            checked={selectedView === "projection"}
            onChange={() => setSelectedView("projection")}
            className="accent-blue-500"
          />
          Generate Projected Data
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="historical"
            checked={selectedView === "historical"}
            onChange={() => setSelectedView("historical")}
            className="accent-blue-500"
          />
          View Historical Data
        </label>
      </div>

      {/* Conditional Rendering Based on Selected View */}
      <div className="w-full max-w-screen-2xl">
      {selectedView === "historical" ? (
        <HistoricalSelection states={states} years={years} dataHash={dataHash}/>
      ) : (
        <ProjectionSelection states={states} years={projectedYears} mlData={mlData} /> 
      )}
      </div>
    </div>
  );
}

export default App;
