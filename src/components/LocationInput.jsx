"use client";
import React, { useState, useEffect } from "react";

const LocationInput = ({ location, setLocation }) => {
  const [query, setQuery] = useState(location || "");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.length > 2) {
        fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
        )
          .then((res) => res.json())
          .then((data) => setSuggestions(data));
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleSelect = (place) => {
    setQuery(place.display_name);
    setLocation(place.display_name);
    setSuggestions([]);
  };

  return (
    <div className="relative col-span-3">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter location"
        className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border border-gray-300 rounded w-full mt-1 max-h-60 overflow-auto shadow">
          {suggestions.map((place) => (
            <li
              key={place.place_id}
              onClick={() => handleSelect(place)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationInput;
