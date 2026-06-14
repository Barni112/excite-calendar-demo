export type TeamMember = {
    id: string;
    name: string;
};

export type LeaveStatus = "pending" | "approved" | "rejected";

export type LeaveRequest = {
    id: string;
    memberId: string;
    startDate: string;  // YYYY-MM-DD
    endDate: string;
    reason: string;
    status: LeaveStatus;
};
