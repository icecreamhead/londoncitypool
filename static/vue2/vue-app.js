const apiHost = location.hostname === 'localhost' ? 'http://localhost:9999' : 'https://londoncitypool.com'

const ActivePlayers = Vue.component('ActivePlayers', {
    template: `<div>
      </br>
      <table>
          <tr v-for="player in players">
              <td>{{ player }}</td>
          </tr>
      </table>
    </div>`,
    data: () => ({
        players: []
    }),
    mounted () {
        fetch(`${apiHost}/.netlify/functions/active-players?season=${this.season}`)
            .then(response => response.json())
            .then(data => this.players = data);
    },
    props: {
        season: Number
    }
})

const LeagueStatus = Vue.component('LeagueStatus', {
    template: `<div>
        <span>
            Choose a season to view the players who have played in that season:
            <select name="season-select" id="season-select-id" @change="onChange($event)">
                <option v-for="s in seasons" :value="s.Id">{{ s.Name }}</option>
            </select>
        </span>
        <active-players v-if="id" :season="id" :key="id"></active-players>
    </div>`,
    data: () => ({
//        season: "<loading>",
        id: null,
        seasons: []
    }),
    mounted () {
        fetch(`${apiHost}/.netlify/functions/league`)
            .then(response => response.json())
            .then(data => {
                this.seasons = JSON.parse(data).sort((a,b) => b.Id-a.Id);
                this.id = this.seasons[0].Id;
            });

    },
    components: {
        ActivePlayers
    },
    methods: {
        onChange(event) {
            this.id = parseInt(event.target.value)
        }
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
