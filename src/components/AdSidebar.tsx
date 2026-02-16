import { useEffect, useRef } from "react";

const AdSidebar = () => {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (!adContainerRef.current || scriptLoadedRef.current) return;

    // Create the <ins> element for the ad
    const ins = document.createElement("ins");
    ins.id = "social-ads";
    ins.className = "social-ads";
    ins.setAttribute(
      "data-social-ads.placement",
      "4919fe52ccf84de4af745fc2382813f8"
    );
    ins.setAttribute(
      "data-social-ads.creative",
      "4919fe52ccf84de4af745fc2382813f8"
    );

    adContainerRef.current.appendChild(ins);

    // Load the ad script
    const script = document.createElement("script");
    script.src = "https://ads.socialdisplay.com/js/ins/display.min.js";
    script.async = true;
    adContainerRef.current.appendChild(script);

    scriptLoadedRef.current = true;

    return () => {
      // Cleanup on unmount
      if (adContainerRef.current) {
        adContainerRef.current.innerHTML = "";
      }
      scriptLoadedRef.current = false;
    };
  }, []);

  return (
    <aside className="hidden lg:flex flex-col w-[300px] min-w-[300px] border-l border-border bg-card/50 backdrop-blur-sm">
      {/* Ad Label */}
      <div className="px-4 pt-4 pb-2">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-medium">
          Sponsored
        </span>
      </div>

      {/* Ad Container */}
      <div
        ref={adContainerRef}
        className="px-4 flex-1 flex flex-col items-center"
        style={{ minHeight: "250px" }}
      />

      {/* Subtle bottom gradient fade */}
      <div className="h-16 bg-gradient-to-t from-card/80 to-transparent pointer-events-none" />
    </aside>
  );
};

export default AdSidebar;
