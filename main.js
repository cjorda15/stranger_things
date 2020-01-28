const util = require('util');
let request = require('request');
request = util.promisify(request);


// NOTE Used this to solve how to remove html from string
// https://stackoverflow.com/questions/1732348/regex-match-open-tags-except-xhtml-self-contained-tags#answer-1732454
// https://stackoverflow.com/questions/11229831/regular-expression-to-remove-html-tags-from-a-string

module.exports = async () => {

  const response = await request('http://api.tvmaze.com/singlesearch/shows?q=stranger-things&embed=episodes')
  const show     = JSON.parse(response.body)

  const details  = show._embedded.episodes.reduce((details, episode, index, list) => {
    details.totalDurationSec += episode.runtime*60

    // Setup for last iteration to find season/episode average
    details.seasons[episode.season]? details.seasons[episode.season]++ : details.seasons[episode.season] = 1

    // Format episode details
    details.episodes[episode.id] = {
      sequenceNumber:`s${episode.season}e${episode.number}`,
      shortTitle: episode.name.split(':')[1].trim(),
      airTimestamp: new Date(episode.airstamp).getTime()/1000,
      shortSummary:episode.summary? episode.summary.replace(/<[^>]*>/g,"").trim():''
    }

    // Find season/episode average at the end of iteration and assign to the averageEpisodesPerSeason property and remove the now useless seasons property
    if(index===list.length-1){
      details.averageEpisodesPerSeason = Object.keys(details.seasons).reduce((total,season,i,l)=>{
        total+= details.seasons[season]
        return i === l.length-1? total/l.length : total
      },0)
      delete details.seasons
    }

    return details
   },
   {
    totalDurationSec:0,
    seasons:{},
    episodes:{}
   })

  return {id:show.id,...details}
}
