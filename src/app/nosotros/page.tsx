import { Metadata } from "next";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "Nosotros | CS4B Digital Business",
  description: "Conoce más sobre CS4B Digital Business - Consultoría estratégica para la transformación digital de tu empresa en Perú.",
};

export default function NosotrosPage() {
  return <AboutContent />;
}