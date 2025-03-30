import Hero from "../components/Hero";
// import About from "@/components/About";
import Faculty from "../components/Faculty";
import Events from "../components/Events";
import Affirmation from "../components/Affirmation";
import AboutCollege from "../components/AboutCollege";
import Footer from "../components/Footer";
import FAQs from "../components/FAQs";

export default function Home() {
  return (
    <section>
      {/* <Affirmation /> */}
        <Hero />
        <Events />
        <Faculty />
        <AboutCollege />
        <FAQs />
        <Footer />
    </section>
  );
}
