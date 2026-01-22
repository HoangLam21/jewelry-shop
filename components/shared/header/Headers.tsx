import React from "react";
import MyButton from "../button/MyButton";

interface Header {
  title: string;
  titleFirstButton: string;
  firstIcon: string;
  titleSecondButton: string;
  secondIcon: string;
  type: number;
}

const Headers = ({
  title,
  titleFirstButton,
  firstIcon,
  titleSecondButton,
  secondIcon,
  onClickFirstButton,
  onClickSecondButton,
  type,
}: {
  title: string;
  titleFirstButton: string;
  firstIcon: string;
  titleSecondButton?: string;
  secondIcon?: string;
  onClickFirstButton: () => void;
  onClickSecondButton?: () => void;
  type: number;
}) => {
  const noop = () => {}; // Hàm rỗng để tránh lỗi
  return (
    <div className="flex w-full  flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex flex-col ">
        <h1 className="text-[24px] font-medium  leading-[31.2px] text-headerTiltle ">
          {title}
        </h1>
        <p className="text-primary-100 font-medium text-[14px] hidden sm:block">
          Let`&apos;s check your update today!
        </p>
      </div>
      <div className="flex gap-6">
        {type === 1 ? (
          <MyButton
            title={titleFirstButton}
            icon={firstIcon}
            event={onClickFirstButton}
            width="w-fit"
            py="py-2"
            background="bg-border-color"
            text_color="text-black"
            border_color="bg-border-color"
          />
        ) : (
          <>
            <MyButton
              title={titleFirstButton}
              icon={firstIcon}
              event={onClickFirstButton}
              width="w-fit"
              py="py-2"
              background="bg-border-color"
              text_color="text-black"
              border_color="bg-border-color"
            />
            <MyButton
              title={titleSecondButton}
              icon={secondIcon}
              event={onClickSecondButton || noop}
              width="w-fit"
              py="py-2"
              background="bg-primary-100"
              text="text-white"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Headers;
