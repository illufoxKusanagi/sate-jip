import { PageStructure } from "@/components/layout/page-structure";
import { TicketForm } from "@/components/forms/ticket-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Submit Support Ticket",
  description: "Submit a support ticket to our help desk team",
};

export default function SubmitTicketPage() {
  return (
    <PageStructure>
      <TicketForm />
    </PageStructure>
  );
}
