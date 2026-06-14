import {
    describe,
    expect,
    it,
} from "vitest";
import {
    hasOverlappingLeave,
    hasOverlappingLeaveExcludingRequest,
    rangesOverlap,
} from "./leaveValidation";
import type {LeaveRequest} from "$lib/types";


describe("rangesOverlap", () => {
    it("detects overlapping inclusive ranges", () => {
        expect(rangesOverlap("2026-06-10", "2026-06-12", "2026-06-12", "2026-06-15")).toBe(
            true,
        );
        expect(rangesOverlap("2026-06-12", "2026-06-15", "2026-06-10", "2026-06-12")).toBe(
            true,
        );
    });

    it("detects non-overlapping ranges", () => {
        expect(rangesOverlap("2026-06-10", "2026-06-12", "2026-06-13", "2026-06-15")).toBe(
            false,
        );
        expect(rangesOverlap("2026-06-13", "2026-06-15", "2026-06-10", "2026-06-12")).toBe(
            false,
        );
    });

    it("detects same-day overlap", () => {
        expect(rangesOverlap("2026-06-10", "2026-06-10", "2026-06-10", "2026-06-10")).toBe(
            true,
        );
    });
});

describe("hasOverlappingLeave", () => {
    const requests: LeaveRequest[] = [
        {
            id: "1",
            memberId: "alice",
            startDate: "2026-06-10",
            endDate: "2026-06-12",
            reason: "Vacation",
            status: "approved",
        },
        {
            id: "2",
            memberId: "bob",
            startDate: "2026-06-10",
            endDate: "2026-06-12",
            reason: "Vacation",
            status: "approved",
        },
        {
            id: "3",
            memberId: "alice",
            startDate: "2026-07-01",
            endDate: "2026-07-02",
            reason: "Old request",
            status: "rejected",
        },
    ];

    it("blocks overlapping leave for the same member", () => {
        expect(hasOverlappingLeave(requests, "alice", "2026-06-12", "2026-06-14")).toBe(true);
    });

    it("does not block overlapping leave for a different member", () => {
        expect(hasOverlappingLeave(requests, "charlie", "2026-06-12", "2026-06-14")).toBe(false);
    });

    it("ignores rejected leave", () => {
        expect(hasOverlappingLeave(requests, "alice", "2026-07-01", "2026-07-02")).toBe(false);
    });
});

describe("hasOverlappingLeaveExcludingRequest", () => {
    const requests: LeaveRequest[] = [
        {
            id: "existing-approved",
            memberId: "1",
            startDate: "2026-06-10",
            endDate: "2026-06-12",
            reason: "Vacation",
            status: "approved",
        },
        {
            id: "request-being-updated",
            memberId: "1",
            startDate: "2026-06-12",
            endDate: "2026-06-14",
            reason: "Family",
            status: "rejected",
        },
    ];

    it("ignores the request currently being updated", () => {
        expect(
            hasOverlappingLeaveExcludingRequest(
                requests,
                "request-being-updated",
                "1",
                "2026-06-12",
                "2026-06-14",
            ),
        ).toBe(true);
    });

    it("returns false when only the current request overlaps itself", () => {
        expect(
            hasOverlappingLeaveExcludingRequest(
                [requests[1]],
                "request-being-updated",
                "1",
                "2026-06-12",
                "2026-06-14",
            ),
        ).toBe(false);
    });
});
