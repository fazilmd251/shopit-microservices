"use client";
import React, { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Plus, X } from "lucide-react";

// This will be the shape of our local state
interface Property {
  name: string;
  options: string[];
}

export default function CustomProperties() {
  const { control } = useFormContext();

  // --- LOCAL STATE ---
  // 1. To store the list of properties (e.g., [{ name: "Color", options: ["Red", "Blue"] }])
  const [properties, setProperties] = useState<Property[]>([]);
  
  // 2. To control the "Add New Property" input (e.g., "Color")
  const [newPropertyName, setNewPropertyName] = useState("");

  // 3. To control the "Add New Value" inputs (e.g., { Color: "Green", Size: "L" })
  const [newValueInputs, setNewValueInputs] = useState<{ [key: string]: string }>({});

  // --- HANDLERS ---
  const handleAddNewProperty = () => {
    if (!newPropertyName.trim() || properties.find((p) => p.name === newPropertyName)) {
      return; // Don't add if empty or name already exists
    }
    
    // Add the new property to our local state
    setProperties([...properties, { name: newPropertyName, options: [] }]);
    
    // Add a new entry for its "add value" input
    setNewValueInputs({ ...newValueInputs, [newPropertyName]: "" });
    
    // Clear the "Add Property" input
    setNewPropertyName("");
  };

  const handleAddNewValue = (propertyName: string) => {
    const value = newValueInputs[propertyName]?.trim();
    if (!value) return;

    setProperties((currentProperties) =>
      currentProperties.map((prop) => {
        // Find the property we're adding a value to
        if (prop.name === propertyName) {
          // Add the new value if it doesn't exist
          if (!prop.options.includes(value)) {
            return { ...prop, options: [...prop.options, value] };
          }
        }
        return prop;
      })
    );
    
    // Clear the "Add Value" input for this property
    setNewValueInputs({ ...newValueInputs, [propertyName]: "" });
  };

  const handleRemoveProperty = (propertyName: string) => {
    setProperties(properties.filter(prop => prop.name !== propertyName));
    // We can leave the form value as-is, it won't hurt
    // Or we could unregister it: unregister(`properties.${propertyName}`)
  };

  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold mb-2 text-white">
        Custom Properties
      </h3>
      
      {/* 1. "Add New Property" Input Form */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={newPropertyName}
          onChange={(e) => setNewPropertyName(e.target.value)}
          placeholder="e.g., Color, Size, Material"
          className="w-full bg-gray-800 text-gray-200 border border-gray-700 px-2 py-1 rounded-sm text-xs"
        />
        <button
          type="button"
          onClick={handleAddNewProperty}
          className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 rounded-sm text-xs text-white transition whitespace-nowrap"
        >
          + Add Property
        </button>
      </div>

      {/* 2. List of Added Properties */}
      <div className="space-y-4">
        {properties.map((prop) => (
          <div key={prop.name} className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
            
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-semibold text-gray-200">{prop.name}</h4>
              <button
                type="button"
                onClick={() => handleRemoveProperty(prop.name)}
                className="text-red-400 hover:text-red-600"
              >
                <X size={16} />
              </button>
            </div>

            {/* "Add New Value" Input for this property */}
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newValueInputs[prop.name] || ""}
                onChange={(e) =>
                  setNewValueInputs({
                    ...newValueInputs,
                    [prop.name]: e.target.value,
                  })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddNewValue(prop.name);
                  }
                }}
                placeholder="Add a value (e.g., Red) and press Enter"
                className="w-full bg-gray-900 text-gray-200 border border-gray-600 px-2 py-1 rounded-sm text-xs"
              />
              <button
                type="button"
                onClick={() => handleAddNewValue(prop.name)}
                className="px-2 py-1 bg-gray-600 hover:bg-gray-500 rounded-sm text-xs text-white transition"
              >
                Add
              </button>
            </div>

            {/* 3. "Value Selector" - This is the react-hook-form part */}
            <Controller
              // The name will be dynamic, e.g., "properties.Color"
              name={`properties.${prop.name}`}
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap gap-2">
                  {prop.options.length === 0 && (
                    <p className="text-xs text-gray-400">No values added yet.</p>
                  )}
                  {prop.options.map((option) => {
                    const isSelected = field.value === option;
                    return (
                      <button
                        type="button"
                        key={option}
                        onClick={() => field.onChange(option)} // Set this as the selected value
                        className={`
                          px-2 py-0.5 rounded-full text-xs transition
                          ${
                            isSelected
                              ? "bg-indigo-600 text-white font-semibold"
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          }
                        `}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}