"use client";
import InputEdit from "@/components/shared/input/InputEdit";
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import { CombinedVariant } from "./ProductEdit";

interface props {
  setOnAdd: React.Dispatch<React.SetStateAction<boolean>>;
  setCombinedData: React.Dispatch<React.SetStateAction<CombinedVariant[]>>;
}

const AddVariant = ({ setCombinedData, setOnAdd }: props) => {
  const [newVariant, setNewVariant] = useState<CombinedVariant>({
    material: "",
    size: "",
    stock: 0,
    addOn: 0
  });
  const handleAddVariant = (newVariant: CombinedVariant) => {
    setCombinedData((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.material === newVariant.material && item.size === newVariant.size
      );

      if (existingIndex !== -1) {
        // Nếu đã tồn tại, cập nhật `stock` và `addOn`
        const updatedData = [...prev];
        updatedData[existingIndex] = {
          ...updatedData[existingIndex],
          addOn: newVariant.addOn
        };
        alert("Variant is update added price");
        return updatedData;
      }

      // Nếu chưa tồn tại, thêm mới
      alert("New variant is added");
      return [...prev, newVariant];
    });
  };

  const handleChangeInputVariant = (
    field: keyof CombinedVariant,
    value: string | number
  ) => {
    setNewVariant((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    handleAddVariant(newVariant);
    // Reset form
    setNewVariant({
      material: "",
      size: "",
      stock: 0,
      addOn: 0
    });
    setOnAdd(false);
  };

  const handleBack = () => {
    setOnAdd(false);
  };
  return (
    <div className="modal-overlay">
      <div className="w-[400px] h-fit rounded-lg background-light800_dark300 items-center justify-start flex flex-col shadow-sm drop-shadow-sm shadow-zinc-700 p-2 gap-3">
        <div className="flex flex-row justify-end items-start w-full h-fit">
          <Icon
            icon="iconoir:cancel"
            width={24}
            height={24}
            className="text-dark100_light500 cursor-pointer"
            onClick={handleBack}
          />
        </div>

        <div className="flex flex-col gap-2 justify-start items-start w-full h-fit ">
          <InputEdit
            titleInput="New Material"
            onChange={(e) =>
              handleChangeInputVariant("material", e.target.value)
            }
            width="w-full"
            placeholder="Enter new material..."
          />

          <InputEdit
            titleInput="New Size"
            onChange={(e) => handleChangeInputVariant("size", e.target.value)}
            width="w-full"
            placeholder="Enter new material..."
          />

          <InputEdit
            titleInput="Added on"
            onChange={(e) =>
              handleChangeInputVariant("addOn", Number(e.target.value))
            }
            width="w-full"
            placeholder="Added Price..."
          />
        </div>

        <div className="flex justify-end w-full items-center pr-4 pb-2">
          <Button
            className="bg-green-600 hover:bg-green-600 text-dark-100 paragraph-regular py-2 px-3 rounded-lg w-fit"
            onClick={handleSubmit}
          >
            Update
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddVariant;
