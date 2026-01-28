import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ServiceCard from '../components/ServiceCard';
import Footer from '../components/Footer';
import '../index.css';

// This is the main page of the website
const LandingPage = () => {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />

            <Hero
                title={<><span style={{ color: 'var(--primary)' }}>LF</span> Collection</>}
                subtitle="Experience the epitome of Ethiopian hospitality. A curated selection of premium hotels and services."
                image="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            />

            <main style={{ flex: 1 }}>
                {/* About Section */}
                <section style={{ padding: '5rem 2rem', background: 'var(--bg-body)' }}>
                    <div className="container" style={{ textAlign: 'center', maxWidth: '800px' }}>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', fontFamily: 'var(--font-heading)' }}>Redefining Luxury</h2>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>
                            Welcome to the LF Collection, where every stay is a story waiting to be told. We bring together the finest accommodations,
                            exquisite dining, and world-class amenities to create unforgettable experiences in Ethiopia.
                            Whether you are here for business, leisure, or a special celebration, we promise perfection in every detail.
                        </p>
                    </div>
                </section>

                {/* Services Section */}
                <section style={{ padding: '5rem 2rem', background: 'rgba(255,255,255,0.02)' }}>
                    <div className="container">
                        <h2 style={{ textAlign: 'center', marginBottom: '4rem', fontSize: '2.5rem' }}>Our Services</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem' }}>
                            <ServiceCard
                                title="Luxury Accommodation"
                                description="Stay in meticulously designed rooms and suites that offer the perfect blend of comfort and elegance."
                                iconUrl="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            />
                            <ServiceCard
                                title="Fine Dining"
                                description="Savor culinary masterpieces crafted by our expert chefs using the freshest local and international ingredients."
                                iconUrl="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            />
                            <ServiceCard
                                title="Wellness & Spa"
                                description="Rejuvenate your mind and body with our comprehensive spa treatments and state-of-the-art fitness centers."
                                iconUrl="https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            />
                            <ServiceCard
                                title="Events & Meetings"
                                description="Host your events in our versatile venues, equipped with modern technology and supported by dedicated planning teams."
                                iconUrl="https://images.unsplash.com/photo-1505373630103-f21ee09d0739?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            />
                            <ServiceCard
                                title="Entertainment"
                                description="Enjoy world-class entertainment, from live music to cultural performances, right within our premises."
                                iconUrl="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            />
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section style={{ padding: '6rem 2rem', textAlign: 'center', background: 'linear-gradient(rgba(0,0,0,0.8), rgba(0,0,0,0.8)), url("https://images.unsplash.com/photo-1571896349842-6e5a51335005?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")', backgroundSize: 'cover', backgroundAttachment: 'fixed' }}>
                    <div className="container">
                        <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>Ready to Experience Excellence?</h2>
                        <p style={{ fontSize: '1.2rem', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
                            Explore our collection of top-rated hotels and find the perfect destination for your next journey.
                        </p>
                        <a href="/hotels" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', textDecoration: 'none', display: 'inline-block' }}>
                            Explore Our Hotels
                        </a>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
};

export default LandingPage;
