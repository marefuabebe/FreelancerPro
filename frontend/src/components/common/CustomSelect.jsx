import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({
    options,
    value,
    onChange,
    placeholder = 'Select option',
    disabled = false
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="relative w-full" ref={containerRef}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`w-full px-4 py-3 border rounded-lg flex items-center justify-between bg-white transition-colors
          ${disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'hover:border-green-500 focus:ring-2 focus:ring-green-500 focus:border-green-500'}
          ${isOpen ? 'border-green-500 ring-2 ring-green-500' : 'border-gray-300'}
        `}
            >
                <span className={`block truncate ${!selectedOption ? 'text-gray-500' : 'text-gray-900'}`}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {options.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={`w-full px-4 py-2 text-left flex items-center justify-between hover:bg-green-50 transition-colors
                ${value === option.value ? 'bg-green-50 text-green-700 font-medium' : 'text-gray-700'}
              `}
                        >
                            <span className="block truncate">{option.label}</span>
                            {value === option.value && <Check className="w-4 h-4 text-green-600" />}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
