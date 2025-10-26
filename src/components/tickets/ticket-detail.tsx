"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow, format } from "date-fns";
import {
  Clock,
  Mail,
  Phone,
  User,
  Tag,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  Send,
} from "lucide-react";
import { toast } from "sonner";

interface Reply {
  id: string;
  message: string;
  authorName: string;
  authorEmail: string;
  isStaffReply: boolean;
  isInternal: boolean;
  createdAt: Date;
}

interface TicketDetailProps {
  ticket: {
    id: string;
    ticketNumber: string;
    subject: string;
    description: string;
    submittedBy: string;
    email: string;
    phone?: string;
    priority: string;
    status: string;
    createdAt: Date;
    replies?: Reply[];
  };
  onUpdate?: () => void;
}

export function TicketDetail({ ticket, onUpdate }: TicketDetailProps) {
  const [replyMessage, setReplyMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInternal, setIsInternal] = useState(false);
  const [newStatus, setNewStatus] = useState(ticket.status);
  const [newPriority, setNewPriority] = useState(ticket.priority);

  async function handleReply() {
    if (!replyMessage.trim()) {
      toast.error("Please enter a reply message");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/tickets/${ticket.id}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: replyMessage,
          authorId: "admin-1", // TODO: Get from auth context
          authorName: "Support Agent", // TODO: Get from auth context
          authorEmail: "support@company.com", // TODO: Get from auth context
          isStaffReply: true,
          isInternal,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to add reply");
      }

      toast.success("Reply added successfully");
      setReplyMessage("");
      setIsInternal(false);
      onUpdate?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to add reply");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateTicket() {
    try {
      const response = await fetch(`/api/tickets/${ticket.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          priority: newPriority,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update ticket");
      }

      toast.success("Ticket updated successfully");
      onUpdate?.();
    } catch (error: any) {
      toast.error(error.message || "Failed to update ticket");
    }
  }

  return (
    <div className="space-y-6">
      {/* Ticket Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{ticket.subject}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Ticket #{ticket.ticketNumber}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">{ticket.priority}</Badge>
              <Badge>{ticket.status.replace("_", " ")}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Customer:</span>
              <span>{ticket.submittedBy}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Email:</span>
              <span>{ticket.email}</span>
            </div>
            {ticket.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Phone:</span>
                <span>{ticket.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Created:</span>
              <span>
                {formatDistanceToNow(new Date(ticket.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {ticket.description}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Update Ticket Status/Priority */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Update Ticket</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="waiting_response">
                  Waiting Response
                </SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={newPriority} onValueChange={setNewPriority}>
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleUpdateTicket}>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Update
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Replies */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Conversation ({ticket.replies?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {ticket.replies && ticket.replies.length > 0 ? (
            ticket.replies.map((reply) => (
              <div
                key={reply.id}
                className={`flex gap-3 p-4 rounded-lg ${
                  reply.isStaffReply
                    ? "bg-blue-50 dark:bg-blue-950"
                    : "bg-gray-50 dark:bg-gray-900"
                }`}
              >
                <Avatar>
                  <AvatarFallback>
                    {reply.authorName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{reply.authorName}</span>
                    {reply.isStaffReply && (
                      <Badge variant="outline" className="text-xs">
                        Staff
                      </Badge>
                    )}
                    {reply.isInternal && (
                      <Badge variant="secondary" className="text-xs">
                        Internal Note
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground ml-auto">
                      {format(new Date(reply.createdAt), "PPp")}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{reply.message}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No replies yet
            </p>
          )}

          <Separator />

          {/* Reply Form */}
          <div className="space-y-3">
            <Textarea
              placeholder="Type your reply..."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              rows={4}
            />
            <div className="flex justify-between items-center">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={isInternal}
                  onChange={(e) => setIsInternal(e.target.checked)}
                  className="rounded"
                />
                <span>Internal note (not visible to customer)</span>
              </label>
              <Button onClick={handleReply} disabled={isSubmitting}>
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Reply
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
