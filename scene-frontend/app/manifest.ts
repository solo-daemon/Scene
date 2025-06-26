import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    description: "mine is sorted, is yours?",
    name: 'scene',
    short_name: 'scene',
    start_url: '/',
    display: 'standalone',
    theme_color: "#FFFFFF",
    background_color: "#FFFFFF",
    orientation: "portrait",
    icons: [
      {
        src: '/scene-app-manifest-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/scene-app-manifest-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    screenshots: [
      {
        src: '/scene-android-launchericon-512.png',
        sizes: '512x512',
        type: 'image/png',
        form_factor: 'narrow', // for mobile
      },
      {
        src: '/scene-windows-launchericon-1280.png',
        sizes: '1240x600',
        type: 'image/png',
        form_factor: 'wide', // for desktop
      },
    ],
  }
}