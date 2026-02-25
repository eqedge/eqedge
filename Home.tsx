import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Calculator, Zap, Users } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calculator className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-900">EquationEdge</h1>
          </div>
          <div className="flex gap-4 items-center">
            <a href="#lessons" className="text-slate-600 hover:text-slate-900 font-medium">Lessons</a>
            <a href="#practice" className="text-slate-600 hover:text-slate-900 font-medium">Practice</a>
            <a href="#about" className="text-slate-600 hover:text-slate-900 font-medium">About</a>
            {user ? (
              <Button variant="outline" onClick={() => setLocation("/dashboard")}>Dashboard</Button>
            ) : (
              <Button className="bg-blue-600 hover:bg-blue-700">Sign In</Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-slate-900 mb-6">Master Your Math Skills</h2>
        <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
          Learn mathematics from basic arithmetic to advanced calculus with interactive lessons, 
          practice problems, and expert guidance.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
            Get Started
          </Button>
          <Button size="lg" variant="outline" className="px-8">
            Learn More
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-slate-900 mb-12 text-center">Why Choose EquationEdge?</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <BookOpen className="w-8 h-8 text-blue-600 mb-2" />
                <CardTitle>Comprehensive Lessons</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Structured curriculum covering all math topics from basics to advanced.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Calculator className="w-8 h-8 text-green-600 mb-2" />
                <CardTitle>Practice Problems</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Thousands of problems with instant feedback and detailed solutions.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Zap className="w-8 h-8 text-yellow-600 mb-2" />
                <CardTitle>Instant Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Get immediate results and explanations for every problem you solve.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Users className="w-8 h-8 text-purple-600 mb-2" />
                <CardTitle>Expert Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Learn from experienced math educators and tutors.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Lessons Section */}
      <section id="lessons" className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-slate-900 mb-12 text-center">Our Lessons</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Algebra", desc: "Master equations, polynomials, and functions" },
            { title: "Geometry", desc: "Explore shapes, proofs, and spatial reasoning" },
            { title: "Calculus", desc: "Understand limits, derivatives, and integrals" },
            { title: "Statistics", desc: "Learn data analysis and probability" },
            { title: "Trigonometry", desc: "Master angles, waves, and triangles" },
            { title: "Pre-Calculus", desc: "Prepare for advanced mathematics" },
          ].map((lesson, i) => (
            <Card key={i} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle>{lesson.title}</CardTitle>
                <CardDescription>{lesson.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">View Lessons</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Practice Section */}
      <section id="practice" className="bg-blue-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-slate-900 mb-6">Practice Makes Perfect</h3>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Strengthen your skills with our extensive collection of practice problems. 
            Each problem includes step-by-step solutions and detailed explanations.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
            Start Practicing
          </Button>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-slate-900 mb-6">About EquationEdge</h3>
        <div className="max-w-3xl">
          <p className="text-lg text-slate-600 mb-4">
            EquationEdge is a comprehensive online math tutoring platform designed to help students 
            of all levels master mathematics. Our mission is to make quality math education accessible 
            to everyone.
          </p>
          <p className="text-lg text-slate-600 mb-4">
            Founded in 2024, we've helped thousands of students improve their math skills through 
            interactive lessons, personalized practice, and expert guidance.
          </p>
          <p className="text-lg text-slate-600">
            Our team of experienced educators and mathematicians are committed to creating engaging, 
            effective learning experiences that help students build confidence and achieve their goals.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-bold mb-4">EquationEdge</h4>
              <p className="text-slate-400">Master your math skills with our comprehensive platform.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Lessons</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white">Algebra</a></li>
                <li><a href="#" className="hover:text-white">Geometry</a></li>
                <li><a href="#" className="hover:text-white">Calculus</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white">Privacy</a></li>
                <li><a href="#" className="hover:text-white">Terms</a></li>
                <li><a href="#" className="hover:text-white">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-8 text-center text-slate-400">
            <p>&copy; 2024 EquationEdge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
