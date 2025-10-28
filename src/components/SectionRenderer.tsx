import React from 'react';
import { ContentSection, StatDataAttributes } from '../services/strapiService';
import './SectionRenderer.css';

interface SectionRendererProps {
    section: ContentSection;
    liveStats?: StatDataAttributes[];
    productColor?: string;
}

export default function SectionRenderer({ section, liveStats = [], productColor = '#2563eb' }: SectionRendererProps) {
    const layoutClass = section.layout ? `layout-${section.layout}` : 'layout-full';

    switch (section.sectionType) {
        case 'features':
            return <FeaturesSection section={section} layoutClass={layoutClass} productColor={productColor} />;
        
        case 'stats':
            return <StatsSection section={section} layoutClass={layoutClass} liveStats={liveStats} productColor={productColor} />;
        
        case 'video':
            return <VideoSection section={section} layoutClass={layoutClass} />;
        
        case 'gallery':
            return <GallerySection section={section} layoutClass={layoutClass} />;
        
        case 'text':
            return <TextSection section={section} layoutClass={layoutClass} />;
        
        case 'custom':
            return <CustomSection section={section} layoutClass={layoutClass} />;
        
        default:
            return null;
    }
}

// Features Section Component
function FeaturesSection({ section, layoutClass, productColor }: any) {
    const features = section.content?.items || section.content?.features || [];

    return (
        <div className={`section features-section ${layoutClass}`}>
            {section.title && <h3 className="section-title">{section.title}</h3>}
            <div className="features-grid">
                {features.map((feature: any, index: number) => (
                    <div key={index} className="feature-item">
                        <div className="feature-icon" style={{ backgroundColor: productColor }}>
                            ✓
                        </div>
                        <div className="feature-content">
                            {typeof feature === 'string' ? (
                                <p>{feature}</p>
                            ) : (
                                <>
                                    {feature.title && <h4>{feature.title}</h4>}
                                    {feature.description && <p>{feature.description}</p>}
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Stats Section Component
function StatsSection({ section, layoutClass, liveStats, productColor }: any) {
    // Merge static stats with live stats
    const staticStats = section.content?.metrics || section.content?.stats || [];
    
    // Create a map of live stats by metric name
    const liveStatsMap = new Map(
        liveStats.map((stat: StatDataAttributes) => [stat.metric, stat])
    );

    // Merge: use live stats if available, otherwise use static
    const displayStats = staticStats.map((stat: any) => {
        const liveStat = liveStatsMap.get(stat.metric || stat.label);
        if (liveStat) {
            return {
                ...stat,
                value: liveStat.value,
                trend: liveStat.trend,
                isLive: true
            };
        }
        return { ...stat, isLive: false };
    });

    return (
        <div className={`section stats-section ${layoutClass}`}>
            {section.title && <h3 className="section-title">{section.title}</h3>}
            <div className="stats-grid">
                {displayStats.map((stat: any, index: number) => (
                    <div key={index} className="stat-item">
                        {stat.isLive && <div className="live-indicator" title="Live data">●</div>}
                        <div className="stat-value" style={{ color: productColor }}>
                            {stat.value}
                        </div>
                        <div className="stat-label">{stat.label || stat.metric}</div>
                        {stat.trend && (
                            <div className={`stat-trend ${stat.trend.startsWith('+') ? 'positive' : 'negative'}`}>
                                {stat.trend}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// Video Section Component
function VideoSection({ section, layoutClass }: any) {
    const videoUrl = section.content?.url || section.media?.url;
    const autoplay = section.content?.autoplay !== false;
    const loop = section.content?.loop !== false;

    if (!videoUrl) return null;

    return (
        <div className={`section video-section ${layoutClass}`}>
            {section.title && <h3 className="section-title">{section.title}</h3>}
            <div className="video-container">
                <video 
                    src={videoUrl}
                    controls
                    autoPlay={autoplay}
                    loop={loop}
                    muted={autoplay} // Mute if autoplay for browser compatibility
                    className="section-video"
                >
                    Your browser does not support the video tag.
                </video>
            </div>
        </div>
    );
}

// Gallery Section Component
function GallerySection({ section, layoutClass }: any) {
    const images = section.media || section.content?.images || [];

    if (images.length === 0) return null;

    return (
        <div className={`section gallery-section ${layoutClass}`}>
            {section.title && <h3 className="section-title">{section.title}</h3>}
            <div className="gallery-grid">
                {images.map((image: any, index: number) => (
                    <div key={index} className="gallery-item">
                        <img 
                            src={image.url} 
                            alt={image.alternativeText || `Gallery image ${index + 1}`}
                            className="gallery-image"
                        />
                        {image.caption && (
                            <p className="gallery-caption">{image.caption}</p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

// Text Section Component
function TextSection({ section, layoutClass }: any) {
    const text = section.content?.text || section.content;

    return (
        <div className={`section text-section ${layoutClass}`}>
            {section.title && <h3 className="section-title">{section.title}</h3>}
            <div className="text-content">
                {typeof text === 'string' ? (
                    <p>{text}</p>
                ) : (
                    <div dangerouslySetInnerHTML={{ __html: text }} />
                )}
            </div>
        </div>
    );
}

// Custom Section Component (for flexible JSON content)
function CustomSection({ section, layoutClass }: any) {
    return (
        <div className={`section custom-section ${layoutClass}`}>
            {section.title && <h3 className="section-title">{section.title}</h3>}
            <div className="custom-content">
                <pre>{JSON.stringify(section.content, null, 2)}</pre>
            </div>
        </div>
    );
}
