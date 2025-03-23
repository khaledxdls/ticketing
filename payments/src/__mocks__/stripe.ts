export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({ id: "stripe_charge_id" }),
  },
  //   paymentIntents: {
  //     create: jest.fn().mockResolvedValue({ id: "stripe_payment_intent_id" }),
  //   },
};
