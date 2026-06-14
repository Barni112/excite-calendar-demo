# Team Leave Calendar with On-Call Rotation

A simple SvelteKit application for managing team leave requests and viewing weekly on-call rotation conflicts.

The application uses a fixed team list, allows leave requests to be created and managed, prevents overlapping leave requests for the same person, and highlights weeks where the on-call person is on approved leave.

## Features

* View fixed team members
* Create leave requests
* View leave requests in a list
* Filter leave requests by team member and status
* Update leave request status
* Delete leave requests
* Prevent overlapping leave requests for the same team member
* View weekly on-call rotation
* Highlight conflicts when the on-call person has approved leave
* Persist leave requests in browser localStorage
* Unit tests for date overlap and on-call rotation logic

## Team Members

The application uses the following fixed team members:

* Alice
* Bob
* Charlie
* Diana

## Leave Request Fields

Each leave request contains:

* Team member
* Start date
* End date
* Reason
* Status

Supported statuses:

* Pending
* Approved
* Rejected

## On-Call Rotation

The application implements a simple weekly rotation:

1. Alice
2. Bob
3. Charlie
4. Diana

The rotation then repeats.

The rotation starts on Monday, `2026-06-15`, with Alice.

If the on-call person has approved leave during their on-call week, the schedule highlights the row as a conflict.

## Tech Stack

* SvelteKit
* TypeScript
* date-fns
* localStorage
* Vitest

## Setup

Install dependencies:

```bash
npm install
```

## Run Locally

Start the development server:

```bash
npm run dev
```

To open the app automatically in the browser:

```bash
npm run dev -- --open
```

## Run Tests

Run unit tests:

```bash
npm test
```


## Assumptions

* Team members are fixed and cannot be created, edited, or deleted.
* No authentication or user registration is required.
* Data is stored in the browser using localStorage.
* Leave dates are treated as inclusive.
* Pending and approved leave requests block overlapping leave requests for the same team member.
* Rejected leave requests do not block new leave requests.
* On-call conflicts are highlighted only for approved leave.
* Pending leave during an on-call week is not treated as a required conflict.
* The on-call rotation starts on Monday, `2026-06-15`, with Alice.
* The app is intended to run locally.

## Date Overlap Rules

Leave requests overlap when they share at least one day.

For example, these two requests overlap:

```text
2026-06-10 to 2026-06-12
2026-06-12 to 2026-06-15
```

They both include `2026-06-12`.

These two requests do not overlap:

```text
2026-06-10 to 2026-06-12
2026-06-13 to 2026-06-15
```

## Completed Requirements

* View team members
* Create a leave request for a team member
* View leave requests in a list
* Prevent overlapping leave requests for the same person
* Mark leave requests as Pending, Approved, or Rejected
* View an on-call rotation schedule
* Show clearly when the on-call person is on approved leave
* Include setup and run instructions
* Include assumptions and incomplete features

## Optional Improvements Added

* Filtering by team member
* Filtering by leave status
* Delete leave requests
* localStorage persistence
* Basic unit tests
* Improved visual conflict highlighting

## Not Implemented

* User authentication
* User registration
* Backend API
* Database persistence
* Calendar month view
* Automatic on-call reassignment
* Leave approval workflow with separate user roles
* Comments on leave requests
* Docker setup
* REST API documentation

## Project Structure

```text
src/
  lib/
    components/
      LeaveRequestForm.svelte
      LeaveRequestList.svelte
      OnCallSchedule.svelte
      TeamMembers.svelte
    data/
      teamMembers.ts
    logic/
      leaveValidation.test.ts
      leaveValidation.ts
      onCallRotation.test.ts
      onCallRotation.ts
    types.ts
  routes/
    +layout.svelte
    +page.svelte
  app.css
```

## Testing Notes

The unit tests focus on the most important business logic:

* inclusive date overlap detection
* preventing overlapping leave for the same member
* ignoring rejected leave during overlap checks
* weekly on-call rotation calculation
* approved leave conflict detection

UI component tests are not included because the main risk in this project is date and rotation correctness.

## Future Improvements

Possible improvements:

* Calendar month view
* Better date formatting
* Automatic on-call replacement suggestion
* Backend API
* Database storage
* Docker setup
* Component tests
* End-to-end tests
* More detailed leave approval workflow
