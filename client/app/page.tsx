import React, { useEffect, useState } from "react";

// /d:/Learning/Microservices with Node JS and React/ticketing/client/app/page.tsx

interface Ticket {
  id: string;
  title: string;
  price: number;
}

const HomePage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("/api/tickets"); // Replace with your API endpoint
        const data = await response.json();
        setTickets(data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="p-8 bg-gradient-to-r from-gray-50 to-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Available Tickets
      </h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((ticket) => (
          <li
            key={ticket.id}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              {ticket.title}
            </h2>
            <p className="text-2xl font-bold text-green-600">
              ${ticket.price.toFixed(2)}
            </p>
            <button className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300">
              View Details
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
