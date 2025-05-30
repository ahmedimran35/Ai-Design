
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { UploadCloud, SearchCode, Lightbulb, Palette, AlignHorizontalDistributeCenter, Eye, Wand2, CheckCircle, Star, Sparkles, Zap, Users, Layers, Brain } from "lucide-react"; // Added Brain
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center space-y-16 md:space-y-24 pb-16 overflow-x-hidden">
      {/* Hero Section */}
      <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-background via-muted/30 to-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text Content Column */}
            <div className="space-y-6 md:space-y-8 text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight">
                Transform Your Designs with
                <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-pink-500 animate-text-gradient">
                  AI Alchemy
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
                Upload your design, and let Design Alchemist unveil pathways to perfection. Get instant, actionable feedback to elevate your creative work.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" asChild className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <Link href="/signup">Get Started Free</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5">
                  <Link href="#how-it-works">Learn More</Link>
                </Button>
              </div>
            </div>

            {/* Insight Text Column */}
            <div className="relative w-full max-w-xl mx-auto lg:mx-0 p-6 md:p-8 bg-card/80 backdrop-blur-sm rounded-lg shadow-xl border border-border/30 group">
              <div className="flex items-center mb-4">
                <Brain className="h-10 w-10 text-primary mr-3 group-hover:animate-pulse" />
                <h2 className="text-2xl font-semibold text-primary">The Alchemist's Secret</h2>
              </div>
              <p className="text-base text-foreground/90 mb-4">
                Design Alchemist isn't just another feedback tool. It's your intelligent design partner, powered by cutting-edge generative AI. We delve deep into the core principles of design, analyzing:
              </p>
              <ul className="space-y-2 text-foreground/80 list-disc list-inside mb-6">
                <li><span className="font-medium text-accent/90">Clarity & Usability:</span> Ensuring your message is clear and interactions are intuitive.</li>
                <li><span className="font-medium text-accent/90">Aesthetic Harmony:</span> Checking for balance in color, typography, and layout.</li>
                <li><span className="font-medium text-accent/90">Accessibility Standards:</span> Helping you create designs that work for everyone.</li>
                <li><span className="font-medium text-accent/90">Consistency & Polish:</span> Identifying areas to refine for a professional finish.</li>
              </ul>
              <p className="text-base text-foreground/90">
                Our AI doesn't just point out flaws; it provides actionable, context-aware suggestions, empowering you to truly transform your creative visions into impactful realities.
              </p>
              <div className="absolute -top-3 -right-3 p-2 bg-accent/80 backdrop-blur-sm rounded-full shadow animate-ping group-hover:animate-none">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-5xl space-y-12 text-center">
        <div className="space-y-3">
          <span className="inline-block px-3 py-1 text-xs font-semibold uppercase bg-primary/10 text-primary rounded-full tracking-wider">Simple Steps</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How Design Alchemist Works</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Achieve design excellence in three straightforward steps. Our AI does the heavy lifting, so you can focus on creating.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: UploadCloud, title: "1. Upload Your Design", description: "Easily submit your design image (JPG, PNG, WebP). Our platform makes it simple to get started." },
            { icon: SearchCode, title: "2. AI-Powered Analysis", description: "Our intelligent system meticulously inspects for flaws and areas of improvement based on design principles." },
            { icon: Lightbulb, title: "3. Refine & Perfect", description: "Receive clear, actionable suggestions. Elevate your design to the next level with expert insights." },
          ].map((step, index) => (
            <Card key={index} className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-card/90 backdrop-blur-sm border border-border/30 group">
              <CardHeader className="items-center pt-8 pb-4">
                <div className="p-4 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full mb-4 border-2 border-primary/20 shadow-inner group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm px-2">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 w-full max-w-6xl space-y-12">
        <div className="space-y-3 text-center">
          <span className="inline-block px-3 py-1 text-xs font-semibold uppercase bg-accent/10 text-accent rounded-full tracking-wider">Core Benefits</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Unlock Your Design Superpowers</h2>
           <p className="text-muted-foreground max-w-2xl mx-auto">
            Leverage AI to enhance every aspect of your design, from aesthetics to usability.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Palette, title: "Color Harmony", description: "Ensure your color palette is cohesive, accessible, and effectively conveys your intended message." },
            { icon: AlignHorizontalDistributeCenter, title: "Layout Precision", description: "Fix alignment and spacing inconsistencies for a polished, professional look." },
            { icon: Eye, title: "Readability Boost", description: "Improve text legibility and contrast, ensuring a better user experience for everyone." },
            { icon: CheckCircle, title: "Hierarchy Clarity", description: "Guide user attention effectively by refining your design's visual structure and focal points." },
          ].map((feature, index) => (
            <Card key={index} className="shadow-md hover:shadow-lg transition-shadow duration-300 bg-card/90 backdrop-blur-sm border border-border/30 group p-1">
              <CardHeader className="pb-3">
                 <div className="p-3 bg-accent/10 rounded-lg mb-3 w-fit transition-colors duration-300 group-hover:bg-accent/20 border border-accent/20">
                  <feature.icon className="h-7 w-7 text-accent transition-transform duration-300 group-hover:scale-110" />
                </div>
                <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonial Section (Example) */}
      <section className="w-full py-12 md:py-20 bg-muted/40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl text-center space-y-8">
          <Zap className="h-12 w-12 text-primary mx-auto animate-pulse" />
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Loved by Designers</h2>
          <div className="relative">
            <blockquote className="text-xl italic text-foreground/80 p-6 bg-background rounded-lg shadow-xl border border-border/30">
              &quot;Design Alchemist transformed how I iterate on my UI mockups. The AI feedback is incredibly insightful and saves me hours!&quot;
            </blockquote>
            <p className="mt-4 text-md font-semibold text-primary">- Alex P., Lead UI/UX Designer</p>
          </div>
        </div>
      </section>


      {/* Final CTA Section */}
      <section className="w-full py-16 bg-gradient-to-r from-primary to-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 max-w-3xl">
          <Star className="h-12 w-12 text-yellow-400 mx-auto animate-bounce" />
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary-foreground">Ready to Elevate Your Designs?</h2>
          <p className="text-lg text-primary-foreground/90">
            Join Design Alchemist today and start transforming your creative visions into polished, professional realities. It's free to get started!
          </p>
          <Button size="lg" variant="secondary" asChild className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-lg py-3 px-8 bg-white text-primary hover:bg-white/90">
            <Link href="/signup">Sign Up Now - It's Free!</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
