"use client";

import React, { useEffect, useState } from "react";
import { Calendar, DateValue } from "@nextui-org/react";
import Headers from "@/components/shared/header/Headers";
import ScheduleList from "@/components/admin/schedule/ScheduleList";
import { Schedule } from "@/dto/ScheduleDTO";
import { fetchSchedule } from "@/lib/service/schedule.service";
import CreateScheduleForm from "@/components/form/schedule/CreateScheduleForm";
import UpdateScheduleForm from "@/components/form/schedule/UpdateScheduleForm";
import * as XLSX from "xlsx";

const Page = () => {
  // ✅ KHÔNG dùng null cho array
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  const [editSchedule, setEditSchedule] = useState<Schedule | null>(null);
  const [date, setDate] = useState<DateValue | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchScheduleData = async () => {
      try {
        const data = await fetchSchedule();
        if (isMounted) {
          setSchedules(data || []);
        }
      } catch (error) {
        console.error("Error loading schedules:", error);
        if (isMounted) {
          setSchedules([]);
        }
      }
    };

    fetchScheduleData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleExport = () => {
    const exportScheduleJSON = schedules.map((schedule) => ({
      id: schedule._id,
      staffId: schedule.staff._id,
      staffName: schedule.staff.fullName,
      shift: schedule.shift,
      date: schedule.date.substring(0, 10),
    }));

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
      />

      <div className="flex flex-row flex-1 w-full h-full gap-4">
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

        {isCreateFormOpen && (
          <CreateScheduleForm
            onClose={() => setIsCreateFormOpen(false)}
            setSchedules={(data: Schedule) =>
              setSchedules((prev) => [...prev, data])
            }
          />
        )}

        {isUpdateFormOpen && editSchedule && (
          <UpdateScheduleForm
            onClose={() => setIsUpdateFormOpen(false)}
            schedule={editSchedule}
            setSchedules={(data: Schedule) =>
              setSchedules((prev) =>
                prev.map((item) => (item._id === data._id ? data : item))
              )
            }
          />
        )}
      </div>
    </div>
  );
};

export default Page;
