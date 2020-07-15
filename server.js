console.log("working test");
const express=require('express')
const app=express()
const axios=require('axios');


let authToken="Bearer BQA3ZiAbdlxpHEU7eW57l4F3j4T9XRM3IeCaQ6NwgWJfH3bZiCjbffb-auUvobyysAtyxOE21TFtrR_oIzN-jTgyf6ytD1zlHSSGfkiA75KXsJ8pT8FN2BBmlB9HDBwBPG2VADAx73zqaDTAh9XGBBKgEGBRhEc"

app.get("/getuserprofile",async(req,res)=>{
    try {
    
    const {userId}=req.query;
 const data= await axios.get(`https://api.spotify.com/v1/users/${userId}`,{headers:{"Authorization":authToken}})
 console.log("data===",data.data );
 res.send({userData:data.data});
     
} catch (error) {
    console.log("error",error.response);
    
        res.json(error.response?error.response.data: {status:405, message:"error occurred"})
}
 

})


app.listen(3000, () => {
    console.log('App listening on port 3000!');
});