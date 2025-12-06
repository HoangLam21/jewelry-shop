import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Button } from "@/components/ui/button";

export interface ConfirmModalProps {
  setConfirm: React.Dispatch<React.SetStateAction<boolean>>;
  handleAction: () => void;
  name: string;
  action: string;
}

interface Confirm {
  confirm: ConfirmModalProps;
}

const ConfirmModal: React.FC<Confirm> = ({ confirm }) => {
  const { setConfirm, name, action, handleAction } = confirm;
  const handleBack = () => {
    setConfirm(false);
  };
  const handleConfirm = () => {
    handleAction();
    console.log("Handle successfully!");
    handleBack();
  };
  return (
    <div className="modal-overlay">
      <div className="max-w-[400px] min-w-[400px] h-fit rounded-lg background-light700_dark300 items-center justify-start flex flex-col md:shadow-none shadow-sm drop-shadow-sm shadow-zinc-700">
        <div className="flex w-full justify-end items-center px-4 pt-2">
          <Icon
            icon="iconoir:cancel"
            width={24}
            height={24}
            className="text-dark100_light500 cursor-pointer"
            onClick={handleBack}
          />
        </div>
        <div className="flex w-full items-center justify-center mt-7">
          <p className="text-sm text-dark100_light500">
            Are you sure to {action} {name}
          </p>
        </div>
        <span className="flex w-full h-[0.5px] bg-slate-400 mt-7 mb-2"></span>

        <div className="flex justify-end w-full items-center px-4 pb-2">
          <div className="flex flex-row w-full h-fit gap-6 justify-end">
            <Button
              onClick={handleBack}
              className="text-sm text-dark100_light500 py-2 px-3 rounded-lg bg-slate-200 w-fit"
            >
              Cancel
            </Button>
            <Button
              className="bg-primary-100 hover:bg-primary-100 text-white text-sm py-2 px-3 rounded-lg w-fit"
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
