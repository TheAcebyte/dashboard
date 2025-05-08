"use client";

import editGroup from "@/actions/group/edit";
import { groupSchema } from "@/actions/group/validation";
import Button from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  dialogContext,
} from "@/components/ui/dialog";
import { TextInput } from "@/components/ui/input";
import { PaginatedGroupRecord } from "@/db/queries/groups";
import useFormAction from "@/hooks/use-form-action";
import { useTableRefetchStore } from "@/stores/table-refetch-store";
import { CircleAlert, Pencil, X } from "lucide-react";
import { useContext, useEffect } from "react";

interface Props {
  record: PaginatedGroupRecord;
}

export default function EditGroupDialog({ record }: Props) {
  return (
    <Dialog id={`edit-group-${record.groupId}`}>
      <DialogTrigger className="flex cursor-pointer items-center gap-4 px-4 py-2 font-medium text-zinc-900 transition-colors hover:bg-gray-50 hover:text-zinc-700">
        <Pencil size={20} />
        Edit
      </DialogTrigger>
      <DialogContent>
        <EditGroupDialogContent record={record} />
      </DialogContent>
    </Dialog>
  );
}

function EditGroupDialogContent({ record }: Props) {
  const contextValue = useContext(dialogContext);
  if (!contextValue) {
    throw new Error(
      "EditGroupDialogContent must be placed inside a DialogContent component.",
    );
  }

  const { close } = contextValue;
  const { refetch } = useTableRefetchStore();

  const editThisGroup = editGroup.bind(null, record.groupId);
  const { handleSubmit, fields, setters, response, errors, reset } =
    useFormAction(editThisGroup, groupSchema, { name: record.name });

  useEffect(() => {
    if (response?.success) {
      close();
      refetch();
    }
  }, [response]);

  return (
    <div className="w-[400px] rounded-2xl border border-gray-300 bg-white">
      <header className="flex items-center justify-between border-b border-gray-300 px-8 py-4">
        <h1 className="text-xl font-semibold text-zinc-900">Edit Group</h1>
        <X
          className="cursor-pointer text-zinc-900 hover:text-zinc-700"
          onClick={close}
        />
      </header>
      <form className="flex flex-col items-center p-8" onSubmit={handleSubmit}>
        <TextInput
          id="name"
          label="Name"
          placeholder="Group name"
          value={fields.name}
          setValue={setters.name}
          error={errors.name}
        />
        <div className="mt-12 flex w-full gap-4">
          <Button
            variant="outline"
            type="button"
            className="flex-1"
            onClick={close}
          >
            Cancel
          </Button>
          <Button variant="solid" className="flex-1">
            Edit
          </Button>
        </div>
        {response && !response.success && (
          <div className="mt-4 flex items-center gap-2 font-medium text-red-700">
            <CircleAlert />
            <p>{response.message}</p>
          </div>
        )}
      </form>
    </div>
  );
}
