import { redirect } from 'next/navigation';

import { routes } from '@/lib/config/routes';

export default function HomePage() {
  redirect(routes.login);
}
