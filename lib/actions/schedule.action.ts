import Schedule from "@/database/schedule.model";
import Staff from "@/database/staff.model";

export const createSchedule = async (data: {
  staff: string;
  shift: number;
  date: string;
}) => {
  try {
    const staff = await Staff.findById(data.staff);
    if (!staff) {
      throw new Error("Staff not exist");
    }
    const schedule = await Schedule.create(data);
    return {...schedule.toObject(),staff:staff};
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const updateSchedule = async (
  id: string,
  data: { staff: string; shift: number; date: string }
) => {
  try {
    const staff = await Staff.findById(data.staff);
    if (!staff) {
      throw new Error("Staff not exist!");
    }
    const existSchedule = await Schedule.findByIdAndUpdate(id, data, {
      new: true,
    });
    return {...existSchedule.toObject(),staff:staff};
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getAllSchedule = async () => {
  try {
    const schedules = await Schedule.find();
    const scheduleResponse = [];
    for (const schedule of schedules) {
      const staff = await Staff.findById(schedule.staff);
      scheduleResponse.push({ ...schedule.toObject(), staff: staff });
    }
    return scheduleResponse;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getScheduleById = async (id: string) => {
  try {
    const schedule = await Schedule.findById(id);
    const staff = await Staff.findById(schedule.staff);
    return { ...schedule.toObject(), staff: staff };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deleteSchedule = async (id: string) => {
  try {
    await Schedule.findByIdAndDelete(id);
    return { message: "Delete schedule successfully!" };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getSchedulesOfStaff = async (id: string) => {
  try {
    const schedules = await Schedule.find({ staff: id });
    const scheduleResponse = [];
    for (const schedule of schedules) {
      const staff = await Staff.findById(schedule.staff);
      scheduleResponse.push({ ...schedule.toObject(), staff: staff });
    }
    return scheduleResponse;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
