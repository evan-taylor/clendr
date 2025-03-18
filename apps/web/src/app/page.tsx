import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/calendar');
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
} 