import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getImageUrl(path: string | undefined): string {
  if (!path) return '/placeholder.svg';
  if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) {
    return path;
  }
  // If it's a relative path starting with /uploads, prefix with backend URL
  // Otherwise, if it starts with /, it might be a public asset
  if (path.startsWith('/uploads')) {
    return `http://localhost:5000${path}`;
  }
  if (path.startsWith('uploads')) {
    return `http://localhost:5000/${path}`;
  }
  return path;
}
