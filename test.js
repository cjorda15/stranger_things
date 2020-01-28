const expect  = require('chai').expect;
const getFormatedObj = require('./main')


describe('Stranger Things',()=>{
  let formattedObject

  before( async () => {
    formattedObject = await getFormatedObj()
  })

  it('should keep the id of the show when formatting', async () => {
      expect(formattedObject.id).to.equal(2993);
  });

  it('should find the total duration of the show in seconds', async () => {
      expect(formattedObject.totalDurationSec).to.equal(91740);
  });

  it('should find the average of episodes per season', async () => {
      expect(formattedObject.averageEpisodesPerSeason).to.equal(6.5);
  });

  // ran out of time for additonal testing...

})
