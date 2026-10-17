import type { Metadata } from 'next';
import { authorName, githubRepoUrl } from '@/lib/shared';

export const metadata: Metadata = {
  title: 'About',
  description: 'Who Trung Nguyen is, and how these backend notes are maintained.',
};

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <p className="text-sm text-fd-muted-foreground">About</p>
      <h1 className="mt-1 text-3xl font-extrabold tracking-tight">Trung Nguyen</h1>
      <p className="mt-4 text-fd-muted-foreground">
        I am a backend engineer. I have been building server-side systems since 2018, mostly with TypeScript, Node.js, and NestJS, and the databases and messaging systems those services sit on.
      </p>
      <p className="mt-3 text-fd-muted-foreground">
        This site is my public notebook. Each topic has one page, grouped into 14 domains, so I can look something up while working and revise it before an interview. The UI is English. A few pages are finished sample notes. The rest of the category tree is in place as placeholders.
      </p>

      <h2 className="mt-8 text-lg font-bold">Stack</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-fd-muted-foreground">
        <li>TypeScript, Node.js, NestJS, Express</li>
        <li>PostgreSQL, MySQL, MongoDB, Redis</li>
        <li>Kafka, RabbitMQ, BullMQ</li>
        <li>Next.js, React, Tailwind CSS</li>
        <li>Docker, Terraform, Ansible</li>
      </ul>

      <h2 className="mt-8 text-lg font-bold">How notes are maintained</h2>
      <p className="mt-2 text-fd-muted-foreground">
        Pages live in this repository as MDX. A change is a pull request, and Vercel can build a preview before it is merged. Notion is not connected to this site. Nothing here is a raw export of a Notion page.
      </p>

      <h2 className="mt-8 text-lg font-bold">Links</h2>
      <ul className="mt-2 space-y-1">
        <li>
          <a href={githubRepoUrl()} className="text-indigo-300 hover:text-white">
            GitHub · {authorName}
          </a>
        </li>
        <li>
          <a href="https://github.com/MinhTrung2031997" className="text-indigo-300 hover:text-white">
            github.com/MinhTrung2031997
          </a>
        </li>
      </ul>
    </main>
  );
}
