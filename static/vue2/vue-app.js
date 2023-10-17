Vue.component('LeagueStatus', {
    template: `<div>The current season is {{ season }}!</div>`,
    data: function() {
        return {
            season: "<loading>"
        }
    },
    mounted () {
        fetch('http://londoncitypool.com/.netlify/functions/league')
//        fetch('http://localhost:9999/.netlify/functions/league')
            .then(response => response.json())
            .then(data => this.season = data.Name);
    }
})

Vue.component('ActivePlayers', {
    template: `<div>
      <h2>Active Players</h2>
      <div>
        <ul v-for="player in players">
            <li>{{ player }}</li>
        </ul>
      </div>
    </div>`,
    data: () => ({ players: [] }),
    mounted () {
        fetch('http://londoncitypool.com/.netlify/functions/active-players')
//        fetch('http://localhost:9999/.netlify/functions/active-players')
            .then(response => response.json())
            .then(data => this.players = data);
    }
})

const vueApp = new Vue({
    el: '#vapp',
    data: {
//        display: 'greenbox'
    },
    methods: {
//        toggleBox() {
//            this.display === 'redbox' ? this.display = 'greenbox' : this.display = 'redbox'
//        },
//        formatDate() {
//            return new Date().toDateString()
//        }
    }
})
