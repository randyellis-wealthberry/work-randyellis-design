import {
  GlowEffectCardBackground,
  GlowEffectHeroTest,
} from "@/components/test/glow-test";
import { GlowingHeroImage } from "@/components/ui/glowing-hero-image";

export default function TestGlowPage() {
  return (
    <div className="min-h-screen space-y-12 bg-gray-950 p-8">
      <div className="text-center">
        <h1 className="mb-8 text-3xl font-bold text-white">
          Glow Effect Tests
        </h1>
      </div>

      {/* Original Card Test */}
      <div className="flex flex-col items-center space-y-4">
        <h2 className="text-xl font-semibold text-white">
          Card Background Test
        </h2>
        <GlowEffectCardBackground />
      </div>

      {/* Hero Test with Gradient */}
      <div className="space-y-4">
        <h2 className="text-center text-xl font-semibold text-white">
          Hero Test (Gradient)
        </h2>
        <GlowEffectHeroTest />
      </div>

      {/* Hero Test with Real Image */}
      <div className="space-y-4">
        <h2 className="text-center text-xl font-semibold text-white">
          Hero Test (Real Image)
        </h2>
        <GlowingHeroImage
          src="/images/projects/metis/hero-banner-metis.jpg"
          alt="Test Hero Image"
          containerClassName="max-w-4xl"
        />
      </div>
    </div>
  );
}
