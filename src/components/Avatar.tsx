import React from "react";

interface AvatarProps {
    name: string;
    size?: "sm" | "md" | "lg" | "xl" | "2xl";
    className?: string;
    onClick?: () => void;
}

export const Avatar: React.FC<AvatarProps> = ({
    name,
    size = "md",
    className = "",
    onClick,
}) => {
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();
    };

    const getGradient = (name: string) => {
        const gradients = [
            "from-blue-500 to-cyan-500",
            "from-purple-500 to-pink-500",
            "from-emerald-500 to-teal-500",
            "from-orange-500 to-amber-500",
            "from-indigo-500 to-violet-500",
            "from-rose-500 to-red-500",
            "from-green-500 to-lime-500",
            "from-yellow-400 to-green-400",
            "from-fuchsia-500 to-purple-600",
            "from-sky-400 to-blue-600",
        ];
        const index = name.length % gradients.length;
        return gradients[index];
    };

    const sizeClasses = {
        sm: "w-8 h-8 text-xs",
        md: "w-10 h-10 text-sm",
        lg: "w-16 h-16 text-xl",
        xl: "w-24 h-24 text-3xl",
        "2xl": "w-32 h-32 text-4xl",
    };

    return (
        <div
            onClick={onClick}
            className={`
        ${sizeClasses[size]} 
        rounded-full 
        bg-linear-to-br ${getGradient(name)} 
        text-white font-bold flex items-center justify-center 
        shadow-lg shadow-gray-200/50 
        ${onClick ? "cursor-pointer hover:opacity-90 transition-opacity" : ""}
        ${className}
      `}
        >
            {getInitials(name)}
        </div>
    );
};
