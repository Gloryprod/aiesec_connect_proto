import React from "react";
import { Badge } from "@/components/ui/Badge";

interface JourneyStep {
  year: string;
  role: string;
  description: string;
  tag: string;
}

export const JourneyTimeline: React.FC<{ steps: JourneyStep[] }> = ({ steps }) => {
  return (
    <div className="relative border-l-2 border-aiesec-border ml-4 pl-6 space-y-6 my-4">
      {steps.map((step, idx) => (
        <div key={idx} className="relative group">
          {/* Node Icon */}
          <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-aiesec-surface border-2 border-aiesec-blue flex items-center justify-center text-aiesec-blue">
            <div className="w-2 h-2 rounded-full bg-aiesec-blue" />
          </div>

          <div className="bg-aiesec-surface border border-aiesec-border rounded-xl p-4 shadow-sm">
            <span className="font-heading font-bold text-xs text-aiesec-blue">{step.year}</span>
            <h4 className="font-heading font-semibold text-base text-aiesec-navy mt-0.5">{step.role}</h4>
            <p className="font-sans text-xs text-aiesec-text-secondary mt-1">{step.description}</p>
            <div className="mt-2.5">
              <Badge variant="purple" size="sm">{step.tag}</Badge>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};