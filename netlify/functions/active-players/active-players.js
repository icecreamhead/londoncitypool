function uniq(players) {
    var seen = {};
    return players.filter(function(player) {
        return seen.hasOwnProperty(player.Name) ? false : (seen[player.Name] = true);
    });
}

const fetchPlayers = async function (id, name, status) {
    const p = `https://app.londoncitypool.com/api/league/results/${id}?apiKey=${process.env.API_KEY}`
    const r = await fetch(p, {
          headers: { Accept: 'application/json' },
    })
    if (!r.ok) {
      console.log(r)
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: r.status, body: r.statusText }
    }

    const json = await r.json()
    const players_ = json
       .flatMap(result => result.Sections)
       .flatMap(section => section.Frames)
       .flatMap(frame => frame.HomePlayers.concat(frame.AwayPlayers))
       .filter(player => player.FirstName && player.LastName)
       .map(player => {
            return { Name : player.FirstName + ' ' + player.LastName }
       })
    const players = uniq(players_).sort((a, b) => a.Name.localeCompare(b.Name))

    return { Id: id, Name: name, Status: status, Players: players }
}

const handler = async function (event) {
  const season = (event.queryStringParameters.season) ? event.queryStringParameters.season : 74
  const seasonsPath = `https://app.londoncitypool.com/api/seasons?apiKey=${process.env.API_KEY}`
//  console.log(event.headers.origin)
  try {
    const seasonsResponse = await fetch(seasonsPath, {
      headers: { Accept: 'application/json' },
    })
    if (!seasonsResponse.ok) {
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText }
    }
    const seasonsArray = await seasonsResponse.json();

    const enriched = seasonsArray.map(s => {
        return fetchPlayers(s.Id, s.Name, s.Status)
    })
    const resolved = await Promise.all(enriched)
    const allow = event.headers.origin === 'http://localhost:1313' || event.headers.origin === 'https://londoncitypool.com'
        ? event.headers.origin : null
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow from anywhere
      },
      body: JSON.stringify(resolved)
    }

  } catch (error) {
    // output to netlify function log
    console.log(error)
    return {
      statusCode: 500,
      // Could be a custom message or object i.e. JSON.stringify(err)
      body: JSON.stringify({ msg: error.message }),
    }
  }
}

module.exports = { handler }
