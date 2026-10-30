import { useState } from "react";

export interface BrandItem {
  id: string;
  name: string;
  shortName: string;
  logo: string;
  whiteLogo: string;
  category: string;
  searchQuery?: string;
}

export const TOP_MEDICAL_BRANDS: BrandItem[] = [
  {
    id: "mindray",
    name: "Mindray",
    shortName: "Mindray",
    logo: "/brands/mindray.png",
    whiteLogo: "/brands/mindray_white.png",
    category: "Patient Monitoring & Ultrasound",
    searchQuery: "Mindray",
  },
  {
    id: "siemens",
    name: "Siemens Healthineers",
    shortName: "Siemens",
    logo: "/brands/siemens.png",
    whiteLogo: "/brands/siemens_white.png",
    category: "MRI, CT & Imaging Systems",
    searchQuery: "Siemens",
  },
  {
    id: "ge_healthcare",
    name: "GE HealthCare",
    shortName: "GE HealthCare",
    logo: "/brands/ge_healthcare.png",
    whiteLogo: "/brands/ge_healthcare_white.png",
    category: "Diagnostic & Surgical Imaging",
    searchQuery: "GE",
  },
  {
    id: "philips",
    name: "Philips Healthcare",
    shortName: "Philips",
    logo: "/brands/philips.png",
    whiteLogo: "/brands/philips_white.png",
    category: "Diagnostic ECG & Patient Care",
    searchQuery: "Philips",
  },
  {
    id: "medtronic",
    name: "Medtronic",
    shortName: "Medtronic",
    logo: "/brands/medtronic.png",
    whiteLogo: "/brands/medtronic_white.png",
    category: "Therapies & Surgical Systems",
    searchQuery: "Medtronic",
  },
  {
    id: "stryker",
    name: "Stryker",
    shortName: "Stryker",
    logo: "/brands/stryker.png",
    whiteLogo: "/brands/stryker_white.png",
    category: "Endoscopy & Orthopedic Care",
    searchQuery: "Stryker",
  },
  {
    id: "draeger",
    name: "Dräger",
    shortName: "Dräger",
    logo: "/brands/draeger.png",
    whiteLogo: "/brands/draeger_white.png",
    category: "Anesthesia & Critical Ventilation",
    searchQuery: "Draeger",
  },
  {
    id: "olympus",
    name: "Olympus",
    shortName: "Olympus",
    logo: "/brands/olympus.png",
    whiteLogo: "/brands/olympus_white.png",
    category: "Endoscopic & Surgical Solutions",
    searchQuery: "Olympus",
  },
  {
    id: "abbott",
    name: "Abbott",
    shortName: "Abbott",
    logo: "/brands/abbott.png",
    whiteLogo: "/brands/abbott_white.png",
    category: "Cardiovascular & Diagnostics",
    searchQuery: "Abbott",
  },
  {
    id: "canon",
    name: "Canon Medical",
    shortName: "Canon Medical",
    logo: "/brands/canon.png",
    whiteLogo: "/brands/canon_white.png",
    category: "Advanced Diagnostic Radiology",
    searchQuery: "Canon",
  },
  {
    id: "jnj",
    name: "Johnson & Johnson",
    shortName: "J&J MedTech",
    logo: "/brands/jnj.png",
    whiteLogo: "/brands/jnj_white.png",
    category: "Orthopedic & Surgical Technology",
    searchQuery: "Johnson",
  },
  {
    id: "boston_scientific",
    name: "Boston Scientific",
    shortName: "Boston Scientific",
    logo: "/brands/boston_scientific.png",
    whiteLogo: "/brands/boston_scientific_white.png",
    category: "Interventional Medical Solutions",
    searchQuery: "Boston Scientific",
  },
  {
    id: "b_braun",
    name: "B. Braun",
    shortName: "B. Braun",
    logo: "/brands/b_braun.png",
    whiteLogo: "/brands/b_braun_white.png",
    category: "Infusion Therapy & Dialysis",
    searchQuery: "B Braun",
  },
  {
    id: "shimadzu",
    name: "Shimadzu",
    shortName: "Shimadzu",
    logo: "/brands/shimadzu.png",
    whiteLogo: "/brands/shimadzu_white.png",
    category: "Medical X-Ray & Angiography",
    searchQuery: "Shimadzu",
  },
  {
    id: "bd",
    name: "BD",
    shortName: "BD Becton Dickinson",
    logo: "/brands/bd.png",
    whiteLogo: "/brands/bd_white.png",
    category: "Medication Delivery & Diagnostics",
    searchQuery: "BD",
  },
];

