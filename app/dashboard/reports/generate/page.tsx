export const dynamic = 'force-dynamic';

export default function GenerateReportPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-primary-500 mb-6">
        Generate Report
      </h1>

      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow p-6">
        <form className="space-y-6">
          <div>
            <label
              htmlFor="report-type"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Report Type
            </label>
            <select
              id="report-type"
              name="report-type"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 dark:border-neutral-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-neutral-700"
            >
              <option>Performance Report</option>
              <option>Call Analytics</option>
              <option>Agent Summary</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="date-range"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Date Range
            </label>
            <select
              id="date-range"
              name="date-range"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 dark:border-neutral-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-neutral-700"
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>Custom Range</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="agents"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Select Agents
            </label>
            <select
              id="agents"
              name="agents"
              multiple
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 dark:border-neutral-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-neutral-700"
            >
              <option>All Agents</option>
              <option>John Doe</option>
              <option>Jane Smith</option>
              <option>Mike Johnson</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="metrics"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Include Metrics
            </label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <input
                  id="calls"
                  name="metrics"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                />
                <label
                  htmlFor="calls"
                  className="ml-2 text-sm text-neutral-700 dark:text-neutral-300"
                >
                  Call Volume
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="duration"
                  name="metrics"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                />
                <label
                  htmlFor="duration"
                  className="ml-2 text-sm text-neutral-700 dark:text-neutral-300"
                >
                  Average Duration
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="success"
                  name="metrics"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                />
                <label
                  htmlFor="success"
                  className="ml-2 text-sm text-neutral-700 dark:text-neutral-300"
                >
                  Success Rate
                </label>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="format"
              className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              Export Format
            </label>
            <select
              id="format"
              name="format"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-300 dark:border-neutral-600 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md dark:bg-neutral-700"
            >
              <option>PDF</option>
              <option>Excel</option>
              <option>CSV</option>
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600"
            >
              Generate Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
