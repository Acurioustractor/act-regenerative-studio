import { AskACT } from '@/components/AskACT';

export const metadata = {
  title: 'Ask ACT | A Curious Tractor',
  description: 'Query the comprehensive ACT knowledge base covering finance, legal, operations, and content templates.',
};

export default function AskPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-stone-50 to-white py-12">
      <AskACT />
    </main>
  );
}
