import React from "react";
import { MobileHeader } from "./MobileHeader";
import { BottomNavigation, NavTab } from "./BottomNavigation";

interface MobileShellProps {
  children: React.ReactNode;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  title?: string;
  showBack?: boolean;
}

export const MobileShell: React.FC<MobileShellProps> = ({
  children,
  activeTab,
  onTabChange,
  title,
  showBack,
}) => {
  return (
    <div className="min-h-screen bg-aiesec-background max-w-md mx-auto shadow-2xl relative flex flex-col pb-20">
      <MobileHeader title={title} showBack={showBack} />
      <main className="flex-1 overflow-y-auto">{children}</main>
      <BottomNavigation activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
};