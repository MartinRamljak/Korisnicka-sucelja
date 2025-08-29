import { useState, useEffect } from "react";

export function useHorizontalScroll(scrollRef: React.RefObject<HTMLElement>) {
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const updateArrows = () => {
    const container = scrollRef.current;
    if (!container) return;

    const { scrollLeft, scrollWidth, clientWidth } = container;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(Math.ceil(scrollLeft + clientWidth) < Math.floor(scrollWidth));
  };

  const waitForScrollEnd = (el: HTMLElement, callback: () => void, timeout = 100) => {
    let isScrolling: number;

    const check = () => {
      window.clearTimeout(isScrolling);
      isScrolling = window.setTimeout(callback, timeout);
    };

    el.addEventListener("scroll", check);
    isScrolling = window.setTimeout(callback, timeout);

    return () => {
      el.removeEventListener("scroll", check);
      clearTimeout(isScrolling);
    };
  };

  const handleScroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;

    const firstChild = container.firstElementChild as HTMLElement | null;
    const cardWidth = firstChild?.clientWidth || container.clientWidth;
    const gap =
      parseInt(window.getComputedStyle(container).gap || "0", 10) || 0;

    // Scroll exactly one "card" at a time (plus gap)
    const scrollAmount = cardWidth + gap;

    container.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });

    waitForScrollEnd(container, updateArrows);
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    updateArrows();
    const cleanup = waitForScrollEnd(container, updateArrows);
    window.addEventListener("resize", updateArrows);

    return () => {
      cleanup();
      window.removeEventListener("resize", updateArrows);
    };
  }, [scrollRef]);

  return { showLeftArrow, showRightArrow, handleScroll };
}
