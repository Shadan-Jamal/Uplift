import Hero from "../components/HomePage/Hero";
import Faculty from "../components/HomePage/Faculty";
import Events from "../components/HomePage/Events";
import Services from "../components/HomePage/Services";
import AboutCollege from "../components/HomePage/AboutCollege";
import Footer from "../components/HomePage/Footer";
import FAQs from "../components/HomePage/FAQs";

export default function Home() {
  return (
    <section className="w-screen">
        <Hero />
        <AboutCollege />
        <Services />
        <Events />
        <Faculty />
        <FAQs />
        <Footer />
    </section>
  );
}
