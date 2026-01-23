"use client";

import MyButton from "@/components/shared/button/MyButton";
import React, { useEffect, useState } from "react";
import { Calendar } from "@nextui-org/calendar";
import { DatePicker } from "@nextui-org/date-picker";
import { Select, SelectItem } from "@nextui-org/select";
import { Staff } from "@/dto/StaffDTO";
import { fetchStaff } from "@/lib/service/staff.service";
import { ScheduleRequest } from "@/dto/ScheduleDTO";
import { createSchedule } from "@/lib/service/schedule.service";
import { X, CalendarDays, Users, Clock, Plus } from "lucide-react";

const Shifts = [
  { number: "1", description: "7:00AM-9:00AM", icon: "☀️", label: "Morning" },
  { number: "2", description: "9:00AM-11:00AM", icon: "☀️", label: "Morning" },
  { number: "3", description: "11:00AM-1:00PM", icon: "🌞", label: "Noon" },
  { number: "4", description: "1:00PM-3:00PM", icon: "🌞", label: "Afternoon" },
  { number: "5", description: "3:00PM-5:00PM", icon: "🌅", label: "Afternoon" },
  { number: "6", description: "5:00PM-7:00PM", icon: "🌆", label: "Evening" },
  { number: "7", description: "7:00PM-9:00PM", icon: "🌙", label: "Evening" },
  { number: "8", description: "9:00PM-11:00PM", icon: "🌙", label: "Night" },
  { number: "9", description: "11:00PM-1:00AM", icon: "🌙", label: "Night" },
  {
    number: "10",
    description: "1:00AM-3:00AM",
    icon: "⭐",
    label: "Late Night",
  },
  {
    number: "11",
    description: "3:00AM-5:00AM",
    icon: "⭐",
    label: "Late Night",
  },
  {
    number: "12",
    description: "5:00AM-7:00AM",
    icon: "🌅",
    label: "Early Morning",
  },
];

