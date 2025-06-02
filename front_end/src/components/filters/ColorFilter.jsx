import React from 'react';

const ColorFilter = ({ colors, selectedColors, onColorSelect }) => {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-900 mb-3 uppercase tracking-wide">
        Màu sắc
      </h3>
      <div className="grid grid-cols-4 gap-2">
        {colors.map((color) => (
          <button
            key={color.id}
            onClick={() => onColorSelect(color.id)}
            className={`w-8 h-8 rounded-full border-2 ${
              selectedColors.includes(color.id)
                ? 'border-gray-800 scale-110'
                : 'border-gray-300'
            } transition-all duration-200`}
            style={{ backgroundColor: color.hexCode }}
            title={color.name}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorFilter; 