import type {
    LeaveRequest,
    LeaveStatus,
} from "$lib/types";


export type MemberFilter = "all" | string;
export type StatusFilter = "all" | LeaveStatus;

export function sortLeaveRequestsByDate(requests: LeaveRequest[]): LeaveRequest[] {
    return [...requests].sort((first, second) => {
        const startDateComparison = first.startDate.localeCompare(second.startDate);
        if (startDateComparison !== 0) return startDateComparison;

        const endDateComparison = first.endDate.localeCompare(second.endDate);
        if (endDateComparison !== 0) return endDateComparison;

        const memberComparison = first.memberId.localeCompare(second.memberId);
        if (memberComparison !== 0) return memberComparison;

        return first.reason.localeCompare(second.reason);
    });
}

export function filterAndSortLeaveRequests(
    requests: LeaveRequest[],
    memberFilter: MemberFilter,
    statusFilter: StatusFilter,
): LeaveRequest[] {
    const filteredRequests = requests.filter((request) => {
        const memberMatches = memberFilter === "all" || request.memberId === memberFilter;
        const statusMatches = statusFilter === "all" || request.status === statusFilter;

        return memberMatches && statusMatches;
    });

    return sortLeaveRequestsByDate(filteredRequests);
}
