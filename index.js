const express = require('express');
const app = express();
app.use(express.json());
const router = express.Router();
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const authRoutes = require("./Routes/AuthRoutes");
const collectionRoutes = require('./Routes/CollectionRoutes')
const itemRoutes = require('./Routes/ItemRoutes')



// connection();

const port = process.env.PORT || 4000;
app.listen(port,()=>(console.log(`Listen on port ${port}...`)))

mongoose.connect("mongodb://localhost/user",{
    useNewUrlParser:true,
    useUnifiedTopology: true
})
    .then(console.log('DB connected'))
    .catch((err) => console.log(err,'not connected'));

app.use(cors({
    origin: "http://localhost:3000",
    methods: ['GET','POST','PUT','DELETE'],
    credentials: true
}))


    
app.use(cookieParser())
app.use(express.json())
app.use('/api/users',authRoutes)
app.use('/api/collections', collectionRoutes)
app.use('/api/items', itemRoutes)