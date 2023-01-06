const express = require('express')
const app = express()
const bodyParser = require('body-parser')
let cors = require('cors')

const mysql = require('mysql');
let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "plana"
});
con.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected!");
});

app.use(cors())
app.use(bodyParser.json())
let urlencodedParser = bodyParser.urlencoded({ extended: false })

app.listen(3000, () => {
    console.log('this server run on port 3000')
})

app.get('/', (req, res) => {
    res.status(200).json({
        msg: 'Good'
    })
})

app.get('/api/todolist', (req, res) => {
    con.query(`select * from todolist where user != 'remove'`, function (err, result) {
        if (err) throw err;
        // console.log("Result: " + JSON.stringify(result));
        let data = JSON.stringify(result)
        data = JSON.parse(data)
        res.status(200).json({
            msg: 'Good',
            data: data
        })
    });

})

app.post('/api/insert/todolist', (req,res) => {
    let user = req.body.user
    let text = req.body.text
    // console.log('user',text)
    // console.log('insert')
    con.query(`
    INSERT INTO todolist(user,text) 
    VALUES ('${user}', '${text}');`, function (err, result) {
        if (err) {
            console.log(err)
            res.status(200).json({
                msg: 'Bad'
            })
        } else {
            res.status(200).json({
                msg: 'Good',
                msg2: 'insert Success'
            })
        }
    });
})

app.post('/api/remove/todolist', (req,res) => {
    // let user = req.body.user
    let planid = req.body.planid
    console.log('planid',planid)
    con.query(`
    UPDATE todolist
    SET user = 'remove'
    WHERE id = '${planid}'
   `, function (err, result) {
        if (err) {
            console.log(err)
            res.status(200).json({
                msg: 'Bad'
            })
        } else {
            res.status(200).json({
                msg: 'Good',
                msg2: 'update Success'
            })
        }
    });
})
app.post('/api/edit/todolist', (req,res) => {
    // let user = req.body.user
    let planid = req.body.planid
    let text = req.body.text
    console.log('edit',planid)
    console.log('text',text)
    con.query(`
    UPDATE todolist
    SET text = '${text}'
    WHERE id = '${planid}'
   `, function (err, result) {
        if (err) {
            console.log(err)
            res.status(200).json({
                msg: 'Bad'
            })
        } else {
            res.status(200).json({
                msg: 'Good',
                msg2: 'update Success'
            })
        }
    });
})
app.post('/api/signup',(req,res) =>{
    let username = req.body.username
    let password = req.body.password
try {
    if (username && password && (password.length >= 8)){
        con.query('select * from member')
    }else{
        res.status(200).json({
            msg : 'username or password wrong !',
        })
    }
} catch (error) {
    console.log(error)
    res.status(400).json({
        msg : 'something wrong'
    })
}
})
