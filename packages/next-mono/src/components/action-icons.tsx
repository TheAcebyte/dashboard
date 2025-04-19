import Notifications from "@/components/notifications";
import ThemeSwitch from "@/components/theme-switch";

export default function ActionIcons() {
  return (
    <div className="fixed top-4 right-8 flex gap-4">
      <ThemeSwitch />
      <Notifications />
    </div>
  );
}
