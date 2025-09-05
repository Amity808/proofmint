"use client";

import React from "react";
import { GadgetStatus, StatusBadgeProps } from "~~/types";

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = "md" }) => {
      const getStatusConfig = (status: GadgetStatus) => {
    switch (status) {
      case GadgetStatus.Active:
        return {
          label: "Active",
          className: "status-success",
          icon: (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )
        };
      case GadgetStatus.Stolen:
        return {
          label: "Stolen",
          className: "status-error",
          icon: (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )
        };
      case GadgetStatus.Misplaced:
        return {
          label: "Misplaced",
          className: "status-warning",
          icon: (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" clipRule="evenodd" />
            </svg>
          )
        };
      case GadgetStatus.Recycled:
        return {
          label: "Recycled",
          className: "status-neutral",
          icon: (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 011.414-1.414L9 9.586V7a1 1 0 112 0v2.586l1.293-1.293a1 1 0 011.414 1.414z" clipRule="evenodd" />
            </svg>
          )
        };
      default:
        return {
          label: "Unknown",
          className: "status-neutral",
          icon: null
        };
    }
  };

    const getSizeClasses = (size: string) => {
        switch (size) {
            case "sm":
                return "px-2 py-1 text-xs";
            case "lg":
                return "px-4 py-2 text-sm";
            default:
                return "px-3 py-1 text-xs";
        }
    };

    const config = getStatusConfig(status);
    const sizeClasses = getSizeClasses(size);

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full border font-medium ${config.className} ${sizeClasses}`}
        >
            {config.icon}
            {config.label}
        </span>
    );
};

export default StatusBadge;
