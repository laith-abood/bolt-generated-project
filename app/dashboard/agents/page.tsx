export const dynamic = 'force-dynamic';

import { CustomLink } from 'shared/components/CustomLink';

export default function AgentsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary-500">Agents</h1>
        <CustomLink
          href="/dashboard/agents/new"
          className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600"
        >
          Add Agent
        </CustomLink>
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
            <thead className="bg-neutral-50 dark:bg-neutral-900">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                >
                  Last Active
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
              {[
                {
                  id: 1,
                  name: 'John Doe',
                  email: 'john@example.com',
                  status: 'Active',
                  lastActive: '2 hours ago',
                },
                {
                  id: 2,
                  name: 'Jane Smith',
                  email: 'jane@example.com',
                  status: 'Inactive',
                  lastActive: '1 day ago',
                },
              ].map((agent) => (
                <tr key={agent.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {agent.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-neutral-500 dark:text-neutral-400">
                      {agent.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        agent.status === 'Active'
                          ? 'bg-success-100 text-success-800'
                          : 'bg-neutral-100 text-neutral-800'
                      }`}
                    >
                      {agent.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                    {agent.lastActive}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <CustomLink
                      href={`/dashboard/agents/${agent.id}`}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      Edit
                    </CustomLink>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
