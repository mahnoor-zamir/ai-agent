'use server';

import { cookies } from 'next/headers';

export async function deleteCookie(name: string) {
  const cookieStore = await cookies();
  cookieStore.delete(name);
  console.log(`Deleted cookie: ${name}`);
}