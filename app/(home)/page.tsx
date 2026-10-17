import { redirect } from 'next/navigation';

const frontNote = '/notes/databases/transaction-isolation-levels';

export default function HomePage() {
  redirect(frontNote);
}
