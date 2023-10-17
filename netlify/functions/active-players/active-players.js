 const path = `https://app.londoncitypool.com/api/league/results/74?apiKey=${process.env.API_KEY}`

const handler = async function () {
  try {
    const response = await fetch(path, {
      headers: { Accept: 'application/json' },
    })
    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText }
    }
    const data = await response.json()

    const a = JSON.parse(data)
        .flatMap(result => result.Sections)
        .flatMap(section => section.Frames)
        .flatMap(frame => frame.HomePlayers.concat(frame.AwayPlayers))
        .filter(player => player.FirstName !== null && player.LastName !== null)
        .map(player => player.FirstName + ' ' + player.LastName)

    const b = [...new Set(a)].sort()
    console.log(JSON.stringify(b))

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow from anywhere
      },
      body: JSON.stringify(b)
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
