import Footer from "../Footer/Footer";
import "./Home.css";

const Home = () => {
    return (
        <>
            <main className="home">
                <section className="hero">
                    <span className="hero__badge">React + TypeScript Starter</span>

                    <h1>Build something amazing.</h1>

                    <p>
                        A clean React starter template featuring authentication,
                        protected routes, React Query, reusable components, custom
                        hooks, and scalable project architecture.
                    </p>

                    <div className="hero__actions">
                        <button className="btn btn-primary">Get Started</button>
                        <button className="btn btn-secondary">Documentation</button>
                    </div>
                </section>

                <section className="features">
                    <div className="feature-card">
                        <h3>⚡ Fast</h3>
                        <p>Built with Vite for lightning-fast development.</p>
                    </div>

                    <div className="feature-card">
                        <h3>🧩 Reusable</h3>
                        <p>Generic components, hooks, layouts, and utilities.</p>
                    </div>

                    <div className="feature-card">
                        <h3>🔒 Production Ready</h3>
                        <p>
                            Authentication, route protection, validation, and error
                            handling included.
                        </p>
                    </div>
                </section>

            </main>
            <Footer />
        </>

    );
};

export default Home;