import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../styles/Sidebar.css'; // Import the CSS file

const Sidebar = ({ filters, selectedFilters, onFilterChange }) => {
  const handleDateChange = (date) => {
    // Check if a valid date was selected
    console.log("sidebardate",date)
    if (date) {
      // Extract the date portion from the selected date
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // Months are zero-indexed, so add 1
      const day = date.getDate();

      // Create a formatted date string (e.g., yyyy-MM-dd)
      const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      console.log(formattedDate)
      // Call the onFilterChange function with the formatted date
      onFilterChange('date', formattedDate);
    } else {
      // If no date selected, set the date filter to an empty string
      onFilterChange('date', '');
    }
  };


  const handleLocationChange = (e) => {
    const location = e.target.value;
    onFilterChange('location', location);
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Filters</h2>
      <div className="filter-section">
        <label>Date:</label>
        <DatePicker
          selected={selectedFilters.date ? new Date(selectedFilters.date) : null}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          isClearable
        />
      </div>
      
      <div className="filter-section">
        <label>Location:</label>
        <select value={selectedFilters.location} onChange={handleLocationChange}>
          <option value="">All</option>
          {filters.locations && filters.locations.length > 0 && filters.locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Sidebar;
