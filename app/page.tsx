import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-primary-500">
          Medicare Call Tracker
        </h1>
        <p className="text-xl text-neutral-600 dark:text-neutral-300 mb-8 max-w-2xl mx-auto">
          Streamline your Medicare call tracking with our comprehensive
          reporting platform.
        </p>

        <div className="flex justify-center space-x-4">
          <Link href="/auth/login" className="btn btn-primary">
            Login
          </Link>
          <Link href="/auth/register" className="btn btn-secondary">
            Register
          </Link>
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-primary-500">
              Call Logging
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300">
              Easily record and track all Medicare-related calls with our
              intuitive interface.
            </p>
          </div>

          <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-primary-500">
              Reporting
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300">
              Generate comprehensive reports to analyze call performance and
              insights.
            </p>
          </div>

          <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-primary-500">
              Compliance
            </h2>
            <p className="text-neutral-600 dark:text-neutral-300">
              Ensure regulatory compliance with built-in tracking and audit
              features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
