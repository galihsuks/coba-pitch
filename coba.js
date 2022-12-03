const express = require('express')
const app = express()

app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/img', express.static(__dirname + 'public/img'))
app.use('/js', express.static(__dirname + 'public/js'))

app.set('view engine','ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', (req,res)=>{
    res.render('pitch')
})

app.listen(process.env.PORT || 3000, () => console.log(`Listening at localhost:3000`))
