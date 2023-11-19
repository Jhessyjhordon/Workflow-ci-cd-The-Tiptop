// allTickets.model.ts
export interface Ticket {
  data: {
    ticket: {
      id: number;
      numTicket: string;
      montantAchat: string;
      dateAchat: string;
      statusGain: string;
      user: {
        id: number;
        lastname: string;
        firstname: string;
        email: string;
        address: string;
      };
      batch: {
        id: number;
        type_lot: string;
        valeur: string;
        description: string;
      };
    };
  };
  message: [string]
}