export const articles = {
  'nodejs/event-loop': `import body
<Tldr>
Node.js runs JavaScript on one main thread. The event loop interleaves timers, I/O callbacks, and microtasks so many connections can be in flight without a thread per request. CPU-heavy synchronous work blocks every connection on that process.
</Tldr>

<Answer>
The event loop is a set of phases. Timers (\`setTimeout\`) run, then poll waits for I/O, then \`setImmediate\` runs in the check phase. Between phases, Node drains \`process.nextTick\` and then resolved Promises. Libuv's thread pool covers some blocking work (file system, DNS, crypto), but your JavaScript still runs on one thread.
</Answer>

## Phases that matter

| Phase | What runs |
| --- | --- |
| Timers | \`setTimeout\` and \`setInterval\` callbacks whose delay has elapsed |
| Poll | Incoming I/O. If the queue is empty, it may wait here |
| Check | \`setImmediate\` |
| Close | \`socket.on('close')\` and similar |

\`process.nextTick\` and Promise reactions are microtasks. They run before the loop moves to the next phase. A \`nextTick\` that schedules another \`nextTick\` can starve I/O.

## What actually leaves the main thread

Network sockets are non-blocking on the main thread. \`fs\` APIs, \`dns.lookup\`, and \`crypto.pbkdf2\` can use the libuv thread pool (default size 4, via \`UV_THREADPOOL_SIZE\`). That pool is small. A burst of CPU-heavy \`pbkdf2\` calls queues behind each other even though the API is async.

## Pitfalls

<Pitfall>
\`await\` does not make CPU work concurrent. A tight loop, \`JSON.parse\` of a huge payload, or synchronous \`bcrypt\` still blocks the loop. Move that work to a worker thread, or break it up. See [Cluster & Worker Threads](/notes/nodejs/cluster-worker-threads).
</Pitfall>

## Interview questions

<details>
<summary>Why can one Node process serve thousands of connections?</summary>
Most of those connections are waiting on the network. The process stores a small amount of state per socket and wakes the callback when the kernel says the socket is readable. Threads are not created per request.
</details>

<details>
<summary>What is the difference between \`nextTick\` and \`setImmediate\`?</summary>
\`nextTick\` runs before the event loop continues, as soon as the current operation finishes. \`setImmediate\` runs in the check phase, after poll. Use \`setImmediate\` when you want to yield to I/O.
</details>
`.replace(/^import body\n/, ''),

  'security/jwt': `import body
<Tldr>
A JWT is a signed token (header, payload, signature), not an encrypted one. Anyone who has the token can read the payload. The signature only proves it was issued by someone who holds the secret or private key.
</Tldr>

<Answer>
I treat a JWT as a short-lived access token. I validate \`alg\`, \`exp\`, \`iss\`, and \`aud\`, I never accept \`alg: none\`, and I do not put secrets in the payload. If I need to revoke a session instantly, I use an opaque server-side session or a short expiry plus a refresh token I can revoke.
</Answer>

## What the three parts are

The payload is base64url JSON. Typical claims are \`sub\`, \`exp\`, \`iat\`, \`iss\`, and \`aud\`. HS256 means a shared secret. RS256 or ES256 means the authorization server signs with a private key and resource servers verify with the public key.

Signing is not encryption. A JWT in \`localStorage\` is readable by any script on the page, which is why XSS is fatal to bearer tokens. An \`HttpOnly\` \`Secure\` cookie avoids that particular leak, and then CSRF becomes the thing to design for.

## Pitfalls

<Pitfall>
Do not decode a JWT and trust it. Verify the signature with an allow-list of algorithms. Libraries that pick the algorithm from the token header have been tricked into treating a public key as an HMAC secret.
</Pitfall>

## Interview questions

<details>
<summary>When is a JWT a bad session mechanism?</summary>
When you need immediate revocation, or the token is large and sent on every request, or you are stuffing roles that change often into a token that lives for hours. A session id in a cookie plus a server-side store is simpler until you actually have many stateless resource servers.
</details>
`.replace(/^import body\n/, ''),

  'security/oauth': `import body
<Tldr>
OAuth 2.0 is delegated authorization. OpenID Connect adds authentication by returning an \`id_token\`. For a browser or mobile app, use the authorization code flow with PKCE. Do not use the implicit flow.
</Tldr>

<Answer>
The user authenticates at the authorization server. My app receives an authorization code, exchanges it with PKCE for tokens, and calls APIs with the access token. The \`id_token\` tells me who the user is. The access token tells the API what the user allowed. OAuth 1.0 is legacy and I do not implement it.
</Answer>

## The four roles

| Role | Job |
| --- | --- |
| Resource owner | The user |
| Client | My application |
| Authorization server | Issues tokens (and the login screen) |
| Resource server | The API that accepts the access token |

PKCE binds the code to the client that started the request, which matters when the client cannot hide a secret. A backend that can keep a secret still uses PKCE. It is cheap and it closes the intercepted-code attack.

## Pitfalls

<Pitfall>
An access token is not proof of identity. Validate the OpenID Connect \`id_token\` (issuer, audience, signature, expiry) when you need to know who logged in. See [JWT](/notes/security/jwt).
</Pitfall>
`.replace(/^import body\n/, ''),

  'databases/sql-vs-nosql': `import body
<Tldr>
SQL databases give you a schema, joins, and strong transactions. Document and key-value stores give you flexible records and easy horizontal partitioning. Many systems now do both: PostgreSQL has JSONB, and MongoDB has multi-document transactions.
</Tldr>

<Answer>
I start with PostgreSQL unless I have a concrete reason not to. I reach for a document store when the data is a self-contained aggregate, the shape changes often, and I do not need joins across those aggregates. I do not pick "NoSQL" as a performance strategy. Indexes and data modeling decide performance.
</Answer>

## How I choose

| Need | Usually |
| --- | --- |
| Invoices, accounts, anything with constraints | PostgreSQL |
| A document that is always read and written as a whole | MongoDB, or JSONB in PostgreSQL |
| A cache or a counter | Redis |
| A relationship graph you traverse | A graph store, or recursive SQL if it is shallow |

The expensive part is the boundary. Once an order lives in one database and the user profile in another, you no longer have a single transaction. That is an architecture problem, not a driver problem. See [ACID vs BASE](/notes/databases/acid-vs-base).
`.replace(/^import body\n/, ''),

  'databases/acid-vs-base': `import body
<Tldr>
ACID is a promise about one database: the transaction is all-or-nothing, constraints hold, concurrent transactions are isolated to some level, and committed data survives a crash. BASE describes systems that stay up by accepting stale or temporary disagreement.
</Tldr>

<Answer>
ACID is Atomicity, Consistency, Isolation, and Durability. BASE is Basically Available, Soft state, and Eventually consistent. Isolation is not one thing. It is a dial, which is why [Transaction Isolation Levels](/notes/databases/transaction-isolation-levels) exists. I use ACID inside a service's database and design explicit compensation when a workflow crosses services.
</Answer>

## What each letter actually constrains

| | ACID | BASE |
| --- | --- | --- |
| Failure | The transaction rolls back | The system answers even if a replica is behind |
| Correctness | Constraints are true at commit | Invariants catch up later, if you designed them to |
| Typical home | PostgreSQL, MySQL | Caches, logs, some distributed stores |

Consistency in ACID means application invariants (foreign keys, checks), not the "C" in CAP. Mixing those two words is how this topic gets muddled in interviews.

## Pitfalls

<Pitfall>
"We use a SQL database, so we are consistent" is not true once you have replicas, caches, or a second service writing its own database. Isolation level and replication lag are separate knobs.
</Pitfall>
`.replace(/^import body\n/, ''),

  'databases/transaction-isolation-levels': `import body
<Tldr>
Isolation levels define which anomalies concurrent transactions may observe. Higher levels prevent more anomalies at the cost of more locking or more retries. PostgreSQL implements Repeatable Read as snapshot isolation.
</Tldr>

<Answer>
There are four ANSI levels: Read Uncommitted, Read Committed, Repeatable Read, and Serializable. Each one rules out more anomalies — dirty reads, non-repeatable reads, and phantoms. In practice Postgres uses MVCC snapshots, so readers never block writers. Its Repeatable Read does not show phantoms, and Serializable may abort a transaction that the application must retry.
</Answer>

## Anomalies by level

A **dirty read** sees another transaction's uncommitted write. A **non-repeatable read** sees a committed update to a row it already read. A **phantom** sees a newly committed row that matches a predicate it already queried.

<table>
  <thead>
    <tr>
      <th>Level</th>
      <th>Dirty read</th>
      <th>Non-repeatable read</th>
      <th>Phantom read</th>
      <th>PostgreSQL in practice</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Read Uncommitted</td>
      <td><span className="text-red-400">possible</span></td>
      <td><span className="text-red-400">possible</span></td>
      <td><span className="text-red-400">possible</span></td>
      <td>behaves as Read Committed</td>
    </tr>
    <tr>
      <td>Read Committed</td>
      <td><span className="text-green-400">prevented</span></td>
      <td><span className="text-red-400">possible</span></td>
      <td><span className="text-red-400">possible</span></td>
      <td>default</td>
    </tr>
    <tr>
      <td>Repeatable Read</td>
      <td><span className="text-green-400">prevented</span></td>
      <td><span className="text-green-400">prevented</span></td>
      <td><span className="text-amber-300">ANSI: possible</span></td>
      <td>snapshot, no phantoms</td>
    </tr>
    <tr>
      <td>Serializable</td>
      <td><span className="text-green-400">prevented</span></td>
      <td><span className="text-green-400">prevented</span></td>
      <td><span className="text-green-400">prevented</span></td>
      <td>SSI, may abort and must be retried</td>
    </tr>
  </tbody>
</table>

### ANSI vs PostgreSQL and MySQL

PostgreSQL never shows dirty reads. Asking for Read Uncommitted silently runs as Read Committed. The default is Read Committed: each statement sees a fresh snapshot, so a later statement in the same transaction can observe commits that happened after the previous statement.

Repeatable Read in PostgreSQL is snapshot isolation. The snapshot is taken at the first statement, and every later statement uses it, so phantoms from concurrent commits do not appear. That is stronger than the ANSI definition of Repeatable Read.

Serializable in PostgreSQL is Serializable Snapshot Isolation. It does not take the read locks a textbook would. It watches for dangerous read/write dependency cycles and aborts one transaction with SQLSTATE \`40001\`. The application retries the whole transaction.

MySQL InnoDB's default is Repeatable Read. It stops many phantoms with next-key locks: a lock on the index record plus the gap before it. InnoDB's Read Uncommitted really can return dirty reads. Its Serializable level turns plain \`SELECT\` into locking reads (\`LOCK IN SHARE MODE\`).

## Avoiding lost updates

Read Committed does not stop two transactions from reading the same balance and both writing a new one. The second commit overwrites the first. That is a lost update, and it is allowed at every level except, in practice, the ones that lock or abort.

<CodeBlockTabs defaultValue="sql">
  <CodeBlockTabsList>
    <CodeBlockTabsTrigger value="sql">transfer.sql</CodeBlockTabsTrigger>
    <CodeBlockTabsTrigger value="ts">transfer.ts</CodeBlockTabsTrigger>
  </CodeBlockTabsList>
  <CodeBlockTab value="sql">

\`\`\`sql title="transfer.sql"
BEGIN ISOLATION LEVEL READ COMMITTED;
SELECT balance FROM accounts WHERE id = 42 FOR UPDATE; -- [!code highlight]
UPDATE accounts SET balance = balance - 100 WHERE id = 42;
COMMIT;
\`\`\`

  </CodeBlockTab>
  <CodeBlockTab value="ts">

\`\`\`ts title="transfer.ts"
await db.transaction(async (tx) => {
  const [row] = await tx\`
    SELECT balance FROM accounts WHERE id = \${42} FOR UPDATE
  \`;
  await tx\`
    UPDATE accounts SET balance = balance - \${100} WHERE id = \${42}
  \`;
  return row;
});
\`\`\`

  </CodeBlockTab>
</CodeBlockTabs>

An atomic \`UPDATE accounts SET balance = balance - 100\` is enough when the new value is a pure function of the current row. \`FOR UPDATE\` is for when the application must read the row, decide, and then write. Optimistic locking (\`UPDATE … WHERE version = $1\`) is the other pattern: the write fails if someone else committed first, and the app retries.

## Pitfalls

<Pitfall>
Read Committed alone does not prevent lost updates. Use \`SELECT … FOR UPDATE\`, an atomic \`UPDATE\`, or optimistic locking. See [Race Conditions & Concurrency Control](/notes/concurrency/race-conditions).
</Pitfall>

## Interview questions

<details>
<summary>Why does PostgreSQL not have phantom reads at Repeatable Read?</summary>

Its Repeatable Read is snapshot isolation. Every statement in the transaction reads the same snapshot taken at the first query, so rows inserted and committed by others later are invisible.

</details>

<details>
<summary>How does InnoDB's next-key locking differ from PostgreSQL's SSI?</summary>

InnoDB blocks conflicting inserts by locking index records plus the gaps between them. PostgreSQL's Serializable Snapshot Isolation does not block. It tracks read/write dependencies and aborts one transaction on a dangerous cycle, so the app must retry.

</details>
`.replace(/^import body\n/, ''),

  'concurrency/race-conditions': `import body
<Tldr>
A race condition is a bug whose result depends on timing. In a database-backed API the usual shape is check-then-act: two requests both see "allowed" and both write. Fix it with an atomic write, a lock, a unique constraint, or an idempotency key — not with hope about request order.
</Tldr>

<Answer>
I name the invariant first (one debit, one seat, one webhook side effect). Then I pick the smallest mechanism that enforces it: an atomic \`UPDATE\`, \`SELECT … FOR UPDATE\`, a unique index, or an idempotency key stored in the same transaction as the side effect. Isolation level alone does not save a read-modify-write at Read Committed. See [Transaction Isolation Levels](/notes/databases/transaction-isolation-levels).
</Answer>

## Six ways I actually use

| Mechanism | Use it when |
| --- | --- |
| Atomic update | The new value is \`balance = balance - 100\` |
| Row lock (\`FOR UPDATE\`) | You must read, decide in application code, then write |
| Optimistic version column | Conflicts are rare and retry is easy |
| Unique constraint | "Only one" is a fact about data, not about timing |
| Advisory lock | The critical section is not a single row |
| Idempotency key | A retry must not apply the side effect twice |

## Pitfalls

<Pitfall>
Catching a duplicate-key error and continuing as if nothing happened is correct only when the existing row is the same operation. If two different payments collide on a bad key, you just dropped one of them.
</Pitfall>
`.replace(/^import body\n/, ''),

  'messaging/kafka-fundamentals': `import body
<Tldr>
Kafka is a distributed log. Producers append records to a topic partition. Consumers read by offset and track progress themselves. Order is guaranteed inside one partition, not across a topic. Modern clusters use KRaft instead of ZooKeeper.
</Tldr>

<Answer>
A topic is split into partitions. Each partition is an ordered, append-only log. A consumer group splits partitions across members, so two consumers in one group do not read the same partition. Consumer lag is the difference between the log end offset and the group's committed offset. Records stay for the retention window even after they are consumed, which is why a new group can replay history.
</Answer>

## Words I keep straight

| Term | Meaning |
| --- | --- |
| Offset | Position of a record in a partition |
| Consumer group | A set of consumers sharing the partitions of a topic |
| Commit | The group recording "I have processed up to here" |
| Lag | Log end offset minus the committed offset |
| KRaft | Kafka's own consensus for cluster metadata. ZooKeeper is gone in current versions |

The group coordinator assigns partitions. When a member dies, partitions move and in-flight records may be processed again. Delivery is at-least-once unless you turn on transactions and design the consumer to be idempotent.

## Pitfalls

<Pitfall>
A key chooses the partition. If you need order for one account, key by that account. If you key by nothing, you get throughput and no order across records that belong together.
</Pitfall>
`.replace(/^import body\n/, ''),

  'messaging/kafka-vs-rabbitmq': `import body
<Tldr>
Kafka is a retained log you read by offset. RabbitMQ is a broker that routes messages into queues and deletes them once they are acknowledged. Kafka replays. RabbitMQ pushes work to competing consumers and then forgets it.
</Tldr>

<Answer>
I use Kafka when several services need the same history, when order inside a key matters, or when I want to replay. I use RabbitMQ when I have a job, a routing key, and a worker pool that should take each message once. BullMQ sits closer to RabbitMQ: a Redis-backed job queue, not a log.
</Answer>

## Side by side

| | Kafka | RabbitMQ |
| --- | --- | --- |
| Model | Append-only log | Queue (and exchanges) |
| After consume | Record stays until retention | Ack removes it |
| Replay | Start a group at an old offset | Not the default model |
| Competing workers | One group member per partition | Many consumers on one queue |
| Order | Per partition | Per queue, if a single consumer |
| Routing | Key → partition | Exchange type and binding key |

## Pitfalls

<Pitfall>
"Kafka is faster" is not a design. A single RabbitMQ queue with competing consumers is the simpler fix for a background job. Kafka pays off when the log itself is the product other teams subscribe to. See [Kafka Fundamentals](/notes/messaging/kafka-fundamentals).
</Pitfall>
`.replace(/^import body\n/, ''),

  'frontend/react-hooks': `import body
<Tldr>
Hooks are functions that let function components keep state and subscribe to React features. Call them at the top level, never inside a condition. \`useEffect\` synchronizes with something outside React. It is not where derived data belongs.
</Tldr>

<Answer>
\`useState\` stores state. \`useRef\` stores a mutable value that does not re-render. \`useMemo\` and \`useCallback\` cache a result or a function when identity matters. \`useEffect\` runs after paint to talk to the outside world. In React 19 I also reach for \`use\` to read a promise or context, and for actions (\`useActionState\`) when a form is the source of the update.
</Answer>

## Rules

1. Call hooks from a component or another hook, in the same order every render.
2. Do not copy props into state unless the copy is allowed to diverge.
3. If a value is computed from props or state, compute it during render. An effect that does \`setState\` with that value is an extra render.
4. \`useCallback\` does not make a function faster. It keeps the same function so a memoized child can skip rendering.

## Pitfalls

<Pitfall>
A missing effect dependency is a stale closure, not a performance win. If the effect over-fires, restructure the code (derive during render, or move the value into the effect) instead of silencing the lint.
</Pitfall>
`.replace(/^import body\n/, ''),
};

