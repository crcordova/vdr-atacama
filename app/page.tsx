import { isAuthenticated } from "@/lib/auth";
import { Hero } from "@/components/sections/Hero";
import { VideoSection } from "@/components/sections/VideoSection";
import { AccessGate } from "@/components/sections/AccessGate";
import { DataRoom } from "@/components/sections/DataRoom";

export default async function HomePage() {
  const authed = await isAuthenticated();

  return (
    <>
      {!authed && <Hero />}
      <VideoSection />
      {authed ? <DataRoom /> : <AccessGate />}
    </>
  );
}
