import Report from "@/database/report.model";
import { connectToDatabase } from "../mongoose";
import Finance from "@/database/finance.model";
import mongoose from "mongoose";

// Create a new report
export const createReport = async (data: {
    staff: string;
    finances: string[];
    revenue: number;
}) => {
    try {
        await connectToDatabase();
        const newReport = await Report.create({
            staff: new mongoose.Types.ObjectId(data.staff),
            finances: data.finances.map(
                (financeId) => new mongoose.Types.ObjectId(financeId)
            ),
            revenue: data.revenue,
        });
        return newReport;
    } catch (error) {
        console.log("Error creating report: ", error);
        throw new Error("Failed to create report");
    } finally {
        await mongoose.connection.close();
    }
};

// Get all reports
export const getReports = async () => {
    try {
        await connectToDatabase();
        const reports = await Report.find();
        return reports;
    } catch (error) {
        console.log("Error fetching reports: ", error);
        throw new Error("Failed to fetch reports");
    } finally {
        await mongoose.connection.close();
    }
};

// Get a report by ID
export const getReportById = async (id: string) => {
    try {
        await connectToDatabase();
        const report = await Report.findById(id);
        if (!report) {
            throw new Error("Report not found");
        }
        return report;
    } catch (error) {
        console.log("Error fetching report: ", error);
        throw new Error("Failed to fetch report");
    } finally {
        await mongoose.connection.close();
    }
};

// Update a report
export const updateReport = async (
    id: string,
    data: Partial<{
        staff: string;
        finances: string[];
        revenue: number;
    }>
) => {
    try {
        await connectToDatabase();
        const report = await Report.findById(id);
        if (!report) {
            throw new Error("Report not found");
        }
        const updatedReport = await Report.findByIdAndUpdate(
            id,
            {
                staff: data.staff
                    ? new mongoose.Types.ObjectId(data.staff)
                    : report.staff,
                finances: data.finances
                    ? data.finances.map(
                          (financeId) => new mongoose.Types.ObjectId(financeId)
                      )
                    : report.finances,
                revenue: data.revenue || report.revenue,
            },
            { new: true }
        );
        return updatedReport;
    } catch (error) {
        console.log("Error updating report: ", error);
        throw new Error("Failed to update report");
    } finally {
        await mongoose.connection.close();
    }
};

// Delete a report
export const deleteReport = async (id: string) => {
    try {
        await connectToDatabase();
        const deletedReport = await Report.findByIdAndDelete(id);
        if (!deletedReport) {
            throw new Error("Report not found");
        }
        return true;
    } catch (error) {
        console.log("Error deleting report: ", error);
        throw new Error("Failed to delete report");
    } finally {
        await mongoose.connection.close();
    }
};

// Calculate the sum of all finances between two dates
export const calculateReportFinancesBetweenDates = async (
    startDate: Date,
    endDate: Date,
    reportId: string
) => {
    try {
        await connectToDatabase();
        const report = await Report.findById(reportId);
        if (!report) {
            throw new Error("Report not found");
        }
        const finances = await Finance.find({
            _id: { $in: report.finances },
            date: { $gte: startDate, $lte: endDate },
        });
        const totalFinances = finances.reduce(
            (acc, finance) => acc + finance.value,
            0
        );
        return totalFinances;
    } catch (error) {
        console.log("Error calculating finances: ", error);
        throw new Error("Failed to calculate finances");
    } finally {
        await mongoose.connection.close();
    }
};
