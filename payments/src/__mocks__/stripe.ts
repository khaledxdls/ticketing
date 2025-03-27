export const stripe = {
  paymentIntents: {
    create: jest.fn().mockResolvedValue({
      id: "pi_12345", // Mock PaymentIntent ID
      status: "succeeded", // Mock status
      client_secret: "secret_12345", // Mock client secret
    }),
  },
};
