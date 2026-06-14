import {
    describe,
    expect,
    it,
} from "vitest";
import {
    getApprovedLeaveConflictForWeek,
    getOnCallMemberIdForWeek,
    getPendingLeaveWarningForWeek,
    isCurrentWeek,
} from "./onCallRotation";
import type {LeaveRequest} from "$lib/types";


describe("getOnCallMemberIdForWeek", () => {
    it("starts with Alice on the reference week", () => {
        expect(getOnCallMemberIdForWeek("2026-06-15")).toBe("1");
    });

    it("rotates to Bob in week 2", () => {
        expect(getOnCallMemberIdForWeek("2026-06-22")).toBe("2");
    });

    it("rotates to Charlie in week 3", () => {
        expect(getOnCallMemberIdForWeek("2026-06-29")).toBe("3");
    });

    it("rotates to Diana in week 4", () => {
        expect(getOnCallMemberIdForWeek("2026-07-06")).toBe("4");
    });

    it("repeats after 4 weeks", () => {
        expect(getOnCallMemberIdForWeek("2026-07-13")).toBe("1");
    });
});

describe("weekly leave conflict helpers", () => {
    const requests: LeaveRequest[] = [
        {
            id: "approved-conflict",
            memberId: "1",
            startDate: "2026-01-05",
            endDate: "2026-01-06",
            reason: "Vacation",
            status: "approved",
        },
        {
            id: "pending-warning",
            memberId: "2",
            startDate: "2026-01-12",
            endDate: "2026-01-13",
            reason: "Family",
            status: "pending",
        },
    ];

    it("detects approved leave conflict", () => {
        const conflict = getApprovedLeaveConflictForWeek(
            requests,
            "1",
            "2026-01-05",
            "2026-01-11",
        );

        expect(conflict?.id).toBe("approved-conflict");
    });

    it("ignores pending leave for approved conflict highlighting", () => {
        const conflict = getApprovedLeaveConflictForWeek(
            requests,
            "2",
            "2026-01-12",
            "2026-01-18",
        );

        expect(conflict).toBeUndefined();
    });

    it("detects pending leave warning", () => {
        const warning = getPendingLeaveWarningForWeek(
            requests,
            "2",
            "2026-01-12",
            "2026-01-18",
        );

        expect(warning?.id).toBe("pending-warning");
    });
});

describe("isCurrentWeek", () => {
    it("detects the week containing the supplied date", () => {
        expect(isCurrentWeek("2026-06-15", new Date("2026-06-18T12:00:00"))).toBe(true);
    });

    it("returns false for a different week", () => {
        expect(isCurrentWeek("2026-06-22", new Date("2026-06-18T12:00:00"))).toBe(false);
    });
});
