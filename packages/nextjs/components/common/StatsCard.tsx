"use client";

import React from "react";
import { StatsCardProps } from "~~/types";

const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon,
    color,
    trend
}) => {
      const getColorClasses = (color: string) => {
    switch (color) {
      case "green":
        return "bg-brand-primary/10 text-brand-primary";
      case "blue":
        return "bg-brand-secondary/10 text-brand-secondary";
      case "purple":
        return "bg-brand-accent/10 text-brand-accent";
      case "red":
        return "bg-brand-error/10 text-brand-error";
      case "yellow":
        return "bg-brand-warning/10 text-brand-warning";
      case "gray":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

    const getTrendIcon = (isPositive: boolean) => {
        return isPositive ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
        ) : (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
        );
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center">
                <div className={`p-2 rounded-lg ${getColorClasses(color)}`}>
                    {icon}
                </div>
                <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <div className="flex items-center gap-2">
                        <p className="text-2xl font-bold text-gray-900">{value}</p>
                        {trend && (
                            <div className={`flex items-center gap-1 text-sm ${trend.isPositive ? "text-green-600" : "text-red-600"
                                }`}>
                                {getTrendIcon(trend.isPositive)}
                                <span>{Math.abs(trend.value)}%</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
