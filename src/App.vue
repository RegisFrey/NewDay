<template>
<div class="splash-pad">
  <header class="splash-pad__header">
    <div class="splash-pad__today">
      <h1>
        <span class="splash-pad__hour">{{ time }}</span>
        <span class="splash-pad__day">{{ day }}</span>
        <span class="splash-pad__date">{{ date }}</span>
        <!-- December 26th -->
      </h1>
    </div>
  </header>

  <div class="splash-pad__content">
    <div class="splash-pad__calendar">
      <h2>Today</h2>
      <!--
      TODO: GCal integration
      <a href="#">Login with Google for Calendar</a>
      -->
      <div class="splash-pad__calendar__entry splash-pad__calendar__entry--now">
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

    <div class="splash-pad__todos">
      <h2>Todo</h2>
      <label class="splash-pad__todo"><input type="checkbox" /> Something to do</label>
      <label class="splash-pad__todo--checked"><input type="checkbox" checked /> Another thing done</label>
      <!-- TODO: Add items -->
      <!-- TODO: Complete items -->
      <!-- TODO: Reorder items? -->
      <!-- TODO: Delete items? -->
      <!-- TODO: Complete items are removed next day (after 3 am) -->
      <!-- TODO: Persistence -->
    </div>

    <div class="splash-pad__notes">
      <h2>Notes</h2>
      <textarea placeholder="Type notes">

      </textarea>
      <!-- TODO: Markdown or TipTap editor -->
      <!-- TODO: Persistence -->
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      now: new Date()
    }
  },
  computed: {
    day () {
      return new Intl.DateTimeFormat('en-US', { weekday: 'long'}).format(this.now);
    },
    time () {
      return new Intl.DateTimeFormat('en-US', { hour: "numeric", minute: "numeric" }).format(this.now);
    },
    date () {
      return new Intl.DateTimeFormat('en-US', { dateStyle: "long" }).format(this.now);
    },
  },
  methods: {
    updateTime () {
      this.now = new Date();
    }
  },
  mounted () {
    const secondsRemainingInMinute = (60 - this.now.getSeconds()) * 1000;

    setTimeout(() => {
        this.updateTime();
        setInterval(() => {
          this.updateTime();
        }, 60000);
    }, secondsRemainingInMinute);
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,800;1,400&display=swap');

html, body, #app, .splash-pad {
  width: 100vw;
  min-height: 100vh;
  padding: 0;
  margin: 0;
}

#app {
  --color-surface: #1E1E1E;
  --color-text: #C7C7C7;
  --color-text-subtle: #767676;
  --color-link: #0C7D9D;
  background-color: var(--color-surface);
  color: var(--color-text);
  font-family: 'Open Sans', sans-serif;
}

.splash-pad {
  display: flex;
  flex-direction: column;
}

.splash-pad__header {

}

.splash-pad__content {
  display: flex;
  flex-direction: row;
  flex: 1;
}

.splash-pad__today {
  display: flex;
  flex-direction: column;
  padding: 20px;
  padding-bottom: 10px;
}

.splash-pad__calendar {
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  flex: 2;
}

.splash-pad__meeting__time {
  font-size: 1.5rem;
}

.splash-pad__todos {
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  flex: 3;
}

.splash-pad__todo {
  display: block;
}

.splash-pad__todo--checked {
  text-decoration: line-through;
  color: var(--color-text-subtle);
}

.splash-pad__notes {
  display: flex;
  flex-direction: column;
  padding: 10px 20px;
  flex: 5;
}

.splash-pad__notes > textarea {
  display: flex;
  flex: 1;
  background-color: transparent;
  border: none;
  outline: none; /** TODO: Focus style */
  color: var(--color-text);
}

.splash-pad__hour,
.splash-pad__day,
.splash-pad__date {
  display: block;
}

.splash-pad__hour {
  font-size: 4rem;
  line-height: 2.5rem;
}
.splash-pad__day {
  font-size: 3rem;
  line-height: 3rem;
  text-transform: uppercase;
}
.splash-pad__date {
  font-size: 2rem;
  line-height: 2rem;
  color: var(--color-text-subtle);
}

h2 {
  text-transform: uppercase;
  font-size: 1rem;
  line-height: 1rem;
  color: var(--color-text-subtle);
}

 a {
  color: var(--color-link)
 }

.splash-pad__calendar__entry {
  display: flex;
   flex-direction: column;
   border-bottom: 1px solid rgb(55, 55, 55);
   padding-bottom: 8px;
   margin-bottom: 16px;
}

 .splash-pad__calendar__entry--now {
   color: rgb(249, 97, 80);
   
 }
</style>
