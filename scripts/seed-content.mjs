import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { articles, interviewArticles } from './articles.mjs';

const root = join(import.meta.dirname, '..');
const force = process.argv.includes('--force');
let written = 0;
let skipped = 0;

const domains = [
  ['01', 'cs-fundamentals', 'CS Fundamentals', 'BookOpen', 'Core computer-science ideas that show up in backend interviews: data structures, processes, and how to talk about them.'],
  ['02', 'design-principles', 'Design Principles & Patterns', 'Shapes', 'SOLID, classic design patterns, and dependency injection.'],
  ['03', 'javascript-typescript', 'JavaScript & TypeScript', 'FileCode', 'Scope, types, and the parts of modern JavaScript that still surprise people.'],
  ['04', 'nodejs', 'Node.js', 'Server', 'The event loop, async I/O, and how one thread serves concurrent requests.'],
  ['05', 'backend-frameworks', 'Backend Frameworks', 'Boxes', 'NestJS and Express: modules, the request lifecycle, and which framework fits.'],
  ['06', 'api-communication', 'API & Communication', 'Waypoints', 'REST, GraphQL, gRPC, gateways, and rate limits.'],
  ['07', 'security', 'Security', 'Shield', 'Authentication, authorization, tokens, cookies, and a Node.js checklist.'],
  ['08', 'databases', 'Databases', 'Database', 'SQL and NoSQL, transactions, isolation, indexing, and choosing an engine.'],
  ['09', 'concurrency', 'Concurrency & Consistency', 'GitMerge', 'Race conditions, locks, and idempotency when requests overlap.'],
  ['10', 'messaging', 'Messaging & Jobs', 'MessagesSquare', 'Kafka, RabbitMQ, and BullMQ: logs, queues, and background work.'],
  ['11', 'architecture', 'Architecture & Distributed Systems', 'Network', 'Monoliths, microservices, sagas, DDD, clean architecture, and caching.'],
  ['12', 'frontend', 'Frontend', 'AppWindow', 'React and Vue notes from a backend engineer who also ships UI.'],
  ['13', 'devops', 'DevOps & Tooling', 'Container', 'Docker, CI/CD, Terraform, Ansible, and Git history.'],
  ['14', 'testing-process', 'Testing & Process', 'FlaskConical', 'What to test at which layer, and the delivery process around the code.'],
];

