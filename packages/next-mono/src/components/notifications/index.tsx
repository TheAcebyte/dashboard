"use client";

import NoNotificationState from "@/components/notifications/no-notification-state";
import NotificationEntry from "@/components/notifications/notification-entry";
import { buttonStyles } from "@/components/ui/button";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
  dropdownContext,
} from "@/components/ui/dropdown";
import { cst } from "@/constants";
import { PaginatedActiveStudentRecord } from "@/db/queries/sessions";
import usePolling from "@/hooks/use-polling";
import { fetchAllPages } from "@/lib/paginate";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/stores/settings-store";
import { Bell } from "lucide-react";
import { CheckCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

const activeStudentEndpoint = new URL("/api/students/active", cst.APP_URL);
const pollingDelay = 5000;

export default function Notifications() {
  const t = useTranslations("notifications");
  const { enabledNotifications } = useSettingsStore();

  const [students, setStudents] = useState<PaginatedActiveStudentRecord[]>([]);
  const [firstUnseenIndex, setFirstUnseenIndex] = useState(0);
  const sinceDateRef = useRef(Date.now());

  const fetchNewerActiveStudents = useCallback(() => {
    const url = new URL(activeStudentEndpoint);
    url.searchParams.set("since", sinceDateRef.current.toString());
    sinceDateRef.current = Date.now();
    fetchAllPages<PaginatedActiveStudentRecord>(url).then((newerStudents) => {
      setStudents((students) => [...students, ...newerStudents]);
    });
  }, []);
  usePolling(fetchNewerActiveStudents, pollingDelay, enabledNotifications);

  const readAllNotifications = () => setFirstUnseenIndex(students.length);
  const isUnseenNotification = (index: number) =>
    index <= students.length - firstUnseenIndex - 1;
  const notificationCount = students.length - firstUnseenIndex;
  const pending = notificationCount > 0;

  return (
    <Dropdown>
      <DropdownTrigger
        className={cn(buttonStyles.outline, "relative aspect-square p-4")}
      >
        <NotificationDropdownTrigger
          pending={pending}
          readAll={readAllNotifications}
        />
      </DropdownTrigger>
      <DropdownContent
        align="right"
        offsetY={8}
        className="max-h-[400px] overflow-y-auto rounded-2xl border border-default-border bg-primary-bg"
      >
        <header className="flex items-center justify-between gap-16 border-b border-default-border px-4 py-2">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-primary-fg">
              {t("notifications")}
            </h1>
            <p className="aspect-square rounded-full bg-primary-hover-bg p-1 text-sm font-semibold text-secondary-fg">
              {notificationCount}
            </p>
          </div>
          <CheckCheck
            size={20}
            className={cn(
              "transition-colors",
              pending
                ? "cursor-pointer text-secondary-fg hover:text-secondary-hover-fg"
                : "text-accent-fg",
            )}
            onClick={readAllNotifications}
          />
        </header>
        {students.length == 0 ? (
          <NoNotificationState />
        ) : (
          <ul className="flex flex-col gap-4 p-4">
            {students.toReversed().map((student, index) => {
              return (
                <NotificationEntry
                  key={`${student.sessionId}-${student.studentId}`}
                  student={student}
                  unseen={isUnseenNotification(index)}
                />
              );
            })}
          </ul>
        )}
      </DropdownContent>
    </Dropdown>
  );
}

interface Props {
  pending: boolean;
  readAll: () => void;
}

function NotificationDropdownTrigger({ pending, readAll }: Props) {
  const contextValue = useContext(dropdownContext);
  if (!contextValue) {
    throw new Error(
      "NotificationDropdownTrigger must be placed inside a Dropdown component.",
    );
  }

  const { active } = contextValue;
  useEffect(() => {
    if (!active) readAll();
  }, [active]);

  return (
    <>
      <Bell className="relative" />
      {pending && (
        <div className="absolute top-4 right-[18px] size-2 rounded-full bg-destructive-fg outline-3 outline-primary-bg" />
      )}
    </>
  );
}
