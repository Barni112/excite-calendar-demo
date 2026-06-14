import {
    describe,
    expect,
    it,
} from "vitest";
import {filterAndSortLeaveRequests} from "./leaveFilters";
import type {LeaveRequest} from "$lib/types";


const requests: LeaveRequest[] = [
    {
        id: "3",
        memberId: "2",
        startDate: "2026-07-10",
        endDate: "2026-07-12",
        reason: "Vacation",
        status: "approved",
    },
    {
        id: "1",
        memberId: "1",
        startDate: "2026-06-10",
        endDate: "2026-06-12",
        reason: "Family",
        status: "pending",
    },
    {
        id: "2",
        memberId: "1",
        startDate: "2026-06-01",
        endDate: "2026-06-02",
        reason: "Doctor",
        status: "rejected",
    },
];

describe("filterAndSortLeaveRequests", () => {
    it("sorts requests by start date", () => {
        expect(filterAndSortLeaveRequests(requests, "all", "all").map((request) => request.id)).toEqual([
            "2",
            "1",
            "3",
        ]);
    });

    it("filters by member", () => {
        expect(filterAndSortLeaveRequests(requests, "1", "all").map((request) => request.id)).toEqual([
            "2",
            "1",
        ]);
    });

    it("filters by status", () => {
        expect(filterAndSortLeaveRequests(requests, "all", "approved").map((request) => request.id)).toEqual([
            "3",
        ]);
    });

    it("filters by member and status together", () => {
        expect(filterAndSortLeaveRequests(requests, "1", "pending").map((request) => request.id)).toEqual([
            "1",
        ]);
    });
});
