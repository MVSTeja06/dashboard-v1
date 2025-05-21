import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { confirmable, ConfirmDialogProps, createConfirmation } from "react-confirm";

export interface Props {
  confirmMessage?: string;
};
function CustomAlert({ show, proceed, confirmMessage }: ConfirmDialogProps<Props, boolean>) {
  // console.log("show", show, proceed, confirmMessage);
  return (
    <AlertDialog open={show}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {confirmMessage
              ? confirmMessage
              : `This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => proceed(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => proceed(true)}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const confirmAlert = createConfirmation(confirmable(CustomAlert));
