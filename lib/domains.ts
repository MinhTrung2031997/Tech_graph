export interface Domain {
  number: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
}

export const domains: Domain[] = [
  {
    number: '01',
    slug: 'cs-fundamentals',
    title: 'CS Fundamentals',
    description: 'Core computer-science ideas that show up in backend interviews: data structures, processes, and how to talk about them.',
    icon: 'BookOpen',
  },
  {
    number: '02',
    slug: 'design-principles',
    title: 'Design Principles & Patterns',
    description: 'SOLID, classic design patterns, and dependency injection — how to structure code that other people can change.',
    icon: 'Shapes',
  },
  {
    number: '03',
    slug: 'javascript-typescript',
    title: 'Typescript - Javascript',
    description: 'Language details I rely on every day: scope, types, equality, and the parts of modern JavaScript that still surprise people.',
    icon: 'FileCode',
  },
  {
    number: '04',
    slug: 'nodejs',
    title: 'NodeJS',
    description: 'The Node.js runtime: the event loop, async I/O, and how a single thread serves concurrent requests.',
    icon: 'Server',
  },
  {
    number: '05',
    slug: 'backend-frameworks',
    title: 'Backend Frameworks',
    description: 'NestJS and Express: modules, the request lifecycle, and which framework fits which service.',
    icon: 'Boxes',
  },
  {
    number: '06',
    slug: 'api-communication',
    title: 'API & Communication',
    description: 'REST, GraphQL, gRPC, gateways, and rate limits — how services talk to each other.',
    icon: 'Waypoints',
  },
  {
    number: '07',
    slug: 'security',
    title: 'Security',
    description: 'Authentication, authorization, JWT, OAuth, cookies, and a practical checklist for Node.js APIs.',
    icon: 'Shield',
  },
  {
    number: '08',
    slug: 'databases',
    title: 'Databases',
    description: 'SQL and NoSQL, transactions, isolation, indexing, and how to choose PostgreSQL, MySQL, or MongoDB.',
    icon: 'Database',
  },
  {
    number: '09',
    slug: 'concurrency',
    title: 'Concurrency & Consistency',
    description: 'Race conditions, locks, and idempotency — keeping shared data correct when requests overlap.',
    icon: 'GitMerge',
  },
  {
    number: '10',
    slug: 'messaging',
    title: 'Messaging & Jobs',
    description: 'Kafka, RabbitMQ, and BullMQ: logs versus queues, consumer lag, and background work.',
    icon: 'MessagesSquare',
  },
  {
    number: '11',
    slug: 'architecture',
    title: 'Architecture & Distributed Systems',
    description: 'Monoliths, microservices, sagas, DDD, clean architecture, and caching across process boundaries.',
    icon: 'Network',
  },
  {
    number: '12',
    slug: 'frontend',
    title: 'Frontend',
    description: 'React and Vue notes from the perspective of a backend engineer who also ships UI.',
    icon: 'AppWindow',
  },
  {
    number: '13',
    slug: 'devops',
    title: 'DevOps & Tooling',
    description: 'Docker, CI/CD, Terraform, Ansible, and the Git history tricks that keep deploys boring.',
    icon: 'Container',
  },
  {
    number: '14',
    slug: 'testing-process',
    title: 'Testing & Process',
    description: 'What to test at which layer, and the delivery process around the code.',
    icon: 'FlaskConical',
  },
];

export function domainBySlug(slug: string) {
  return domains.find((domain) => domain.slug === slug);
}
