import React, { useState } from "react";

function HistoricalSelection({ states, years, dataHash }) {
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedState, setSelectedState] = useState("");

  // Get data based on selected year and state
  const selectedKey = `${selectedYear}_${selectedState}`;
  const rowData = dataHash[selectedKey] || null;

  return (
    <div className="p-6 w-full max-w-screen-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Historical Vehicle Registrations</h2>
      <p className="p-3 max-w-2xl mx-auto text-center">By selecting a state and year you will be querying the historical registration data we retrieved from Data.gov <a target="_blank" href="https://catalog.data.gov/dataset/motor-vehicle-registrations-dashboard-data">Here</a>. We took this data in CSV format and imported it into our application to make it easily usable by the machine learning algorithm and searchable for historical record purposes. It also allows for efficient reading since we read it into memory on page load.</p>
      <h2 className="text-lg font-semibold mb-4 text-center">Select Year and State</h2>

      <label className="block font-medium text-white-700">Year:</label>
      <select
        className="w-96 p-2 mb-4 border rounded-md"
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
      >
        <option value="">Select a Historical Year</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      <label className="block font-medium text-white-700">State:</label>
      <select
        className="w-96 p-2 mb-4 border rounded-md"
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

      {rowData ? (
        <table className="w-full border-collapse border border-gray-300 mt-4">
          <thead>
            <tr className="bg-gray-500">
              <th className="border border-gray-300 px-4 py-2">Vehicle Type</th>
              <th className="border border-gray-300 px-4 py-2">Vehicle Registration Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Auto</td>
              <td className="border border-gray-300 px-4 py-2">{rowData.Auto}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Bus</td>
              <td className="border border-gray-300 px-4 py-2">{rowData.Bus}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Truck</td>
              <td className="border border-gray-300 px-4 py-2">{rowData.Truck}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Motorcycle</td>
              <td className="border border-gray-300 px-4 py-2">{rowData.Motorcycle}</td>
            </tr>
          </tbody>
        </table>
      ) : (
        selectedYear &&
        selectedState && (
          <p className="text-center text-red-500 mt-4">No data available for this selection.</p>
        )
      )}
    </div>
  );
}

export default HistoricalSelection;
