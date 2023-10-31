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

    }),
    mounted () {

    },
    props: {
        season: Number,
        players: Array
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
        <br>
        <active-players v-if="id" :season="id" :key="id" :players="seasonPlayers"></active-players>
        <img v-else="id" src="/loading.gif" style="display:block;margin-left:auto;margin-right:auto" />
    </div>`,
    data: () => ({
        id: null,
        seasons: [],
        seasonPlayers: []
    }),
    mounted () {
        fetch(`${apiHost}/.netlify/functions/active-players`)
            .then(response => response.json())
            .then(data => {
//                console.log('mounted')
                this.seasons = data.sort((a,b) => b.Id - a.Id);
                this.id = this.seasons[0].Id;
                this.seasonPlayers = this.seasons[0].Players
            });

    },
    components: {
        ActivePlayers
    },
    methods: {
        onChange(event) {
            this.id = parseInt(event.target.value)
            this.seasonPlayers = this.seasons.find(s => s.Id === this.id).Players
        }
    }
})

const vueApp = new Vue({
    el: '#vapp',
    data: {

    },
    methods: {

    }
})
