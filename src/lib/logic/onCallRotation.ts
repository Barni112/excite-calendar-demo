import {
    addDays,
    addWeeks,
    differenceInCalendarWeeks,
    format,
    parseISO,
    startOfWeek,
} from "date-fns";
import type {LeaveRequest} from "$lib/types";
import {rangesOverlap} from "./leaveValidation";
import {teamMembers} from "$lib/data/teamMembers";


export const ROTATION_START_DATE = "2026-06-15";

export type OnCallWeek = {
    startDate: string;
    endDate: string;
    onCallMemberId: string;
};

export function toDateString(date: Date): string {
    return format(date, "yyyy-MM-dd");
}

export function getMonday(date: Date): Date {
    return startOfWeek(date, {weekStartsOn: 1});
}

export function getOnCallMemberIdForWeek(weekStartDate: string): string {
    const referenceMonday = parseISO(ROTATION_START_DATE);
    const currentMonday = getMonday(parseISO(weekStartDate));

    const weekIndex = differenceInCalendarWeeks(currentMonday, referenceMonday, {weekStartsOn: 1});

    const normalizedIndex = ((weekIndex % teamMembers.length) + teamMembers.length) % teamMembers.length;

    return teamMembers[normalizedIndex]["id"];
}

export function getUpcomingOnCallWeeks(count: number, fromDate = new Date()): OnCallWeek[] {
    const firstMonday = getMonday(fromDate);

    return Array.from({length: count}, (_, index) => {
        const weekStart = addWeeks(firstMonday, index);
        const weekEnd = addDays(weekStart, 6);
        const startDate = toDateString(weekStart);
        const endDate = toDateString(weekEnd);

        return {
            startDate,
            endDate,
            onCallMemberId: getOnCallMemberIdForWeek(startDate),
        };
    });
}

export function getApprovedLeaveConflictForWeek(
    requests: LeaveRequest[],
    memberId: string,
    weekStartDate: string,
    weekEndDate: string,
): LeaveRequest | undefined {
    return requests.find((request: LeaveRequest): boolean => {
        if (request.memberId !== memberId) return false;
        if (request.status !== "approved") return false;

        return rangesOverlap(request.startDate, request.endDate, weekStartDate, weekEndDate);
    });
}
