const express = require('express')
const app = express()
const bodyParser = require('body-parser')
let cors = require('cors')
const MD5 = require('md5');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const secretKey = 'mypasswordissohard'
const fs = require('fs');
const multer = require('multer');
// configure storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

// initialize upload object
const upload = multer({
    storage: storage
});

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
app.use(express.static('reading'))
app.use(express.static('uploads'))

app.listen(3000, () => {
    console.log('this server run on port 3000')
})

app.get('/', (req, res) => {
    res.status(200).json({
        msg: 'Good'
    })
})

app.post('/api/todolist', (req, res) => {
    let token = req.body.token
    console.log(token)
    let user = decodeToken(token).username
    con.query(`select * from todolist where username = ?`, [user], function (err, result) {
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
function decodeToken(token) {
    try {
        let decoded = jwt.verify(token, secretKey);
        console.log(decoded)
        return decoded
    } catch (err) {
        console.log('token :', err)
    }
}
app.post('/api/insert/todolist', (req, res) => {
    let text = req.body.text
    let token = req.body.token
    try {
        // let decoded = jwt.verify(token, secretKey);
        // console.log(typeof decoded , decoded.data[0].username)
        let user = decodeToken(token).username
        con.query(`
        INSERT INTO todolist(username,text) 
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
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'bad',
            msg2: 'failed'
        })
    }

})

app.post('/api/remove/todolist', (req, res) => {
    // let user = req.body.user
    let planid = req.body.planid
    console.log('planid', planid)
    con.query(`
    UPDATE todolist
    SET username = 'remove'
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
            username = username
            password = MD5(password)
            con.query('select * from member where username =  ? ', [username], function (error, results, fields) {
                if (error) {
                    responseErr()
                } else if (!results[0]) {
                    console.log(results)
                    console.log('user : ', username)
                    con.query(`INSERT INTO member(username,password) VALUES ( ?, ? );`, [username, password], function (err, result) {
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
                msg: 'check your username and password',
            })
        }
    } catch (error) {
        console.log(error)
        responseErr()
    }
})
app.post('/api/login', (req, res) => {
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
    const responseSuccess = (msg1, data = '') => {
        res.status(200).json({
            msg: msg1 ? msg1 : 'success',
            token: data,
            code: 0
        })
    }
    try {
        console.log(2)
        username = username
        password = MD5(password)
        if (username && password && (password.length >= 8)) {
            console.log(3)
            con.query('select * from member where username =  ? && password = ?', [username, password], function (error, results, fields) {
                if (error) {
                    console.log(6)
                    responseErr()
                } else if (results[0]) {
                    con.query(`SELECT member.id, member.username ,todolist.text, data.subject, data.ref1,data.ref2,data.ref3 FROM member
                    INNER JOIN todolist 
                    ON member.username = todolist.username
                    INNER JOIN data
                    ON data.mid = member.id
                    WHERE todolist.username = ?`, [username], (error, data) => {
                        if (error) responseErr()
                        else {
                            let mid = results[0].id
                            // console.log(mid)
                            const token = jwt.sign({ data, username, mid }, secretKey);
                            // const  decoded = jwt.verify(token, secretKey);
                            console.log('token', token)
                            responseSuccess('login', token)
                        }
                    })
                } else {
                    console.log(results)
                    responseErr()
                }
            })
        } else {
            console.log(4)
            responseErr('username and password something wrong')
        }
    } catch (err) {
        responseErr()
    }
})

app.post('/api/profile', (req, res) => {
    const token = req.body.token;
    if (!token) {
        return res.status(401).json({ msg: 'Unauthorized', code: -1 });
    } else {
        try {
            let decoded = jwt.verify(token, secretKey);
            // console.log(decoded)
            return res.status(200).json({ msg: 'success', code: 0, decoded });
        } catch (err) {
            // console.log('/api/profile/Err : ', err)
            return res.status(401).json({ msg: 'Unauthorized', code: -2 });
        }
    }
})
app.post('/api/subject/insert', (req, res) => {
    try {
        let token = req.body.token
        let subject = req.body.subject
        let data = req.body.data
        // console.log('subject : ',subject)
        // console.log('token in subject insert', subject)
        // let user = decodeToken(token).username
        let mid = decodeToken(token).mid

        if (token && subject && data) {
            con.query(`insert into data (mid,subject,ref1,ref2,ref3) values (?,?,?,?,?)`,
                [mid, subject, data.subject, data.num_all + '', data.num_correct + '']
                , function (error, results, fields) {
                    if (error) {
                        console.log(error)
                        res.status(400).json({ msg: 'query data base err' })
                    }
                    else {
                        res.status(200).json({ msg: 'success', code: 0 })
                    }
                })
        } else {
            res.status(400).json({
                msg: 'something wrong',
                code: -2
            })
        }
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: err,
            err: err,
            code: -1
        })
    }
})

app.post('/api/subject/:subject', (req, res) => {
    try {
        let token = req.body.token
        // console.log('token subject', token)
        let mid = decodeToken(token).mid
        let subject = req.params.subject
        // console.log(decodeToken(token))
        con.query(`select * from data where subject = ? && mid = ? `, [subject, mid], (err, result) => {
            if (err) {
                console.log(err)
                res.status(400).json({ msg: 'query data base err' })
            }
            else {
                res.status(200).json({ msg: 'success', data: result, code: 0 })
            }
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({
            msg: 'something err',
            code: -1
        })
    }
})
app.post('/api/upload', upload.array('file'), (req, res) => {
    try {
        let file = req.files;
        let head = req.body.head
        let hash_tags = req.body.hashtages
        let user = req.body.user
        console.log(file[0], head, hash_tags, user)
        if (!file[0] || !head || !hash_tags || !user) {
            res.status(400).json({
                msg: 'bad',
                data: JSON.stringify(file)
            })
        } else {
            let paths = []
            for (const data of file) {
                paths.push(data.filename)
            }
            console.log(paths)
            con.query(`SELECT id FROM member where username = ? ;`, [user], (err, result) => {
                if (err) {
                    console.log(err)
                    res.status(400).json({ msg: 'query data base err' })
                }
                else {
                    console.log(result[0].id)
                    let id = result[0].id
                    con.query(`INSERT INTO uploads_data (mid, path, hashtag, title, writer) VALUES (?, ? ,? , ?, ?)`, [id, paths.toString(), hash_tags.toString(), head, user], (err, results) => {
                        console.log(err)
                        if (err) res.status(400).json({ msg: 'query data base err' })
                        else {
                            if (results.insertId) {
                                res.status(200).json({ msg: 'success', data: [], code: 0 })

                            }
                        }

                    })

                }
            })
        }
        console.log('uploads success')
    } catch (err) {
        console.log('uploads fale')
        console.log(err)
        res.status(400).json({
            msg: 'bad',
        })
    }
});
app.get('/api/show/post', (req, res) => {
    try {
        con.query(`select id,hashtag ,path,title,writer from uploads_data where status != 'remove'`, (err, results) => {
            if (err) res.status(400).json({ msg: 'query data base err' })
            else {
                res.status(200).json({ msg: 'success', data: results, code: 0 })
            }
        })
    } catch (err) {
        res.status(400).json({ msg: 'something err' })
    }
})
app.post('/api/show/fev', (req, res) => {
    try {
        let token = req.body.token
        let decoded = jwt.verify(token, secretKey);
        let mid = decoded.mid
        con.query(`SELECT ud_id,status FROM fev WHERE mid = ?`, [mid], (err, results) => {
            if (err) res.status(400).json({ msg: 'query data base err' })
            else {
                res.status(200).json({ msg: 'success', data: results, code: 0 })
            }
        })
    } catch (err) {
        console.log(err)
        res.status(400).json({ msg: 'something err' })
    }
})
app.post('/api/fev/:status', (req, res) => {
    try {
        let status = req.params.status
        let id_change = req.body.id
        let token = req.body.token
        if (token && status && id_change) {
            let decoded = jwt.verify(token, secretKey);
            let mid = decoded.mid
            con.query(`select * from fev where mid = ? and ud_id = ?`, [mid, id_change], (err, results) => {
                if (err) res.status(400).json({ msg: 'query data base err' })
                if (results[0]) {
                    con.query(`update fev set status = ? where mid = ? and ud_id = ?  `, [status, mid, id_change], (err, results) => {
                        if (err) res.status(400).json({ msg: 'query data base err' })
                        if (results) {
                            res.status(200).json({ msg: 'success', code: 0 })
                        }
                    })
                } else {
                    con.query(`insert into fev (mid,ud_id,status) values(?,?,?)`, [mid, id_change, status], (err, results) => {
                        if (err) res.status(400).json({ msg: 'query data base err' })
                        if (results[0]) {
                            console.log(results)
                            res.status(200).json({ msg: 'success', code: 0 })
                        }
                    })
                }

            })
        } else {
            res.status(400).json({ msg: 'กรอกข้อมูลมาให้ครบ' })
        }
    } catch (err) {
        res.status(400).json({ msg: 'something err' })
    }
})
app.post('/api/del/post', (req, res) => {
    try {
        let token = req.body.token
        let id_remove = req.body.id
        decodeToken(token)
        con.query(`UPDATE uploads_data SET status = 'remove' where id=? `, [id_remove], (err, results) => {
            if (err) res.status(400).json({ msg: 'query data base err' })
            if (results) {
                console.log(results)
                res.status(200).json({ msg: 'success', code: 0 })
            }
        })
    } catch (err) {
        res.status(400).json({ msg: 'something err' })
    }
})

