import { useState } from 'react';
/**
 * A hook to automate the process of defining a open, close and isOpen variables for modals.
 * The memory will be in a separate instance on each useModal call.
 */
export const useModal = (stopPropagation = true) => {
  const [isOpen, setOpen] = useState(false);
  const open = (event) => {
    if (stopPropagation === true) {
      event?.stopPropagation();
      setOpen(true);
    }
  };
  const close = (event) => {
    if (stopPropagation === true) {
      event?.stopPropagation();
      setOpen(false);
    }
  };
  return [isOpen, open, close];
};
