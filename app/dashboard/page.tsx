export const dynamic = 'force-dynamic';

import { CustomLink } from 'shared/components/CustomLink';

export default function DashboardOverviewPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-primary-500 mb-6">
        Dashboard Overview
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-4">
            Total Calls
          </h2>
          <div className="text-4xl font-bold text-primary-500">1,234</div>
          <CustomLink
            href="/dashboard/calls"
            className="text-sm text-primary-600 hover:text-primary-700 mt-2 inline-block"
          >
            View Details
          </CustomLink>
        </div>

        <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-4">
            Active Agents
          </h2>
          <div className="text-4xl font-bold text-primary-500">24</div>
          <CustomLink
            href="/dashboard/agents"
            className="text-sm text-primary-600 hover:text-primary-700 mt-2 inline-block"
          >
            Manage Agents
          </CustomLink>
        </div>

        <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-4">
            Pending Reports
          </h2>
          <div className="text-4xl font-bold text-primary-500">12</div>
          <CustomLink
            href="/dashboard/reports"
            className="text-sm text-primary-600 hover:text-primary-700 mt-2 inline-block"
          >
            Generate Reports
          </CustomLink>
        </div>
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-4">
            Recent Calls
          </h2>
          <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {[
              {
                id: 1,
                agent: 'John Doe',
                duration: '12:34',
                status: 'Completed',
              },
              {
                id: 2,
                agent: 'Jane Smith',
                duration: '08:45',
                status: 'In Progress',
              },
              {
                id: 3,
                agent: 'Mike Johnson',
                duration: '15:22',
                status: 'Completed',
              },
            ].map((call) => (
              <li key={call.id} className="py-3 flex justify-between">
                <span className="text-neutral-700 dark:text-neutral-300">
                  {call.agent}
                </span>
                <span className="text-neutral-500">{call.duration}</span>
                <span
                  className={`
                  px-2 py-1 rounded text-xs
                  ${
                    call.status === 'Completed'
                      ? 'bg-success-100 text-success-700'
                      : 'bg-warning-100 text-warning-700'
                  }
                `}
                >
                  {call.status}
                </span>
              </li>
            ))}
          </ul>
          <CustomLink
            href="/dashboard/calls"
            className="block text-center text-sm text-primary-600 hover:text-primary-700 mt-4"
          >
            View All Calls
          </CustomLink>
        </div>

        <div className="bg-neutral-100 dark:bg-neutral-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-4">
            Performance Metrics
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-neutral-600 dark:text-neutral-400">
                Avg. Call Duration
              </p>
              <div className="text-2xl font-bold text-primary-500">10:23</div>
            </div>
            <div>
              <p className="text-neutral-600 dark:text-neutral-400">
                Call Success Rate
              </p>
              <div className="text-2xl font-bold text-success-500">92%</div>
            </div>
          </div>
          <CustomLink
            href="/dashboard/reports"
            className="block text-center text-sm text-primary-600 hover:text-primary-700 mt-4"
          >
            Detailed Analytics
          </CustomLink>
        </div>
      </div>
    </div>
  );
}
