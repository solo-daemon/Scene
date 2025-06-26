import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import slamBlankTemplate from "@/app/assets/slam-assets/SlamBlankTemplate.png"
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// export const exportElementAsImage = async (
//   element: HTMLElement,
//   fileName = 'slam-card.png'
// ) => {
//   try {
//     // Wait for all fonts to load
//     await (document as any).fonts?.ready;

//     const canvas = await html2canvas(element, {
//       backgroundColor: null,
//       useCORS: true,
//       scale: 2, // higher resolution
//     });

//     const dataUrl = canvas.toDataURL('image/png');

//     const link = document.createElement('a');
//     link.href = dataUrl;
//     link.download = fileName;
//     link.click();
//   } catch (err) {
//     console.error('❌ Error exporting image:', err);
//   }
// };
export const handleSlamTemplateDownload = () => {
    const link = document.createElement('a');
    link.href = slamBlankTemplate.src; // 🔥 use .src here
    link.download = 'scene-slam-template.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

};

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "";

  const first = parts[0][0]?.toUpperCase() || "";

  let second = "";
  if (parts.length > 1 && /^[a-zA-Z]/.test(parts[1])) {
    second = parts[1][0]?.toUpperCase() || "";
  } else if (parts[0].length > 1) {
    second = parts[0][1]?.toUpperCase() || "";
  }

  return first + second;
}