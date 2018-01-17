const express = require('express')
const app = express()
const axios = require('axios')
const env = require('dotenv').config();
var updated_at=new Date(),champions=[];
app.get('/champions', async (req, res) => {
    if(champions.length > 0 && (new Date()  - updated_at)/1000 < (1000*60*60) ){
        return res.status(202).json(champions)
    }
    try {
        let champions_id = [];
        const champions_ids = await axios({
             method: 'get',
             url: 'https://eun1.api.riotgames.com/lol/platform/v3/champions?freeToPlay=true',
             headers:{ "X-Riot-Token": process.env.API_KEY},
           });
           champions_id = champions_ids.data.champions.map((c)=>c.id)
           const champions_data = await axios({
             method: 'get',
             url: 'https://eun1.api.riotgames.com/lol/static-data/v3/champions?locale=en_US&tags=all&dataById=true',
             headers:{ "X-Riot-Token": process.env.API_KEY},
           });
          // console.log('ids',champions_id)
          for (const key in champions_data.data.data) {
             // console.log('key',key,'champ',champions_data.data.data[key])
             if(champions_id.indexOf(Number(key))>-1){
                 let champ = champions_data.data.data[key];
                 champ.img = 'http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/'+champ.image.full;
                 champ.loading_img = 'http://ddragon.leagueoflegends.com/cdn/img/champion/loading/'+champ.key+'_0.jpg';
                 champions.push(champ)
             }
          }
          updated_at=new Date();
         return res.json(champions)
    } catch (error) {
        console.log(error);
        return res.status(error.response.status).send(error.response.statusText)
    }
   
});

app.listen(process.env.PORT, () => console.log('Example app listening on port '+process.env.PORT))