import Hero from "@/components/Hero";
import IntroSection from "@/components/IntroSection";
import DestinationsSection from "@/components/destinations/DestinationsSection";
import QuizSection from "@/components/quiz/QuizSection";
import BookingSection from "@/components/booking/BookingSection";

export default function Home() {
  return (
    <>
      <Hero />
      <IntroSection />
      <DestinationsSection />
      <QuizSection />
      <BookingSection />
    </>
  );
}
