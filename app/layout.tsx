import { AuthProvider } from '@/features/auth';
import { ConfigManager } from '@/core/config/ConfigManager';
import { LogLevel, LoggerService } from '@/core/services/LoggerService';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import '@/styles/globals.css';
import '@/app/firebase-init';

// Initialize logger
LoggerService.log(LogLevel.INFO, 'Application starting', {
  environment: ConfigManager.get('environment'),
});

// Configure font
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Medicare Call Tracker',
    template: '%s | Medicare Call Tracker',
  },
  description: 'Comprehensive Medicare call tracking and reporting platform',
  applicationName: 'Medicare Call Tracker',
  keywords: ['medicare', 'call tracking', 'healthcare', 'reporting'],
  robots: {
    index: true,
    follow: true,
    nocache: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-white dark:bg-neutral-900">
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