/** @type {Record<string, Array<Record<string, unknown>>>} */
const notes = {
  'cs-fundamentals': [
    note('oop-fundamentals', 'OOP Fundamentals', 'concept', ['oop']),
    note('array-vs-linked-list', 'Array vs Linked List', 'comparison', ['data-structures']),
    note('sorting-algorithms', 'Sorting Algorithms', 'concept', ['algorithms'], { status: 'draft' }),
    note('process-vs-thread', 'Process vs Thread', 'comparison', ['os']),
    note('uml-diagrams', 'UML Diagrams', 'concept', ['uml']),
  ],
  'design-principles': [
    note('solid-principles', 'SOLID Principles', 'concept', ['solid']),
    note('design-patterns-gof', 'Design Patterns (GoF)', 'pattern', ['design-patterns']),
    note('ioc-dependency-injection', 'IoC & Dependency Injection', 'concept', ['nestjs', 'di']),
  ],
  'javascript-typescript': [
    note('modern-javascript', 'Modern JavaScript (ES2015+)', 'concept', ['javascript']),
    note('strict-mode', 'Strict Mode', 'concept', ['javascript']),
    note('var-let-const', 'var vs let vs const', 'comparison', ['javascript']),
    note('this-bind-call-apply', 'this, bind, call, apply & Closures', 'concept', ['javascript']),
    note('data-types', 'Data Types & Pass by Value vs Reference', 'concept', ['javascript']),
    note('type-vs-interface', 'Type vs Interface', 'comparison', ['typescript']),
    note('abstract-class-vs-interface', 'Abstract Class vs Interface', 'comparison', ['typescript']),
  ],
  nodejs: [
    note('nodejs-overview', 'Node.js Overview', 'concept', ['nodejs']),
    note('event-loop', 'Event Loop & Task Queues', 'concept', ['nodejs'], {
      status: 'reviewed',
      interviewPriority: true,
      lastReviewed: '2026-10-08',
      appliesTo: 'Node.js 22',
      related: ['nodejs/sync-vs-async', 'nodejs/cluster-worker-threads'],
      sources: ['https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick'],
    }),
    note('sync-vs-async', 'Sync vs Async, Blocking vs Non-blocking', 'comparison', ['nodejs']),
    note('cluster-worker-threads', 'Cluster & Worker Threads', 'concept', ['nodejs'], { status: 'draft' }),
  ],
  'backend-frameworks': [
    note('nestjs-modules', 'NestJS Modules & Request Lifecycle', 'concept', ['nestjs']),
    note('nestjs-design-patterns', 'Design Patterns in NestJS', 'pattern', ['nestjs']),
    note('express-vs-nestjs', 'Express vs NestJS', 'comparison', ['nestjs', 'express']),
  ],
  'api-communication': [
    note('rest-api', 'REST API', 'concept', ['http', 'rest']),
    note('graphql', 'GraphQL', 'concept', ['graphql']),
    note('grpc', 'gRPC & Streaming Modes', 'concept', ['grpc']),
    note('rest-vs-graphql-vs-grpc', 'REST vs GraphQL vs gRPC', 'comparison', ['rest', 'graphql', 'grpc']),
    note('api-rate-limiting', 'API Rate Limiting', 'how-to', ['http']),
    note('api-gateway', 'API Gateway', 'concept', ['http']),
  ],
  security: [
    note('authentication-vs-authorization', 'Authentication vs Authorization', 'comparison', ['auth']),
    note('jwt', 'JWT', 'concept', ['jwt', 'auth'], {
      status: 'reviewed',
      interviewPriority: true,
      lastReviewed: '2026-10-06',
      appliesTo: 'Any HTTP API',
      related: ['security/oauth', 'security/authentication-vs-authorization', 'security/cookies-vs-sessions'],
      sources: ['https://datatracker.ietf.org/doc/html/rfc7519'],
    }),
    note('oauth', 'OAuth 2.0 & OpenID Connect', 'concept', ['oauth', 'auth'], {
      status: 'reviewed',
      lastReviewed: '2026-10-09',
      appliesTo: 'OAuth 2.0, OpenID Connect',
      related: ['security/jwt', 'security/authentication-vs-authorization'],
      sources: ['https://datatracker.ietf.org/doc/html/rfc6749', 'https://openid.net/specs/openid-connect-core-1_0.html'],
    }),
    note('api-authentication-methods', 'API Authentication Methods', 'cheatsheet', ['auth']),
    note('cookies-vs-sessions', 'Cookies vs Sessions', 'comparison', ['auth', 'http']),
    note('nodejs-security-checklist', 'Node.js Security Checklist', 'cheatsheet', ['nodejs', 'auth']),
  ],
  databases: [
    note('sql-vs-nosql', 'SQL vs NoSQL', 'comparison', ['sql', 'nosql'], {
      status: 'reviewed',
      lastReviewed: '2026-10-04',
      appliesTo: 'PostgreSQL 17, MongoDB 8',
      related: ['databases/acid-vs-base', 'databases/mysql-vs-postgresql'],
    }),
    note('acid-vs-base', 'ACID vs BASE', 'comparison', ['postgresql', 'transactions'], {
      status: 'reviewed',
      interviewPriority: true,
      lastReviewed: '2026-10-11',
      appliesTo: 'PostgreSQL 17',
      related: ['databases/transaction-isolation-levels', 'databases/sql-vs-nosql'],
    }),
    note('transaction-isolation-levels', 'Transaction Isolation Levels', 'concept', ['postgresql', 'mysql', 'mvcc'], {
      status: 'reviewed',
      interviewPriority: true,
      lastReviewed: '2026-10-12',
      appliesTo: 'PostgreSQL 17, MySQL 8.4',
      related: ['databases/acid-vs-base', 'concurrency/race-conditions', 'databases/mysql-vs-postgresql'],
      sources: [
        'https://www.postgresql.org/docs/current/transaction-iso.html',
        'https://dev.mysql.com/doc/refman/8.4/en/innodb-transaction-isolation-levels.html',
      ],
    }),
    note('normalization', 'Normalization', 'concept', ['sql']),
    note('sql-basics', 'SQL Basics & Logical Execution Order', 'concept', ['sql']),
    note('query-optimization', 'Query Optimization', 'how-to', ['sql', 'postgresql']),
    note('postgresql-indexing', 'PostgreSQL Indexing', 'concept', ['postgresql']),
    note('mongodb-indexes', 'MongoDB Indexes', 'concept', ['mongodb']),
    note('sharding-vs-partitioning', 'Sharding vs Partitioning', 'comparison', ['postgresql', 'mongodb']),
    note('mysql-vs-postgresql', 'MySQL vs PostgreSQL', 'comparison', ['mysql', 'postgresql']),
    note('orms', 'ORMs: TypeORM vs Prisma vs Knex', 'comparison', ['typescript', 'postgresql']),
  ],
  concurrency: [
    note('race-conditions', 'Race Conditions & Concurrency Control', 'concept', ['postgresql', 'concurrency'], {
      status: 'reviewed',
      interviewPriority: true,
      lastReviewed: '2026-10-11',
      appliesTo: 'PostgreSQL 17',
      related: ['databases/transaction-isolation-levels', 'databases/acid-vs-base', 'concurrency/idempotency-outbox'],
    }),
    note('idempotency-outbox', 'Idempotency & Outbox Pattern', 'pattern', ['messaging'], { status: 'draft' }),
  ],
  messaging: [
    note('kafka-fundamentals', 'Kafka Fundamentals', 'concept', ['kafka'], {
      status: 'reviewed',
      lastReviewed: '2026-10-10',
      appliesTo: 'Kafka 4.x',
      related: ['messaging/kafka-vs-rabbitmq', 'messaging/rabbitmq-fundamentals'],
      sources: ['https://kafka.apache.org/documentation/#intro_concepts'],
    }),
    note('rabbitmq-fundamentals', 'RabbitMQ Fundamentals', 'concept', ['rabbitmq']),
    note('kafka-vs-rabbitmq', 'Kafka vs RabbitMQ', 'comparison', ['kafka', 'rabbitmq'], {
      status: 'reviewed',
      interviewPriority: true,
      lastReviewed: '2026-10-10',
      appliesTo: 'Kafka 4.x, RabbitMQ 4',
      related: ['messaging/kafka-fundamentals', 'messaging/rabbitmq-fundamentals', 'messaging/bullmq'],
    }),
    note('bullmq', 'BullMQ', 'concept', ['redis', 'nodejs']),
  ],
  architecture: [
    note('architecture-overview', 'Architecture & System Design Patterns', 'concept', ['architecture']),
    note('monolith-vs-microservices', 'Monolith vs Microservices', 'comparison', ['architecture']),
    note('saga-pattern', 'Saga Pattern', 'pattern', ['architecture', 'messaging']),
    note('domain-driven-design', 'Domain-Driven Design', 'concept', ['architecture']),
    note('clean-architecture', 'Clean Architecture', 'concept', ['architecture']),
    note('caching-strategies', 'Caching Strategies (Redis)', 'concept', ['redis'], {
      status: 'draft',
      lastReviewed: '2026-10-05',
    }),
  ],
  frontend: [
    note('react-fundamentals', 'React Fundamentals: Components, Props & State', 'concept', ['react']),
    note('react-hooks', 'React Hooks', 'concept', ['react'], {
      status: 'reviewed',
      lastReviewed: '2026-10-07',
      appliesTo: 'React 19',
      related: ['frontend/react-fundamentals', 'frontend/react-rendering'],
      sources: ['https://react.dev/reference/react/hooks'],
    }),
    note('react-rendering', 'React Rendering & Virtual DOM', 'concept', ['react']),
    note('redux', 'Redux & Redux Toolkit', 'concept', ['react', 'redux']),
    note('vue', 'Vue.js & Composition API', 'concept', ['vue']),
  ],
  devops: [
    note('docker-image-optimization', 'Docker Image Optimization', 'how-to', ['docker']),
    note('cicd-pipelines', 'CI/CD Pipelines', 'concept', ['cicd'], { status: 'draft' }),
    note('terraform-vs-ansible', 'Terraform vs Ansible', 'comparison', ['terraform', 'ansible']),
    note('git-merge-vs-rebase', 'Git: Merge vs Rebase', 'comparison', ['git']),
  ],
  'testing-process': [
    note('testing-strategy', 'Testing Strategy', 'concept', ['testing'], { status: 'draft' }),
    note('sdlc-scrum', 'SDLC Models & Scrum', 'concept', ['process'], { status: 'draft' }),
  ],
};

