import React, {useState} from 'react';
import {useTranslation} from "react-i18next";

const PriceFilter = ({priceRange, onPriceRangeChange, onPriceFilter}) => {
    const {t} = useTranslation();
    const [error, setError] = useState('');

    const quickPriceRanges = [
        {label: 'Dưới 300k', min: '0', max: '300000'},
        {label: '300k - 500k', min: '300000', max: '500000'},
        {label: '500k - 1 triệu', min: '500000', max: '1000000'},
        {label: 'Trên 1 triệu', min: '1000000', max: ''}
    ];

    const validatePrice = (min, max) => {
        if (min && max && Number(min) > Number(max)) {
            setError('Giá tối thiểu không được lớn hơn giá tối đa');
            return false;
        }
        if (min && Number(min) < 0) {
            setError('Giá không được âm');
            return false;
        }
        if (max && Number(max) < 0) {
            setError('Giá không được âm');
            return false;
        }
        setError('');
        return true;
    };

    const handlePriceChange = (field, value) => {
        const newPriceRange = {...priceRange, [field]: value};
        onPriceRangeChange(newPriceRange);
        validatePrice(newPriceRange.min, newPriceRange.max);
    };

    const handleApplyFilter = () => {
        if (validatePrice(priceRange.min, priceRange.max)) {
            onPriceFilter(priceRange.min, priceRange.max);
        }
    };

    const handleQuickFilter = (min, max) => {
        onPriceRangeChange({min, max});
        onPriceFilter(min, max);
    };

    return (
        <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3 uppercase tracking-wide">
                {t("product_list.price")}
            </h3>

            {/* Quick Price Filters */}
            <div className="grid grid-cols-2 gap-2 mb-4">
                {quickPriceRanges.map((range, index) => (
                    <button
                        key={index}
                        onClick={() => handleQuickFilter(range.min, range.max)}
                        className={`px-3 py-2 text-sm border rounded transition-colors duration-200 ${
                            priceRange.min === range.min && priceRange.max === range.max
                                ? 'border-gray-800 bg-gray-800 text-white'
                                : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                    >
                        {range.label}
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <div className="flex-1">
                        <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={priceRange.min}
                            onChange={(e) => handlePriceChange('min', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-500"
                        />
                    </div>
                    <span className="text-gray-500">-</span>
                    <div className="flex-1">
                        <input
                            type="number"
                            min="0"
                            placeholder="0"
                            value={priceRange.max}
                            onChange={(e) => handlePriceChange('max', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-gray-500"
                        />
                    </div>
                </div>

                {error && (
                    <p className="text-red-500 text-sm">{error}</p>
                )}

                <button
                    onClick={handleApplyFilter}
                    disabled={!!error}
                    className="w-full px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {t("product_list.apply_button")}
                </button>
            </div>
        </div>
    );
};

export default PriceFilter; 