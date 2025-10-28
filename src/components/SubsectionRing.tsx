import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./SubsectionRing.css";

// Import individual product SVGs
import myAvatar from "./svg/products/CareRecord/myAvatar.svg";
import myEvolve from "./svg/products/CareRecord/myEvolve.svg";
import myUnity from "./svg/products/CareRecord/myUnity.svg";
import myInsight from "./svg/products/CareRecord/myInsight.svg";
import myVRS from "./svg/products/CareRecord/myVRS.svg";
import addictionTreatment from "./svg/products/CareRecord/addictionTreatment.svg";
import theraOffice from "./svg/products/CareRecord/theraOffice.svg";
import gehriMed from "./svg/products/CareRecord/gehriMed.svg";

import AdvisoryConsulting from "./svg/products/CareAdministration/AdvisoryConsulting.svg";
import alphaAnalytics from "./svg/products/CareAdministration/alphaAnalytics.svg"; 
import alphaCoding from "./svg/products/CareAdministration/alphaCoding.svg";
import alphaCollector from "./svg/products/CareAdministration/alphaCollector.svg"; 
import alphaVerify from "./svg/products/CareAdministration/alphaVerify.svg"; 
import backOfficeRevenueCycle from "./svg/products/CareAdministration/Back-OfficeRevenueCycle.svg"; 
import Benny from "./svg/products/CareAdministration/Benny.svg";
import CodingServices from "./svg/products/CareAdministration/CodingServices.svg";
import PreServiceRevenueCycle from "./svg/products/CareAdministration/PreServiceRevenueCycle.svg";
import RevConnect from "./svg/products/CareAdministration/RevConnect.svg";

import Bells from "./svg/products/CareGuidanceSolutions/Bells.svg";
import myHealthPointe from "./svg/products/CareGuidanceSolutions/myHealthPointe.svg";
import netsmartTelehealth from "./svg/products/CareGuidanceSolutions/netsmartTelehealth.svg";
import orderConnect from "./svg/products/CareGuidanceSolutions/orderConnect.svg";

import coreAnalytics from "./svg/products/DataSolutions/coreAnalytics.svg";
import dataPlatform from "./svg/products/DataSolutions/dataPlatform.svg";
import healthPivots from "./svg/products/DataSolutions/healthPivots.svg";
import kpiDashboard from "./svg/products/DataSolutions/kpiDashboard.svg";
import simpleAnalyzer from "./svg/products/DataSolutions/simpleAnalyzer.svg";
import simpleHomeHealth from "./svg/products/DataSolutions/simpleHomeHealth.svg";
import simpleHospice from "./svg/products/DataSolutions/simpleHospice.svg";
import simplePBJ from "./svg/products/DataSolutions/simplePBJ.svg";

import OneTeam from "./svg/products/PlexusServices/OneTeam.svg";
import plexusCloud from "./svg/products/PlexusServices/plexusCloud.svg";
import plexusConsulting from "./svg/products/PlexusServices/plexusConsulting.svg";

import careConnect from "./svg/products/PopulationHealthManagement/careConnect.svg";
import careConnectInbox from "./svg/products/PopulationHealthManagement/careConnectInbox.svg";
import careManager from "./svg/products/PopulationHealthManagement/careManager.svg";
import healthStatusMonitor from "./svg/products/PopulationHealthManagement/healthStatusMonitor.svg";
import higherPath from "./svg/products/PopulationHealthManagement/higherPath.svg";
import referralManager from "./svg/products/PopulationHealthManagement/referralManager.svg";

import careRouter from "./svg/products/WorkForceManagement/careRouter.svg";
import mobileCaregiver from "./svg/products/WorkForceManagement/mobileCaregiver.svg";

// Import arc guide
import subsectionUnfilledBox from "./svg/subSections/subsectionUnfilledBox.svg";

