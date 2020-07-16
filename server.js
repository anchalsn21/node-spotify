console.log("working test");
const express=require('express')
const app=express()
const axios=require('axios');
const path=require('path')
const mongoose=require('mongoose')
const cors=require('cors')
const SpotifyUsers= require('./models/userData')
var cookieParser = require('cookie-parser')
 
app.use(cookieParser())


app.use(cors())

app.use(express.static(path.join(__dirname,"public")))

var authToken="Bearer BQDYoBgjfFRsqMgWzf53zmfuBeyPWPbm1jL1Qh0CGnNRMxxCLuci8iaUXHzIkqU2nx02mSc7-69wRTqCAvVSFDQY5bbpARy05ptIQ48XJTNgoq7pQLBu7gSz0LkzRz3tUtT5LflXytVDmOT5YNLlPWmEKIzIBVQ"



let url =process.env.DB_URL || "mongodb+srv://test:test123@cluster0-d4nax.mongodb.net/testing?retryWrites=true&w=majority"
mongoose.connect( url,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, res) => {
    if (err) throw new Error("Db connection failed");

    console.log("db connected successfully");
  }
);



var my_client_id="368ece4bd8344e88a0ed7dcb52e63097"
var redirect_uri="http://localhost:3000/callback"
var client_secret="91270d0d0dae4c3b983fa3ca4b9befc0"

app.get('/', (req, res) => {
  res.redirect("/login")
});

app.get('/login', function(req, res) {
  var scopes = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + my_client_id +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') 
    +
    '&redirect_uri=' + encodeURIComponent(redirect_uri)
    );
  });


  app.get('/callback', async (req,res) => {
    console.log("hereeeeeeeeeee");
    
    const { code } = req.query;
    console.log(code)
    try {
      let params={
        grant_type:"authorization_code",
        redirect_uri:redirect_uri,
        code:code
      }
      console.log(params);
      
      var data = await axios({
        method: 'post',
        url:'https://accounts.spotify.com/api/token',
        params: {
            client_id: my_client_id,
            client_secret: client_secret,
            code,
            grant_type :'authorization_code',
            redirect_uri: redirect_uri
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
    console.log("data====",data.data);
      
      const { access_token, refresh_token } = data.data;
      // spotifyApi.setAccessToken(access_token);
      // spotifyApi.setRefreshToken(refresh_token);
  
       res.redirect(`/home.html?token=${access_token}`);
   return   res.send(data.data);
    } catch(err) {
      console.log(err);
      return res.send('Something went  wrong');

    //  return res.send('/#/error/invalid token');
    }
  });


app.get("/getuserprofile",async(req,res)=>{
    try {
    
    let {userId,token}=req.query;
   token &&( token=`Bearer ${token}`);
 const data= await axios.get(`https://api.spotify.com/v1/users/${userId}`,{headers:{"Authorization":token?token:authToken}})
 console.log("data===",data.data );

 let obj={
     userName:userId,
     userData:data.data
 }

 const result=await SpotifyUsers.findOneAndUpdate({userName:userId},obj,{upsert:true})
 console.log(result);
 
 res.send({userData:data.data});
     
} catch (error) {
    console.log("error",error);
    
        res.json(error.response?error.response.data: {status:405, message:"error occurred"})
}
 

})


app.get('/allsavedusers', async (req, res) => {
  
  try {
    
    const data=await SpotifyUsers.find({})
    res.json({status:200 , message:"Saved Users Data" , data:data})
  } catch (error) {
    res.json({status:408 , message:"Error Occurred" , error:error})
 
  }
});




app.use('/', async(req, res)=>
{
   
	res.json({status:404, message:"Api path incorrect, Not found"})
}); 



app.listen(3000, () => {
    console.log('App listening on port 3000!');
});



/***
 * 
 * 
 * 

var my_client_id="368ece4bd8344e88a0ed7dcb52e63097"
var redirect_uri="my-node-app"
var client_id = '368ece4bd8344e88a0ed7dcb52e63097'; // Your client id
var client_secret = '91270d0d0dae4c3b983fa3ca4b9befc0'; // Your secret
var redirect_uri = 'REDIRECT_URI'; 
var scopes = "\'user-read-private user-read-email\'"

app.get('/login', async function(req, res) {
  var scopes = 'user-read-private user-read-email';
const data=await  axios.get('https://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + my_client_id +
    (scopes ? '&scope=' + encodeURIComponent(scopes) : '') 
    +
    '&redirect_uri=' + encodeURIComponent(redirect_uri)
    );
    console.log("data===",data);
    // res.send(data);
    
  });


 */