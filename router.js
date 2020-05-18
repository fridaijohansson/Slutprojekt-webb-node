const objectId = require('mongodb').ObjectId;
const express = require('express');
const multer = require('multer');
const path = require('path');
const ejs = require('ejs');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secret = require("./secret");
const fs = require('fs');
const login = require('./login');
const mail = require('./mail');
const renderPosts = require('./render-posts');

const app = express();
app.use(express.urlencoded({extended:false}));

module.exports = function(app){

console.log("Hello Routes");

//Leder bilden till sin destination och ger den ett namn
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req,file,cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }  
});

//Laddar upp filen genom en validation om hur stor filen är samt typ
const upload = multer({
    storage:storage,
    limits:{fileSize:900000},
    fileFilter: function(req,file,cb){
        //callback funkion för att undersöka vilken typ av fil det är
        checkFileType(file,cb);
    }
}).single('img'); //skickar endast en fil

//callback funktionen som kallades på rad 31
function checkFileType(file,cb){
    //Tillåtna filtyper
    const filetypes = /jpeg|jpg|png/;
    //undersöker vägnamnet (ex ".jpg")
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    //undersöker vilken tp av fil som har laddats upp med hjälp av rad 38
    const mimetype = filetypes.test(file.mimetype);
    //om båda stämmer tillåts filen at laddas upp och läggs till i mappen "uploads"
    if(mimetype && extname){
        return cb(null,true);
    }else{
        cb('Error: images only!');
    }
}




//Anger första sidan vilket innehåller en länk till inloggning eller registrering
app.get('/' ,function(req,res){
    res.sendFile(process.cwd()+'/register.html');
});

//registrering formuläret skickar värden till denna async router
app.post('/register', async function(req,res){
    try {
        //multer funktion då bilderna laddas upp
        await upload(req,res, (err) =>{
            if(err){
                console.log(err);
                //visa form med felmeddelande
            } 
            else if(undefiened)
            {
                //lägg till automatisk standard bild
            }
            else{
                console.log(req.file.filename);
                //ladda om sidan med bild
            }
        });
        //letar upp användare i databasen som redan har emailen
        const userexist =  await app.users.findOne({email: req.body.email});
        if(userexist){
            res.send("User exists...");
        }
        else{
            //tar in värderna som hämtas upp av POST-routern och 
            //lägger det i en variable
            const user = {...req.body};
            //raderar ena lösenordet då det inte behövs längre
            delete user.confirmPass;
            //hashar och saltar lösenord med bcrypt
            user.password = await bcrypt.hash(user.password,12);
            //lägger till extra egenskaper
            user.verified = false;
            user.time = Date.now();
            user.confirmed = false;
            user.profileImg = req.file.filename;
            //lägger till använaren i databasen
            let ins =  await app.users.insertOne(user);
          
            console.log("insertInfor: ",ins);
            //Tar med värden till mail.js för att skicka 
            //verifieringsmejlet med hjälp av nodemailer
            mail(req.body.email, ins.insertedId, user.time);
          
        }
    }
    catch (error) {
         res.status("error").send(error);
    }


    
});

//länken leder till denna routern som innehåller användarID och tidsämpel koden
app.get('/confirmation/:id/:code', async function (req,res){
    try{
        //översätter koden och mha findOne operatorn kan man ge värden som den jämför
        let code = parseInt(req.params.code);
        const user = await app.users.findOne({_id:objectId(req.params.id), time:code});
        //om det stämmer blir user.confirmed sann och användaren skickas till inloggningssidan
        if(user){
            user.confirmed = true;
            res.redirect('/login');
        }
        else{
            res.send("User is not available");
        }
    }
    catch(err){
        res.send(err);
    }
});


//hashnings code
function randomCode(){
    const crypto = require('crypto');
    const code = crypto.randomBytes(6).toString("hex");
    console.log(code);
    return code;
}





app.get("/login", function(req, res){
    res.sendFile(__dirname+"/log-in.html");

});
app.post("/login",async function(req, res){
    try{
        // Hämtar användare från datbasen och undersöker 
        //ifall den angivna emailen finns i databasen.
        const users = await app.users.find().toArray();
        const user = users.filter(function(u){
            return req.body.email === u.email
        });

        // Om vi har en och exakt en användare med rätt email
        if(user.length===1)
        {
            // kollar lösenordet på den speifika andvändaren
            bcrypt.compare(req.body.password,user[0].password,function(err,success){
                //om lösenordet stämmer med mejlen får användaren en jsonwebtoken
                if(success){
                const token = jwt.sign({email:user[0].email},secret,{expiresIn:60});
                res.cookie("token",token,{httpOnly:true,sameSite:"strict"}); 
                res.redirect('/firstPage');
                }
                else{
                    res.send("Wrong Password");
                }
            })
        }
        else
        {
            res.send("no such user");
        }
    }catch(error){
        res.send(error.message);
    }
    
});

app.get("/logout", function(req,res){
    res.cookie("token","loggar ut");
    res.redirect(__dirname + "/regitser.html");
});


//första sidan renderar alla inlägg som finns i databasen i render-posts.js
app.get('/firstPage',async function(req,res){
    res.sendFile(__dirname + '/first-page.html');
    try {
        const dbPosts = await app.posts.find().toArray();

        let html = dbPosts.reverse().map(function(post){
            return `
                <div class="post-container">
                    <div class="post-header">
                        <p>${post.user} ${post.posted}</p>
                        <button id="liked" class="post-btn">Liked</button>
                        <button id="saved" on:click={function(){ savePost(post)}} class="post-btn">Save</button>
                    </div>

                    <div class="post-content">
                        <h2 class="italic">${post.title} <span>by</span> ${post.author}</h2>
                        <p>${post.description}</p>
                        <p><a href="${post.link}" target="_blank" >Listen to ${post.title}</a></p>
                    </div>
                </div>
                
                <hr>
            `;
        });
        res.send(renderPosts(html.join('')));
        

    } catch (error) {
        res.send(error.message);
    }
});

//router som tar hand inlägg som blir tillagda
app.post('/add',function(req,res){
    try {
        let post = {...req.body};
        //egenskaperna som ett inlägg har
        post.liked = false;
        post.posted = Date.now();
        post.id = Date.now();
        // *användarnamnet av den som postade inlägget
        post.user = "lasse123"; 
        //lägger till inlägget i databasen för inlägg
        app.posts.insertOne(post);
        console.log(posts);
        res.redirect('/firstPage');

    } catch (error) {
        res.send('no post was added');
    }
});






}


