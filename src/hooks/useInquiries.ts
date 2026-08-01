import { useQuery } from "@tanstack/react-query";
import { getInquiries } from "../api/inquiry";

export const inquiryKeys = {
  list: () => ["inquiries", "list"] as const,
};

export function useInquiriesQuery() {
  return useQuery({
    queryKey: inquiryKeys.list(),
    queryFn: getInquiries,
  });
}
