/*var express = require('express')
var path = require('path') 
var app = express()

//Acces static files
app.use(express.static(path.join(__dirname, 'public')));

//Bodyparser
app.use(express.urlencoded({extended: true})); 
app.use(express.json()); 

//Connect with db
var mongoose = require('mongoose');
var mongoDB = 'mongodb://localhost/myDB';

mongoose.connect(mongoDB);

mongoose.connection.on('error', (err) => {
    console.log('DB connection Error');
});

mongoose.connection.on('connected', (err) => {
    console.log('DB connected');
});

var productSchema = new mongoose.Schema({
    productName: String
  })

var product =  mongoose.model('Products', productSchema);

// Add in db
app.post('/:pro',function (req, res) {
  console.log(req.body);
  let newProduct = new product({
    productName: req.body 
  })
  newProduct.save()
   .then(data => {
     console.log(data)
     res.send(data)
   })
   .catch(err => {
     console.error(err)
     res.send(error)
   })
  
})

//Get from DB
app.get('/products',function(req,res){
    product.find({
         // search query
        // productName: 'mlbTvrndc'  
    })
    .then(data => {
        console.log(data)
        res.send(data)
      })
      .catch(err => {
        console.error(err)
        res.send(error)
      })
})


//
app.put('/updateProduct',function(req,res){
    console.log(req.body);
    product.findOneAndUpdate(
    {
        productName: req.body.name  // search query
    }, 
    {
      productName: req.body.nameNew   // field:values to update
    },
    {
      new: true,                       // return updated doc
      runValidators: true              // validate before update
    })
    .then(data => {
        console.log(data)
        res.send(data)
      })
      .catch(err => {
        console.error(err)
        res.send(error)
      })
})
app.put('/updateProduct',function(req,res)
  {
    /*
        console.log(req.body)
        console.log(req.params.pro)*/
      /*  var id =  req.params.pro.toString()
        console.log(id)
        product.updateOne( { "_id" : id },{ $set : req.body.text } , function(err,result)
        {
          if(err)
          throw err
          else
          {
            res.send("DATA UPDATED SUCCESFULLY")
          }
        })

  })

app.delete('/deleteProduct',function(req,res)
  {
      var id = req.params.pro.toString();
      console.log(id);
      product.deleteOne({ "_id": id },function(err,result)
      {
          if(err)
          throw error
          else
          {
            console.log(result);
              res.send("data deleted SUCCESFULLY")
          }
      });
  })

app.get('/test',function(req,res){
    res.send('hello');
})
app.listen(3225)*/





  var express = require('express')
  var path = require('path')
  var app = express()
  var ejs=require("ejs");
var session=require('express-session');
app.use(session({
    secret:"xYzUCAchitkara",
    resave:false,
    saveUninitialized:true
}));
  app.use(express.static(path.join(__dirname,'public')))

  app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');
 
 

  app.use(express.urlencoded({extended: true}))
  app.use(express.json())

  var mongoose = require('mongoose');
  var mongoDB = 'mongodb://localhost/meraDB';

  mongoose.connect(mongoDB);

  mongoose.connection.on('error',(err) => {
    console.log('DB connection Error');
  })

  mongoose.connection.on('connected',(err) => {
    console.log('DB connected');
  })
var  tagschema=new mongoose.Schema({
    tagname:String,
    created:String,
    date1:String,
    delete:String
    
})
  var productSchema = new mongoose.Schema({
    name: String,
    emailid: String,
    password: String,
    city: String,
      dob:String,
      phoneno:String,
      gender:String,
      role:String,
      status:String,
      restrict:String
  })
var tag=mongoose.model('tags',tagschema);
  var product = mongoose.model('products', productSchema);
app.post('/tag1',function (req, res)
  {
    tag.create(req.body,function(error,result)
      {
        if(error)
        throw error;
        else
        {
          console.log(result);
        }
      })

       res.send("1");  
})
  app.post('/productlogin',function (req, res)
  {
      
      console.log(req.body);
      product.find({
          emailid :req.body.username1,
          password :req.body.pass1
      })
          
      .then(data=>{
          if(data.length!=0){
              if(data[0].restrict==1)
                  {
              req.session.islogin=1;
              req.session.name=data[0].name;
              req.session.emailid=data[0].emailid;
              req.session._id=data[0]._id;
              req.session.password=data[0].password;
              res.send("1");
                  }
              else
                  res.send("-1");
          }
          else
              res.send("0");
      })
          
      .catch(err=>{
          res.send(error)
      })
     /* product.create(req.body,function(error,result)
      {
        if(error)
        throw error;
        else
        {
          console.log(result);
        }
      })*/

       //res.send("data has been saved");
  })

