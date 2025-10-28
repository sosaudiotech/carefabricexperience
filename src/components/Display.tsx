import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { strapiService, ProductAttributes, StatDataAttributes } from '../services/strapiService';
import SectionRenderer from './SectionRenderer';
import './Display.css';

interface DisplayState {
    buttonId: string | null;
    subcategoryId: string | null;
    timestamp: number | null;
}

export default function Display() {
    const [state, setState] = useState<DisplayState>({
        buttonId: null,
        subcategoryId: null,
        timestamp: null
    });
    const [socket, setSocket] = useState<Socket | null>(null);
    const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
    
    // Strapi data
    const [product, setProduct] = useState<ProductAttributes | null>(null);
    const [liveStats, setLiveStats] = useState<StatDataAttributes[]>([]);
    const [loading, setLoading] = useState(false);
    const [strapiConnected, setStrapiConnected] = useState(false);

    // Check Strapi connection on mount
    useEffect(() => {
        strapiService.healthCheck().then(isHealthy => {
            setStrapiConnected(isHealthy);
            if (!isHealthy) {
                console.warn('Strapi is not accessible. Using fallback content.');
            }
        });
    }, []);

    // WebSocket connection
    useEffect(() => {
        const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:3001';
        const newSocket = io(serverUrl);

        newSocket.on('connect', () => {
            console.log('Connected to server');
            setConnectionStatus('connected');
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from server');
            setConnectionStatus('disconnected');
        });

        newSocket.on('state-update', (newState: DisplayState) => {
            console.log('State update received:', newState);
            setState(newState);
        });

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    // Load product data when buttonId changes
    useEffect(() => {
        if (!state.buttonId) {
            setProduct(null);
            setLiveStats([]);
            return;
        }

        loadProductData(state.buttonId);
    }, [state.buttonId]);

    // Set up real-time stats subscription
    useEffect(() => {
        if (!product?.realtimeConfig?.enabled) return;

        const unsubscribe = strapiService.subscribeToUpdates(
            product.productId,
            (stats) => {
                console.log('Live stats updated:', stats);
                setLiveStats(stats);
            }
        );

        return () => {
            unsubscribe.then(cleanup => cleanup());
        };
    }, [product]);

    const loadProductData = async (productId: string) => {
        setLoading(true);
        try {
            const productData = await strapiService.getProduct(productId);
            
            if (productData) {
                console.log('Loaded product from Strapi:', productData);
                setProduct(productData);
                
                // Load initial stats if realtime is enabled
                if (productData.realtimeConfig?.enabled) {
                    const stats = await strapiService.getLiveStats(productId);
                    setLiveStats(stats);
                }
            } else {
                console.warn(`Product ${productId} not found in Strapi, using fallback`);
                setProduct(createFallbackProduct(productId));
            }
        } catch (error) {
            console.error('Error loading product:', error);
            setProduct(createFallbackProduct(productId));
        } finally {
            setLoading(false);
        }
    };

    // Fallback product for when Strapi is not available
    const createFallbackProduct = (productId: string): ProductAttributes => ({
        productId,
        title: productId,
        tagline: 'Healthcare Solution',
        description: 'This product has not been configured in Strapi yet. Please add content in the CMS.',
        color: '#2563eb',
        template: 'standard',
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sections: [
            {
                id: 1,
                sectionType: 'text',
                title: 'Getting Started',
                content: {
                    text: 'To customize this content, log into Strapi CMS and create a product entry.'
                }
            }
        ]
    });

    if (loading) {
        return (
            <div className="display-container">
                <div className="display-content">
                    <div className="loading-display">
                        <div className="spinner"></div>
                        <p>Loading product data...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="display-container">
            {/* Connection status indicators */}
            <div className="connection-indicators">
                <div className={`connection-status ${connectionStatus}`} title="WebSocket Server">
                    <div className="status-dot"></div>
                    <span>Server: {connectionStatus}</span>
                </div>
                <div className={`connection-status ${strapiConnected ? 'connected' : 'disconnected'}`} title="Strapi CMS">
                    <div className="status-dot"></div>
                    <span>CMS: {strapiConnected ? 'connected' : 'disconnected'}</span>
                </div>
            </div>

            {/* Main content area */}
            <div className="display-content">
                {product ? (
                    <div 
                        className="product-display"
                        style={{ borderColor: product.color }}
                    >
                        {/* Product Header */}
                        <div className="product-header">
                            <div 
                                className="product-icon"
                                style={{ backgroundColor: product.color }}
                            >
                                {product.title.charAt(0).toUpperCase()}
                            </div>
                            <div className="product-title-group">
                                <h1 style={{ color: product.color }}>
                                    {product.title}
                                </h1>
                                {product.tagline && (
                                    <p className="product-tagline">{product.tagline}</p>
                                )}
                            </div>
                        </div>

                        {/* Hero Media */}
                        {product.heroMedia && (
                            <div className="product-hero">
                                {product.heroMedia.mime?.startsWith('video/') ? (
                                    <video 
                                        src={product.heroMedia.url} 
                                        autoPlay 
                                        loop 
                                        muted
                                        className="hero-video"
                                    />
                                ) : (
                                    <img 
                                        src={product.heroMedia.url} 
                                        alt={product.heroMedia.alternativeText || product.title}
                                        className="hero-image"
                                    />
                                )}
                            </div>
                        )}

                        {/* Description */}
                        {product.description && (
                            <div className="product-description">
                                <p>{product.description}</p>
                            </div>
                        )}

                        {/* Dynamic Sections */}
                        {product.sections && product.sections.length > 0 && (
                            <div className="product-sections">
                                {product.sections
                                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                                    .map((section, index) => (
                                        <SectionRenderer 
                                            key={section.id || index}
                                            section={section}
                                            liveStats={liveStats}
                                            productColor={product.color}
                                        />
                                    ))
                                }
                            </div>
                        )}

                        {/* Metadata Footer */}
                        <div className="product-footer">
                            <div className="footer-meta">
                                <span className="meta-label">Category:</span>
                                <span className="meta-value">{state.subcategoryId}</span>
                            </div>
                            <div className="footer-meta">
                                <span className="meta-label">Product ID:</span>
                                <span className="meta-value">{product.productId}</span>
                            </div>
                            {liveStats.length > 0 && (
                                <div className="footer-meta">
                                    <span className="meta-label">Last Update:</span>
                                    <span className="meta-value">
                                        {new Date(liveStats[0].timestamp).toLocaleTimeString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="idle-display">
                        <div className="idle-content">
                            <div className="idle-logo">
                                <div className="logo-circle"></div>
                            </div>
                            <h2>Care Fabric Experience</h2>
                            <p>Waiting for product selection...</p>
                            {!strapiConnected && (
                                <p className="warning-text">
                                    ⚠️ Strapi CMS is not connected. Start Strapi with: <code>cd cms && npm run develop</code>
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
