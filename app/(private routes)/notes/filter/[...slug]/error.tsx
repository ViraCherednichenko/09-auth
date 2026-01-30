"use client";

import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <p>Something went wrong.</p>
      <button type="button" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}