"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Bell,
    X,
    CheckCircle,
    AlertCircle,
    Heart,
    Recycle,
    ShoppingBag,
    Users,
    Award
} from "lucide-react";

interface Notification {
    id: string;
    type: "receipt" | "recycling" | "follow" | "achievement" | "system";
    title: string;
    message: string;
    time: string;
    unread: boolean;
    action?: {
        label: string;
        href: string;
    };
}

interface NotificationBellProps {
    notifications?: Notification[];
    onMarkAsRead?: (id: string) => void;
    onMarkAllAsRead?: () => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
    notifications = [],
    onMarkAsRead,
    onMarkAllAsRead
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [notificationsList, setNotificationsList] = useState<Notification[]>(notifications);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Mock notifications for demo
    const mockNotifications: Notification[] = [
        {
            id: "1",
            type: "receipt",
            title: "New Receipt Generated",
            message: "iPhone 15 Pro receipt #1234 has been minted successfully",
            time: "2 minutes ago",
            unread: true,
            action: { label: "View Receipt", href: "/dashboard" }
        },
        {
            id: "2",
            type: "recycling",
            title: "Recycling Reward Earned",
            message: "You earned 50 PMT tokens for recycling your old MacBook Pro",
            time: "1 hour ago",
            unread: true,
            action: { label: "View Rewards", href: "/rewards" }
        },
        {
            id: "3",
            type: "follow",
            title: "New Follower",
            message: "EcoRecycler started following you",
            time: "3 hours ago",
            unread: true,
            action: { label: "View Profile", href: "/profile" }
        },
        {
            id: "4",
            type: "achievement",
            title: "Achievement Unlocked",
            message: "You've reached the 'Green Warrior' level!",
            time: "1 day ago",
            unread: false,
            action: { label: "View Badge", href: "/achievements" }
        },
        {
            id: "5",
            type: "system",
            title: "System Update",
            message: "New features available in the marketplace",
            time: "2 days ago",
            unread: false
        }
    ];

    useEffect(() => {
        if (notifications.length === 0) {
            setNotificationsList(mockNotifications);
        }
    }, [notifications]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const unreadCount = notificationsList.filter(n => n.unread).length;

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case "receipt":
                return <ShoppingBag className="w-5 h-5 text-brand-primary" />;
            case "recycling":
                return <Recycle className="w-5 h-5 text-brand-secondary" />;
            case "follow":
                return <Users className="w-5 h-5 text-brand-accent" />;
            case "achievement":
                return <Award className="w-5 h-5 text-yellow-500" />;
            case "system":
                return <AlertCircle className="w-5 h-5 text-gray-500" />;
            default:
                return <Bell className="w-5 h-5 text-gray-500" />;
        }
    };

    const getNotificationColor = (type: string) => {
        switch (type) {
            case "receipt":
                return "bg-brand-primary/10 border-brand-primary/20";
            case "recycling":
                return "bg-brand-secondary/10 border-brand-secondary/20";
            case "follow":
                return "bg-brand-accent/10 border-brand-accent/20";
            case "achievement":
                return "bg-yellow-50 border-yellow-200";
            case "system":
                return "bg-gray-50 border-gray-200";
            default:
                return "bg-gray-50 border-gray-200";
        }
    };

    const handleMarkAsRead = (id: string) => {
        setNotificationsList(prev =>
            prev.map(notification =>
                notification.id === id
                    ? { ...notification, unread: false }
                    : notification
            )
        );
        onMarkAsRead?.(id);
    };

    const handleMarkAllAsRead = () => {
        setNotificationsList(prev =>
            prev.map(notification => ({ ...notification, unread: false }))
        );
        onMarkAllAsRead?.();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Notification Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-brand-primary/20 hover:bg-white hover:shadow-brand-primary transition-all duration-200 group"
            >
                <Bell className={`w-6 h-6 transition-colors ${isOpen ? "text-brand-primary" : "text-gray-600 group-hover:text-brand-primary"
                    }`} />

                {/* Unread Badge */}
                {unreadCount > 0 && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-brand-error text-white text-xs rounded-full flex items-center justify-center font-bold"
                    >
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </motion.div>
                )}
            </button>

            {/* Notification Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-96 bg-white/95 backdrop-blur-lg rounded-2xl shadow-brand-primary border border-brand-primary/20 overflow-hidden z-50"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-100">
                            <h3 className="font-bold text-gray-900">Notifications</h3>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllAsRead}
                                        className="text-sm text-brand-primary hover:text-brand-primary-dark font-medium"
                                    >
                                        Mark all read
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    <X className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-96 overflow-y-auto">
                            {notificationsList.length === 0 ? (
                                <div className="p-8 text-center">
                                    <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-500">No notifications yet</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {notificationsList.map((notification) => (
                                        <motion.div
                                            key={notification.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={`p-4 hover:bg-gray-50 transition-colors ${notification.unread ? "bg-brand-primary/5" : ""
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                {/* Icon */}
                                                <div className="flex-shrink-0 mt-1">
                                                    {getNotificationIcon(notification.type)}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <h4 className="font-medium text-gray-900 text-sm">
                                                                {notification.title}
                                                            </h4>
                                                            <p className="text-sm text-gray-600 mt-1">
                                                                {notification.message}
                                                            </p>
                                                            <p className="text-xs text-gray-400 mt-1">
                                                                {notification.time}
                                                            </p>
                                                        </div>

                                                        {/* Unread indicator */}
                                                        {notification.unread && (
                                                            <div className="w-2 h-2 bg-brand-primary rounded-full flex-shrink-0 mt-2" />
                                                        )}
                                                    </div>

                                                    {/* Action Button */}
                                                    {notification.action && (
                                                        <div className="mt-3">
                                                            <button
                                                                onClick={() => {
                                                                    handleMarkAsRead(notification.id);
                                                                    // Handle navigation
                                                                    console.log("Navigate to:", notification.action?.href);
                                                                }}
                                                                className="text-sm text-brand-primary hover:text-brand-primary-dark font-medium"
                                                            >
                                                                {notification.action.label} →
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Mark as read button */}
                                                {notification.unread && (
                                                    <button
                                                        onClick={() => handleMarkAsRead(notification.id)}
                                                        className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                                                        title="Mark as read"
                                                    >
                                                        <CheckCircle className="w-4 h-4 text-gray-400" />
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {notificationsList.length > 0 && (
                            <div className="p-4 border-t border-gray-100 bg-gray-50">
                                <button className="w-full text-center text-sm text-brand-primary hover:text-brand-primary-dark font-medium">
                                    View all notifications
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;
