const express = require('express');
const path = require('path');
const app = express();
const port = 8080;

app.listen(port);

app.use('/static', express.static(path.join(__dirname, 'code')));

let pexnidi = [];

// parse url-encoded content from body
app.use(express.urlencoded({ extended: false }))

// parse application/json content from body
app.use(express.json())

// pass main.html as the first page
app.get('/', function(req, res){

    let options = {
        root: path.join(__dirname, 'code')
    }

    res.sendFile('main.html', options, function(err){
    })
});

app.use('/images', express.static('images'));
app.use(express.static(__dirname + '/code'));

app.get('/points', function(req, res){

    let options = {
        root: path.join(__dirname, 'code')
    }

    res.sendFile('points.html', options, function(err){
    })
});

app.get('/final', function(req, res){

    let options = {
        root: path.join(__dirname, 'code')
    }

    res.sendFile('final.html', options, function(err){
    })
});

app.get('/api/library/pexnidi', (req, res) => {
   
    if(req.query.userId){
        return res.status(200).json(pexnidi.filter(x => x.userId === req.query.userId));
    }
    return res.status(200).json(pexnidi);
    
});

app.post('/api/library/pexnidi', (req, res) => {

    let exists = pexnidi.filter(x => x.userId === req.body.userId && x.katigoria === req.body.katigoria);

    if(exists.length === 0 ){
        pexnidi.push(req.body);
    }
    return res.status(200).json('success');
});

app.put('/api/library/pexnidi', (req, res) => {
    let exists = pexnidi.filter(x => x.userId === req.body.userId && x.katigoria === req.body.katigoria);
    if(exists.length === 0 ){
        console.log('den iparxei');
    }else {
        console.log('iparxei');
        for(let i=0;i<pexnidi.length;i++){
            if(pexnidi[i].userId === req.body.userId && pexnidi[i].katigoria === req.body.katigoria){
                pexnidi[i].katigoria = req.body.katigoria;
                pexnidi[i].erwtisis = req.body.erwtisis;
                pexnidi[i].q1 = req.body.q1;
                pexnidi[i].q2 = req.body.q2;
                pexnidi[i].q3 = req.body.q3;
            }
        }
    }
    return res.status(200).json('success');
});

app.delete('/api/library/pexnidi', (req, res) => {
    for(let i=0;i<pexnidi.length;i++){
        if(pexnidi[i].userId === req.body.userId){
            pexnidi.splice(i, 1);
        }
    }
    return res.status(200).json('success');

});