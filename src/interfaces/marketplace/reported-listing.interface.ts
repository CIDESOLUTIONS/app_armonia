import { ListingDto } from "./marketplace.dto";

export interface ReportedListing {
  id: number;
  listing: ListingDto;
  reporter: { id: number; name: string };
  reason: string;
  createdAt: string;
  status: "PENDING" | "RESOLVED";
}