const express = require('express');
const app = express();
app.use(express.json());

let expense = [];
let idx = 1;
const PORT = 3000;
function filterExpense(expense, filters){
    let result = [...expense];
    const {category,subcategory, startDate, EndDate} = filters;
    if(category) result = result.filter(e => e.category===category);
    if(subcategory) result = result.filter(e=>e.subcategory===subcategory);
    if(startDate&&EndDate){
        const strt = new Date(startDate);
        const nd = new Date(EndDate);
        result=result.filter(e=> {
            const d = new Date(e.date);
            return d>=strt && d<=nd;
        });
    }
}


app.post("/expense" ,(req,res)=>{
    const { date, category, subcategory, amount, description } = req.body;
    console.log("Data arrived");
    const exp = { id:idx++ , date, category, subcategory, amount, description};
    expense.push(exp);
    console.log("Data Pushed")
    res.status(201).json(expense);
})

app.get("/get-expense", (req,res) =>{
    const result = [...expense];
    const totalAmount = result.reduce((sum,e) => sum+e.amount);
    res.json({
        Amount:totalAmount
    })
})

app.get("/get-expense/category/:category",(req,res)=>{
    const {cate} = req.params;
   
    const filtered = filterExpense(expense,cate);
    res.json({
        expense:filtered
    })
})
app.get("/get-expense/subcategory/:subCategory", (req,res)=>{
    const {subCate} = req.params;
    const filtered = filterExpense(expense,subCate);
    res.json({
        expense:filtered
    })
})
app.get("get-expense/daterange",(req,res)=>{
    const {startDate, EndDate} = req.query;
    const filtered = filterExpense(expense,{startDate,EndDate});
    res.json({
        expense:filtered
    })
})

app.listen(PORT,()=>
    console.log(`Server is running ${PORT}`)
);