function note(slug, title, type, tags, extra = {}) {
  return {
    slug,
    title,
    type,
    tags,
    status: 'draft',
    interviewPriority: false,
    placeholder: true,
    ...extra,
    placeholder: extra.status === 'reviewed' ? false : true,
  };
}

function fm(data) {
  const lines = ['---'];
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === false) continue;
    if (Array.isArray(value)) {
      lines.push(value.length === 0 ? `${key}: []` : `${key}: [${value.map((item) => JSON.stringify(item)).join(', ')}]`);
    } else if (typeof value === 'boolean') {
      lines.push(`${key}: ${value}`);
    } else {
      lines.push(`${key}: ${JSON.stringify(value)}`);
    }
  }
  lines.push('---', '');
  return lines.join('\n');
}

function write(path, contents) {
  if (!force && existsSync(path)) {
    console.log(`skip ${relative(root, path)} (exists, pass --force to overwrite)`);
    skipped++;
    return;
  }
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, contents);
  written++;
}

const notesRoot = join(root, 'content/notes');
write(
  join(notesRoot, 'meta.json'),
  JSON.stringify(
    {
      title: 'Notes',
      pages: ['index', ...domains.map((domain) => domain[1])],
    },
    null,
    2,
  ) + '\n',
);

write(
  join(notesRoot, 'index.mdx'),
  fm({
    title: 'Notes',
    description: 'Fourteen domains of backend notes. Open a domain to see every page, including placeholders.',
  }) +
    `The sidebar is the category tree. Finished notes have a TL;DR and a 30-second answer. Placeholder pages are marked Draft.\n`,
);

