import React, { useState, useEffect } from "react";
import { io, Socket } from 'socket.io-client';
import SpinWheel from "./SpinWheel";
import SubsectionRing from "./SubsectionRing";
import "./CareExperience.css";

// Define which categories have multiple subcategories
const CATEGORY_SUBCATEGORIES: Record<string, string[]> = {
    CareRecord: ["Enterprise", "SpecialtyServices"],
    CareAdministration: ["Technology", "Services"],
};

export default function CareExperience() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');

    useEffect(() => {
        // Connect to the server
        const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:3001';
        const newSocket = io(serverUrl);

        newSocket.on('connect', () => {
            console.log('Remote control connected to server');
            setConnectionStatus('connected');
        });

        newSocket.on('disconnect', () => {
            console.log('Remote control disconnected from server');
            setConnectionStatus('disconnected');
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    // Handle when a category is selected from the wheel
    const handleCategorySelect = (categoryId: string) => {
        console.log("Category selected:", categoryId);
        setSelectedCategory(categoryId);
    };

    // Handle when a product button is clicked
    const handleButtonClick = (buttonId: string, subcategoryId: string) => {
        console.log(`Button clicked: ${buttonId} from ${subcategoryId}`);
        
        // Send to server via WebSocket
        if (socket && socket.connected) {
            socket.emit('button-press', {
                buttonId,
                subcategoryId
            });
        } else {
            console.warn('Socket not connected, cannot send button press');
            alert('Not connected to display server!');
        }
    };

    // Handle reset (close subsections)
    const handleReset = () => {
        setSelectedCategory(null);
        
        // Send reset to server
        if (socket && socket.connected) {
            socket.emit('reset');
        }
    };

    const hasSubsection = selectedCategory !== null;

    return (
        <div className="care-experience">
            {/* Connection status indicator */}
            <div className={`connection-indicator ${connectionStatus}`} title={`Server: ${connectionStatus}`}>
                <div className="indicator-dot"></div>
            </div>

            {/* Unified fixed-size container - 800x800px */}
            <div className={`unified-container ${hasSubsection ? 'has-subsection' : ''}`}>
                {/* Main wheel */}
                <div className="wheel-container">
                    <SpinWheel onSelect={handleCategorySelect} />
                    
                    {/* Center button to close subsections - only visible when shrunk */}
                    {hasSubsection && (
                        <button 
                            className="wheel-center-button"
                            onClick={handleReset}
                            title="Close and expand wheel"
                        >
                            <div className="center-icon">✕</div>
                        </button>
                    )}
                </div>
                
                {/* Show product ring with divided arc for multiple subcategories */}
                {selectedCategory && (
                    <SubsectionRing
                        categoryId={selectedCategory}
                        subcategories={CATEGORY_SUBCATEGORIES[selectedCategory] || [selectedCategory]}
                        onButtonClick={handleButtonClick}
                    />
                )}
            </div>
        </div>
    );
}
