"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function TranslationWatcher() {
  const pathname = usePathname();
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const getActiveLang = () => {
      const saved = localStorage.getItem("aayu_selected_language");
      if (saved && saved !== "en") return saved;
      const match = document.cookie.match(/(?:^|;\s*)googtrans=\/en\/([^;]+)/);
      if (match && match[1] && match[1] !== "en") return match[1];
      return null;
    };

    const reapplyTranslation = () => {
      const activeLang = getActiveLang();
      if (!activeLang) return;

      const combo = document.querySelector(".goog-te-combo") as HTMLSelectElement | null;
      if (!combo) return;

      if (combo.value !== activeLang) {
        combo.value = activeLang;
      }
      combo.dispatchEvent(new Event("change", { bubbles: true }));
    };

    const scheduleReapply = (delay = 200) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        reapplyTranslation();
      }, delay);
    };

    // 1. Re-apply on route/pathname change
    scheduleReapply(300);

    // 2. Re-apply when any button or link is clicked
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Don't intercept language dropdown itself
      if (target.closest("[aria-label*='language']")) return;

      const isInteractive = target.closest("button, a, input, select, textarea, [role='button'], [role='tab']");
      if (isInteractive) {
        scheduleReapply(150);
      }
    };

    window.addEventListener("click", handleClick, { capture: true });

    // 3. MutationObserver to catch React state re-renders (tabs, filters, toggles)
    const observer = new MutationObserver((mutations) => {
      const activeLang = getActiveLang();
      if (!activeLang) return;

      let hasNewContent = false;
      for (const mutation of mutations) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
          for (const node of Array.from(mutation.addedNodes)) {
            // Ignore Google Translate's own inserted elements
            if (
              node.nodeType === Node.ELEMENT_NODE &&
              !(node as HTMLElement).classList.contains("goog-te-combo") &&
              !(node as HTMLElement).classList.contains("skiptranslate") &&
              (node as HTMLElement).id !== "goog-gt-tt"
            ) {
              hasNewContent = true;
              break;
            }
          }
        }
        if (hasNewContent) break;
      }

      if (hasNewContent) {
        scheduleReapply(250);
      }
    });

    const mainEl = document.querySelector("main") || document.body;
    observer.observe(mainEl, { childList: true, subtree: true });

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      window.removeEventListener("click", handleClick, { capture: true });
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
