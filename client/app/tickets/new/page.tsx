import TicketForm from "@/app/_components/TicketForm";

export default function NewTicketPage() {
  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create a Ticket
        </h2>
        <TicketForm />
      </div>
    </div>
  );
}
