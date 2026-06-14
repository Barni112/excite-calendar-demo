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
        onStatusChange: (requestId: string, status: LeaveStatus) => void;
        onDelete: (requestId: string) => void;
    }>();

    function handleStatusChange(event: Event, requestId: string) {
        const target = event.target as HTMLSelectElement;
        onStatusChange(requestId, target.value as LeaveStatus);
    }
</script>

<section class="card">
    <h2>Leave Requests</h2>

    {#if requests.length === 0}
        <p>No leave requests found.</p>
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
                            <select
                                    value={request.status}
                                    onchange={(event) => handleStatusChange(event, request.id)}
                            >
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </td>
                        <td>
                            <button type="button" class="secondary" onclick={() => onDelete(request.id)}>
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
