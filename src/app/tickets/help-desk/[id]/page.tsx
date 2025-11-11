"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PageStructure } from "@/components/layout/page-structure";
import { TicketDetail } from "@/components/dialogs/ticket-detail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function TicketDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchTicket() {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/tickets/${ticketId}`);
      const result = await response.json();

      if (result.success) {
        setTicket(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch ticket");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  if (isLoading) {
    return (
      <PageStructure>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </PageStructure>
    );
  }

  if (!ticket) {
    return (
      <PageStructure>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-2">Ticket Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The ticket you're looking for doesn't exist.
          </p>
          <Button onClick={() => router.push("/tickets/help-desk")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tickets
          </Button>
        </div>
      </PageStructure>
    );
  }

  return (
    <PageStructure>
      <div className="space-y-4">
        <Button
          variant="ghost"
          onClick={() => router.push("/tickets/help-desk")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tickets
        </Button>

        <TicketDetail ticket={ticket} onUpdate={fetchTicket} />
      </div>
    </PageStructure>
  );
}
