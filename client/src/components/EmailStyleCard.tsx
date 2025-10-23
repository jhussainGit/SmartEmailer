import { Card } from "@/components/ui/card";
import { EmailStyle } from "@/lib/emailStyles";
import { LucideIcon } from "lucide-react";

interface EmailStyleCardProps {
  style: EmailStyle;
  isSelected: boolean;
  onClick: () => void;
}

export default function EmailStyleCard({ style, isSelected, onClick }: EmailStyleCardProps) {
  const Icon: LucideIcon = style.icon;

  return (
    <Card
      className={`p-4 cursor-pointer transition-all hover-elevate active-elevate-2 ${
        isSelected ? 'border-primary border-2' : ''
      }`}
      onClick={onClick}
      data-testid={`style-card-${style.id}`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="font-medium text-sm">{style.name}</h3>
        </div>
        <p className="text-xs text-muted-foreground">{style.description}</p>
      </div>
    </Card>
  );
}
