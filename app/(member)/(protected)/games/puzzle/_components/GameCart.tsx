import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface GameCardProps {
  title: string;
  description: string;
  icon: string;
  colorClass: string;
  route: string;
}

export const GameCard = ({ title, description, icon, colorClass, route }: GameCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
      onClick={() => navigate(route)}
      className={cn(
        "group relative overflow-hidden border-none p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer",
        colorClass
      )}
    >
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="mb-4 transform transition-transform duration-300 group-hover:scale-110">
          <img src={icon} alt={title} className="h-24 w-24 object-contain" />
        </div>
        <h3 className="mb-2 text-2xl font-bold text-white">{title}</h3>
        <p className="text-sm text-white/90">{description}</p>
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </Card>
  );
};