const CreateScheduleForm = ({ onClose, setSchedules }: any) => {
  const [date, setDate] = useState<any>(null);
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [shift, setShift] = useState("");
  const [staff, setStaff] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStaffs, setLoadingStaffs] = useState(true);

  useEffect(() => {
    const fetchDataForCreate = async () => {
      try {
        setLoadingStaffs(true);
        const staffs = await fetchStaff();
        setStaffs(staffs);
      } catch (error) {
        console.error("Error loading staffs:", error);
      } finally {
        setLoadingStaffs(false);
      }
    };
    fetchDataForCreate();
  }, []);

  const handleAddSchedule = async () => {
    if (!staff || !shift || !date) {
      alert("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      const param: ScheduleRequest = {
        staff,
        shift: parseInt(shift),
        date: date?.toString?.() ?? "",
      };

      const result = await createSchedule(param);
      if (result) {
        setSchedules?.(result);
        alert("Schedule created successfully!");
        onClose();
      }
    } catch (error) {
      console.error("Error creating schedule:", error);
      alert("Failed to create schedule. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedShiftInfo = Shifts.find((s) => s.number === shift);
  const selectedStaffInfo = staffs.find((s) => s._id === staff);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-screen w-full max-w-[550px] z-[101] flex flex-col bg-white dark:bg-gray-800 shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 py-6 px-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <CalendarDays className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Create Schedule
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Assign staff to a shift
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              disabled={loading}
            >
              <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Calendar Section */}
          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Select Date
              </h3>
              <span className="text-red-500 text-sm ml-1">*</span>
            </div>
            <div className="flex items-center justify-center">
              <Calendar
                color="primary"
                calendarWidth={280}
                weekdayStyle="narrow"
                value={date as any}
                onChange={setDate as any}
                classNames={{
                  base: "bg-white dark:bg-gray-800 shadow-sm rounded-lg",
                }}
              />
            </div>
            {date && (
              <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                <p className="text-sm text-purple-700 dark:text-purple-400 font-medium">
                  📅 Selected: {date.day}/{date.month}/{date.year}
                </p>
              </div>
            )}
          </div>

          {/* Staff Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Staff Member
              </h3>
              <span className="text-red-500 text-sm">*</span>
            </div>

            {loadingStaffs ? (
              <div className="flex items-center justify-center py-8 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <Select
                label="Select staff member"
                labelPlacement="inside"
                selectedKeys={staff ? [staff] : []}
                onSelectionChange={(keys) => {
                  const selectedStaff = Array.from(keys)[0] as string;
                  setStaff(selectedStaff);
                }}
                classNames={{
                  base: "max-w-full",
                  trigger:
                    "h-14 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 hover:border-purple-400 data-[hover=true]:bg-gray-100 dark:data-[hover=true]:bg-gray-800",
                  value: "text-gray-900 dark:text-white font-medium",
                }}
                popoverProps={{
                  placement: "bottom",
                  classNames: {
                    base: "w-full",
                    content:
                      "z-[102] p-0 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800",
                  },
                }}
                listboxProps={{
                  itemClasses: {
                    base: "px-3 py-3 rounded-lg data-[hover=true]:bg-gray-100 dark:data-[hover=true]:bg-gray-700 data-[selectable=true]:focus:bg-purple-50 dark:data-[selectable=true]:focus:bg-purple-900/20",
                  },
                }}
                renderValue={(items) => {
                  return items.map((item) => (
                    <div key={item.key} className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {selectedStaffInfo?.fullName.charAt(0).toUpperCase()}
                      </div>
                      <span className="truncate">
                        {selectedStaffInfo?.fullName}
                      </span>
                    </div>
                  ));
                }}
              >
                {staffs.map((s) => (
                  <SelectItem
                    key={s._id}
                    textValue={s.fullName}
                    className="py-2"
                  >
                    <div className="flex items-center gap-3 py-1">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                        {s.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-medium text-gray-900 dark:text-white truncate">
                          {s.fullName}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {s._id.slice(-8)}
                        </span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </Select>
            )}
          </div>

          {/* Shift Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                Shift Time
              </h3>
              <span className="text-red-500 text-sm">*</span>
            </div>

            <Select
              label="Select shift"
              labelPlacement="inside"
              selectedKeys={shift ? [shift] : []}
              onSelectionChange={(keys) => {
                const selectedShift = Array.from(keys)[0] as string;
                setShift(selectedShift);
              }}
              classNames={{
                base: "max-w-full",
                trigger:
                  "h-14 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 hover:border-orange-400 data-[hover=true]:bg-gray-100 dark:data-[hover=true]:bg-gray-800",
                value: "text-gray-900 dark:text-white font-medium",
              }}
              popoverProps={{
                placement: "bottom",
                classNames: {
                  base: "w-full",
                  content:
                    "z-[102] p-0 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800",
                },
              }}
              listboxProps={{
                itemClasses: {
                  base: "px-3 py-3 rounded-lg data-[hover=true]:bg-gray-100 dark:data-[hover=true]:bg-gray-700 data-[selectable=true]:focus:bg-orange-50 dark:data-[selectable=true]:focus:bg-orange-900/20",
                },
              }}
              renderValue={(items) => {
                return items.map((item) => (
                  <div key={item.key} className="flex items-center gap-2">
                    <span className="text-lg">{selectedShiftInfo?.icon}</span>
                    <span className="truncate">
                      {selectedShiftInfo?.label} -{" "}
                      {selectedShiftInfo?.description}
                    </span>
                  </div>
                ));
              }}
            >
              {Shifts.map((sh) => (
                <SelectItem
                  key={sh.number}
                  textValue={`Shift ${sh.number}`}
                  className="py-2"
                >
                  <div className="flex items-center gap-3 py-1">
                    <span className="text-2xl flex-shrink-0">{sh.icon}</span>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="font-medium text-gray-900 dark:text-white">
                        Shift {sh.number} - {sh.label}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {sh.description}
                      </span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </Select>

            {selectedShiftInfo && (
              <div className="mt-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedShiftInfo.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {selectedShiftInfo.label} Shift
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedShiftInfo.description}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Summary Card */}
          {staff && shift && date && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-5 border border-purple-200 dark:border-purple-800">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <span>📋</span> Schedule Summary
              </h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Users className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400 block">
                      Staff:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white block truncate">
                      {selectedStaffInfo?.fullName}
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400 block">
                      Shift:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white block">
                      {selectedShiftInfo?.label} (
                      {selectedShiftInfo?.description})
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CalendarDays className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400 block">
                      Date:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white block">
                      {date.day}/{date.month}/{date.year}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer - Fixed */}
        <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2.5 rounded-lg font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleAddSchedule}
              disabled={loading || !staff || !shift || !date}
              className="px-6 py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[103]">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-purple-600"></div>
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              Creating schedule...
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateScheduleForm;
