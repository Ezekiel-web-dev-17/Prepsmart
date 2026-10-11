/**
 * Utilities for Web Push API and VAPID key conversion
 */

/**
 * Converts a base64 string to a Uint8Array for applicationServerKey
 */
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Fallback demo public key if NEXT_PUBLIC_VAPID_PUBLIC_KEY is not defined in env
export const DEFAULT_VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-Skv6_DQhQjYpJyq7R8v4g6Jv6F4K8q1Y9q0P1A2B3C4D5E6F7G8H9I0";
