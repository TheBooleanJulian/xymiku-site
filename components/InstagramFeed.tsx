"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { InstagramPost } from "@/lib/instagram";

const PROFILE_URL = "https://www.instagram.com/xymiku.39/";

function PostCard({ post }: { post: InstagramPost }) {
  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener"
      className="group relative flex w-[240px] shrink-0 flex-col overflow-hidden border border-cyan/10 bg-deep sm:w-[300px] lg:w-[360px]"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={post.image}
          alt={post.caption || "Instagram post"}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute top-2 left-2 h-3 w-3 border-t border-l border-cyan/50" />
        <span className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-cyan/50" />
      </div>
      {post.caption && (
        <p className="line-clamp-2 px-3 py-3 font-technical text-[11px] leading-relaxed text-mute">
          {post.caption}
        </p>
      )}
    </a>
  );
}

export function InstagramFeed({ posts }: { posts: InstagramPost[] }) {
  const prefersReducedMotion = useReducedMotion();
  const duration = Math.max(20, posts.length * 6);
  const track = prefersReducedMotion ? posts : [...posts, ...posts];

  return (
    <section id="instagram" className="border-b border-cyan/15 px-4 py-16 sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <div className="flex flex-wrap items-end justify-between gap-4 px-0 sm:px-0">
          <div className="flex flex-col gap-2">
            <p className="font-technical text-xs tracking-[0.3em] text-cyan">
              INSTAGRAM UPLINK //
            </p>
            <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
              LATEST FROM <span className="text-cyan">@XYMIKU.39</span>
            </h2>
          </div>
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noopener"
            className="border border-cyan/20 px-4 py-2 font-technical text-[10px] tracking-[0.15em] text-mute transition-colors hover:border-cyan hover:text-cyan"
          >
            VIEW PROFILE
          </a>
        </div>

        {posts.length > 0 ? (
          <div className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-black to-transparent sm:w-24" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-black to-transparent sm:w-24" />
            <motion.div
              className="flex gap-4"
              animate={prefersReducedMotion ? undefined : { x: ["0%", "-50%"] }}
              transition={{ duration, repeat: Infinity, ease: "linear" }}
            >
              {track.map((post, i) => (
                <PostCard key={`${post.id}-${i}`} post={post} />
              ))}
            </motion.div>
          </div>
        ) : (
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noopener"
            className="border border-cyan/15 bg-cyan-panel/10 px-6 py-10 text-center font-technical text-xs tracking-[0.2em] text-mute transition-colors hover:border-cyan/40 hover:text-cyan"
          >
            SIGNAL OFFLINE // FEED NOT CONFIGURED — TAP TO VIEW PROFILE
          </a>
        )}
      </div>
    </section>
  );
}
