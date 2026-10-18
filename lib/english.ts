import type { Node, Root } from 'fumadocs-core/page-tree';

export interface EnglishQuestion {
  title: string;
  id: string;
}

export interface EnglishPage {
  title: string;
  href: string;
  questions?: EnglishQuestion[];
}

export interface EnglishSet {
  id: string;
  title: string;
  hint: string;
  prefix: string;
  href: string;
  pages: EnglishPage[];
}

export const englishSets: EnglishSet[] = [
  {
    id: 'interview',
    title: 'English Interview',
    hint: 'answers, self-introduction, interview phrases',
    prefix: '/english/interview',
    href: '/english/interview/microservice-benefits',
    pages: [
      {
        title: "Microservice benefits",
        href: "/english/interview/microservice-benefits",
        questions: [
          { title: "Scalability", id: "scalability" },
          { title: "Flexibility in Technology Stack", id: "flexibility-in-technology-stack" },
          { title: "Improved Fault Isolation", id: "improved-fault-isolation" },
          { title: "Faster Development & Deployment", id: "faster-development--deployment" },
          { title: "Easier Maintenance & Updates", id: "easier-maintenance--updates" },
          { title: "Better Team Autonomy", id: "better-team-autonomy" },
          { title: "Enhanced Security & Compliance", id: "enhanced-security--compliance" },
          { title: "Optimized Performance", id: "optimized-performance" },
          { title: "Improved Business Agility", id: "improved-business-agility" },
          { title: "Easier Debugging & Monitoring", id: "easier-debugging--monitoring" },
        ],
      },
      {
        title: "About You & Your Background",
        href: "/english/interview/about-you",
        questions: [
          { title: "Introduction", id: "introduction" },
          { title: "Why do you want to leave the company and find a new environment?", id: "why-leave" },
          { title: "What duties have you been responsible for in your current role at your company CLT?", id: "duties-at-clt" },
          { title: "What duties have you been responsible for in your current role at your company ONPOINT?", id: "duties-at-onpoint" },
          { title: "What accomplishments have you achieved in your current role at your company?", id: "accomplishments" },
          { title: "Most impressive project", id: "most-impressive-project" },
          { title: "Tell me about a time you took ownership of a project", id: "took-ownership" },
          { title: "What are you most proud of in your 7 years of experience?", id: "most-proud-of" },
          { title: "I heard that you have a degree in Communication and Computer Networks. Why did you become a developer?", id: "why-a-developer" },
          { title: "Why did you graduate later than expected and start working earlier than usual?", id: "graduation-timing" },
          { title: "Summary experience", id: "summary-experience" },
        ],
      },
      {
        title: "Teamwork & Collaboration",
        href: "/english/interview/teamwork",
        questions: [
          { title: "How do you handle conflicts with your teammates or partners?", id: "handle-conflicts" },
          { title: "Describe a time you had a conflict with a teammate. How did you resolve it?", id: "conflict-with-a-teammate" },
          { title: "Have you ever mentored /ˈmen.tɔːr/ junior developers? What was your approach?", id: "mentoring-juniors" },
          { title: "Could you tell me about a time you worked with a difficult colleague?", id: "difficult-colleague" },
          { title: "How do you give and receive constructive feedback?", id: "constructive-feedback" },
          { title: "What role do you usually take in a team?", id: "role-in-a-team" },
        ],
      },
      {
        title: "Problem Solving & Pressure",
        href: "/english/interview/problem-solving",
        questions: [
          { title: "What was the biggest challenge you faced, and how did you overcome it?", id: "biggest-challenge" },
          { title: "How do you prioritize when you have multiple urgent deadlines?", id: "urgent-deadlines" },
          { title: "Have you ever had to make a decision /dɪˈsɪʒ.ən/ without enough information?", id: "incomplete-information" },
          { title: "How do you make technical decisions?", id: "technical-decisions" },
          { title: "Describe a time a project failed or didn't go as planned. What did you do?", id: "a-project-that-failed" },
          { title: "What do you do when requirements are unclear?", id: "unclear-requirements" },
          { title: "How do you determine whether an issue is actually a bug or not?", id: "bug-or-not" },
        ],
      },
      {
        title: "Company & Culture Alignment",
        href: "/english/interview/company-culture",
        questions: [
          { title: "What are your expectations for your next company?", id: "next-company" },
          { title: "How do you feel when working in a new environment", id: "new-environment" },
          { title: "What does an ideal work environment look like for you?", id: "ideal-environment" },
          { title: "How do you prefer to work — independently or collaboratively?", id: "independent-or-collaborative" },
          { title: "What do you know about our company, and why do you want to join us?", id: "why-join" },
          { title: "What are your thoughts on our tech stack/product?", id: "tech-stack" },
          { title: "What are your thoughts on working with teammates from different countries?", id: "international-teammates" },
        ],
      },
      {
        title: "Growth & Learning",
        href: "/english/interview/growth",
        questions: [
          { title: "How do you keep your technical skills up to date?", id: "keep-skills-current" },
          { title: "What's a technical mistake you made, and what did you learn from it?", id: "technical-mistake" },
          { title: "How to become a good software engineer.", id: "good-software-engineer" },
          { title: "Where do you see yourself in the next 3–5 years?", id: "next-35-years" },
        ],
      },
      {
        title: "Work Style & Process",
        href: "/english/interview/work-style",
        questions: [
          { title: "How do you stay organized and productive while coding?", id: "stay-organized" },
          { title: "How do you explain complex technical concepts to non-technical people?", id: "non-technical-explanations" },
          { title: "How do you ensure code quality in your team?", id: "code-quality" },
          { title: "Could you tell me the team’s process and workflow when working according to the Scrum methodology?", id: "scrum-workflow" },
          { title: "Could you tell me the software development process of the team?", id: "development-process" },
          { title: "What are the key Scrum events in the Scrum process?", id: "scrum-events" },
          { title: "What Are the Main Roles In a Scrum Team?", id: "scrum-roles" },
          { title: "What Are Scrum Values in the Scrum Methodology?", id: "scrum-values" },
          { title: "Advantages and disadvantages", id: "advantages-and-disadvantages" },
        ],
      },
      {
        title: "Ownership & Initiative",
        href: "/english/interview/ownership",
        questions: [
          { title: "Tell me about a time you went beyond your job description to help the team", id: "beyond-the-job" },
          { title: "Have you ever proposed and implemented a process improvement? What was the impact?", id: "process-improvement" },
          { title: "Describe a time you took ownership of a project from start to finish.", id: "start-to-finish" },
        ],
      },
      {
        title: "Closing",
        href: "/english/interview/closing",
        questions: [
          { title: "Why should we hire you?", id: "why-hire-you" },
        ],
      },
    ],
  },
  {
    id: 'daily',
    title: 'English Daily',
    hint: 'everyday speaking and small talk',
    prefix: '/english/daily',
    href: '/english/daily/a-day-of-new-friendship',
    pages: [
      {
        title: 'A Day Of New Friendship',
        href: '/english/daily/a-day-of-new-friendship',
        questions: [
          { title: 'Seat taken', id: 'seat-taken' },
          { title: 'Sit down', id: 'sit-down' },
          { title: 'My name is Alex', id: 'my-name-is-alex' },
          { title: 'Nice to meet you', id: 'nice-to-meet-you' },
          { title: 'Six months here', id: 'six-months-here' },
          { title: 'Red brick facade', id: 'red-brick-facade' },
          { title: 'Ten minutes away', id: 'ten-minutes-away' },
          { title: 'Slight accent', id: 'slight-accent' },
          { title: 'From Toronto', id: 'from-toronto' },
          { title: 'From Colorado', id: 'from-colorado' },
          { title: 'Graphic design work', id: 'graphic-design-work' },
          { title: 'Marketing agency', id: 'marketing-agency' },
          { title: 'Imagination and code', id: 'imagination-and-code' },
          { title: 'Do you enjoy it', id: 'do-you-enjoy-it' },
          { title: 'Stuck on a bug', id: 'stuck-on-a-bug' },
          { title: 'Blank screen', id: 'blank-screen' },
          { title: 'Hobbies outside work', id: 'hobbies-outside-work' },
          { title: 'Photography weekends', id: 'photography-weekends' },
          { title: 'New hobby', id: 'new-hobby' },
          { title: 'Try hiking', id: 'try-hiking' },
          { title: 'Hiking in Canada', id: 'hiking-in-canada' },
          { title: 'Hiking group', id: 'hiking-group' },
          { title: 'Special equipment', id: 'special-equipment' },
          { title: 'Beginner trails', id: 'beginner-trails' },
          { title: 'Ordering breakfast', id: 'ordering-breakfast' },
          { title: 'Blueberry muffins', id: 'blueberry-muffins' },
          { title: 'Order a croissant', id: 'order-a-croissant' },
          { title: 'A croissant', id: 'a-croissant' },
          { title: 'Traveled much', id: 'traveled-much' },
          { title: 'San Francisco', id: 'san-francisco' },
          { title: 'Technology conference', id: 'technology-conference' },
          { title: 'Hundreds of photos', id: 'hundreds-of-photos' },
          { title: 'Other languages', id: 'other-languages' },
          { title: 'Studied Spanish', id: 'studied-spanish' },
          { title: 'A little French', id: 'a-little-french' },
          { title: 'Family in Canada', id: 'family-in-canada' },
          { title: 'Visit twice a year', id: 'visit-twice-a-year' },
          { title: 'Video call often', id: 'video-call-often' },
          { title: 'Every Sunday', id: 'every-sunday' },
          { title: 'Call my mom', id: 'call-my-mom' },
          { title: 'Any siblings', id: 'any-siblings' },
          { title: 'Older brother', id: 'older-brother' },
          { title: 'Teaching profession', id: 'teaching-profession' },
          { title: 'High school math', id: 'high-school-math' },
          { title: 'Science and programming', id: 'science-and-programming' },
          { title: 'Art and literature', id: 'art-and-literature' },
          { title: 'Honest about math', id: 'honest-about-math' },
          { title: 'Mystery novels', id: 'mystery-novels' },
          { title: 'Science fiction', id: 'science-fiction' },
          { title: 'Good books recently', id: 'good-books-recently' },
          { title: 'Space exploration', id: 'space-exploration' },
          { title: 'Recommend it sometime', id: 'recommend-it-sometime' },
          { title: 'Weekend activities', id: 'weekend-activities' },
          { title: 'Thai green curry', id: 'thai-green-curry' },
          { title: 'How it turned out', id: 'how-it-turned-out' },
          { title: 'Spicy but delicious', id: 'spicy-but-delicious' },
          { title: 'Basic meals', id: 'basic-meals' },
          { title: 'Cooking takes practice', id: 'cooking-takes-practice' },
          { title: 'Favorite cuisine', id: 'favorite-cuisine' },
          { title: 'Italian food', id: 'italian-food' },
          { title: 'Risotto and you', id: 'risotto-and-you' },
          { title: 'Japanese food', id: 'japanese-food' },
          { title: 'Sushi together', id: 'sushi-together' },
          { title: 'Free next weekend', id: 'free-next-weekend' },
          { title: 'Saturday evening', id: 'saturday-evening' },
          { title: 'Dietary restrictions', id: 'dietary-restrictions' },
          { title: 'Eat everything', id: 'eat-everything' },
          { title: 'Adventurous with food', id: 'adventurous-with-food' },
          { title: 'Why you moved', id: 'why-you-moved' },
          { title: 'Job offer', id: 'job-offer' },
          { title: 'Starting fresh', id: 'starting-fresh' },
          { title: 'Lonely at first', id: 'lonely-at-first' },
          { title: 'Close friend', id: 'close-friend' },
          { title: 'Requires planning', id: 'requires-planning' },
          { title: 'Weekly video calls', id: 'weekly-video-calls' },
          { title: 'Friday night games', id: 'friday-night-games' },
          { title: 'What games', id: 'what-games' },
          { title: 'Strategy games', id: 'strategy-games' },
          { title: 'Chess on my phone', id: 'chess-on-my-phone' },
          { title: 'Rusty at chess', id: 'rusty-at-chess' },
          { title: 'Outdoor chess', id: 'outdoor-chess' },
          { title: 'Very rusty', id: 'very-rusty' },
          { title: 'Just for fun', id: 'just-for-fun' },
          { title: 'Big fountain', id: 'big-fountain' },
          { title: 'Riverside Park', id: 'riverside-park' },
          { title: 'Summer concerts', id: 'summer-concerts' },
          { title: 'Bands and musicians', id: 'bands-and-musicians' },
          { title: 'Kind of music', id: 'kind-of-music' },
          { title: 'Jazz band', id: 'jazz-band' },
          { title: 'Outdoor atmosphere', id: 'outdoor-atmosphere' },
          { title: 'Picnic baskets', id: 'picnic-baskets' },
          { title: 'Summer evening', id: 'summer-evening' },
          { title: 'Schedule in May', id: 'schedule-in-may' },
          { title: 'Winter plans', id: 'winter-plans' },
          { title: 'Art museum', id: 'art-museum' },
          { title: 'Worth visiting', id: 'worth-visiting' },
          { title: 'Photography exhibition', id: 'photography-exhibition' },
          { title: 'Visit the museum', id: 'visit-the-museum' },
          { title: 'Cultural activities', id: 'cultural-activities' },
          { title: 'Relax at home', id: 'relax-at-home' },
          { title: 'Doing nothing', id: 'doing-nothing' },
          { title: 'Television or movies', id: 'television-or-movies' },
          { title: 'British crime series', id: 'british-crime-series' },
          { title: 'Complex plots', id: 'complex-plots' },
          { title: 'American shows', id: 'american-shows' },
          { title: 'Science documentaries', id: 'science-documentaries' },
          { title: 'Cinematography', id: 'cinematography' },
          { title: 'Ocean documentary', id: 'ocean-documentary' },
          { title: 'Never finished', id: 'never-finished' },
          { title: 'Almost alien', id: 'almost-alien' },
          { title: 'Watch list', id: 'watch-list' },
          { title: 'Typical work day', id: 'typical-work-day' },
          { title: 'Start at nine', id: 'start-at-nine' },
          { title: 'Multiple projects', id: 'multiple-projects' },
          { title: 'Three campaigns', id: 'three-campaigns' },
          { title: 'Organization skills', id: 'organization-skills' },
          { title: 'Lists and reminders', id: 'lists-and-reminders' },
          { title: 'Task management', id: 'task-management' },
          { title: 'Better tools', id: 'better-tools' },
          { title: 'Taskmaster', id: 'taskmaster' },
          { title: 'Free version', id: 'free-version' },
          { title: 'Finish work', id: 'finish-work' },
          { title: 'Flexible schedule', id: 'flexible-schedule' },
          { title: 'Work and personal life', id: 'work-and-personal-life' },
          { title: 'Working late', id: 'working-late' },
          { title: 'Set boundaries', id: 'set-boundaries' },
          { title: 'Home office', id: 'home-office' },
          { title: 'Office space', id: 'office-space' },
          { title: 'More disciplined', id: 'more-disciplined' },
          { title: 'Mental health', id: 'mental-health' },
          { title: 'Meditation or yoga', id: 'meditation-or-yoga' },
          { title: 'Yoga pronunciation', id: 'yoga-pronunciation' },
          { title: 'Tried yoga', id: 'tried-yoga' },
          { title: 'Hard to stay consistent', id: 'hard-to-stay-consistent' },
          { title: 'Accountability partner', id: 'accountability-partner' },
          { title: 'Meditation center', id: 'meditation-center' },
          { title: 'Yoga studio nearby', id: 'yoga-studio-nearby' },
          { title: 'Beginner classes', id: 'beginner-classes' },
          { title: 'After our coffee', id: 'after-our-coffee' },
          { title: 'Physical activities', id: 'physical-activities' },
          { title: 'Sitting at a desk', id: 'sitting-at-a-desk' },
          { title: 'Sedentary life', id: 'sedentary-life' },
          { title: 'Physical labor', id: 'physical-labor' },
          { title: 'Quite ironic', id: 'quite-ironic' },
          { title: 'Artificial solutions', id: 'artificial-solutions' },
        ],
      },
    ],
  },
  {
    id: 'workplace',
    title: 'Workplace',
    hint: 'standups, meetings, and Slack',
    prefix: '/english/workplace',
    href: '/english/workplace',
    pages: [{ title: 'Workplace', href: '/english/workplace' }],
  },
  {
    id: 'vocabulary',
    title: 'Vocabulary',
    hint: 'words and phrases worth keeping',
    prefix: '/english/vocabulary',
    href: '/english/vocabulary',
    pages: [{ title: 'Vocabulary', href: '/english/vocabulary' }],
  },
];

export function englishSetForPath(pathname: string) {
  const path = pathname.split(/[?#]/)[0] ?? pathname;
  return englishSets.find((set) => path === set.prefix || path.startsWith(`${set.prefix}/`));
}

export function englishTitleForSlug(slug: string[]) {
  const path = `/english/${slug.join('/')}`;
  for (const set of englishSets) {
    const page = set.pages.find((item) => item.href === path);
    if (page) return page.title;
  }
  return undefined;
}

export function englishPaths() {
  return englishSets.flatMap((set) => set.pages.map((page) => page.href));
}

function sectionNode(page: EnglishPage): Node {
  if (!page.questions?.length) {
    return { type: 'page', name: page.title, url: page.href };
  }

  return {
    type: 'folder',
    name: page.title,
    collapsible: true,
    defaultOpen: false,
    index: { type: 'page', name: page.title, url: page.href },
    children: page.questions.map((question) => ({
      type: 'page',
      name: question.title,
      url: `${page.href}#${question.id}`,
    })),
  };
}

export function englishTree(set: EnglishSet): Root {
  return {
    name: set.title,
    children: [{ type: 'separator', name: set.title }, ...set.pages.map(sectionNode)],
  };
}
