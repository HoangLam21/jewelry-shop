"use client";

import React, { useEffect, useState } from "react";
import { Calendar } from "@nextui-org/react";
import Headers from "@/components/shared/header/Headers";
import ScheduleList from "@/components/admin/schedule/ScheduleList";
import { Schedule } from "@/dto/ScheduleDTO";
import { fetchSchedule } from "@/lib/service/schedule.service";
import CreateScheduleForm from "@/components/form/schedule/CreateScheduleForm";
import UpdateScheduleForm from "@/components/form/schedule/UpdateScheduleForm";
import * as XLSX from "xlsx";
import { CalendarDays } from "lucide-react";
import { today, getLocalTimeZone } from "@internationalized/date";

const Page = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  const [editSchedule, setEditSchedule] = useState<Schedule | null>(null);
  const [loading, setLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchScheduleData = async () => {
      try {
        setLoading(true);
        const data = await fetchSchedule();
        if (isMounted) {
          setSchedules(data || []);
        }
      } catch (error) {
        console.error("Error loading schedules:", error);
        if (isMounted) {
          setSchedules([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchScheduleData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleExport = () => {
    if (schedules.length === 0) {
      alert("No schedules to export");
      return;
    }

    setIsExporting(true);

    try {
      const getShiftName = (shift: number) => {
        const shifts: { [key: number]: string } = {
          1: "Morning",
          2: "Afternoon",
          3: "Evening",
          4: "Night",
        };
        return shifts[shift] || `Shift ${shift}`;
      };

      const exportScheduleJSON = schedules.map((schedule) => ({
        "Schedule ID": schedule._id,
        "Staff ID": schedule.staff._id,
        "Staff Name": schedule.staff.fullName,
        Shift: `${getShiftName(schedule.shift)} (${schedule.shift})`,
        Date: new Date(schedule.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      }));

      const ws = XLSX.utils.json_to_sheet(exportScheduleJSON);
      ws["!cols"] = [
        { wch: 25 },
        { wch: 25 },
        { wch: 25 },
        { wch: 20 },
        { wch: 20 },
      ];

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Schedules");

      const fileName = `Schedules_Export_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      XLSX.writeFile(wb, fileName);

      setTimeout(() => {
        alert("Schedules exported successfully!");
      }, 100);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export schedules");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full h-full p-4 md:p-6 lg:p-8 flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-xl">
              <CalendarDays className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                Schedule Management
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {loading
                  ? "Loading schedules..."
                  : `Manage ${schedules.length} schedule${
                      schedules.length !== 1 ? "s" : ""
                    }`}
              </p>
            </div>
          </div>

          <Headers
            title=""
            firstIcon="clarity:export-line"
            titleFirstButton={isExporting ? "Exporting..." : "Export Excel"}
            secondIcon="mingcute:add-line"
            titleSecondButton="Create Schedule"
            onClickFirstButton={handleExport}
            onClickSecondButton={() => setIsCreateFormOpen(true)}
            type={2}
          />
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Calendar Section */}
          <div className="lg:w-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <CalendarDays className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Calendar View
                </h2>
              </div>
              <Calendar
                color="primary"
                calendarWidth={300}
                weekdayStyle="narrow"
                defaultValue={today(getLocalTimeZone())}
                classNames={{
                  base: "rounded-lg",
                }}
              />
            </div>
          </div>

          {/* Schedule List Section */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <ScheduleList
                schedules={schedules}
                setSchedules={setSchedules}
                loading={loading}
                openEditForm={(schedule) => {
                  setEditSchedule(schedule);
                  setIsUpdateFormOpen(true);
                }}
              />
            </div>
          </div>
        </div>

        {/* Modals */}
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
