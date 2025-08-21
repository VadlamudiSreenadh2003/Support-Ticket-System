import { useEffect, useState } from 'react';
import './App.css';
import TicketCreate from './TicketCreate';
import axios from 'axios';

function App() {
  const [ticketCount, setTicketCount] = useState(0);

  // This function fetches ticket count
  const fetchTicketCount = () => {
    axios.get('http://localhost:5000/api/tickets')
      .then(res => {
        setTicketCount(res.data.length);
      })
      .catch(err => {
        console.error('Failed to fetch tickets:', err);
      });
  };

  // Fetch once on mount
  useEffect(() => {
    fetchTicketCount();
  }, []);

  return (
    <>
      <img
        src="https://cdn-icons-png.flaticon.com/512/1055/1055646.png"
        alt="Ticket Icon"
        className="header-image"
      />

      <h1>Support Ticket System</h1>

      <div className="card">
        <button disabled>
          🎫 Total Tickets: {ticketCount}
        </button>
      </div>

      <hr />

      <h2>Create Ticket</h2>
      {/* Pass the update function to TicketCreate */}
      <TicketCreate onTicketCreated={fetchTicketCount} />
    </>
  );
}

export default App;
