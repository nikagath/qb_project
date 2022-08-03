var categories = [];
var questions = [];
var game = [];
let resultsBox;
let apiUrl;
let userId;
let location;


document.addEventListener("DOMContentLoaded", async function(event){
    location=window.location.pathname;
    apiUrl = 'http://localhost:8080/api/library';
    userId = localStorage.getItem('userId') || generateUserId();

    if (location === '/') {
        let saved=document.getElementById('save');
        saved.addEventListener("click",() => {
            getCategories();
            postCategories();
        })
    }else if (location === '/points') {
        resultsBox = document.querySelector('#results-box');
        updateRB();
        let saved=document.getElementById('save');
        saved.addEventListener("click",() => {
            getCategories();
            postCategories();
        })
    }else if (location === '/final') {
        resultsBox = document.querySelector('#results-box');
        showGame();
        deleteLastResults();
    }
    let saved=document.getElementById('save');
})

const save = () => {
    getCategories();
    postCategories();
}

// dimiurgia id gia user
const generateUserId = () => {
    let id = uuid();
    localStorage.setItem('userId', id);
    return id;
}

// dimiurgia monadikou kodikou gia kathe user
const uuid = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        let r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

// vriskw pies katigories tha xrisimopiisume
const getCategories = () => {
    let search = document.querySelectorAll('.category');
    if (location ==='/') {
        search.forEach(checkIfExists)
    } else {
        search.forEach(updatePoints)
    }
    
}

//checking for category if exists and then add category on game
const checkIfExists = (category) =>{
    let input=category.lastElementChild.value;
    if (input !=0) {
       categories.push(category.firstElementChild.id);
       questions.push(input);
    }
}

//checking for category if exists and then add category on game
const updatePoints = (category) =>{
    var inputCount = category.getElementsByTagName('input').length;
    let p1="";
    let p2="";
    let p3="";
    if (inputCount == 2) {
        p1=category.getElementsByTagName('input')[0].value;
        p2=category.getElementsByTagName('input')[1].value;
    } else if (inputCount == 3) {
        p1=category.getElementsByTagName('input')[0].value;
        p2=category.getElementsByTagName('input')[1].value;
        p3=category.getElementsByTagName('input')[2].value;
    }
    
    let cq = {
        katigoria : category.firstElementChild.id,
        erwtisis : inputCount,
        q1 : p1,
        q2 : p2,
        q3 : p3
    }
    fetch(apiUrl + '/pexnidi', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(cq)
    }).then(res => {
        fetchUserChoices().then(res => res.json()).then(pexnidi => {
            game = pexnidi;
        });
    })
    .catch(err => {
        console.log(err);
    })
    
}

const deleteLastResults = () => {
    fetch(apiUrl + '/pexnidi',{
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
    })
    .then(res => {
            console.log('Deleted!')
    });

}

const postCategories = () => {
    for (var i=0; i<categories.length; i++){
        let cq = {
            katigoria : categories[i],
            erwtisis : questions[i],
            q1 : "",
            q2 : "",
            q3 : ""
        }
        fetch(apiUrl + '/pexnidi',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(cq)
        }).then(res => {
            fetchUserChoices().then(res => res.json()).then(pexnidi => {
                game = pexnidi;
            });
        }).catch(err => {
            console.log(err);
        })
    }
}

// epistrofi agapimenwn tou xristi
const fetchUserChoices = () => {
    if(userId) return fetch(apiUrl + '/pexnidi?userId='+userId);
}

const updateRB = () => {
    fetch (apiUrl+'/pexnidi',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json' 
        }
    })
    .then (res => res.json())
    .then (res =>{
        for(var i=0; i<res.length; i++){
            if (res[i].erwtisis==2){
                resultsBox.innerHTML += '<div class="category">' +
                '<img src="../images/'+res[i].katigoria+'.jpg"' + ' class="catImages" id="'+res[i].katigoria+'" >' +
                '<input type="text" class="catBars2" value="0">' +
                '<input type="text" class="catBars2" value="0">' +
                '</div>';
           }else if (res[i].erwtisis == 3) {
                resultsBox.innerHTML += '<div class="category">' +
                '<img src="../images/'+res[i].katigoria+'.jpg"' + ' class="catImages" id="'+res[i].katigoria+'" >' +
                '<input type="text" class="catBars3" value="0">' +
                '<input type="text" class="catBars3" value="0">' +
                '<input type="text" class="catBars3" value="0">' +
                '</div>'
           }else {
                alert("Something went wrong!")
           }
        }
        
    })
}

const showGame = () => {
    fetch (apiUrl+'/pexnidi',{
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json' 
        }
    })
    .then (res => res.json())
    .then (res =>{
        for(var i=0; i<res.length; i++){
            if (res[i].erwtisis==2){
                resultsBox.innerHTML += '<div class="category">' +
                '<img src="../images/'+res[i].katigoria+'.jpg"' + ' class="catImages" id="'+res[i].katigoria+'" >' +
                '<button class="lastScreen2" id="'+res[i].katigoria+'1" type="button" onClick="reply_click(this.id)">x'+res[i].q1+'</button>' +
                '<button class="lastScreen2" id="'+res[i].katigoria+'2" type="button" onClick="reply_click(this.id)">x'+res[i].q2+'</button>' +
                '</div>';
           }else if (res[i].erwtisis == 3) {
                resultsBox.innerHTML += '<div class="category">' +
                '<img src="../images/'+res[i].katigoria+'.jpg"' + ' class="catImages" id="'+res[i].katigoria+'" >' +
                '<button class="lastScreen3" id="'+res[i].katigoria+'1" type="button" onClick="reply_click(this.id)">x'+res[i].q1+'</button>' +
                '<button class="lastScreen3" id="'+res[i].katigoria+'2" type="button" onClick="reply_click(this.id)">x'+res[i].q2+'</button>' +
                '<button class="lastScreen3" id="'+res[i].katigoria+'3" type="button" onClick="reply_click(this.id)">x'+res[i].q3+'</button>' +
                '</div>'
           }else {
                alert("Something went wrong!")
           }
        }
        
    })
}