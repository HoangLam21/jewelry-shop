import { createOrder } from "../actions/order.action";

export const createOrderService = async (req: any, res: any) => {
  try {
    const {
      cost,
      discount,
      details,
      status,
      shippingMethod,
      ETD,
      customer,
      staff,
    } = req.body;
    if (
      !cost ||
      !details ||
      !status ||
      !shippingMethod ||
      !customer ||
      !staff
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const order = await createOrder({
      cost,
      discount,
      details,
      status,
      shippingMethod,
      ETD: new Date(ETD),
      customer,
      staff,
    });

    return res
      .status(201)
      .json({ message: "Order created successfully", order });
  } catch (error) {
    console.error("Error in createOrderService: ", error);
    return res.status(500).json({ error: "Failed to create order" });
  }
};
