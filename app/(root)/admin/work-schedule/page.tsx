"use client";
import React, { useEffect, useState } from "react";
import { Calendar, DateValue } from "@nextui-org/calendar";
import Headers from "@/components/shared/header/Headers";
import ScheduleList from "@/components/admin/schedule/ScheduleList";
import { Schedule } from "@/dto/ScheduleDTO";
import { fetchSchedule } from "@/lib/service/schedule.service";
import CreateScheduleForm from "@/components/form/schedule/CreateScheduleForm";
import UpdateScheduleForm from "@/components/form/schedule/UpdateScheduleForm";
import * as XLSX from "xlsx";
import Staff from "@/database/staff.model";
const Page = () => {
  const [schedules, setSchedules] = useState<Schedule[] | []>([]);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  const [editSchedule, setEditSchedule] = useState<Schedule>();
  const [date, setDate] = useState<DateValue>();

  useEffect(() => {
    const fetchScheduleData = async () => {
      const schedules = await fetchSchedule();
      if (schedules) {
        setSchedules(schedules);
      } else {
        setSchedules([]);
      }
    };
    fetchScheduleData();
  }, []);

  const handleExport = async () => {
    const exportScheduleJSON = [];
    for (const schedule of schedules) {
      exportScheduleJSON.push({
        id: schedule._id,
        staffId: schedule.staff._id,
        staffName: schedule.staff.fullName,
        shift: schedule.shift,
        date: schedule.date.substring(0, 10),
      });
    }
    const ws = XLSX.utils.json_to_sheet(exportScheduleJSON);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Schedules");
    XLSX.writeFile(wb, "schedules.xlsx");
  };
  return (
    <div className="w-full h-screen flex flex-col flex-1 p-4">
      <Headers
        title="Schedule"
        firstIcon="clarity:export-line"
        titleFirstButton="Export"
        secondIcon="mingcute:add-line"
        titleSecondButton="Add Schedule"
        onClickFirstButton={handleExport}
        onClickSecondButton={() => setIsCreateFormOpen(true)}
        type={2}
      ></Headers>
      <div className="flex flex-row flex-1 w-full h-full">
        <div className="flex items-center justify-center h-full">
          <Calendar
            color="primary"
            calendarWidth={300}
            weekdayStyle="narrow"
            value={date}
            onChange={setDate}
          />
        </div>
        <ScheduleList
          schedules={schedules}
          setSchedules={setSchedules}
          openEditForm={(schedule) => {
            setEditSchedule(schedule);
            setIsUpdateFormOpen(true);
          }}
        />
        {isCreateFormOpen ? (
          <CreateScheduleForm
            onClose={() => setIsCreateFormOpen(false)}
            setSchedules={(data: Schedule) =>
              setSchedules((prev) => [...prev, data])
            }
          />
        ) : null}
        {isUpdateFormOpen ? (
          <UpdateScheduleForm
            onClose={() => {
              setIsUpdateFormOpen(false);
            }}
            setSchedules={(data: Schedule) =>
              setSchedules((prev) =>
                prev.map((item) => (item._id === data._id ? data : item))
              )
            }
            schedule={editSchedule}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Page;