// Map product IDs to their individual SVG files
const PRODUCT_ICONS: Record<string, string> = {
    myAvatar, myEvolve, myUnity, myInsight, myVRS, addictionTreatment, theraOffice, gehriMed,
    AdvisoryConsulting, alphaAnalytics, alphaCoding, alphaCollector, alphaVerify, backOfficeRevenueCycle, Benny, 
    CodingServices, PreServiceRevenueCycle, RevConnect, Bells, myHealthPointe, netsmartTelehealth, orderConnect,
    coreAnalytics, dataPlatform, healthPivots, kpiDashboard, simpleAnalyzer, simpleHomeHealth, simpleHospice, simplePBJ,
    OneTeam, plexusCloud, plexusConsulting,
    careConnect, careConnectInbox, careManager, healthStatusMonitor, higherPath, referralManager, 
    careRouter, mobileCaregiver,
};

// Map of subcategory -> clickable item IDs
const CLICKABLE_ITEMS: Record<string, string[]> = {
    Enterprise: ["myAvatar", "myEvolve", "myUnity", "myInsight", "myVRS"],
    SpecialtyServices: ["addictionTreatment", "theraOffice", "gehriMed"],
    Technology: ["alphaAnalytics", "alphaCoding", "alphaCollector", "alphaVerify", "Benny", "RevConnect"],
    Services: ["AdvisoryConsulting", "CodingServices", "backOfficeRevenueCycle", "PreServiceRevenueCycle"],
    CareGuidanceSolutions: ["Bells", "myHealthPointe", "netsmartTelehealth", "orderConnect"],
    DataSolutions: ["coreAnalytics", "dataPlatform", "healthPivots", "kpiDashboard", "simpleAnalyzer", "simpleHomeHealth", "simpleHospice", "simplePBJ"],
    PlexusServices: ["OneTeam", "plexusCloud", "plexusConsulting"],
    PopulationHealthManagement: ["careConnect", "careConnectInbox", "careManager", "healthStatusMonitor", "higherPath", "referralManager"],
    WorkForceManagement: ["careRouter", "mobileCaregiver"]
};

interface SubsectionRingProps {
    categoryId: string;
    subcategories: string[];
    onButtonClick?: (buttonId: string, subcategoryId: string) => void;
}

interface SubsectionItem {
    id: string;
    subcategoryId: string;
    angle: number;
    iconPath: string;
}

// Fixed dimensions - 800x800px container
const CONTAINER_SIZE = 800;
const CENTER = CONTAINER_SIZE / 2; // 400px
const RING_RADIUS = 360; // pixels from center