for (const [number, slug, title, icon, description] of domains) {
  const dir = join(notesRoot, slug);
  const pages = notes[slug];
  write(
    join(dir, 'meta.json'),
    JSON.stringify(
      {
        title: `${number} · ${title}`,
        description,
        icon,
        collapsible: true,
        defaultOpen: false,
        pages: pages.map((page) => page.slug),
      },
      null,
      2,
    ) + '\n',
  );

  write(
    join(dir, 'index.mdx'),
    fm({
      title,
      description,
      number,
      domain: slug,
      type: 'domain',
    }) + `${description}\n\nDraft pages are outlines. Reviewed pages are safe to revise from.\n`,
  );

  for (const page of pages) {
    const key = `${slug}/${page.slug}`;
    const body =
      articles[key] ??
      `<Tldr>\nPlaceholder for ${page.title}. The full note is not written yet.\n</Tldr>\n\nThis page is part of the ${title} tree so navigation works. It is not a copy of a Notion page.\n\n## What this note will cover\n\n${page.title}: a ${page.type} note for backend work and interviews.\n`;
    write(
      join(dir, `${page.slug}.mdx`),
      fm({
        title: page.title,
        description: page.placeholder
          ? `Placeholder outline for ${page.title}.`
          : firstParagraph(body),
        domain: slug,
        type: page.type,
        tags: page.tags,
        status: page.status,
        appliesTo: page.appliesTo,
        lastReviewed: page.lastReviewed,
        interviewPriority: page.interviewPriority,
        related: page.related,
        sources: page.sources,
        placeholder: page.placeholder,
      }) + body,
    );
  }
}

const interviewRoot = join(root, 'content/interview');
write(
  join(interviewRoot, 'meta.json'),
  JSON.stringify({ title: 'Interview Prep', pages: ['self-introduction', 'star', 'answers', 'checklists'] }, null, 2) + '\n',
);
write(
  join(interviewRoot, 'index.mdx'),
  fm({
    title: 'Interview Prep',
    description: 'A public-safe space for self-introduction, STAR outlines, and study checklists.',
  }) +
    `Personal stories stay unpublished until they are safe to tell. The self-introduction and the React checklist are written. The STAR pages are outlines only.\n`,
);
write(
  join(interviewRoot, 'self-introduction.mdx'),
  fm({
    title: 'Self-Introduction',
    description: 'A short public introduction. Backend engineer since 2018.',
    type: 'concept',
    status: 'reviewed',
    tags: ['interview'],
  }) + interviewArticles['self-introduction'],
);

