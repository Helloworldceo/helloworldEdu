import Link from "next/link";
import { HiAcademicCap, HiBookOpen, HiPlay, HiUsers, HiLightningBolt, HiBadgeCheck } from "react-icons/hi";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-6">
              <HiAcademicCap className="text-4xl text-indigo-600" />
              <span className="text-sm font-semibold text-indigo-600 tracking-widest uppercase">
                Helloworldceo
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Learn, Grow, and
              <span className="text-indigo-600"> Excel</span>
            </h1>
            <p className="mt-6 text-lg text-gray-500 max-w-2xl mx-auto">
              A modern learning platform for university students. Access quality courses,
              interactive quizzes, video lessons, and earn certificates — all in one place.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/courses"
                className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-indigo-700 transition text-lg"
              >
                Browse Courses
              </Link>
              <Link
                href="/register"
                className="bg-gray-100 text-gray-700 px-8 py-3.5 rounded-xl font-medium hover:bg-gray-200 transition text-lg"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50/50 to-transparent" />
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Everything you need to succeed</h2>
            <p className="text-gray-500 mt-3">
              Our platform provides comprehensive tools for both students and instructors.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: HiPlay,
                title: "Video Lessons",
                description:
                  "Watch high-quality video lectures with a built-in player. Learn at your own pace.",
                color: "bg-indigo-50 text-indigo-600",
              },
              {
                icon: HiBookOpen,
                title: "Interactive Quizzes",
                description:
                  "Test your knowledge with quizzes after each module. Get instant feedback.",
                color: "bg-green-50 text-green-600",
              },
              {
                icon: HiBadgeCheck,
                title: "Certificates",
                description:
                  "Earn verified certificates upon course completion. Share your achievements.",
                color: "bg-purple-50 text-purple-600",
              },
              {
                icon: HiUsers,
                title: "Discussion Forum",
                description:
                  "Engage with fellow students and instructors in course-specific forums.",
                color: "bg-orange-50 text-orange-600",
              },
              {
                icon: HiLightningBolt,
                title: "Track Progress",
                description:
                  "Monitor your learning journey with detailed progress tracking per course.",
                color: "bg-yellow-50 text-yellow-600",
              },
              {
                icon: HiAcademicCap,
                title: "Instructor Tools",
                description:
                  "Create courses, add lessons, build quizzes, and manage students easily.",
                color: "bg-pink-50 text-pink-600",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-gray-100 p-6 hover:shadow-md transition"
              >
                <div
                  className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}
                >
                  <feature.icon className="text-xl" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
            {[
              { label: "Active Learners", value: "500+" },
              { label: "Courses Available", value: "50+" },
              { label: "Video Hours", value: "200+" },
              { label: "Certificates Issued", value: "1,000+" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl lg:text-4xl font-bold">{stat.value}</p>
                <p className="text-indigo-200 mt-1 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to start learning?
          </h2>
          <p className="text-gray-500 mb-8">
            Join thousands of students already learning on Helloworldceo.
            Create your free account today.
          </p>
          <Link
            href="/register"
            className="inline-block bg-indigo-600 text-white px-8 py-3.5 rounded-xl font-medium hover:bg-indigo-700 transition text-lg"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </div>
  );
}
