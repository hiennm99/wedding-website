import React from "react";
import type {RadioButtonProps} from "../../types";

export const RadioButton: React.FC<RadioButtonProps> = ({ checked, onClick, label }) => (
    <div
        className={`flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border cursor-pointer hover:bg-pink-50 transition-all shadow-sm ${
            checked ? 'border-rose-400 bg-gradient-to-r from-pink-50 to-rose-50' : 'border-pink-100'
        }`}
        onClick={onClick}
    >
        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
            checked ? 'border-rose-400 bg-rose-400' : 'border-pink-300'
        }`}>
            {checked && <div className="w-2 h-2 bg-white rounded-full"></div>}
        </div>
        <span className={`text-sm ${checked ? 'text-rose-600' : 'text-pink-600'}`}>{label}</span>
    </div>
);