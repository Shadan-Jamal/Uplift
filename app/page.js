import Hero from "../components/Hero";
// import About from "@/components/About";
import Faculty from "../components/Faculty";
import Events from "../components/Events";
import Affirmation from "../components/Affirmation";

export default function Home() {
  return (
    <section>
      {/* <Affirmation /> */}
      <Hero />
      <Events />
      <Faculty />
    </section>
  );
}
