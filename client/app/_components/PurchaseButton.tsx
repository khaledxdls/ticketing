"use client";

import { useRequest } from "@/hooks/useRequest";
import { useRouter } from "next/navigation";

export default function PurchaseButton({ ticketId }: { ticketId: string }) {
  const router = useRouter();
  const { doRequest, errors, isLoading } = useRequest({
    url: `/api/orders`,
    method: "post",
    body: {
      ticketId,
    },
    onSuccess: (order) => {
      router.push(`/orders/${order.id}`);
    },
  });

  return (
    <>
      {errors}
      <button
        onClick={() => doRequest()}
        disabled={isLoading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Purchase
      </button>
    </>
  );
}
