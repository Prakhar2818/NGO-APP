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

const heroImage =
  "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80";
const foodDonationImg =
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&auto=format&fit=crop&q=80";
const communityImg =
  "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&auto=format&fit=crop&q=80";
const restaurantImg =
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80";
const ngoImg =
  "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=600&auto=format&fit=crop&q=80";
const impactImg =
  "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=600&auto=format&fit=crop&q=80";

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
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&auto=format&fit=crop&q=80",
  },
  {
    step: 2,
    title: "Create or Browse Donations",
    description:
      "Restaurants post available food, NGOs browse and accept suitable donations.",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&auto=format&fit=crop&q=80",
  },
  {
    step: 3,
    title: "Coordinate Pickup",
    description:
      "Schedule pickup times and coordinate logistics between parties.",
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&auto=format&fit=crop&q=80",
  },
  {
    step: 4,
    title: "Track Impact",
    description: "Monitor successful deliveries and measure community impact.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80",
  },
];

const LandingPage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [location.hash]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 font-mono">
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
            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl mb-6">
              <img
                src={heroImage}
                alt="Food donation and community support"
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white text-lg font-semibold">
                  Connecting surplus food with those who need it most
                </p>
              </div>
            </div>
            <div
              id="impact"
              className="rounded-2xl p-6 bg-white/80 backdrop-blur-sm shadow-lg"
            >
              <h3 className="text-xl font-bold mb-4 text-gray-900">
                Impact Snapshot
              </h3>
              <div className="grid grid-cols-2 gap-3">
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

        {/* Feature Images Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="relative rounded-xl overflow-hidden shadow-lg group">
            <img
              src={foodDonationImg}
              alt="Food donation"
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/70 to-transparent"></div>
            <div className="absolute bottom-4 left-4">
              <p className="text-white font-semibold">Food Rescue</p>
              <p className="text-white/80 text-sm">
                Saving surplus meals daily
              </p>
            </div>
          </div>
          <div className="relative rounded-xl overflow-hidden shadow-lg group">
            <img
              src={communityImg}
              alt="Community support"
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/70 to-transparent"></div>
            <div className="absolute bottom-4 left-4">
              <p className="text-white font-semibold">Community Impact</p>
              <p className="text-white/80 text-sm">Feeding the needy</p>
            </div>
          </div>
          <div className="relative rounded-xl overflow-hidden shadow-lg group">
            <img
              src={restaurantImg}
              alt="Restaurant partners"
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/70 to-transparent"></div>
            <div className="absolute bottom-4 left-4">
              <p className="text-white font-semibold">Restaurant Partners</p>
              <p className="text-white/80 text-sm">Growing network daily</p>
            </div>
          </div>
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

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {howItWorksSteps.map((step) => (
            <div key={step.step} className="relative group">
              <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl h-full">
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute top-3 left-3">
                    <div className="w-10 h-10 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                      {step.step}
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </Section>

      {/* Final CTA Section */}
      <Section backgroundColor="secondary" padding="xl">
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src={impactImg}
            alt="Community impact"
            className="absolute inset-0 w-full h-full object-cover opacity-20"
          />
          <div className="relative z-10 text-center py-8">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Reduce Food Waste at Scale?
            </h2>
            <p className="text-xl text-gray-100 mb-8 max-w-2xl mx-auto">
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
        </div>
      </Section>
      <Footer />
    </div>
  );
};

export default LandingPage;
