"use client";

import { useEffect, useState } from "react";
import { PageStructure } from "@/components/layout/page-structure";
import { TicketsTable, Ticket } from "@/components/chart/tickets-table";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

export default function HelpDeskPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchTickets() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/tickets");
      const result = await response.json();

      if (result.success) {
        setTickets(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch tickets");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleRowClick = (ticket: Ticket) => {
    // Navigate to ticket detail page
    window.location.href = `/help-desk/${ticket.id}`;
  };

  return (
    <PageStructure>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="heading-1">Help Desk</h1>
            <p className="text-muted-foreground">
              Manage customer support tickets
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={fetchTickets}
              disabled={isLoading}
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={() => (window.location.href = "/tickets")}>
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <TicketsTable data={tickets} onRowClick={handleRowClick} />
        )}
      </div>
    </PageStructure>
  );
}
