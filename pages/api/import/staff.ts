// getAllImportsOfStaff API
import { NextApiRequest, NextApiResponse } from "next";
import { getAllImportsOfStaff } from "@/lib/actions/import.action";
import { withStaffOrAdmin, ApiAuthResult } from "@/lib/utils/api-auth";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  auth: ApiAuthResult
) {
  if (req.method === "GET") {
    try {
      const { id } = req.query; // Lấy ID từ query params

      if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Invalid or missing staff ID" });
      }
      // const staffId = req.query.staffId;
      const imports = await getAllImportsOfStaff(id);
      return res.status(200).json(imports);
    } catch (error) {
      console.error("Error fetching imports of staff: ", error);
      return res
        .status(500)
        .json({ error: "Failed to fetch imports of staff" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}

export default withStaffOrAdmin(handler);