const path = `https://app.londoncitypool.com/api/seasons?apiKey=${process.env.API_KEY}`

const handler = async function () {
  //console.log(path)
  try {
    const response = await fetch(path, {
      headers: { Accept: 'application/json' },
    })
    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText }
    }
    const data = await response.json()

//    const b = JSON.parse(data)
//        .map(s => {
//          return { Name: s.Name, Id: s.Id }
//        })
//        .find(s => s.Status === 'InProgress')

//    console.log(data.sort((a,b) => {a - b}))
    //console.log("got data")
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*", // Allow from anywhere
      },
      body: JSON.stringify(data)
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
