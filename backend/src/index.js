import express from 'express'
import cors from 'cors'
import connectdb from './db/connectdb.js';
import userRouter from './routes/user.routes.js';
import taskRouter from './routes/task.routes.js';


const app = express();
const port = process.env.PORT || 4000;

connectdb();

app.use(express.json())
app.use(cors());

app.use('/api/user',userRouter)
app.use('/api/task',taskRouter)


app.listen(port,()=>{
    console.log('Server Started at port ',port);
})