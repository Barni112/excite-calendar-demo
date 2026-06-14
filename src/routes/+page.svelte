<script lang="ts">
    import {onMount} from "svelte";
    import TeamMembers from "$lib/components/TeamMembers.svelte";
    import LeaveRequestForm from "$lib/components/LeaveRequestForm.svelte";
    import LeaveRequestList from "$lib/components/LeaveRequestList.svelte";
    import OnCallSchedule from "$lib/components/OnCallSchedule.svelte";
    import {teamMembers} from "$lib/data/teamMembers";
    import type {
        LeaveRequest,
        LeaveStatus,
    } from "$lib/types";


    const STORAGE_KEY = "team-leave-calendar-requests";

    type StatusFilter = "all" | LeaveStatus;

    let leaveRequests = $state<LeaveRequest[]>([]);
    let memberFilter = $state("all");
    let statusFilter = $state<StatusFilter>("all");

    const filteredRequests = $derived(
        leaveRequests.filter((request) => {
            const memberMatches = memberFilter === "all" || request.memberId === memberFilter;
            const statusMatches = statusFilter === "all" || request.status === statusFilter;

            return memberMatches && statusMatches;
        }),
    );

    onMount(() => {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (!saved) return;

        try {
            leaveRequests = JSON.parse(saved) as LeaveRequest[];
        } catch {
            leaveRequests = [];
        }
    });

    function saveRequests(nextRequests: LeaveRequest[]) {
        leaveRequests = nextRequests;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextRequests));
    }

    function getMemberName(memberId: string): string {
        return teamMembers.find((member) => member.id === memberId)?.name ?? "Unknown";
    }

    function addLeaveRequest(request: LeaveRequest) {
        saveRequests([...leaveRequests, request]);
    }

    function updateLeaveStatus(requestId: string, status: LeaveStatus) {
        saveRequests(
            leaveRequests.map((request) =>
                request.id === requestId
                ? {
                        ...request,
                        status,
                    }
                : request,
            ),
        );
    }

    function deleteLeaveRequest(requestId: string) {
        saveRequests(leaveRequests.filter((request) => request.id !== requestId));
    }
</script>

<svelte:head>
    <title>Team Leave Calendar</title>
</svelte:head>

<main class="page">
    <header class="hero">
        <h1>Team Leave Calendar</h1>
        <p>Manage leave requests and see weekly on-call conflicts.</p>
    </header>

    <TeamMembers/>

    <LeaveRequestForm requests={leaveRequests} onCreate={addLeaveRequest}/>

    <section class="card">
        <h2>Filters</h2>

        <div class="filters">
            <label>
                Team member
                <select bind:value={memberFilter}>
                    <option value="all">All members</option>
                    {#each teamMembers as member}
                        <option value={member.id}>{member.name}</option>
                    {/each}
                </select>
            </label>

            <label>
                Status
                <select bind:value={statusFilter}>
                    <option value="all">All statuses</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </label>
        </div>
    </section>

    <LeaveRequestList
            requests={filteredRequests}
            {getMemberName}
            onStatusChange={updateLeaveStatus}
            onDelete={deleteLeaveRequest}
    />

    <OnCallSchedule requests={leaveRequests} {getMemberName}/>
</main>
