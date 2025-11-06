"use client";
import { Plus, Check } from "lucide-react";
import React, { useState } from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";

const defaultColors = [
  "#000000", "#0000FF", "#008000", "#00FFFF",
  "#FF0000", "#FFFFFF", "#FFFF00", "#FF00FF",
];

interface ColorSelectorProps {
  control: Control<any>;
  errors: FieldErrors;
}

const ColorSelector = ({ control, errors }: ColorSelectorProps) => {
  const [customColors, setCustomColors] = useState<string[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newColor, setNewColor] = useState("#000000");

  const handleAddNewColor = () => {
    if (newColor && !defaultColors.includes(newColor) && !customColors.includes(newColor)) {
      setCustomColors((prev) => [...prev, newColor]);
    }
    setShowColorPicker(false);
  };

  return (
    <div className="space-y-1"> {/* CHANGED: Reduced vertical space */}
      <label className="text-xs font-medium text-gray-200">Select Colors</label>
      <Controller
        name="color"
        control={control}
        render={({ field }) => (
          <div className="flex gap-1.5 flex-wrap items-center"> {/* CHANGED: Reduced gap */}
            {[...defaultColors, ...customColors].map((color) => {
              const isSelected = (field.value || []).includes(color);
              const isLightColor = ["#FFFFFF", "#FFFF00"].includes(
                color.toUpperCase()
              );

              return (
                <button
                  type="button"
                  key={color}
                  onClick={() => {
                    const currentValue = field.value || [];
                    const newValue = isSelected
                      ? currentValue.filter((c: string) => c !== color)
                      : [...currentValue, color];
                    field.onChange(newValue);
                  }}
                  className={`
                    w-5 h-5 rounded-full flex items-center justify-center {/* CHANGED: w-5 h-5 */}
                    transition-all duration-150
                    ${isLightColor ? "border border-gray-400" : ""}
                    ${isSelected ? "ring-2 ring-offset-1 ring-offset-gray-800 ring-indigo-500" : ""}
                  `}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                >
                  {isSelected && (
                    <Check
                      size={12} // CHANGED: Reduced icon size
                      className={isLightColor ? "text-black" : "text-white"}
                    />
                  )}
                </button>
              );
            })}

            {/* Button to show/hide the color picker */}
            {!showColorPicker && (
              <button
                type="button"
                onClick={() => setShowColorPicker(true)}
                className="w-5 h-5 rounded-full flex items-center justify-center bg-gray-700 hover:bg-gray-600 text-gray-300 transition" // CHANGED: w-5 h-5
                aria-label="Add new color"
              >
                <Plus size={12} /> {/* CHANGED: Reduced icon size */}
              </button>
            )}

            {/* The Custom Color Picker UI */}
            {showColorPicker && (
              <div className="flex items-center gap-1 p-0.5 bg-gray-800 rounded-md border border-gray-700"> {/* CHANGED: Tighter spacing */}
                <input
                  type="color"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="w-5 h-5 border-none p-0 rounded-sm cursor-pointer bg-transparent" // CHANGED: w-5 h-5
                  style={{
                    backgroundColor: newColor,
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddNewColor}
                  className="px-1 py-0 bg-indigo-600 hover:bg-indigo-700 rounded text-[11px] text-white" // CHANGED: Tighter buttons
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowColorPicker(false)}
                  className="px-1 py-0 bg-gray-600 hover:bg-gray-500 rounded text-[11px] text-white" // CHANGED: Tighter buttons
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      />
      {/* Displaying the error message */}
      {errors.color && (
        <p className="text-xs text-red-500">
          {String(errors.color.message)}
        </p>
      )}
    </div>
  );
};

export default ColorSelector;