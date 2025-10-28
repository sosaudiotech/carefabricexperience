import React, { useRef, useState, useEffect } from "react";
import "./SubsectionView.css";

// Import subsection SVGs
import CareRecords_enterprise from "./svg/subSections/CareRecords_enterprise.svg";
import CareRecords_specialtyPractices from "./svg/subSections/CareRecords_specialtyPractices.svg";
import subsectionUnfilledBox from "./svg/subSections/subsectionUnfilledBox.svg";

// Map of category -> subcategory -> SVG path
const SUBSECTION_MAP: Record<string, Record<string, string>> = {
    CareRecord: {
        Enterprise: CareRecords_enterprise,
        SpecialtyPractices: CareRecords_specialtyPractices,
    },
};

// Map of subcategory -> clickable item IDs
const CLICKABLE_ITEMS: Record<string, string[]> = {
    Enterprise: ["myAvatar", "myEvolve", "myUnity", "myInisght", "myVRS"],
    SpecialtyPractices: ["addictionTreatment", "theraOffice", "gehriMed"],
};

interface SubsectionViewProps {
    categoryId: string;
    subcategoryId: string;
    onButtonClick?: (buttonId: string) => void;
    onBack?: () => void;
}

export default function SubsectionView({
    categoryId,
    subcategoryId,
    onButtonClick,
    onBack,
}: SubsectionViewProps) {
    const objectRef = useRef<HTMLObjectElement | null>(null);
    const [svgDoc, setSvgDoc] = useState<Document | null>(null);

    // Get the appropriate SVG path
    const svgPath = SUBSECTION_MAP[categoryId]?.[subcategoryId];

    const handleLoad = () => {
        if (objectRef.current) {
            const doc = objectRef.current.contentDocument;
            setSvgDoc(doc);
        }
    };

    // Setup click handlers for interactive elements
    useEffect(() => {
        if (!svgDoc || !onButtonClick) return;

        const clickableIds = CLICKABLE_ITEMS[subcategoryId] || [];
        const handlers: Array<{ element: SVGElement; handler: EventListener }> = [];

        clickableIds.forEach((id) => {
            const element = svgDoc.getElementById(id) as SVGElement | null;
            if (element) {
                // Add visual feedback
                element.style.cursor = "pointer";
                
                // Store original opacity
                const originalOpacity = element.style.opacity || "1";

                // Hover effect
                const handleMouseEnter = () => {
                    element.style.opacity = "0.7";
                };
                const handleMouseLeave = () => {
                    element.style.opacity = originalOpacity;
                };

                // Click handler
                const handleClick = () => {
                    onButtonClick(id);
                };

                element.addEventListener("mouseenter", handleMouseEnter);
                element.addEventListener("mouseleave", handleMouseLeave);
                element.addEventListener("click", handleClick);

                handlers.push({
                    element,
                    handler: handleClick,
                });
            }
        });

        // Cleanup
        return () => {
            handlers.forEach(({ element }) => {
                element.style.cursor = "";
                element.style.opacity = "";
            });
        };
    }, [svgDoc, subcategoryId, onButtonClick]);

    if (!svgPath) {
        return (
            <div className="subsection-container">
                <div className="subsection-error">
                    <p>Subsection not found: {categoryId} / {subcategoryId}</p>
                    {onBack && (
                        <button onClick={onBack} className="back-button">
                            ← Back to Wheel
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="subsection-container">
            {onBack && (
                <button onClick={onBack} className="back-button">
                    ← Back to Wheel
                </button>
            )}
            <object
                ref={objectRef}
                data={svgPath}
                type="image/svg+xml"
                onLoad={handleLoad}
                className="subsection-svg"
            />
        </div>
    );
}
