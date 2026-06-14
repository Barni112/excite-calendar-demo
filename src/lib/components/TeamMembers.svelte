<script lang="ts">
    import {teamMembers} from "$lib/data/teamMembers";
</script>

<section class="card">
    <h2>Team Members</h2>

    <ul class="team-list">
        {#each teamMembers as member}
            <li>{member.name}</li>
        {/each}
    </ul>
</section>
