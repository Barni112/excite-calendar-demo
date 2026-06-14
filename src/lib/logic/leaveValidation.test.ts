import {
    describe,
    expect,
    it,
} from "vitest";
import {
    hasOverlappingLeave,
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
