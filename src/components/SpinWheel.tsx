import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import "./SpinWheel.css";
import CareFabric from "./svg/CareFabric.svg";

/**
 * SpinWheel Component
 * Categories orbit around the wheel while staying upright
 * Features detent mechanism at category centers for stable positioning
 * Lives inside unified 800x800px container
 *
 * Props:
 *  - onSelect: (categoryId: string) => void
 */
export default function SpinWheel({ onSelect }: { onSelect?: (id: string) => void }) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const objectRef = useRef<HTMLObjectElement | null>(null);
    const [svgDoc, setSvgDoc] = useState<Document | null>(null);
    const rotation = useMotionValue(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startAngle, setStartAngle] = useState(0);
    const [velocity, setVelocity] = useState(0);
    const [lastTime, setLastTime] = useState<number | null>(null);
    const [wheelCenter, setWheelCenter] = useState<{ x: number; y: number } | null>(null);
    const [categoryPositions, setCategoryPositions] = useState<Map<string, { x: number; y: number; angle: number; radius: number }>>(new Map());
    const [isInDetent, setIsInDetent] = useState(false);
    const [dragStartRotation, setDragStartRotation] = useState(0);

    // Detent configuration
    const DETENT_THRESHOLD = 15; // degrees - how close to snap
    const DETENT_RESISTANCE = 0.4; // multiplier for resistance when in detent
    const MIN_VELOCITY_TO_BREAK = 0.3; // minimum velocity needed to break from detent
    const SNAP_VELOCITY = 15; // velocity for snap animation

    const handleLoad = () => {
        if (objectRef.current) {
            const doc = objectRef.current.contentDocument;
            setSvgDoc(doc);
            
            // Calculate wheel center and initial category positions
            if (doc) {
                const wheel = doc.getElementById("CareWheel") as SVGGraphicsElement | null;
                if (wheel) {
                    const bbox = wheel.getBBox();
                    const center = {
                        x: bbox.x + bbox.width / 2,
                        y: bbox.y + bbox.height / 2,
                    };
                    setWheelCenter(center);

                    // Store initial positions and angles of categories
                    const icons = [
                        "CareRecord",
                        "PlexusServices",
                        "DataSolutions",
                        "CareGuidanceSolutions",
                        "WorkForceManagement",
                        "PopulationHealthManagement",
                        "CareAdministration",
                    ];

                    const positions = new Map();
                    icons.forEach((id) => {
                        const el = doc.getElementById(id) as SVGGraphicsElement | null;
                        if (!el) return;
                        const bbox = el.getBBox();
                        const cx = bbox.x + bbox.width / 2;
                        const cy = bbox.y + bbox.height / 2;
                        const angle = Math.atan2(cy - center.y, cx - center.x);
                        const radius = Math.sqrt(Math.pow(cx - center.x, 2) + Math.pow(cy - center.y, 2));
                        
                        positions.set(id, {
                            x: cx,
                            y: cy,
                            angle: angle,
                            radius: radius,
                        });
                    });
                    setCategoryPositions(positions);
                }
            }
        }
    };

    // Find nearest category and check if we're in detent range
    const getNearestCategory = (currentRotation: number): { id: string | null; distance: number; targetRotation: number } => {
        if (categoryPositions.size === 0) return { id: null, distance: Infinity, targetRotation: 0 };
        
        let closestId: string | null = null;
        let minDiff = Infinity;
        let targetRot = 0;
        const currentRotationRad = (currentRotation * Math.PI) / 180;

        categoryPositions.forEach((pos, id) => {
            // Calculate where this category is now
            const newAngle = pos.angle + currentRotationRad;
            // Target is at top (270 degrees or -90 degrees from right)
            const targetAngle = -Math.PI / 2;
            
            // Calculate the rotation needed to bring this category to top
            let rotationNeeded = (targetAngle - pos.angle) * 180 / Math.PI;
            
            // Find the difference from current rotation
            let diff = rotationNeeded - currentRotation;
            
            // Normalize to -180 to 180
            while (diff > 180) diff -= 360;
            while (diff < -180) diff += 360;
            
            const absDiff = Math.abs(diff);
            if (absDiff < minDiff) {
                minDiff = absDiff;
                closestId = id;
                targetRot = currentRotation + diff;
            }
        });

        return { 
            id: closestId, 
            distance: minDiff,
            targetRotation: targetRot
        };
    };

    // Handle drag start
    const handlePointerDown = (e: React.PointerEvent) => {
        setIsDragging(true);
        setLastTime(Date.now());
        setStartAngle(getAngle(e));
        setDragStartRotation(rotation.get());
        
        // Check if we're starting in a detent
        const nearest = getNearestCategory(rotation.get());
        setIsInDetent(nearest.distance < DETENT_THRESHOLD);
    };

    // Handle drag move with detent resistance
    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging || !containerRef.current) return;
        const currentAngle = getAngle(e);
        let delta = currentAngle - startAngle;
        const now = Date.now();

        const timeDelta = now - (lastTime || now);
        const speed = delta / (timeDelta / 16);

        // Check if we're near a detent position
        const nearest = getNearestCategory(rotation.get() + delta);
        const inDetentZone = nearest.distance < DETENT_THRESHOLD;
        
        // Apply resistance if in detent zone
        if (inDetentZone) {
            // Calculate how much movement we've had since drag start
            const totalMovement = Math.abs(rotation.get() + delta - dragStartRotation);
            
            // Only apply resistance if we haven't built up enough movement
            if (totalMovement < DETENT_THRESHOLD) {
                delta *= DETENT_RESISTANCE;
                setIsInDetent(true);
            } else {
                setIsInDetent(false);
            }
        } else {
            setIsInDetent(false);
        }

        setVelocity(speed);
        setLastTime(now);
        rotation.set(rotation.get() + delta);
        setStartAngle(currentAngle);
    };

    // Handle drag release with detent snapping
    const handlePointerUp = () => {
        setIsDragging(false);
        
        const currentRotation = rotation.get();
        const nearest = getNearestCategory(currentRotation);
        
        // If we're close to a detent and velocity is low, snap to it
        if (nearest.distance < DETENT_THRESHOLD && Math.abs(velocity) < MIN_VELOCITY_TO_BREAK) {
            // Snap to nearest category
            animate(rotation, nearest.targetRotation, {
                type: "spring",
                stiffness: 300,
                damping: 30,
                velocity: SNAP_VELOCITY,
                onComplete: () => {
                    setIsInDetent(true);
                    if (onSelect && nearest.id) onSelect(nearest.id);
                },
            });
        } else {
            // Normal inertia spin
            animate(rotation, rotation.get() + velocity * 20, {
                type: "inertia",
                velocity: velocity * 10,
                power: 0.5,
                timeConstant: 300,
                restDelta: 0.01,
                modifyTarget: (target) => {
                    // After inertia, snap to nearest category
                    const finalNearest = getNearestCategory(target);
                    return finalNearest.targetRotation;
                },
                onUpdate: (latest) => rotation.set(latest),
                onComplete: () => {
                    const selected = detectSelectedCategory();
                    setIsInDetent(true);
                    if (onSelect && selected) onSelect(selected);
                },
            });
        }
    };

    // Get angle relative to wheel center
    const getAngle = (e: React.PointerEvent) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return 0;
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        return (Math.atan2(y, x) * 180) / Math.PI;
    };

    // Update wheel and category positions as rotation changes
    useEffect(() => {
        if (!svgDoc || !wheelCenter || categoryPositions.size === 0) return;
        
        const unsubscribe = rotation.on("change", (r) => {
            const radians = (r * Math.PI) / 180;
            
            // Rotate the wheel graphic
            const wheel = svgDoc.getElementById("CareWheel") as SVGGraphicsElement | null;
            if (wheel) {
                wheel.setAttribute("transform", `rotate(${r}, ${wheelCenter.x}, ${wheelCenter.y})`);
            }
            
            // Update category positions to orbit while staying upright
            categoryPositions.forEach((pos, id) => {
                const el = svgDoc.getElementById(id) as SVGGraphicsElement | null;
                if (!el) return;
                
                // Calculate new position after rotation
                const newAngle = pos.angle + radians;
                const newX = wheelCenter.x + pos.radius * Math.cos(newAngle);
                const newY = wheelCenter.y + pos.radius * Math.sin(newAngle);
                
                // Translate to new position (keeping upright)
                const dx = newX - pos.x;
                const dy = newY - pos.y;
                el.setAttribute("transform", `translate(${dx}, ${dy})`);
            });
        });

        return () => unsubscribe();
    }, [rotation, svgDoc, wheelCenter, categoryPositions]);

    // Detect which category is "at top"
    const detectSelectedCategory = (): string | null => {
        if (!svgDoc || !wheelCenter || categoryPositions.size === 0) return null;
        
        let closestId: string | null = null;
        let minDiff = Infinity;
        const currentRotation = (rotation.get() * Math.PI) / 180;

        categoryPositions.forEach((pos, id) => {
            const newAngle = pos.angle + currentRotation;
            // Normalize angle to check if it's at the top (270 degrees or -90 degrees)
            let normalizedAngle = ((newAngle * 180 / Math.PI) + 90) % 360;
            if (normalizedAngle < 0) normalizedAngle += 360;
            
            const diff = Math.min(normalizedAngle, 360 - normalizedAngle);
            if (diff < minDiff) {
                minDiff = diff;
                closestId = id;
            }
        });

        return closestId;
    };

    return (
        <div
            ref={containerRef}
            className="spinwheel-container"
            style={{
                position: "relative",
                width: "100%",
                height: "100%",
                touchAction: "none",
                userSelect: "none",
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
        >
            <object
                ref={objectRef}
                data={CareFabric}
                type="image/svg+xml"
                onLoad={handleLoad}
                style={{
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                }}
            />
        </div>
    );
}
