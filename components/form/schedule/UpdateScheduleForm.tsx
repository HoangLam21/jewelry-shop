import MyButton from "@/components/shared/button/MyButton";
import { Calendar, DateValue } from "@nextui-org/calendar";
import React, { useEffect, useState } from "react";
import { DateInput } from "@nextui-org/date-input";
import InputEdit from "@/components/shared/input/InputUnEdit";
import { DatePicker } from "@nextui-org/date-picker";
import { Select, SelectSection, SelectItem } from "@nextui-org/select";
import { Staff } from "@/dto/StaffDTO";
import { fetchStaff } from "@/lib/service/staff.service";
import { Schedule, ScheduleRequest } from "@/dto/ScheduleDTO";
import { createSchedule, editSchedule } from "@/lib/service/schedule.service";
import { Temporal } from "@js-temporal/polyfill";
import { toDate } from "date-fns";
import { parseDate, parseDateTime } from "@internationalized/date";

const Shifts = [
  { number: "1", description: "7:00AM-9:00AM" },
  { number: "2", description: "9:00AM-11:00AM" },
  { number: "3", description: "11:00AM-1:00PM" },
  { number: "4", description: "1:00PM-3:00PM" },
  { number: "5", description: "3:00PM-5:00PM" },
  { number: "6", description: "5:00PM-7:00PM" },
  { number: "7", description: "7:00PM-9:00PM" },
  { number: "8", description: "9:00PM-11:00PM" },
  { number: "9", description: "11:00PM-1:00AM" },
  { number: "10", description: "1:00AM-3:00AM" },
  { number: "11", description: "3:00AM-5:00AM" },
  { number: "12", description: "5:00AM-7:00AM" },
];
const UpdateScheduleForm = ({ onClose, setSchedules, schedule }: any) => {
  const [date, setDate] = useState<DateValue>();

  const [staffs, setStaffs] = useState<Staff[] | []>([]);
  const [shift, setShift] = useState("");
  const [staff, setStaff] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDataForCreate = async () => {
      const staffs = await fetchStaff();
      setStaffs(staffs);
    };
    const dateString = schedule.date.substring(0, 10);
    const calendarDate = parseDate(dateString);
    setDate(calendarDate);
    setShift(schedule.shift.toString());
    setStaff(schedule.staff._id);
    fetchDataForCreate();
  }, [schedule]);

  const handleEditSchedule = async () => {
    setLoading(true);
    const param: ScheduleRequest = {
      staff: staff!,
      shift: parseInt(shift),
      date: date?.toString()!,
    };
    const result = await editSchedule(schedule._id, param);
    if (result) {
      setSchedules?.(result);
    }
    setLoading(false);
    onClose();
  };

  return (
    <div className="w-screen h-screen bg-opacity-60 bg-black fixed z-50 top-0 left-0">
      <div className="flex flex-col background-light800_dark300 w-[500px] absolute right-0 h-screen justify-between">
        <div className="border-b border-border-color py-[20px] mx-[30px]">
          <h1 className="text-[24px] font-medium  leading-[31.2px] text-headerTiltle">
            Edit schedule
          </h1>
        </div>
        <div className="flex items-center justify-center">
          <Calendar
            color="primary"
            calendarWidth={300}
            weekdayStyle="narrow"
            onChange={setDate}
            value={date}
          />
        </div>
        <div className="flex gap-[10px] flex-col px-[40px]">
          <Select
            labelPlacement="outside-left"
            className="w-full"
            label="Staff:"
            fullWidth={true}
            selectedKeys={[staff]}
            onSelectionChange={(keys) => {
              const selectedStaff = Array.from(keys)[0] as string;
              console.log("Selected staff:", selectedStaff);
              setStaff(selectedStaff);
            }}
          >
            {staffs.map((staff) => (
              <SelectItem key={staff._id}>
                {staff.fullName + " - " + staff._id}
              </SelectItem>
            ))}
          </Select>
          <Select
            labelPlacement="outside-left"
            className="w-full"
            label="Shift"
            selectedKeys={shift}
            onSelectionChange={(keys) => {
              const selectedShift = Array.from(keys)[0] as string;
              setShift(selectedShift);
            }}
          >
            {Shifts.map((shift) => (
              <SelectItem key={shift.number}>
                {shift.number + " - " + shift.description}
              </SelectItem>
            ))}
          </Select>
          <DatePicker
            className="w-full"
            label="Date"
            value={date}
            labelPlacement="outside-left"
          />
        </div>
        <div className="flex gap-[30px] w-full justify-end p-[10px] pb-[20px]">
          <MyButton
            title="Cancel"
            icon="material-symbols:close-rounded"
            event={onClose}
            width="w-fit"
            py="py-2"
            background="bg-border-color"
            text_color="text-black"
            border_color="bg-border-color"
          />
          <MyButton
            title="Edit schedule"
            icon="mingcute:add-line"
            event={handleEditSchedule}
            width="w-fit"
            py="py-2"
            background="bg-primary-100"
            text="text-white"
          />
        </div>
      </div>
      {loading ? (
        <div className="flex h-screen w-screen items-center justify-center ">
          <div className="loader"></div>
        </div>
      ) : null}
    </div>
  );
};

export default UpdateScheduleForm;
