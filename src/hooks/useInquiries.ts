import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createInquiry, getInquiries } from "../api/inquiry";
import type { CreateInquiryRequestJson } from "../types/inquiryApi";

export const inquiryKeys = {
  list: () => ["inquiries", "list"] as const,
};

export function useInquiriesQuery() {
  return useQuery({
    queryKey: inquiryKeys.list(),
    queryFn: getInquiries,
  });
}

export function useCreateInquiryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      input,
      images,
    }: {
      input: CreateInquiryRequestJson;
      images: File[];
    }) => createInquiry(input, images),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: inquiryKeys.list() }),
  });
}
