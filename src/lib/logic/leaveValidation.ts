import type {LeaveRequest} from "$lib/types";


export function rangesOverlap(
    startA: string,
    endA: string,
    startB: string,
    endB: string,
): boolean {
    return startA <= endB && startB <= endA;
}

export function hasOverlappingLeave(
    requests: LeaveRequest[],
    memberId: string,
    startDate: string,
    endDate: string,
): boolean {
    return requests.some((request: LeaveRequest): boolean => {
        if (request.memberId !== memberId) return false;
        if (request.status === "rejected") return false;
        return rangesOverlap(request.startDate, request.endDate, startDate, endDate);
    });
}
