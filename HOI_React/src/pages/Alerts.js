import React, { useEffect, useState } from "react";
import "../styles/Alerts.css";
import AlertDetails from "../components/AlertDetails";
import Sidebar from "../components/Sidebar";

function Alerts() {
  const [pastAlerts, setPastAlerts] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    dates: [],
    locations: [],
  });
  const [selectedFilters, setSelectedFilters] = useState({
    date: "",
    location: "",
  });

  const fetchFirebaseData = async () => {
    try {
      let endpoint = `http://127.0.0.1:8000/hoi/prediction`;
      let response = await fetch(endpoint);
      let data = await response.json();
      console.log("DATA", data);

      // Filter data based on the selected date and location
      const filteredData = data.filter((item) => {
        const dateMatches =
          !selectedFilters.date ||
          formatDate(item.timestamp) === selectedFilters.date;
        const locationMatches =
          !selectedFilters.location ||
          item.location === selectedFilters.location;
        return dateMatches && locationMatches;
      });

      setPastAlerts(filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  // Function to sort alerts based on the latest frame number
  const sortAlertsByFrameNumber = (alerts) => {
    return alerts.sort((a, b) => b.code_id - a.code_id);
  };

  // Function to format a timestamp to "yyyy-MM-dd" format
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleFilterChange = (filterType, value) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value,
    }));
  };

  useEffect(() => {
    // Fetch filter options when the component mounts
    const fetchFilterOptions = async () => {
      try {
        let filtersEndpoint = "http://127.0.0.1:8000/hoi/location"; // Adjust the endpoint
        let response = await fetch(filtersEndpoint);
        let filtersData = await response.json();
        console.log(filtersData);
        // Extract location names from the response data
        const locationNames = filtersData.map(
          (location) => location.location_name
        );

        // Set the location options in the state
        setFilterOptions({ ...filterOptions, locations: locationNames });
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchFirebaseData(); // Fetch data when the component mounts
    fetchFilterOptions(); // Fetch filter options when the component mounts
  }, []);

  useEffect(() => {
    // Fetch data when the selected filters change
    fetchFirebaseData();
    console.log(selectedFilters);
  }, [selectedFilters]);

  return (
    <div className="alerts">
      <div className="sidebar">
        {/* Pass filter options and selected filters to the Sidebar component */}
        <Sidebar
          filters={filterOptions}
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
        />
      </div>
      <div className="alert-list">
        <h2>Past Alerts</h2>
        {pastAlerts.length === 0 ? (
          <p>No records found.</p>
        ) : (
          sortAlertsByFrameNumber(pastAlerts).map((alert, index) => (
            <AlertDetails key={index} alert={alert} />
          ))
        )}
      </div>
    </div>
  );
}

export default Alerts;