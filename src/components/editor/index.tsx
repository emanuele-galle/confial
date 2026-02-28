import dynamic from "next/dynamic";

// Code-split AdvancedEditor to keep initial bundle small
// TipTap + all extensions ≈ 80KB, loaded only when needed
export const AdvancedEditor = dynamic(
  () => import("./advanced-editor").then((mod) => ({ default: mod.AdvancedEditor })),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] border border-gray-300 rounded-lg animate-pulse bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-sm">Caricamento editor...</p>
      </div>
    ),
  }
);

// Export basic editor for backward compatibility

// Export types
