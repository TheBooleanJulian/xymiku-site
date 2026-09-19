// Custom element from the RSS.app wall widget (loaded via
// components/InstagramFeed.tsx), not a real DOM element TS knows about.
// React 19's JSX namespace lives inside the "react" module now, not the
// global scope, so it has to be augmented there rather than globally.
import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "rssapp-wall": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        id: string;
      };
    }
  }
}
