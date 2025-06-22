import  express, {Application , Request , Response} from "express";
const app:Application = express()
const PORT:number = 3000

require('./model/index.ts')
app.get("/",(req:Request,res:Response)=>{
  res.send("hello world")
})

app.get("/about", (req: Request, res: Response) => {
  res.send("hi world");
});

app.listen(PORT , ()=>{
    console.log("Server has started at port " ,PORT)
})