import React, { useEffect } from "react";
import {
  TerminalAnimationRoot,
  TerminalAnimationWindow,
  TerminalAnimationContent,
  TerminalAnimationCommandBar,
  TerminalAnimationOutput,
} from "@/components/ui/terminal-animation";
import type { TabContent } from "@/components/ui/terminal-animation";

const tabs: TabContent[] = [
  {
    label: "profile",
    command: "cat profile.json",
    lines: [
      { text: "", delay: 100 },
      { text: "{", delay: 100 },
      { text: '  "name": "Yujun Pan",', delay: 100, color: "text-primary" },
      { text: '  "role": "Product Engineering",', delay: 100, color: "text-primary" },
      { text: "}", delay: 100 },
      { text: "", delay: 100 },
    ],
  },
];

export function Greeting({ onComplete }: { onComplete?: () => void }) {
  useEffect(() => {
    if (onComplete) {
      // Allow enough time for typing and lines to appear
      const t = setTimeout(onComplete, 4000);
      return () => clearTimeout(t);
    }
  }, [onComplete]);

  return (
    <div className="w-full max-w-xl mx-auto px-6">
      <TerminalAnimationRoot tabs={tabs}>
        <TerminalAnimationWindow
          backgroundColor="transparent"
          minHeight="180px"
          className="border border-border shadow-xl rounded-lg bg-card/50 backdrop-blur-md"
          animateOnVisible={true}
        >
          {/* Default Mac-style title bar */}
          <div className="flex items-center px-4 h-8 bg-muted/80 border-b border-border">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-primary/30"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-primary/30"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-primary/30"></div>
            </div>
          </div>

          <TerminalAnimationContent className="text-sm font-mono p-5 leading-relaxed">
            <div className="flex items-center gap-2">
              <span className="text-primary font-bold">guest@yujun:~$</span>
              <TerminalAnimationCommandBar className="text-foreground font-medium" />
            </div>
            <TerminalAnimationOutput className="mt-1 text-foreground/80 whitespace-pre font-medium" />
          </TerminalAnimationContent>
        </TerminalAnimationWindow>
      </TerminalAnimationRoot>
    </div>
  );
}
