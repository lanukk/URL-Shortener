require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');



app.use(express.urlencoded({extended: false}));


// Basic Configuration
const port = process.env.PORT || 3000;
const db = require(__dirname + '/config/keys');
const URL = require(__dirname + '/model/urlModel');

//Connecting DB
mongoose.connect(db.MongoURI, (err)=>{
  if(err)console.log(err);
  console.log("CONNECTED TO DB...");
});



//Landing Page
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', (req, res)=> {
  res.sendFile(__dirname + '/views/index.html');
});



//REGEX expression to validate a URL
const expression = /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/;

const regex = new RegExp(expression);




//API short URL
app.post('/api/shorturl/', (req, res)=>{

  const original_url = req.body.url;

  if(original_url.match(regex)){
    
      const filter = {
        original_url
      };

      URL.findOne(filter)
          .then(async (data) => {
                if(data){
                    return res.send({
                      original_url: data.original_url,
                      short_url: data.short_url
                    });
                }

                let all = await URL.find({});
                const short_url = all.length + 1;

                const newURL = new URL({
                  original_url,
                  short_url 
                });
                
                newURL.save();

                return res.json({
                  original_url,
                  short_url
                });

          })
          .catch((err)=>{
            console.log(err);
            return res.send("Something went wrong");
          });

  }
  else{
     return res.json({error: 'Invalid URL'});
  }

});



app.get('/api/shorturl/:short_url', (req,res)=>{

  const short_url = Number(req.params.short_url);
  const filter = {
    short_url
  };
  URL.findOne(filter)
      .then((data) =>{

          if(data)
              return res.redirect(data.original_url);
          
          return res.send("Short URL does not exist");
      })
      .catch((err) =>{
        console.log(err);
        res.send("Something Went Wrong");
      })
  
});

app.listen(port, () => {
  console.log(`Server Up and Running on port ${port}`);
});