import React from "react";

export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-4">
      <div className="flex items-center justify-center p-4 bg-gray-100 rounded-full">
        <Icon className="h-8 w-8 text-gray-500" />
      </div>
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
