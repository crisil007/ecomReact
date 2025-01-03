const express=require('express');
const app = express();
const dotenv=require('dotenv');
dotenv.config();
const mongoConnect=require('./db/connect')
const userRoutes = require('./routes/userRoutes');
const authRoutes =require('./routes/authRoutes');
const productRoutes=require('./routes/productRoutes')
const cartRoutes=require('./routes/cartRoutes')
const wishRoutes=require('./routes/wishRoutes')
const orderRoutes=require('./routes/orderRoutes')
const fileUpload=require('./utils/fileUpload')
const cors=require('cors')
const path = require("path");


app.use(cors({origin: "http://localhost:5173" }))
app.get('/test', (req, res) => {
    res.status(200).send("Test successful");
});

app.use(express.static( "../client"));
// app.use("/upload",express.static("./upload"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))



mongoConnect();

app.use(express.json({ limit: "100mb" }));


app.use(express.urlencoded({extended : true}));

app.use(userRoutes);
app.use(authRoutes);
app.use('/',productRoutes);
app.use(cartRoutes)
app.use(wishRoutes)
app.use(orderRoutes)


app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
});
