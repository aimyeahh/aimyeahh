const express = require('express')
const app = express()
const bodyParser = require('body-parser')
let cors = require('cors')
const MD5 = require('md5');
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

app.post('/api/insert/todolist', (req, res) => {
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

app.post('/api/remove/todolist', (req, res) => {
    // let user = req.body.user
    let planid = req.body.planid
    console.log('planid', planid)
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
app.post('/api/edit/todolist', (req, res) => {
    // let user = req.body.user
    let planid = req.body.planid
    let text = req.body.text
    console.log('edit', planid)
    console.log('text', text)
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

app.post('/api/signup', (req, res) => {
    const responseErr = (msg1) => {
        res.status(400).json({
            msg: msg1 ? msg1 : 'something wrong',
            code: -1
        })
    }
    const responseSuccess = (msg1) => {
        res.status(200).json({
            msg: msg1 ? msg1 : 'success',
            code: 0
        })
    }
    let username = req.body.username
    let password = req.body.password
    try {
        if (username && password && (password.length >= 8)) {
            username = MD5(username)
            password = MD5(password)
            con.query('select * from member where username =  ? ', [username], function (error, results, fields) {
                if (error) {
                    responseErr()
                } else if (!results[0]) {
                    console.log(results)
                    con.query(`INSERT INTO member(username,password) VALUES ( ?, ? );`,[username,password], function (err, result) {
                        if (err) {
                            console.log(err)
                            res.status(200).json({
                                msg: 'Bad'
                            })
                        } else {
                            console.log(result)
                            responseSuccess()
                        }
                    });
                   
                } else {
                    responseErr('username already exists')
                }
            })
        } else {
            res.status(200).json({
                msg: '',
            })
        }
    } catch (error) {
        console.log(error)
        responseErr()
    }
})
app.post('/api/login',(req,res) => {
    console.log('login API')
    let username = req.body.username
    let password = req.body.password
    console.log(1)
    const responseErr = (msg1) => {
        res.status(400).json({
            msg: msg1 ? msg1 : 'something wrong',
            code: -1
        })
    }
    const responseSuccess = (msg1) => {
        res.status(200).json({
            msg: msg1 ? msg1 : 'success',
            code: 0
        })
    }
    try{
        console.log(2)
        username = MD5(username)
        password = MD5(password)
        if (username && password && (password.length >= 8)) {
            console.log(3)
            con.query('select * from member where username =  ? ', [username,password], function (error, results, fields) {
                if (error) {
                    console.log(6)
                    responseErr()
                } else if (results[0]) {
                    console.log(results)
                    responseSuccess('login')
                }else{
                    console.log(results)
                    responseErr()
                }
            })
        }else{
            console.log(4)
            responseErr('username and password something wrong')
        }
    }catch(err){
        responseErr()
    }
})
