import express from "express";
import bodyParser from "body-parser";
import {dirname} from "path";
import path from "path";
import multer from "multer";
import {Vibrant} from "node-vibrant/node";






const app = express();
const port = process.env.PORT || 3000;

//Set up  EJS view engine
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

//Configure multer to store files in server memory (Buffer format)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/") //Save files here
    }, 
    filename: (req, file, cb) => {
        //Create a unique filename using timestamp
        cb(null, Date.now() + path.extname(file.originalname));
    }
})
const upload = multer({storage: storage });

app.post("/publish", upload.single("thumbnail"), (req, res) => {
    const title = req.body.title;
    const author = req.body.author;  
    const thumbnail = `uploads/${req.file.filename}`;
    const userContent = req.body.content;

    if(!thumbnail){
        return res.status(400).send("Please upload an image");
    }

    res.render("index.ejs" , {
        blogTitle : title,
        Author : author ,
        Thumbnail : thumbnail,
        Content : userContent,
    })
  
})

app.post("/blogPost.ejs", async(req, res) => {

    const imagePath = path.join(process.cwd(),"public",req.body.thumbnail);

    const palette = await Vibrant.from(imagePath).getPalette();
    
    const dominant = palette.Vibrant.hex;

    res.render("blogPost.ejs", {
           blogTitle : req.body.title,
        blogAuthor : req.body.author ,
        thumbImage : req.body.thumbnail,
        userContent : req.body.content,
        footerBgColor : dominant,
    
    });
  console.log(req.body.thumbnail);
})

app.get("/", (req, res) => {
    res.render("index.ejs");
})

app.get("/create.ejs", (req, res) => {
    res.render("create.ejs");
})

app.listen(port, () => {
    console.log(`The server is up and running on port ${port}`);
})