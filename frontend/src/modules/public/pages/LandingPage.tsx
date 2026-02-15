import { useEffect } from "react";
import {
  ArrowRight,
  HeartHandshake,
  ShieldCheck,
  TimerReset,
  Users,
  TrendingUp,
  Award,
  Globe,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import PublicNavbar from "../../components/PublicNavbar";
import Footer from "../../components/Footer";
import Section from "../../components/ui/Section";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const impactStats = [
  { label: "Meals Delivered", value: "25K+", icon: HeartHandshake },
  { label: "Partner NGOs", value: "120+", icon: Users },
  { label: "Restaurants", value: "340+", icon: Award },
  { label: "Food Waste Reduced", value: "18T+", icon: TrendingUp },
];

const features = [
  {
    title: "Fast Donation Matching",
    description:
      "Restaurants and NGOs connect in minutes with live availability.",
    icon: TimerReset,
  },
  {
    title: "Verified Participants",
    description:
      "Role-based onboarding and profile checks keep operations reliable.",
    icon: ShieldCheck,
  },
  {
    title: "Impact You Can Track",
    description:
      "Monitor accepted, picked-up, and completed donations in one flow.",
    icon: HeartHandshake,
  },
  {
    title: "Global Reach",
    description: "Connect with organizations across regions and communities.",
    icon: Globe,
  },
];

const howItWorksSteps = [
  {
    step: 1,
    title: "Register Your Organization",
    description:
      "Create an account as a restaurant or NGO with verified credentials.",
  },
  {
    step: 2,
    title: "Create or Browse Donations",
    description:
      "Restaurants post available food, NGOs browse and accept suitable donations.",
  },
  {
    step: 3,
    title: "Coordinate Pickup",
    description:
      "Schedule pickup times and coordinate logistics between parties.",
  },
  {
    step: 4,
    title: "Track Impact",
    description: "Monitor successful deliveries and measure community impact.",
  },
];

const LandingPage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <PublicNavbar />

      {/* Hero Section */}
      <Section backgroundColor="white" padding="xm">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-6">
              <Users size={16} className="mr-2" />
              Restaurants + NGOs
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Rescue Food.
              <br />
              <span className="text-primary-600">Serve Communities.</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl">
              A global initiative focused on reducing food waste by connecting
              surplus food with people in need. Our goal is to promote
              sustainability, reduce environmental impact, and create a more
              responsible food ecosystem.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register">
                <Button
                  variant="heroButton"
                  size="lg"
                  className="transition transform hover:scale-[1.02]"
                >
                  Get Started
                  <ArrowRight size={20} className="ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="cta"
                  size="lg"
                  className="transition transform hover:scale-[1.02]"
                >
                  Continue to Dashboard
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <div id="impact" className="rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6">Impact Snapshot</h3>
              <div className="grid grid-cols-2 gap-4">
                {impactStats.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Card
                      key={item.label}
                      className="bg-primary-600 text-white backdrop-blur-sm border-0 transition transform hover:scale-[1.02]"
                      padding="sm"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon size={24} className="text-white flex-shrink-0" />
                        <div>
                          <p className="text-2xl font-bold">{item.value}</p>
                          <p className="text-sm opacity-90">{item.label}</p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Features Section */}
      <Section backgroundColor="gray" padding="xl" id="features">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Teams Use This Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Designed to streamline food rescue operations while maximizing
            community impact
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                hover={true}
                className="text-center transition-transform hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon size={28} className="text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            );
          })}
        </div>
      </Section>

      {/* How It Works Section */}
      <Section backgroundColor="white" padding="xl" id="how-it-works">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Simple four-step process to connect food donors with community
            organizations
          </p>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>

          <div className="grid lg:grid-cols-2 gap-12">
            {howItWorksSteps.map((step, index) => (
              <div
                key={step.step}
                className={`relative ${index % 2 === 0 ? "lg:pr-12" : "lg:pl-12 lg:col-start-2"}`}
              >
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                      {step.step}
                    </div>
                  </div>
                  <Card className="flex-1 transition-transform hover:-translate-y-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Final CTA Section */}
      <Section backgroundColor="secondary" padding="xl">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Reduce Food Waste at Scale?
          </h2>
          <p className="text-xl text-gray-800 mb-8 max-w-2xl mx-auto">
            Join thousands of organizations making a difference in their
            communities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button
                size="lg"
                className="cursor-pointer transition transform hover:scale-[1.02]"
              >
                Sign In to Your Account
              </Button>
            </Link>
            <Link to="/register">
              <Button
                variant="cta"
                size="lg"
                className=" cursor-pointer transition transform hover:scale-[1.02]"
              >
                Register Your Organization
              </Button>
            </Link>
          </div>
        </div>
      </Section>

      <Footer />
    </div>
  );
};

export default LandingPage;
