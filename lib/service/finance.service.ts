import { CretaeFinance } from "@/dto/FinaceDTO";

export async function fetchFinance(): Promise<CretaeFinance[]> {
  try {
    const response = await fetch(`/api/finance/all`);
    if (!response.ok) {
      throw new Error("Error fetching posts");
    }
    const data = await response.json();
    // console.log(data);
    return data;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    throw error;
  }
}

export async function createFinanace(
  params: CretaeFinance
): Promise<CretaeFinance> {
  try {
    // Prepare the body in JSON format
    const body = JSON.stringify({
      type: params.type,
      date: params.date,
      value: params.value,
    });

    console.log(body, "Prepared request body");

    const response = await fetch(`/api/finance/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error creating finance");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create finance:", error);
    throw error;
  }
}
