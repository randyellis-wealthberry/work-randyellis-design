"use client";

import React, { useState } from "react";
import { HamburgerButton, MemoizedHamburgerButton } from "./hamburger-button";

export function HamburgerButtonDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSecondOpen, setIsSecondOpen] = useState(false);
  const [isThirdOpen, setIsThirdOpen] = useState(false);

  return (
    <div className="p-8 space-y-8 bg-background text-foreground">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Hamburger Button Component Demo</h2>
        <p className="text-muted-foreground">
          Interactive examples of the animated hamburger button with different configurations.
        </p>
      </div>

      {/* Default Usage */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Default Usage</h3>
        <div className="flex items-center gap-4">
          <HamburgerButton
            isOpen={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle main menu"
          />
          <div className="text-sm text-muted-foreground">
            State: {isOpen ? "Open" : "Closed"}
          </div>
        </div>
      </div>

      {/* Different Sizes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Different Sizes</h3>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <HamburgerButton
              isOpen={false}
              onClick={() => {}}
              size="sm"
              aria-label="Small menu"
            />
            <span className="text-xs text-muted-foreground">Small</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <HamburgerButton
              isOpen={false}
              onClick={() => {}}
              size="md"
              aria-label="Medium menu"
            />
            <span className="text-xs text-muted-foreground">Medium</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <HamburgerButton
              isOpen={false}
              onClick={() => {}}
              size="lg"
              aria-label="Large menu"
            />
            <span className="text-xs text-muted-foreground">Large</span>
          </div>
        </div>
      </div>

      {/* Different Variants */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Different Variants</h3>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <HamburgerButton
              isOpen={false}
              onClick={() => {}}
              variant="default"
              aria-label="Default menu"
            />
            <span className="text-xs text-muted-foreground">Default</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <HamburgerButton
              isOpen={false}
              onClick={() => {}}
              variant="muted"
              aria-label="Muted menu"
            />
            <span className="text-xs text-muted-foreground">Muted</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <HamburgerButton
              isOpen={false}
              onClick={() => {}}
              variant="accent"
              aria-label="Accent menu"
            />
            <span className="text-xs text-muted-foreground">Accent</span>
          </div>
        </div>
      </div>

      {/* Animated State Example */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Animated State Example</h3>
        <div className="flex items-center gap-4">
          <HamburgerButton
            isOpen={isSecondOpen}
            onClick={() => setIsSecondOpen(!isSecondOpen)}
            size="lg"
            variant="accent"
            aria-label="Toggle secondary menu"
          />
          <div className="text-sm text-muted-foreground">
            Click to see the smooth 300ms animation
          </div>
        </div>
      </div>

      {/* Disabled State */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Disabled State</h3>
        <div className="flex items-center gap-6">
          <HamburgerButton
            isOpen={false}
            onClick={() => {}}
            disabled
            aria-label="Disabled menu"
          />
          <div className="text-sm text-muted-foreground">
            Disabled button (not interactive)
          </div>
        </div>
      </div>

      {/* Memoized Version */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Memoized Version</h3>
        <div className="flex items-center gap-4">
          <MemoizedHamburgerButton
            isOpen={isThirdOpen}
            onClick={() => setIsThirdOpen(!isThirdOpen)}
            aria-label="Toggle optimized menu"
          />
          <div className="text-sm text-muted-foreground">
            Memoized component for performance optimization
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Usage Examples</h3>
        <div className="bg-muted p-4 rounded-lg">
          <pre className="text-sm overflow-x-auto">
{`import { HamburgerButton } from "@/components/ui/hamburger-button";

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <HamburgerButton
      isOpen={isOpen}
      onClick={() => setIsOpen(!isOpen)}
      size="md"
      variant="default"
      aria-label="Toggle navigation menu"
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
    />
  );
}`}
          </pre>
        </div>
      </div>

      {/* Accessibility Features */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Accessibility Features</h3>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li>• Proper ARIA labels and expanded states</li>
          <li>• Keyboard navigation support</li>
          <li>• Focus visible states</li>
          <li>• Touch-friendly (minimum 44px)</li>
          <li>• Screen reader announcements</li>
          <li>• High contrast support</li>
        </ul>
      </div>
    </div>
  );
}