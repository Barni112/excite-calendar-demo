<script lang="ts">
    import {teamMembers} from "$lib/data/teamMembers";
    import type {
        LeaveRequest,
        LeaveStatus,
    } from "$lib/types";
    import {hasOverlappingLeave} from "$lib/logic/leaveValidation";


    let {
        requests,
        onCreate,
    } = $props<{
        requests: LeaveRequest[];
        onCreate: (request: LeaveRequest) => void;
    }>();

    let memberId = $state(teamMembers[0].id);
    let startDate = $state("");
    let endDate = $state("");
    let reason = $state("");
    let status = $state<LeaveStatus>("pending");
    let errors = $state<string[]>([]);

    function validate(): string[] {
        const validationErrors: string[] = [];


        if (!memberId) validationErrors.push("Team member is required.");
        if (!startDate) validationErrors.push("Start date is required.");
        if (!endDate) validationErrors.push("End date is required.");
        if (!reason.trim()) validationErrors.push("Reason is required.");

        if (validationErrors.length > 0) return validationErrors;

        if (endDate < startDate) {
            validationErrors.push("End date cannot be before start date.");
            return validationErrors;
        }

        if (hasOverlappingLeave(requests, memberId, startDate, endDate)) {
            validationErrors.push("This team member already has an overlapping pending or approved leave request.");
        }

        return validationErrors;
    }

    function handleSubmit(event: SubmitEvent) {
        event.preventDefault();

        errors = validate();

        if (errors.length > 0) {
            return;
        }

        onCreate({
            id: crypto.randomUUID(),
            memberId,
            startDate,
            endDate,
            reason: reason.trim(),
            status,
        });

        startDate = "";
        endDate = "";
        reason = "";
        status = "pending";
        errors = [];
    }
</script>

<section class="card">
    <h2>Create Leave Request</h2>

    {#if errors.length > 0}
        <div class="error-box">
            <ul>
                {#each errors as error}
                    <li>{error}</li>
                {/each}
            </ul>
        </div>
    {/if}

    <form onsubmit={handleSubmit} class="form">
        <label>
            Team member
            <select bind:value={memberId}>
                {#each teamMembers as member}
                    <option value={member.id}>{member.name}</option>
                {/each}
            </select>
        </label>

        <label>
            Start date
            <input type="date" bind:value={startDate}/>
        </label>

        <label>
            End date
            <input type="date" bind:value={endDate}/>
        </label>

        <label>
            Reason
            <textarea bind:value={reason} rows="3"></textarea>
        </label>

        <label>
            Status
            <select bind:value={status}>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
            </select>
        </label>

        <button type="submit">Create request</button>
    </form>
</section>
