<script lang="ts">
    import type {LeaveRequest} from "$lib/types";
    import {
        getApprovedLeaveConflictForWeek,
        getPendingLeaveWarningForWeek,
        getUpcomingOnCallWeeks,
        isCurrentWeek,
    } from "$lib/logic/onCallRotation";
    import {
        DEFAULT_ON_CALL_WEEK_COUNT,
        ON_CALL_WEEK_COUNT_OPTIONS,
    } from "$lib/config";


    let {
        requests,
        getMemberName,
    } = $props<{
        requests: LeaveRequest[];
        getMemberName: (memberId: string) => string;
    }>();

    let weekCount = $state(DEFAULT_ON_CALL_WEEK_COUNT);

    const weeks = $derived(getUpcomingOnCallWeeks(weekCount));
</script>

<section class="card">
    <div class="section-header">
        <h2>On-Call Schedule</h2>

        <label class="compact-label">
            Weeks to show
            <select bind:value={weekCount}>
                {#each ON_CALL_WEEK_COUNT_OPTIONS as option}
                    <option value={option}>{option}</option>
                {/each}
            </select>
        </label>
    </div>

    <div class="table-wrapper">
        <table class="on-call-table">
            <colgroup>
                <col class="week-start-col"/>
                <col class="week-end-col"/>
                <col class="person-col"/>
                <col class="conflict-col"/>
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
                {@const warning = conflict ? undefined : getPendingLeaveWarningForWeek(
                    requests,
                    week.onCallMemberId,
                    week.startDate,
                    week.endDate
                )}
                {@const currentWeek = isCurrentWeek(week.startDate)}

                <tr
                        class:conflict={Boolean(conflict)}
                        class:warning={!conflict && Boolean(warning)}
                        class:current-week={currentWeek}
                >
                    <td>
                        <div class="week-start-cell">
                            <span>{week.startDate}</span>
                            {#if currentWeek}
                                <span class="current-week-badge">Current week</span>
                            {/if}
                        </div>
                    </td>
                    <td>{week.endDate}</td>
                    <td>{getMemberName(week.onCallMemberId)}</td>
                    <td class="conflict-cell">
                        {#if conflict}
                            <strong class="conflict-message">
                                Conflict: {getMemberName(week.onCallMemberId)} is on approved leave from {conflict.startDate} to {conflict.endDate}
                            </strong>
                        {:else if warning}
                            <strong class="warning-message">
                                Warning: {getMemberName(week.onCallMemberId)} has pending leave from {warning.startDate} to {warning.endDate}
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
