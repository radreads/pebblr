"use client"

import { useState, FormEvent } from "react"
import { Bell, CheckCircle, Clock, Users, ArrowRight, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function LandingPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [isPulsing, setIsPulsing] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  
  const router = useRouter()
  const { signIn, signUp, error } = useAuth()

  // Login form state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Signup form state
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await signIn(loginEmail, loginPassword)
      setIsLoginOpen(false)
      router.push("/dashboard")
      toast.success("Successfully logged in!")
    } catch (error) {
      toast.error("Failed to log in. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await signUp(signupEmail, signupPassword)
      setIsSignupOpen(false)
      toast.success("Successfully signed up! Please check your email to verify your account.")
    } catch (error) {
      toast.error("Failed to sign up. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-noise">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2 font-semibold">
              <div className="size-8 rounded-full bg-cyan-700 flex items-center justify-center text-white">
                <Bell className="size-4" />
              </div>
              <span className="text-cyan-950 text-xl">Pebblr</span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="text-cyan-700 hover:text-cyan-900 hover:bg-gray-100"
                onClick={() => setIsLoginOpen(true)}
              >
                Log in
              </Button>
              <Button className="bg-cyan-700 hover:bg-cyan-800 text-white" onClick={() => setIsSignupOpen(true)}>
                Sign up
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-cyan-50 to-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2 space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-cyan-950 leading-tight">
                  Never forget to stay in touch with the people who matter
                </h1>
                <p className="text-xl text-cyan-700">
                  Pebblr helps you maintain meaningful relationships by reminding you when it's time to check in with
                  friends, family, and colleagues.
                </p>
                <div className="pt-4">
                  <Button
                    size="lg"
                    className="bg-[#EC3E72] hover:bg-[#F06292] text-white px-8 py-6 text-lg rounded-full"
                    onClick={() => setIsSignupOpen(true)}
                  >
                    Get started for free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
              <div className="lg:w-1/2">
                <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-200">
                  <img
                    src="/placeholder.svg?height=400&width=500"
                    alt="Pebblr app interface"
                    className="w-full rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-cyan-950 mb-12">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-cyan-50 rounded-lg p-6 text-center">
                <div className="mx-auto w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
                  <Clock className="h-8 w-8 text-cyan-700" />
                </div>
                <h3 className="text-xl font-semibold text-cyan-900 mb-2">Smart Reminders</h3>
                <p className="text-cyan-700">Never miss an important check-in with customizable reminder schedules.</p>
              </div>
              <div className="bg-cyan-50 rounded-lg p-6 text-center">
                <div className="mx-auto w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-cyan-700" />
                </div>
                <h3 className="text-xl font-semibold text-cyan-900 mb-2">Contact Management</h3>
                <p className="text-cyan-700">Organize your relationships and keep track of important details.</p>
              </div>
              <div className="bg-cyan-50 rounded-lg p-6 text-center">
                <div className="mx-auto w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mb-4">
                  <Gift className="h-8 w-8 text-cyan-700" />
                </div>
                <h3 className="text-xl font-semibold text-cyan-900 mb-2">Birthday Tracking</h3>
                <p className="text-cyan-700">Never forget a birthday with automatic birthday reminders.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-cyan-950 mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="relative">
                <div className="absolute top-0 left-0 -ml-4 mt-2 text-5xl font-bold text-cyan-200">1</div>
                <div className="bg-white rounded-lg p-6 shadow-sm relative z-10">
                  <h3 className="text-xl font-semibold text-cyan-900 mb-2">Add Your Contacts</h3>
                  <p className="text-cyan-700">Import or manually add the people you want to stay in touch with.</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute top-0 left-0 -ml-4 mt-2 text-5xl font-bold text-cyan-200">2</div>
                <div className="bg-white rounded-lg p-6 shadow-sm relative z-10">
                  <h3 className="text-xl font-semibold text-cyan-900 mb-2">Set Check-in Frequency</h3>
                  <p className="text-cyan-700">Choose how often you want to connect with each person.</p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute top-0 left-0 -ml-4 mt-2 text-5xl font-bold text-cyan-200">3</div>
                <div className="bg-white rounded-lg p-6 shadow-sm relative z-10">
                  <h3 className="text-xl font-semibold text-cyan-900 mb-2">Get Reminded</h3>
                  <p className="text-cyan-700">Receive timely notifications when it's time to reach out.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-cyan-950 mb-12">Why Choose Pebblr</h2>
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-cyan-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-cyan-900 mb-2">Strengthen Relationships</h3>
                    <p className="text-cyan-700">
                      Regular check-ins help build stronger, more meaningful connections with the people in your life.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-cyan-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-cyan-900 mb-2">Reduce Social Anxiety</h3>
                    <p className="text-cyan-700">Never worry about how long it's been since you last reached out.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-cyan-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-cyan-900 mb-2">Stay Organized</h3>
                    <p className="text-cyan-700">
                      Keep track of important details and conversation topics for each contact.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-cyan-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-cyan-900 mb-2">Never Miss Important Dates</h3>
                    <p className="text-cyan-700">
                      Birthday and anniversary reminders ensure you never forget a special occasion.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-cyan-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-cyan-900 mb-2">Customizable Frequencies</h3>
                    <p className="text-cyan-700">
                      Set different check-in schedules for different relationships based on their importance.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-6 w-6 text-cyan-700" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-cyan-900 mb-2">Cross-Platform Access</h3>
                    <p className="text-cyan-700">Access your contacts and reminders from any device, anywhere.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-cyan-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-cyan-950 mb-12">What Our Users Say</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-semibold text-cyan-900">Sarah J.</h4>
                    <p className="text-sm text-cyan-700">Marketing Manager</p>
                  </div>
                </div>
                <p className="text-cyan-700 italic">
                  "Pebblr has transformed how I maintain my professional network. I'm no longer that person who only
                  reaches out when I need something."
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-semibold text-cyan-900">Michael T.</h4>
                    <p className="text-sm text-cyan-700">Software Developer</p>
                  </div>
                </div>
                <p className="text-cyan-700 italic">
                  "As someone who struggles with social anxiety, having a system that tells me when it's appropriate to
                  reach out has been a game-changer."
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
                  <div>
                    <h4 className="font-semibold text-cyan-900">Elena R.</h4>
                    <p className="text-sm text-cyan-700">Freelance Writer</p>
                  </div>
                </div>
                <p className="text-cyan-700 italic">
                  "I've reconnected with so many old friends thanks to Pebblr. The birthday reminders alone have saved
                  me from countless awkward belated messages."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-cyan-950 mb-4">Simple Pricing</h2>
            <p className="text-center text-cyan-700 mb-12 max-w-2xl mx-auto">
              Choose the plan that works for your relationship management needs
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="border border-gray-200 rounded-lg p-6 bg-white">
                <h3 className="text-xl font-semibold text-cyan-900 mb-2">Free</h3>
                <p className="text-3xl font-bold text-cyan-950 mb-4">
                  $0<span className="text-base font-normal text-cyan-700">/month</span>
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-cyan-700 mr-2" />
                    <span className="text-cyan-700">Up to 10 contacts</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-cyan-700 mr-2" />
                    <span className="text-cyan-700">Basic reminders</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-cyan-700 mr-2" />
                    <span className="text-cyan-700">Web access</span>
                  </li>
                </ul>
                <Button
                  className="w-full bg-cyan-700 hover:bg-cyan-800 text-white"
                  onClick={() => setIsSignupOpen(true)}
                >
                  Get Started
                </Button>
              </div>

              <div className="border-2 border-cyan-700 rounded-lg p-6 bg-white shadow-lg relative">
                <div className="absolute top-0 right-0 bg-cyan-700 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                  POPULAR
                </div>
                <h3 className="text-xl font-semibold text-cyan-900 mb-2">Premium</h3>
                <p className="text-3xl font-bold text-cyan-950 mb-4">
                  $5<span className="text-base font-normal text-cyan-700">/month</span>
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-cyan-700 mr-2" />
                    <span className="text-cyan-700">Unlimited contacts</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-cyan-700 mr-2" />
                    <span className="text-cyan-700">Advanced reminders</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-cyan-700 mr-2" />
                    <span className="text-cyan-700">Contact notes</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-cyan-700 mr-2" />
                    <span className="text-cyan-700">Birthday tracking</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-cyan-700 mr-2" />
                    <span className="text-cyan-700">Priority support</span>
                  </li>
                </ul>
                <Button
                  className="w-full bg-[#EC3E72] hover:bg-[#F06292] text-white"
                  onClick={() => setIsSignupOpen(true)}
                >
                  Get Premium
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-gradient-to-r from-cyan-700 to-cyan-900 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to strengthen your relationships?</h2>
            <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
              Join thousands of people who use Pebblr to stay connected with the people who matter most.
            </p>
            <Button
              size="lg"
              className="bg-white text-cyan-900 hover:bg-cyan-50 px-8 py-6 text-lg rounded-full"
              onClick={() => setIsSignupOpen(true)}
            >
              Get started for free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Testimonials
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Webinars
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Partners
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    GDPR
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 font-semibold mb-4 md:mb-0">
              <div className="size-8 rounded-full bg-cyan-700 flex items-center justify-center text-white">
                <Bell className="size-4" />
              </div>
              <span className="text-white text-xl">Pebblr</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.713.026 4.985-.98 8.4a8.488 8.488 0 01-2.624-6.13c0-.522.051-1.033.138-1.53zm4.254 13.764c-.04-.851-.18-2.9.553-5.432 5.941-1.199 7.685.609 7.8.701a8.521 8.521 0 01-8.353 4.731z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Pebblr. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-cyan-950">Log in to your account</DialogTitle>
            <DialogDescription className="text-cyan-700">
              Enter your email and password to access your Pebblr account.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-cyan-900">
                  Email
                </Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com" 
                  className="border-gray-200"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required 
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-cyan-900">
                    Password
                  </Label>
                  <a href="#" className="text-sm text-cyan-700 hover:text-cyan-900">
                    Forgot password?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  className="border-gray-200"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter className="sm:justify-between">
              <div className="text-sm text-cyan-700">
                Don't have an account?{" "}
                <button
                  type="button"
                  className="text-cyan-900 font-medium hover:underline"
                  onClick={() => {
                    setIsLoginOpen(false)
                    setSignupEmail("")
                    setSignupPassword("")
                    setIsSignupOpen(true)
                  }}
                >
                  Sign up
                </button>
              </div>
              <Button 
                type="submit" 
                className="bg-cyan-700 hover:bg-cyan-800 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log in"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Signup Modal */}
      <Dialog open={isSignupOpen} onOpenChange={setIsSignupOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-cyan-950">Create your account</DialogTitle>
            <DialogDescription className="text-cyan-700">
              Join Pebblr today and start strengthening your relationships.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSignup}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name" className="text-cyan-900">
                    First name
                  </Label>
                  <Input 
                    id="first-name" 
                    placeholder="John" 
                    className="border-gray-200"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name" className="text-cyan-900">
                    Last name
                  </Label>
                  <Input 
                    id="last-name" 
                    placeholder="Doe" 
                    className="border-gray-200"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signup-email" className="text-cyan-900">
                  Email
                </Label>
                <Input 
                  id="signup-email" 
                  type="email" 
                  placeholder="you@example.com" 
                  className="border-gray-200"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="signup-password" className="text-cyan-900">
                  Password
                </Label>
                <Input 
                  id="signup-password" 
                  type="password" 
                  placeholder="Create a password" 
                  className="border-gray-200"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <p className="text-xs text-cyan-700">Must be at least 8 characters</p>
              </div>
            </div>
            <DialogFooter className="sm:justify-between">
              <div className="text-sm text-cyan-700">
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-cyan-900 font-medium hover:underline"
                  onClick={() => {
                    setIsSignupOpen(false)
                    setLoginEmail("")
                    setLoginPassword("")
                    setIsLoginOpen(true)
                  }}
                >
                  Log in
                </button>
              </div>
              <Button 
                type="submit" 
                className="bg-cyan-700 hover:bg-cyan-800 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

