import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useChatRoomsQuery } from "./useChat";
import { useInterestCount } from "./useInterestCount";
import { useSupportBookmarkCount } from "./useSupportQueries";
import { useSideMenuCounts } from "./useSideMenuCounts";

vi.mock("./useChat", () => ({ useChatRoomsQuery: vi.fn() }));
vi.mock("./useInterestCount", () => ({ useInterestCount: vi.fn() }));
vi.mock("./useSupportQueries", () => ({ useSupportBookmarkCount: vi.fn() }));

describe("useSideMenuCounts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useInterestCount).mockReturnValue(0);
    vi.mocked(useSupportBookmarkCount).mockReturnValue(0);
  });

  it("서버 채팅방 목록 개수를 사이드 메뉴 채팅 수로 사용한다", () => {
    vi.mocked(useChatRoomsQuery).mockReturnValue({
      data: [{ id: "1" }, { id: "2" }, { id: "3" }],
    } as ReturnType<typeof useChatRoomsQuery>);

    const { result } = renderHook(() => useSideMenuCounts());

    expect(result.current.chatCount).toBe(3);
  });
});
