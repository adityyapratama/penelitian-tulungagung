import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const activities = [
  { user: "Ahmad Rizki", action: "menyelesaikan kuis", target: "Sejarah Indonesia" },
  { user: "Sari Dewi", action: "menyelesaikan puzzle", target: "Candi Borobudur" },
  { user: "Budi Santoso", action: "membaca cerita", target: "Petualangan Hutan" },
  { user: "Citra Lestari", action: "mencapai level 5", target: "" },
  { user: "Eko Prasetyo", action: "menyelesaikan puzzle", target: "Peta Nusantara" },
];

export function RecentActivities() {
  return (
    <div className="space-y-6">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`/avatars/0${index + 1}.png`} alt="Avatar" />
            <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium">
              {activity.user}{" "}
              <span className="text-muted-foreground">{activity.action}</span>
              {activity.target && <span className="text-primary"> {activity.target}</span>}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}