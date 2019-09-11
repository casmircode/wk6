const express = require('express');
const mongodb = require('mongodb');
let bodyparser = require('body-parser')
//get client from the ref
let mongoClient = mongodb.MongoClient;
let ObjectId = mongodb.ObjectID;
let app = express();

//get access to db from the client
const url = "mongodb://localhost:27017";
let viewsPath = __dirname+"/views/"
let db = null;
let col = null;
app.engine('html', require("ejs").renderFile);
app.set('view engine', 'html');
app.use(express.static('images'));
app.use(express.static('css'));

mongoClient.connect(url,{useNewUrlParser: true, useUnifiedTopology:true},function(err,client){
db = client.db('wk6');
col = db.collection('taskManagement');
});

app.use(bodyparser.urlencoded({
    extended:false
})
);

app.get('/', (req,res) => {
    res.sendFile(viewsPath + "index.html");
})


app.get('/newtask.html', (req,res)=> {
    res.sendFile(viewsPath + "newtask.html");
})
app.post('/newtask.html', (req,res)=> {
    let query = req.body;
    col.insertOne(query);
    // res.sendFile(viewsPath + "newtask.html");
    res.redirect('/gettask.html');
})


app.get('/deletetask.html', (req,res)=>{
    res.sendFile(viewsPath + "deletetask.html");
})
app.post('/deletetask.html', (req,res)=>{
    let userDetails = req.body; 
    let id = ObjectId(userDetails.id);
    let filter = {_id: id};    
    col.deleteOne(filter);
    res.redirect('/gettask.html')
})

app.get('/deleteall.html', (req,res)=> {
    res.sendFile(viewsPath + "deleteall.html");
})
app.post('/deleteall.html', (req,res)=> {
    let query = {taskStatus: "Complete"};    
    col.deleteMany(query, (err,result)=>{});
    res.redirect('/gettask.html');
})


app.get('/gettask.html', (req,res)=>{
    col.find().toArray((err,data)=>{
        res.render('gettask.html', {
            taskDb: data
            });
    });
})

app.get('/updatetask.html', (req,res) =>{
    res.sendFile(viewsPath + "updatetask.html");
})

app.post('/updatetask.html', (req,res)=>{
    let id = ObjectId(req.body.id);
    let newStatus = req.body.newStatus;
    col.updateOne( {_id: id}, {$set: {taskStatus: newStatus}}, {upsert: true},(err,result)=>{})
    res.redirect('/gettask.html');
});

app.listen(8080, () =>{
    console.log("Server running....");
});






