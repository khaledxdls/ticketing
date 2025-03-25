"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useRequest } from "@/hooks/useRequest";

interface TicketFormData {
  title: string;
  price: number;
}

export default function TicketForm() {
  const {
    doRequest,
    errors: requestErrors,
    isLoading,
  } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {},
    onSuccess: () => {
      // Refresh the current route to update server components
      router.refresh();
      // Then navigate to home page
      router.push("/");
    },
  });
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<TicketFormData>();

  const onSubmit = async (data: TicketFormData) => {
    try {
      await doRequest({
        title: data.title,
        price: data.price,
      });
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div className="rounded-md shadow-sm space-y-4">
        {requestErrors && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {requestErrors}
          </div>
        )}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            id="title"
            {...register("title", { required: "Title is required" })}
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter ticket title"
          />
          {formErrors.title && (
            <p className="mt-2 text-sm text-red-600">
              {formErrors.title.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Price
          </label>
          <input
            id="price"
            {...register("price", {
              required: "Price is required",
              valueAsNumber: true,
              min: { value: 0, message: "Price must be greater than 0" },
            })}
            type="number"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Enter ticket price"
          />
          {formErrors.price && (
            <p className="mt-2 text-sm text-red-600">
              {formErrors.price.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Create Ticket
      </button>
    </form>
  );
}
