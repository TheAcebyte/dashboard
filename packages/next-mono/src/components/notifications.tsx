"use client";

import Avatar from "@/components/ui/avatar";
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
import { formatDateToHHmm, formatRelativeDay } from "@/lib/date";
import { fetchAllPages } from "@/lib/paginate";
import { cn } from "@/lib/utils";
import { Bell, BellOff } from "lucide-react";
import { CheckCheck } from "lucide-react";
import { useCallback, useContext, useEffect, useRef, useState } from "react";

const activeStudentEndpoint = new URL("/api/students/active", cst.APP_URL);
const pollingDelay = 5000;

export default function Notifications() {
  const [students, setStudents] = useState<PaginatedActiveStudentRecord[]>([]);
  const sinceDateRef = useRef(Date.now());
  const [firstUnseenIndex, setFirstUnseenIndex] = useState(0);

  const fetchNewerActiveStudents = useCallback(() => {
    const url = new URL(activeStudentEndpoint);
    url.searchParams.set("since", sinceDateRef.current.toString());
    sinceDateRef.current = Date.now();
    fetchAllPages<PaginatedActiveStudentRecord>(url).then((newerStudents) => {
      setStudents((students) => [...students, ...newerStudents]);
    });
  }, []);
  usePolling(fetchNewerActiveStudents, pollingDelay);

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
        className="max-h-[400px] overflow-y-auto rounded-2xl border border-gray-300 bg-white"
      >
        <header className="flex items-center justify-between gap-16 border-b border-gray-300 px-4 py-2">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-zinc-900">
              Notifications
            </h1>
            <p className="aspect-square rounded-full bg-gray-50 p-1 text-sm font-semibold text-gray-500">
              {notificationCount}
            </p>
          </div>
          <CheckCheck
            size={20}
            className={cn(
              "transition-colors",
              pending
                ? "cursor-pointer text-gray-500 hover:text-gray-600"
                : "text-green-700",
            )}
            onClick={readAllNotifications}
          />
        </header>
        {students.length == 0 ? (
          <NoNotificationState />
        ) : (
          <ul className="flex flex-col gap-4 p-4">
            {students.toReversed().map((student, index) => {
              const key = `${student.sessionId}-${student.studentId}`;
              const fullName = `${student.firstName} ${student.lastName}`;
              // Since status is either present or late, arrivedAt is guaranteed to exist
              const arrivalDate = new Date(student.arrivedAt!);
              const formattedDate = `${formatRelativeDay(arrivalDate)}, ${formatDateToHHmm(arrivalDate)}`;

              return (
                <li
                  key={key}
                  className="flex w-full items-center justify-between gap-8"
                >
                  <div className="flex items-center gap-4">
                    <Avatar src={student.pictureUrl} size={48} />
                    <div className="flex flex-col">
                      <p className="text-zinc-900">
                        <span className="font-medium">{fullName}</span> checked
                        in for{" "}
                        <span className="font-medium">
                          {student.groupName}.
                        </span>
                      </p>
                      <p className="text-sm font-medium text-gray-500">
                        {formattedDate}
                      </p>
                    </div>
                  </div>
                  {isUnseenNotification(index) && (
                    <div className="size-2 rounded-full bg-red-700" />
                  )}
                </li>
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
        <div className="absolute top-4 right-[18px] size-2 rounded-full bg-red-700 outline-3 outline-white" />
      )}
    </>
  );
}

function NoNotificationState() {
  return (
    <div className="flex flex-col items-center p-8">
      <div className="flex aspect-square items-center rounded-full border border-gray-300 bg-gray-50 px-6 text-zinc-900">
        <BellOff size={24} />
      </div>
      <h1 className="mt-4 text-lg font-semibold text-zinc-900">
        No Notifications
      </h1>
      <p className="mt-1 font-medium text-gray-500">
        Check back later for notifications.
      </p>
    </div>
  );
}
