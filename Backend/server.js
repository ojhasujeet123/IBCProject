const express=require('express')
const app = express();
const cors=require('cors')
const connectDatabase=require('./models/index')
const transactionRoute=require('./routes/transaction.routes')
const authenticationRoute=require('./routes/auth.routes');
const { errorHandler } = require('./middleware/validateRoute');
const session=require('express-session')
const port = 5000;


connectDatabase()

app.use(express.json())
app.use(cors())
app.use(errorHandler)
app.use(session({
  secret:"ojhasujeet",
  resave:false,
  saveUninitialized:true,
  cookie:{secure:false},
}))

//Routes
app.use('/api',transactionRoute,authenticationRoute)


app.get('/', (req, res) => {
  res.send('Welcome to IBC!');
});



app.listen(port, () => {
  console.log(`app listening at http://192.168.1.75:${port}`);
});