import React from "react";

interface CharacterArtProps {
  type: "prayer" | "habit" | "journal" | "finance" | "tasks" | "learning";
  className?: string;
}

const artifactBase = "/@fs/C:/Users/masud/.gemini/antigravity-ide/brain/8632299d-3bb4-4082-9ca5-32322c07c88f";

const generatedPngUrls: Record<CharacterArtProps["type"], string> = {
  prayer: `${artifactBase}/character_prayer_action_1785165178958.png`,
  habit: `${artifactBase}/character_habit_action_1785165196179.png`,
  journal: `${artifactBase}/character_journal_action_1785165209033.png`,
  finance: `${artifactBase}/character_finance_action_1785165221409.png`,
  tasks: `${artifactBase}/character_tasks_action_1785165234557.png`,
  learning: `${artifactBase}/character_learning_action_1785165247315.png`,
};

export const CharacterArtImage: React.FC<CharacterArtProps> = ({ type, className = "" }) => {
  return (
    <div className={`relative pointer-events-none select-none ${className}`}>
      <img
        src={generatedPngUrls[type]}
        alt={`${type} generated illustration`}
        className="w-full h-full object-contain mix-blend-multiply filter contrast-105 rounded-2xl"
      />
    </div>
  );
};
