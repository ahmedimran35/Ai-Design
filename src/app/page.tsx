
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UploadCloud, SearchCode, Lightbulb, Palette, AlignHorizontalDistributeCenter, Eye, Wand2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center space-y-16 md:space-y-24 py-8 md:py-12">
      {/* Hero Section */}
      <section className="text-center space-y-6 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
          Transform Your Designs with AI Insight
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground">
          Upload your design, and let Design Alchemist unveil pathways to perfection. Get instant, actionable feedback to elevate your creative work.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="shadow-lg hover:shadow-xl transition-shadow">
            <Link href="/signup">Get Started Free</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="shadow-sm hover:shadow-md transition-shadow">
            <Link href="#how-it-works">Learn More</Link>
          </Button>
        </div>
        <div className="mt-12 relative w-full max-w-2xl mx-auto aspect-video rounded-lg overflow-hidden shadow-2xl">
           <Image
            src="https://placehold.co/1200x675.png"
            alt="Abstract design representation"
            layout="fill"
            objectFit="cover"
            priority
            data-ai-hint="abstract design"
            className="bg-muted"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-accent/30 opacity-50"></div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="w-full max-w-5xl mx-auto space-y-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight">How Design Alchemist Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: UploadCloud, title: "1. Upload Your Design", description: "Easily submit your design image in common formats like JPG, PNG, or WebP." },
            { icon: SearchCode, title: "2. AI Analysis", description: "Our intelligent system meticulously inspects for flaws and areas of improvement." },
            { icon: Lightbulb, title: "3. Refine & Perfect", description: "Receive clear, actionable suggestions to elevate your design to the next level." },
          ].map((step, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow transform hover:-translate-y-1">
              <CardHeader className="items-center">
                <div className="p-3 bg-primary/10 rounded-full mb-3">
                  <step.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-5xl mx-auto space-y-10">
        <h2 className="text-3xl font-bold tracking-tight text-center">Unlock Your Design Superpowers</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {[
            { icon: Palette, title: "Color Palette Cohesion", description: "Ensure your colors work harmoniously and convey the right message." },
            { icon: AlignHorizontalDistributeCenter, title: "Alignment & Layout Precision", description: "Identify and fix inconsistencies in spacing and alignment for a polished look." },
            { icon: Eye, title: "Readability & Accessibility", description: "Improve text legibility and contrast for a better user experience for all." },
            { icon: Wand2, title: "Visual Hierarchy Clarity", description: "Guide your audience's attention effectively by refining your design's structure." },
          ].map((feature, index) => (
            <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/10 rounded-md">
                    <feature.icon className="h-6 w-6 text-accent" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="text-center space-y-6 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight">Ready to Elevate Your Designs?</h2>
        <p className="text-lg text-muted-foreground">
          Join Design Alchemist today and start transforming your creative visions into polished, professional realities.
        </p>
        <Button size="lg" asChild className="shadow-lg hover:shadow-xl transition-shadow">
          <Link href="/signup">Sign Up Now - It&apos;s Free!</Link>
        </Button>
      </section>
    </div>
  );
}
