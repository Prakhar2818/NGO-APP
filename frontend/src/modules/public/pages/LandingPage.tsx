import { ArrowRight, HeartHandshake, ShieldCheck, TimerReset, Users } from "lucide-react";
import { Link } from "react-router-dom";

const impactStats = [
  { label: "Meals Delivered", value: "25K+" },
  { label: "Partner NGOs", value: "120+" },
  { label: "Restaurants", value: "340+" },
  { label: "Food Waste Reduced", value: "18T+" },
];

const features = [
  {
    title: "Fast Donation Matching",
    description: "Restaurants and NGOs connect in minutes with live availability.",
    icon: TimerReset,
  },
  {
    title: "Verified Participants",
    description: "Role-based onboarding and profile checks keep operations reliable.",
    icon: ShieldCheck,
  },
  {
    title: "Impact You Can Track",
    description: "Monitor accepted, picked-up, and completed donations in one flow.",
    icon: HeartHandshake,
  },
];

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-100 to-pink-100 font-mono text-gray-900">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-10 rounded-3xl border border-white/60 bg-white/75 p-4 shadow-xl backdrop-blur-xl sm:p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-purple-700">
                NGO Connect
              </p>
              <h1 className="text-lg font-bold text-gray-900 sm:text-xl">
                Rescue Food. Serve Communities.
              </h1>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <Link
                to="/login"
                className="rounded-xl border border-purple-200 bg-white px-4 py-2 text-sm font-semibold text-purple-700 transition hover:bg-purple-50"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:from-purple-700 hover:to-indigo-700"
              >
                Register
              </Link>
            </div>
          </div>
        </header>

        <section className="mb-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <p className="mb-3 inline-flex items-center rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
              <Users size={14} className="mr-2" />
              Restaurants + NGOs + Admin
            </p>
            <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
              Make surplus food useful before it is wasted.
            </h2>
            <p className="mt-4 max-w-2xl text-sm text-gray-600 sm:text-base">
              A clean, role-based platform for creating donations, accepting pickups, and monitoring impact
              without changing your current workflow.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="inline-flex items-center rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:from-purple-700 hover:to-indigo-700"
              >
                Get Started
                <ArrowRight size={16} className="ml-2" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center rounded-xl border border-purple-200 bg-white px-5 py-3 text-sm font-semibold text-purple-700 transition hover:bg-purple-50"
              >
                Continue to Dashboard
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <h3 className="text-lg font-bold text-purple-700">Impact Snapshot</h3>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {impactStats.map((item) => (
                <div key={item.label} className="rounded-2xl bg-gradient-to-br from-white to-purple-50 p-4">
                  <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                  <p className="mt-1 text-xs font-medium text-gray-600">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-8 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
          <h3 className="text-xl font-bold text-gray-900">Why teams use this platform</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
                  <div className="mb-3 inline-flex rounded-xl bg-purple-100 p-2 text-purple-700">
                    <Icon size={18} />
                  </div>
                  <h4 className="text-base font-bold text-gray-900">{feature.title}</h4>
                  <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-700 p-6 text-white shadow-2xl sm:p-8">
          <h3 className="text-2xl font-bold">Ready to reduce food waste at scale?</h3>
          <p className="mt-2 max-w-2xl text-sm text-purple-100 sm:text-base">
            Sign in to continue your current flow, or create a new account to onboard your organization.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/login"
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-purple-700 transition hover:bg-purple-50"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-xl border border-white/40 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Register Organization
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