export default function SubsectionRing({
    categoryId,
    subcategories,
    onButtonClick,
}: SubsectionRingProps) {
    const [subsectionItems, setSubsectionItems] = useState<SubsectionItem[]>([]);
    const [subcategoryDividers, setSubcategoryDividers] = useState<Array<{
        angle: number;
        label: string;
    }>>([]);
    const [subcategoryLabelPositions, setSubcategoryLabelPositions] = useState<Array<{
        angle: number;
        label: string;
    }>>([]);

    // Calculate positions for all product items across all subcategories
    useEffect(() => {
        const allItems: SubsectionItem[] = [];
        const dividers: Array<{ angle: number; label: string }> = [];
        const labelPositions: Array<{ angle: number; label: string }> = [];
        
        const arcStart = 180;
        const arcEnd = 360;
        const totalArc = arcEnd - arcStart;
        
        if (subcategories.length === 1) {
            // Single subcategory - use full arc
            const items = CLICKABLE_ITEMS[subcategories[0]] || [];
            const angleStep = items.length > 1 ? totalArc / (items.length - 1) : 0;
            
            items.forEach((id, index) => {
                allItems.push({
                    id,
                    subcategoryId: subcategories[0],
                    angle: arcStart + (angleStep * index),
                    iconPath: PRODUCT_ICONS[id] || "",
                });
            });
        } else {
            // Multiple subcategories - calculate proportional spacing with auto gaps
            const itemCounts = subcategories.map(sub => (CLICKABLE_ITEMS[sub] || []).length);
            const totalItems = itemCounts.reduce((sum, count) => sum + count, 0);
            
            const numGaps = subcategories.length -1;
            const gapMultiplier = 1;
            const baseSpacing = totalArc / ((totalItems - 1) + (numGaps * gapMultiplier));
            const sectionGap = gapMultiplier * baseSpacing;
            
            let currentAngle = arcStart;
            
            subcategories.forEach((subcategory, subIndex) => {
                const items = CLICKABLE_ITEMS[subcategory] || [];
                const itemCount = items.length;
                
                const arcPortion = (itemCount - 0.5) * baseSpacing;
                const subArcEnd = currentAngle + arcPortion;
                
                const angleStep = items.length > 1 ? baseSpacing : 0;
                
                items.forEach((id, itemIndex) => {
                    allItems.push({
                        id,
                        subcategoryId: subcategory,
                        angle: currentAngle + (angleStep * itemIndex),
                        iconPath: PRODUCT_ICONS[id] || "",
                    });
                });
                
                // Store label position at the center of this subcategory's arc
                labelPositions.push({
                    angle: currentAngle + (arcPortion / 2),
                    label: subcategory,
                });
                
                // Add divider at the end of each subcategory (except the last)
                if (subIndex < subcategories.length - 1) {
                    dividers.push({
                        angle: subArcEnd + (sectionGap / 2),
                        label: subcategory,
                    });
                }
                
                // Move to next subcategory's starting angle (add gap)
                currentAngle = subArcEnd + sectionGap;
            });
        }
        
        setSubsectionItems(allItems);
        setSubcategoryDividers(dividers);
        setSubcategoryLabelPositions(labelPositions);
    }, [subcategories]);

    const handleItemClick = (itemId: string, subcategoryId: string) => {
        if (onButtonClick) {
            onButtonClick(itemId, subcategoryId);
        }
    };

    // Convert angle and radius to pixel coordinates
    const getPixelPosition = (angle: number, radius: number) => {
        const angleRad = (angle * Math.PI) / 180;
        const x = CENTER + radius * Math.cos(angleRad);
        const y = CENTER + radius * Math.sin(angleRad);
        return { x, y };
    };

    return (
        <motion.div
            className="subsection-ring"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Subcategory dividers */}
            {subcategoryDividers.map((divider, index) => {
                const pos = getPixelPosition(divider.angle, RING_RADIUS);
                const rotation = divider.angle + 90;
                
                return (
                    <div
                        key={`divider-${index}`}
                        className="subcategory-divider"
                        style={{
                            display: "none",
                            left: `${pos.x}px`,
                            top: `${pos.y}px`,
                            transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                        }}
                    />
                );
            })}
            
            {/* Positioned subsection items with individual SVG icons */}
            {subsectionItems.map((item, index) => {
                const pos = getPixelPosition(item.angle, RING_RADIUS);
                
                return (
                    <motion.div
                        key={`${item.subcategoryId}-${item.id}`}
                        className="subsection-item"
                        style={{
                            left: `${pos.x}px`,
                            top: `${pos.y}px`,
                        }}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                        onClick={() => handleItemClick(item.id, item.subcategoryId)}
                    >
                        {/* Individual product icon */}
                        <div className="subsection-item-icon">
                            {item.iconPath ? (
                                <img 
                                    src={item.iconPath} 
                                    alt={item.id}
                                    className="product-icon"
                                />
                            ) : (
                                <div className="product-icon-placeholder">?</div>
                            )}
                        </div>
                    </motion.div>
                );
            })}
            
            {/* Subcategory labels */}
            {subcategoryLabelPositions.map((position) => {
                const labelRadius = 80; // Closer to wheel for labels
                const pos = getPixelPosition(position.angle, labelRadius);
                
                return (
                    <div
                        key={`label-${position.label}`}
                        className="subcategory-label"
                        style={{
                            display: "none",
                            left: `${pos.x}px`,
                            top: `${pos.y}px`,
                        }}
                    >
                        {position.label}
                    </div>
                );
            })}
        </motion.div>
    );
}
