"use client";

import { useState, useEffect } from "react";
import { fetchOGData, OGData } from "@/lib/og-fetcher";

interface UseOGImageResult {
  imageUrl: string | null;
  loading: boolean;
  error: string | null;
  ogData: OGData | null;
}

export function useOGImage(url: string | undefined): UseOGImageResult {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ogData, setOgData] = useState<OGData | null>(null);

  useEffect(() => {
    if (!url) {
      setImageUrl(null);
      setLoading(false);
      setError(null);
      setOgData(null);
      return;
    }

    let cancelled = false;
    const urlToFetch = url; // Capture for async closure

    async function fetchImage() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchOGData(urlToFetch);

        if (cancelled) return;

        if (data) {
          setOgData(data);
          setImageUrl(data.image || null);
        } else {
          setError("No OG data found");
        }
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to fetch OG image");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchImage();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { imageUrl, loading, error, ogData };
}
