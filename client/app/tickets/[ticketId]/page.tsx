import PurchaseButton from "@/app/_components/PurchaseButton";
import { getTicket } from "@/app/_lib/auth/actions";

export default async function TicketPage({
  params,
}: {
  params: { ticketId: string };
}) {
  const ticket = await getTicket(params.ticketId);

  if (!ticket) {
    return <div>Ticket not found</div>;
  }

  return (
    <div className="container p-4">
      <h1>{ticket.title}</h1>
      <h4>Price: ${ticket.price}</h4>
      <PurchaseButton ticketId={ticket.id} />
    </div>
  );
}
