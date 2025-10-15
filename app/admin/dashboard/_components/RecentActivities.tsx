import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
interface Activity {
  user: string;
  action: string;
  target: string;
}

interface RecentActivitiesProps {
  activities: Activity[];
}

export function RecentActivities({ activities }: RecentActivitiesProps) {
  return (
    <div className="space-y-6">
      {activities.map((activity, index) => (
        <div key={index} className="flex items-center gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`/avatars/0${index + 1}.png`} alt="Avatar" />
            <AvatarFallback>
              {activity.user.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-sm">
            <p className="font-medium">
              {activity.user}{" "}
              <span className="text-muted-foreground">{activity.action}</span>
              {activity.target && (
                <span className="text-primary"> {activity.target}</span>
              )}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
