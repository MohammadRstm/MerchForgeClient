import Footer from "../Footer/Footer";
import Hero from "./components/Hero/Hero";
import "./Home.css";

const Home = () => {
    return (
        <>
                <Hero />
            <main className="home">

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