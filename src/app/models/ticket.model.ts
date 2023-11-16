// allTickets.model.ts
export interface Ticket {
    id?: number;
    numTicket: string;
    montantAchat: string;
    dateAchat: string;
    statusGain: string;
    user: {
      firstname: string;
      lastname: string;
      email: string;
      address: string;
    },
    batch: {
      id: number;
      type_lot: string;
      valeur: string;
      description: string;
    }
}