//add user
 app.post('/adduser1',function (req, res)
  {
      
      console.log(req.body);
     product.find({
          emailid :req.body.emailid
      })
     .then(data=>{
          if(data.length!=0){
            res.send("0"); 
          }
          else
              {
                 product.create(req.body,function(error,result)
      {
        if(error)
        throw error;
        else
        {
          console.log(result);
        }
      })

       res.send("1");   
              }
      })
    
  })
  //Get from DB
  app.get('/profile',function(req,res)
  {
      product.find({
          name: req.session.name,
          emailid: req.session.emailid
      })
      .then(data=>{
          if(data.length!=0){
              res.render('profile',{
                  product : data[0]
              });
            
          }
          else
              {
                  res.redirect("login.html");
              }
      })
            
//      var data = product.find({}).exec(function(error,result)
//      {
//        if(error)
//        throw error;
//        else
//        res.send(JSON.stringify(result))
//      });
  })
      
      app.get('/getTagTable',function(req,res)
  {
     var data=tag.find({}).exec(function(error,result)
                               {
         if(error)
             throw error;
         else
             res.send(JSON.stringify(result));
     })
    
  })
  app.get('/getTable',function(req,res)
  {
     var data=product.find({}).exec(function(error,result)
                               {
         if(error)
             throw error;
         else
             res.send(JSON.stringify(result));
     })
    
  })
app.get('/add',function(req,res)
  {
      product.find({
          name: req.session.name,
          emailid: req.session.emailid
      })
      .then(data=>{
          if(data.length!=0){
              res.render('Add',{
                  product : data[0]
              });
            
          }
          else
              {
                  res.redirect("login.html");
              }
      })
})
    


app.get('/edit',function(req,res)
  {
      product.find({
          name: req.session.name,
          emailid: req.session.emailid
      })
      .then(data=>{
          if(data.length!=0){
              res.render('edit',{
                  product : data[0]
              });
            
          }
          else
              {
                  res.redirect("login.html");
              }
      })
})

app.get('/createtag',function(req,res)
  {
      product.find({
          name: req.session.name,
          emailid: req.session.emailid
      })
      .then(data=>{
          if(data.length!=0){
              res.render('createtag',{
                  product : data[0]
              });
            
          }
          else
              {
                  res.redirect("login.html");
              }
      })
})

app.get('/changepass',function(req,res)
  {
      product.find({
          name: req.session.name,
          emailid: req.session.emailid
      })
      .then(data=>{
          if(data.length!=0){
              res.render('changepass',{
                  product : data[0]
              });
            
          }
          else
              {
                  res.redirect("login.html");
              }
      })
})
app.get('/taglist',function(req,res)
  {
      product.find({
          name: req.session.name,
          emailid: req.session.emailid
      })
      .then(data=>{
          if(data.length!=0){
              res.render('taglist',{
                  product : data[0]
              });
            
          }
          else
              {
                  res.redirect("login.html");
              }
      })
})
app.get('/userlist',function(req,res)
  {
      product.find({
          name: req.session.name,
          emailid: req.session.emailid
      })
      .then(data=>{
          if(data.length!=0){
              res.render('userlist',{
                  product : data[0]
              });
            
          }
          else
              {
                  res.redirect("login.html");
              }
      })
})
app.post('/changepass1',function(req,res)
       {
    console.log(req.body);
    console.log(req.session.password);
    if(req.body.oldpass!=req.session.password)
        res.send("0");
    else{
        product.updateOne({"_id":req.session._id},{$set:{"password":req.body.newpass}},function(error,result){
            
    if(error)
        throw error;
            else
                req.session.password=req.body.newpass;
            
        })
        res.send("1");
    }
});
app.post('/changepass2',function(req,res)
       {
    console.log(req.body);
        product.updateOne({"_id":req.session._id},{$set:{"name":req.body.name1,"dob":req.body.dob,"gender":req.body.gender,"phoneno":req.body.phoneno,"city":req.body.city}},function(error,result){
            
    if(error)
        throw error;
            else
                req.session.name=req.body.name;
            
        })
        res.send("1");
});
app.post('/updateuserlist',function(req,res)
       {
    console.log(req.body);
        product.updateOne({"_id":req.body.id},{$set:{"emailid":req.body.emailid,"phoneno":req.body.phoneno,"city":req.body.city,"status":req.body.status,"role":req.body.role}},function(error,result){
            
    if(error)
        throw error;
             else
                 {
                     if(req.session.emailid==req.body.old)
                req.session.emailid=req.body.emailid;
                 }
        })
        res.send("1");
});
app.post('/tagdelete',function(req,res)
       {
    console.log(req.body.del);
        tag.updateOne({"_id":req.body.id},{$set:{"delete":req.body.del}},function(error,result){
            
    if(error)
        throw error;
            
        })
        res.send("1");
    });
app.get('/update',function(req,res)
  {
      product.find({
          name: req.session.name,
          emailid: req.session.emailid
      })
      .then(data=>{
          if(data.length!=0){
              res.render('update',{
                  product : data[0]
              });
            
          }
          else
              {
                  res.redirect("login.html");
              }
      })
})
  app.put('/:pro',function(req,res)
  {
    /*
        console.log(req.body)
        console.log(req.params.pro)*/
        var id =  req.params.pro.toString()
        console.log(id)
        product.updateOne( { "_id" : id },{ $set : req.body.text } , function(err,result)
        {
          if(err)
          throw err
          else
          {
            res.send("DATA UPDATED SUCCESFULLY")
          }
        })

  })

  app.delete('/:pro',function(req,res)
  {
      var id = req.params.pro.toString();
      console.log(id);
      product.deleteOne({ "_id": id },function(err,result)
      {
          if(err)
          throw error
          else
          {
            console.log(result);
              res.send("data deleted SUCCESFULLY")
          }
      });
  })

//  app.get('/hello',function(req,res){
//    res.send('hello');
//})

  console.log("Running on port 3000");
  app.listen(3000)