write(
  join(interviewRoot, 'star/meta.json'),
  JSON.stringify(
    {
      title: 'STAR Stories',
      pages: ['kafka-consumer-lag', 'kafka-ordering', 'iot-chart-timeout', 'dashboard-preaggregation'],
    },
    null,
    2,
  ) + '\n',
);
write(
  join(interviewRoot, 'star/index.mdx'),
  fm({
    title: 'STAR Stories',
    description: 'Outlines for behavioral stories. Private production details are not on this site.',
    placeholder: true,
    status: 'draft',
  }) + `Each story will eventually have Situation, Task, Action, and Result. Nothing here is a real incident write-up.\n`,
);

for (const [slug, title] of [
  ['kafka-consumer-lag', 'STAR: Kafka Consumer Lag'],
  ['kafka-ordering', 'STAR: Kafka Ordering & Duplicates'],
  ['iot-chart-timeout', 'STAR: IoT Chart Data Timeout'],
  ['dashboard-preaggregation', 'STAR: Dashboard Pre-aggregation'],
]) {
  write(
    join(interviewRoot, 'star', `${slug}.mdx`),
    fm({
      title,
      description: `Outline only. ${title} is not published with production details.`,
      placeholder: true,
      status: 'draft',
      type: 'pattern',
      tags: ['interview'],
    }) +
      `## Situation\n\nNot published.\n\n## Task\n\nNot published.\n\n## Action\n\nNot published.\n\n## Result\n\nNot published. Numbers from production stay off this public site.\n`,
  );
}

write(
  join(interviewRoot, 'answers/meta.json'),
  JSON.stringify({ title: 'Answers', pages: ['optimize-heavy-queries', 'cloud-devops'] }, null, 2) + '\n',
);
write(
  join(interviewRoot, 'answers/index.mdx'),
  fm({
    title: 'Answers',
    description: 'Short first-person answers. These pages are outlines.',
    placeholder: true,
    status: 'draft',
  }) + `The finished answers will be first person and specific. These two are placeholders.\n`,
);
for (const [slug, title] of [
  ['optimize-heavy-queries', 'Answer: How I Optimize Heavy Queries'],
  ['cloud-devops', 'Answer: Cloud / DevOps Experience'],
]) {
  write(
    join(interviewRoot, 'answers', `${slug}.mdx`),
    fm({
      title,
      description: `Outline for ${title}.`,
      placeholder: true,
      status: 'draft',
      tags: ['interview'],
    }) + `This answer is not written yet. The page exists so the interview section has a complete map.\n`,
  );
}

write(
  join(interviewRoot, 'checklists/meta.json'),
  JSON.stringify({ title: 'Study Checklists', pages: ['react'] }, null, 2) + '\n',
);
write(
  join(interviewRoot, 'checklists/index.mdx'),
  fm({
    title: 'Study Checklists',
    description: 'Topic lists to walk before an interview.',
  }) + `Open a checklist and tick it off on paper. The React list is the one that is filled in.\n`,
);
write(
  join(interviewRoot, 'checklists/react.mdx'),
  fm({
    title: 'Study Checklist: React',
    description: 'A short React study list for interview revision.',
    type: 'cheatsheet',
    status: 'reviewed',
    tags: ['react', 'interview'],
  }) + interviewArticles['checklists/react'],
);

function firstParagraph(body) {
  const text = body
    .replace(/<Tldr>\n?/, '')
    .replace(/<\/Tldr>/, '')
    .split('\n')
    .map((line) => line.trim())
    .find((line) => line && !line.startsWith('<') && !line.startsWith('#'));
  return (text ?? 'Backend note.').slice(0, 220);
}

console.log(`Seeded content/notes and content/interview: ${written} written, ${skipped} skipped`);
