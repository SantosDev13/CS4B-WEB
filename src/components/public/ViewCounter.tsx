"use client";

import { useEffect, useRef } from "react";

interface ViewCounterProps {
  slug: string;
}

export default function ViewCounter({ slug }: ViewCounterProps) {
  const hasCalled = useRef(false);

  useEffect(() => {
    if (hasCalled.current) return;
    hasCalled.current = true;

    fetch(`/api/posts/${slug}/vistas`, {
      method: "POST",
      credentials: "include",
    }).catch((err) => {
      console.error("Error incrementando vistas:", err);
    });
  }, [slug]);

  return null;
}