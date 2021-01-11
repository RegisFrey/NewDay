<template>
<div class="splash-pad-calendar">
    <!--
      TODO: GCal integration
      <a href="#">Login with Google for Calendar</a>
      -->
        <div
          class="splash-pad__calendar__entry splash-pad__calendar__entry--now"
        >
          <b class="splash-pad__meeting__time">2:10 PM</b>
          Meeting Name Something
        </div>

        <div class="splash-pad__calendar__entry">
          <b class="splash-pad__meeting__time">3:20 PM</b>
          Meeting Name Something
        </div>

        <div class="splash-pad__calendar__entry">
          <b class="splash-pad__meeting__time">5:00 PM</b>
          Other Event
        </div>
</div>
</template>


<style>
.splash-pad__meeting__time {
  font-size: 1.5rem;
}

.splash-pad__calendar__entry {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--color-linework);
  padding-bottom: 8px;
  margin-bottom: 16px;
}

.splash-pad__calendar__entry--now {
  color: var(--color-warning)
}
</style>