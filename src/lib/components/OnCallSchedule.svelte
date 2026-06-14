<script lang="ts">
    import type {LeaveRequest} from "$lib/types";
    import {
        getApprovedLeaveConflictForWeek,
        getUpcomingOnCallWeeks,
    } from "$lib/logic/onCallRotation";


    let {
        requests,
        getMemberName,
    } = $props<{
        requests: LeaveRequest[];
        getMemberName: (memberId: string) => string;
    }>();

    const weeks = $derived(getUpcomingOnCallWeeks(8));
</script>

<section class="card">
    <h2>On-Call Schedule</h2>

    <div class="table-wrapper">
        <table class="on-call-table">
            <colgroup>
                <col class="week-start-col" />
                <col class="week-end-col" />
                <col class="person-col" />
                <col class="conflict-col" />
            </colgroup>

            <thead>
            <tr>
                <th>Week start</th>
                <th>Week end</th>
                <th>On-call person</th>
                <th>Conflict</th>
            </tr>
            </thead>

            <tbody>
            {#each weeks as week}
                {@const conflict = getApprovedLeaveConflictForWeek(
                    requests,
                    week.onCallMemberId,
                    week.startDate,
                    week.endDate
                )}

                <tr class:conflict={Boolean(conflict)}>
                    <td>{week.startDate}</td>
                    <td>{week.endDate}</td>
                    <td>{getMemberName(week.onCallMemberId)}</td>
                    <td class="conflict-cell">
                        {#if conflict}
                            <strong>
                                {getMemberName(week.onCallMemberId)} is on approved leave from {conflict.startDate} to {conflict.endDate}
                            </strong>
                        {:else}
                            <span class="no-conflict">No conflict</span>
                        {/if}
                    </td>
                </tr>
            {/each}
            </tbody>
        </table>
    </div>
</section>
