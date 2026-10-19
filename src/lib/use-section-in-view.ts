import { useEffect, useState } from "react";

/** True while any part of the element with this id is on screen (false where IntersectionObserver is missing). */
export function useSectionInView(id: string): boolean {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = document.getElementById(id);
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([entry]) => setInView(!!entry?.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [id]);
  return inView;
}
