import { getOrders } from "../_lib/auth/actions";

interface Order {
  id: string;
  ticket: {
    title: string;
    price: number;
  };
  status: string;
  expiresAt: string;
}

async function OrdersPage() {
  const orders = await getOrders();
  console.log(orders, "orders");
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      <div className="grid gap-4">
        {orders.map((order: Order) => (
          <div
            key={order.id}
            className="border p-4 rounded-lg shadow-sm hover:shadow-md"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{order.ticket.title}</h2>
              <span className="text-sm px-2 py-1 rounded-full bg-gray-100">
                {order.status}
              </span>
            </div>
            <p className="text-gray-600 mt-2">
              Price: ${order.ticket.price.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Expires: {new Date(order.expiresAt).toLocaleString()}
            </p>
          </div>
        ))}
        {orders.length === 0 && (
          <p className="text-center text-gray-500">No orders found</p>
        )}
      </div>
    </div>
  );
}

export default OrdersPage;
