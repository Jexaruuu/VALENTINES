// homepage/Menu.jsx
import Navigation from "../components/Navigation";
import Hero from "../components/Hero";
import Footer from "../components/Footer";


export default function Menu() {
    return (
        <div className="min-h-screen app-bg">
            <Navigation />
            <main className="flex-1">
                <Hero />
            </main>
            <Footer />
        </div>
    );
}
