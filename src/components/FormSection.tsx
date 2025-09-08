import React from "react";
import type {FormSectionProps} from "../types";

export const FormSection: React.FC<FormSectionProps> = ({ title, children, className = "" }) => (
    <div className={`bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-200 shadow-sm ${className} placeholder-pink-400 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-rose-400 transition-colors`}>
        <h3 className="text-2xl font-['Allura'] font-medium text-rose-600 mb-4">{title}</h3>
        {children}
    </div>
);