interface BrandCardProps {
  brand: BrandItem;
  variant?: "teal" | "light" | "glass";
}

function BrandLogoItem({ brand, variant = "teal" }: BrandCardProps) {
  const [imgError, setImgError] = useState(false);

  const imgSrc = variant === "light" 
    ? (imgError ? brand.whiteLogo : brand.logo)
    : (imgError ? brand.logo : brand.whiteLogo);

  return (
    <div
      className={`relative flex items-center gap-2.5 px-4 py-2 rounded-xl select-none shrink-0 ${
        variant === "teal"
          ? "bg-white/10 border border-white/15 text-white shadow-sm"
          : variant === "glass"
          ? "bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/80 dark:border-slate-800/80 text-slate-800 dark:text-slate-100 shadow-sm"
          : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-sm"
      }`}
    >
      <div className="relative flex items-center justify-center w-7 h-7 shrink-0">
        <img
          src={imgSrc}
          alt={`${brand.name} logo`}
          onError={() => setImgError(true)}
          className={`max-h-7 max-w-[28px] object-contain ${
            variant === "teal" ? "brightness-100 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" : ""
          }`}
          loading="lazy"
        />
      </div>

      <span className="text-xs sm:text-sm font-bold tracking-tight whitespace-nowrap">
        {brand.name}
      </span>
    </div>
  );
}

export interface BrandMarqueeTickerProps {
  variant?: "teal" | "light" | "glass";
  className?: string;
  showTitle?: boolean;
}

export function BrandMarqueeTicker({
  variant = "teal",
  className = "",
  showTitle = true,
}: BrandMarqueeTickerProps) {
  // Duplicate for seamless 50% translation loop
  const marqueeList = [...TOP_MEDICAL_BRANDS, ...TOP_MEDICAL_BRANDS];

  const containerStyles =
    variant === "teal"
      ? "bg-gradient-to-r from-[#00695C] via-[#00796B] to-[#004D40] text-white border-y border-teal-500/30 shadow-inner"
      : variant === "glass"
      ? "bg-slate-100/70 dark:bg-slate-900/70 backdrop-blur-md border-y border-slate-200/80 dark:border-slate-800/80"
      : "bg-slate-100 dark:bg-slate-900/90 border-y border-slate-200 dark:border-slate-800";

  return (
    <div className={`relative overflow-hidden w-full select-none cursor-default ${containerStyles} ${className}`}>
      <div className="flex items-center">
        {/* Optional Section Pill / Badge on the left */}
        {showTitle && (
          <div className={`flex items-center gap-2 pl-4 sm:pl-6 pr-4 sm:pr-6 shrink-0 py-3.5 z-20 border-r select-none ${
            variant === "teal" ? "border-white/15 bg-[#00695C]/90 backdrop-blur-sm" : "border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm"
          }`}>
            <span className="flex h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
            <div className="flex flex-col">
              <span className={`text-[11px] sm:text-xs font-extrabold tracking-wider uppercase whitespace-nowrap ${
                variant === "teal" ? "text-white" : "text-slate-900 dark:text-slate-100"
              }`}>
                Top Brands
              </span>
              <span className={`text-[9px] font-medium tracking-tight whitespace-nowrap hidden sm:inline-block ${
                variant === "teal" ? "text-teal-200" : "text-slate-500 dark:text-slate-400"
              }`}>
                15 Verified Partners
              </span>
            </div>
          </div>
        )}

        {/* Marquee viewport (pointer-events-none ensures no interaction and continuous static scrolling) */}
        <div className="relative flex-1 overflow-hidden py-3 pointer-events-none">
          {/* Subtle gradient fade edges */}
          <div className={`pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 z-10 ${
            variant === "teal"
              ? "bg-gradient-to-r from-[#00695C] to-transparent"
              : "bg-gradient-to-r from-slate-100 dark:from-slate-900 to-transparent"
          }`} />
          <div className={`pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 z-10 ${
            variant === "teal"
              ? "bg-gradient-to-l from-[#004D40] to-transparent"
              : "bg-gradient-to-l from-slate-100 dark:from-slate-900 to-transparent"
          }`} />

          {/* Continuous scrolling marquee track */}
          <div className="animate-marquee flex items-center gap-3 sm:gap-4 pl-4">
            {marqueeList.map((brand, idx) => (
              <BrandLogoItem
                key={`${brand.id}-${idx}`}
                brand={brand}
                variant={variant}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
