export const dynamic = 'force-dynamic';

import { CustomLink } from 'shared/components/CustomLink';

export default function ReportsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary-500">Reports</h1>
        <CustomLink
          href="/dashboard/reports/generate"
          className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600"
        >
          Generate Report
        </CustomLink>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Recent Reports
          </h2>
          <ul className="divide-y divide-neutral-200 dark:divide-neutral-700">
            {[
              {
                id: 1,
                name: 'Monthly Performance Report',
                date: '2024-01-15',
                type: 'Performance',
              },
              {
                id: 2,
                name: 'Call Volume Analysis',
                date: '2024-01-14',
                type: 'Analytics',
              },
              {
                id: 3,
                name: 'Agent Productivity Summary',
                date: '2024-01-13',
                type: 'Summary',
              },
            ].map((report) => (
              <li
                key={report.id}
                className="py-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    {report.name}
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {report.date}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    report.type === 'Performance'
                      ? 'bg-primary-100 text-primary-800'
                      : report.type === 'Analytics'
                      ? 'bg-info-100 text-info-800'
                      : 'bg-success-100 text-success-800'
                  }`}
                >
                  {report.type}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Report Templates
          </h2>
          <ul className="space-y-4">
            {[
              {
                id: 1,
                name: 'Performance Report',
                description:
                  'Detailed analysis of agent performance metrics and KPIs',
              },
              {
                id: 2,
                name: 'Call Analytics',
                description:
                  'Comprehensive breakdown of call volumes and patterns',
              },
              {
                id: 3,
                name: 'Agent Summary',
                description:
                  'Overview of individual agent activities and achievements',
              },
            ].map((template) => (
              <li
                key={template.id}
                className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-4"
              >
                <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {template.name}
                </h3>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  {template.description}
                </p>
                <CustomLink
                  href={`/dashboard/reports/generate?template=${template.id}`}
                  className="mt-2 text-sm text-primary-600 hover:text-primary-900 inline-block"
                >
                  Use Template
                </CustomLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