export const interviewArticles = {
  'self-introduction': `import body
I am Trung Nguyen, a backend engineer. I have been building server-side systems since 2018.

I spend most of my time on TypeScript services: Node.js and NestJS, PostgreSQL, and messaging with Kafka or a job queue when a request should not do the work inline. I also ship the occasional Next.js UI and I care about how the service is deployed, so Docker, Terraform, and Ansible show up in the same week as the application code.

These notes are how I prepare. I keep one page per concept, with a TL;DR I can say out loud and a pitfall I have actually hit or expect to be asked about.

I do not publish employer names, production numbers, or incident write-ups on this site. The STAR section is an outline until I decide a story is safe to tell in public.
`.replace(/^import body\n/, ''),

  'checklists/react': `import body
A short list I walk before a React interview. It is a study outline, not a transcript of any course.

## Components

- Function components, props, and state. What causes a render.
- Composition versus inheritance. Children and render props, briefly.
- Keys in lists, and why the index is a bad key when the list reorders.

## Hooks

- Rules of hooks.
- \`useState\`, \`useReducer\`, \`useRef\`, \`useContext\`.
- \`useEffect\`: synchronization, cleanup, and why derived state does not belong there.
- \`useMemo\` and \`useCallback\`: identity, not a default optimization.
- React 19: \`use\`, actions, and \`useOptimistic\` at a high level.

## Rendering

- Render is pure. Effects and event handlers are where side effects live.
- State updates are queued. Several \`setState\` calls in one event are batched.
- Lifting state, and when a context is the wrong global store.

## Data

- Where the server cache lives (I name the library I last used and stop there).
- Forms: controlled inputs, pending state, and showing an error without wiping what the user typed.
`.replace(/^import body\n/, ''),
};
