export const payVNPay = async (orderId: string, amount: number) => {
  try {
    const data = { orderId: orderId, amount: amount };
    const response = await fetch("/api/vnpay/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(data),
    });
    if (!response) {
      alert("Error when create Payment, please try again!");
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
