<script lang="ts">
    import type {
        LeaveRequest,
        LeaveStatus,
    } from "$lib/types";


    let {
        requests,
        getMemberName,
        onStatusChange,
        onDelete,
    } = $props<{
        requests: LeaveRequest[];
        getMemberName: (memberId: string) => string;
        onStatusChange: (requestId: string, status: LeaveStatus) => boolean;
        onDelete: (requestId: string) => void;
    }>();

    function handleStatusChange(event: Event, request: LeaveRequest) {
        const target = event.target as HTMLSelectElement;
        const updated = onStatusChange(request.id, target.value as LeaveStatus);

        if (!updated) {
            target.value = request.status;
        }
    }

    function handleDelete(request: LeaveRequest) {
        const confirmed = confirm(
            `Delete leave request for ${getMemberName(request.memberId)} from ${request.startDate} to ${request.endDate}?`,
        );

        if (!confirmed) return;

        onDelete(request.id);
    }
</script>

<section class="card">
    <h2>Leave Requests</h2>

    {#if requests.length === 0}
        <p>No leave requests match the current filters.</p>
    {:else}
        <div class="table-wrapper">
            <table>
                <thead>
                <tr>
                    <th>Member</th>
                    <th>Start</th>
                    <th>End</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>

                <tbody>
                {#each requests as request}
                    <tr>
                        <td>{getMemberName(request.memberId)}</td>
                        <td>{request.startDate}</td>
                        <td>{request.endDate}</td>
                        <td>{request.reason}</td>
                        <td>
                            <div class="status-cell">
                                <select
                                        class={`status-select status-${request.status}`}
                                        value={request.status}
                                        onchange={(event) => handleStatusChange(event, request)}
                                >
                                    <option class="status-pending" value="pending">Pending</option>
                                    <option class="status-approved" value="approved">Approved</option>
                                    <option class="status-rejected" value="rejected">Rejected</option>
                                </select>
                            </div>
                        </td>
                        <td>
                            <button type="button" class="secondary" onclick={() => handleDelete(request)}>
                                Delete
                            </button>
                        </td>
                    </tr>
                {/each}
                </tbody>
            </table>
        </div>
    {/if}
</section>
