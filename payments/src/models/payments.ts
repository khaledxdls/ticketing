import mongoose from "mongoose";

interface paymentsAttrs {
  orderId: string;
  stripeId: string;
}

interface paymentsDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
}

interface paymentsModel extends mongoose.Model<paymentsDoc> {
  build(attrs: paymentsAttrs): paymentsDoc;
}

const paymentsSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

paymentsSchema.statics.build = (attrs: paymentsAttrs) => {
  return new Payments(attrs);
};

const Payments = mongoose.model<paymentsDoc, paymentsModel>(
  "Payments",
  paymentsSchema
);

export { Payments };
