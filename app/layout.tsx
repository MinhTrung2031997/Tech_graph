import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { appName, authorName, siteUrl } from '@/lib/shared';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${appName} · ${authorName}`,
    template: `%s · ${appName}`,
  },
  description: 'Backend engineering notes by Trung Nguyen. Node.js, NestJS, databases, messaging, and distributed systems.',
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <RootProvider
          theme={{
            attribute: 'class',
            defaultTheme: 'dark',
            enableSystem: true,
          }}
          search={{
            links: [
              ['SQL ISOLATION', '/notes/databases/transaction-isolation-levels'],
              ['Event loop', '/notes/nodejs/event-loop'],
              ['Kafka vs RabbitMQ', '/notes/messaging/kafka-vs-rabbitmq'],
              ['Quick Review', '/review'],
            ],
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
