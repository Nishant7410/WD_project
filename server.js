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
  var multer=require("multer");
   var passport=require('passport');
   app.use(passport.initialize());
   app.use(passport.session());
var nodemailer = require('nodemailer');
var GitHubStrategy = require('passport-github').Strategy;
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
var communityschema=new mongoose.Schema({
    communityname:String,
    rule:String,
    location:String,
    owner:String,
    createdate:String,
    pic:String,
    desc:String
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
      restrict:String,
      first:String,
      photoname:String
  })
  var yojna=mongoose.model('community',communityschema);
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
passport.serializeUser(function(user,done)
                      {
    done(null,user);
});

passport.deserializeUser(function(user,done)
                      {
    done(null,user);
});
passport.use(new GitHubStrategy({
    clientID: '01fcbb38f6f86a2bdf79',
    clientSecret: '37e5e39265529608f2c6c2d48303bde326ede03c',
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    //findOrCreate({ githubId: profile.id }, function (err, user) {
      return cb(null, profile);
    })
             );
app.get('/auth/github',
  passport.authenticate('github'));

app.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login.html' }),
  function(req, res) {
    console.log(req.session.passport.user);
    product.find({
          emailid :req.session.passport.user._json.email
      })
      .then(data=>{
          if(data.length!=0){
              
              console.log("if")
              if(data[0].restrict==1)
                  {
              req.session.islogin=1;
              req.session.name=data[0].name;
              req.session.emailid=data[0].emailid;
              req.session._id=data[0]._id;
              req.session.password=data[0].password;
              req.session.data=data[0];          
              if(data[0].role=="Superadmin")
                  {
              res.redirect('/profile');
                  }
              else
                  {
                      if(data[0].first=="false")          
                      res.redirect('/usercommunities');        
                      else
                          res.redirect('/firstuser');
                  }
                      
                  }
              else
                  res.redirect('/deactivate');
          }
          else
             {
                 console.log("else")
        var ob=new Object();
        ob.name=req.session.passport.user._json.name;
        ob.emailid=req.session.passport.user._json.email;
        ob.password="123";
        ob.city=req.session.passport.user._json.location;
        ob.dob="12/12/1998";
        ob.phoneno="1234567890";
        ob.gender="Male";
        ob.role=req.session.passport.user._json.type;
        ob.status="Pending";
        ob.restrict="1";
        ob.first="true";
        ob.photoname="default.png";
              req.session.islogin=1;
              req.session.name=ob.name;
              req.session.emailid=ob.emailid;
              req.session.password=ob.password;
              let newuser=new product(ob);
                 newuser.save().then(result=>{
                   req.session.data=result;
                     req.session._id=req.session.data._id;
                     console.log(req.session.data);
                      var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nishantsaini86066@gmail.com',
    pass: '9728686066'
  }
});

var mailOptions = {
  from: 'nishantsaini86066@gmail.com',
  to: ob.emailid,
  subject: 'Hi How are you',
  text: 'You are successfully added in cq community Emailid->'+ob.emailid+' Password->'+ob.password
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
                  res.redirect('/firstuser');
                 })
             
              
             }
      })
    // Successful authentication, redirect home.
    
  })

var photoName ;
app.get('/',(req,res)=>{
    res.redirect('login.html')
})
var storage = multer.diskStorage({
  destination : './public',
  filename : function(req, file, callback)
  {
    photoName=file.fieldname + '-' + Date.now() + '@' +path.extname(file.originalname)
      console.log("ye abhi wala consolehai"+photoName);
    callback(null,photoName);
  }
})

var upload = multer({
  storage : storage,
    fileFilter: function(req, file, callback) {
        console.log("ye apun ka test hai"+file);
    validateFile(file, callback)
  }
}).single('myImage');

function validateFile(file, callback) {
  let extensions = ['jpg', 'png', 'gif', 'jpeg'];
  let isAllowed = extensions.includes(file.originalname.split('.')[1].toLowerCase());
  let isAllowedMimeType = file.mimetype.startsWith("image/")
  if(isAllowed && isAllowedMimeType) {
    return callback(null, true);
  } else {
    callback("Erorr: File Type not allowed");
  }
}
app.post('/upload',(req,res) => {
  upload(req,res,(err)=>{
    if(err)
    {
      throw error;
    }
    else{
      console.log(req.file);
      console.log(photoName);
      console.log(req.session.data._id);

      product.updateOne({ "_id" : req.session._id } , { $set : { "photoname" : photoName } }  ,function(error,result)
      {
        console.log(result);
        if(error)
          {
            console.log("error vale mai");
            throw error;
          }
        else
        {
          console.log("update vale mai");
          req.session.data.photoname = photoName;
          console.log(req.session.data);
          console.log(req.session.data.photoname);
            product.find({
          _id: req.session._id,
      })
      .then(data=>{
          if(data.length!=0){
             if(data[0].role=="Superadmin")
          res.render('profile', { product : data[0] });
            else
                {
                    console.log(req.session.data.first);
                    if(data[0].first=="true")
                       res.render('firstuser', { product : data[0] });
                    else
                        res.render('userprofile', { product :data[0] });
                        
                }
          }
      })
           
        }
      })
  }
})
});


app.post('/upload1',(req,res) => {
  upload(req,res,(err)=>{
    if(err)
    {
      throw error;
    }
    else{
      console.log(req.file);
      console.log(photoName);
      console.log(req.session.data._id);

      product.updateOne({ "_id" : req.session._id } , { $set : { "photoname" : photoName } }  ,function(error,result)
      {
        console.log(result);
        if(error)
          {
            console.log("error vale mai");
            throw error;
          }
        else
        {
          console.log("update vale mai");
          req.session.data.photoname = photoName;
          console.log(req.session.data);
          console.log(req.session.data.photoname);
          res.render('adminprofile', { product : req.session.data });
        }
      })
  }
})
});

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
              req.session.data=data[0];          
              if(data[0].role=="Superadmin")
                  {
              res.send("1");
                  }
              else
                  {
                      if(data[0].first=="false")          
                      res.send("new");         
                      else
                          res.send("update");
                  }
                      
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
         var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nishantsaini86066@gmail.com',
    pass: '9728686066'
  }
});

var mailOptions = {
  from: 'nishantsaini86066@gmail.com',
  to: req.body.emailid,
  subject: 'Hi How are you',
  text: 'You are successfully added in cq community Emailid->'+req.body.emailid+' Password->'+req.body.password
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
        }
      })

       res.send("1");   
              }
      })
    
  })

app.post('/photo',function (req, res)
  {
    console.log("i am requested")
     upload(req,res,(err)=>{
         if(err)
             {
             throw error;
             }
        else{
           // console.log("this is chaling  "+req.file+"   "+req.files+"  "+req.body);
            console.log(req.body);
    var obj=
    {
    communityname:req.body.communityname,
    rule:req.body.rule,
    location:req.body.location,
    owner:req.body.owner,
    createdate:req.body.createdate,
    pic:photoName,    
    html:req.body.desc        
    }
//            var obj=
//    {
//    communityname:"hii",
//    rule:"Direct",
//    location:"not added",
//    owner:"Superadmin",
//    createdate:"12-july-2019",
//    pic:photoName,    
//    desc:"html"        
//    }
    let newuser=new yojna(obj);
                 newuser.save().then(result=>{
                     res.send();
                 });
         }
     });
              });
app.post('/mail',function (req, res)
  {
      
      console.log(req.body);
     product.find({
         _id:req.body._id,
          emailid :req.body.emailid
      })
     .then(data=>{
          if(data.length==0){
            res.send("0"); 
          }
          else
              {
         var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'nishantsaini86066@gmail.com',
    pass: '9728686066'
  }
});

var mailOptions = {
  from: 'nishantsaini86066@gmail.com',
  to: req.body.emailid,
  subject: req.body.subject,
  html: req.body.text
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
        }

       res.send("1");   
              })
})
    
  //Get from DB
  app.get('/profile',function(req,res)
  {
     
          if(req.session.islogin==1){
              res.render('profile',{
                  product : req.session.data
              });
            
          }
          else
              {
                  res.redirect("login.html");
              }
            
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
//app.post('/getpaginationtable',function(req,res){
//
//    product.countDocuments(function(error,count){
//        var start = parseInt(req.body.start);
//        var len  = parseInt(req.body.length);
//
//        product.find({
//
//        }).skip(start).limit(len)
//        .then(data=> {
//            res.send({"recordsTotal" : count, "recordsFiltered" : count,data})
//        })
//        .catch(err=> {
//            res.send(err)
//        })
//    })
//})
app.post('/users' , function (req , res)
{
    // console.log("\n\n\n" + req.body.search.value + "\n\n\n");
    let query = {};
    let params={};
    console.log(req.body.order);
    if(req.body.role === 'All' && req.body.status !== 'All')
    {
        query = {status: req.body.status}
    }
    else if(req.body.role !== 'All' && req.body.status === 'All')
    {
        query = {role: req.body.role}
    }
    else if(req.body.role !== 'All' && req.body.status !== 'All')
    {
        query = {role: req.body.role , status: req.body.status}
    }
    
     let sortingType;
    if(req.body.order[0].dir === 'asc')
        sortingType = 1;
    else
        sortingType = -1;

    if(req.body.order[0].column === '0')
    {
        params = {skip : parseInt(req.body.start) , limit : parseInt(req.body.length) , sort : {emailid : sortingType}}
    }
    else if(req.body.order[0].column === '2')
    {
        params = {skip : parseInt(req.body.start) , limit : parseInt(req.body.length) , sort : {city : sortingType}}
    }
    else if(req.body.order[0].column === '3')
    {
        params = {skip : parseInt(req.body.start) , limit : parseInt(req.body.length) , sort : {status : sortingType}}
    }
    else if(req.body.order[0].column === '4')
    {
        params = {skip : parseInt(req.body.start) , limit : parseInt(req.body.length) , sort : {role : sortingType}}
    }
    console.log(params);
    product.find(query ,{},params, function (err , data)
        {
            if(err)
            {
                console.log(err);
                return;
            }
            else
                console.log(data);
                product.countDocuments(function(err , count)
                {
                    if(err)
                    {
                        console.log(err);
                    }
                    else
                    {
                        if (req.body.search.value)
                        {
                            data = data.filter((value) => {
                                console.log(value);
                                return value.emailid.includes(req.body.search.value)||value.phoneno.includes(req.body.search.value)||value.city.includes(req.body.search.value)||value.status.includes(req.body.search.value)||value.role.includes(req.body.search.value)
                            })
                        }
                        res.send({"recordsTotal": count, "recordsFiltered": count, data});
                    }
                });
        })

});
app.get('/add',function(req,res)
  {
      product.find({
          _id: req.session._id,
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
app.get('/communities',function(req,res)
  {
      product.find({
          _id: req.session._id,
      })
      .then(data=>{
          if(data.length!=0){
              res.render('communities',{
                  product : data[0]
              });
            
          }
          else
              {
                  res.redirect("login.html");
              }
      })
})
app.get('/createcommunities',function(req,res)
  {
      product.find({
          _id: req.session._id,
      })
      .then(data=>{
          if(data.length!=0){
              res.render('createcommunities',{
                  product : data[0]
              });
            
          }
          else
              {
                  res.redirect("login.html");
              }
      })
})
app.get('/firstuser',function(req,res)
  {
     
          if(req.session.islogin==1){
              console.log(req.session.data);
              res.render('firstuser',{
                  product : req.session.data
              });
            
          }
          else
              {
                  res.redirect("login.html");
              }
})
  app.get('/adminprofile',function(req,res)
  {
      product.find({
          _id: req.session._id,
      })
      .then(data=>{
          if(data.length!=0){
              res.render('adminprofile',{
                  product : data[0]
              });
            
          }
          else
              {
                  res.redirect("login.html");
              }
      })
})  
app.get('/admincommunities',function(req,res)
  {
      product.find({
          _id: req.session._id,
      })
      .then(data=>{
          if(data.length!=0){
              res.render('admincommunities',{
                  product : data[0]
              });
            
          }
          else
              {
                  res.redirect("login.html");
              }
      })
})
app.get('/adminchangepass',function(req,res)
  {
      product.find({
          _id: req.session._id,
      })
      .then(data=>{
          if(data.length!=0){
              res.render('adminchangepass',{
                  product : data[0]
              });
            
          }
          else
              {
                  res.redirect("login.html");
              }
      })
})
app.get('/adminedit',function(req,res)
  {
      product.find({
          _id: req.session._id,
      })
      .then(data=>{
          if(data.length!=0){
              res.render('adminedit',{
                  product : data[0]
              });
            
          }
          else
              {
                  res.redirect("login.html");
              }
      })
})
app.get('/adminupdate',function(req,res)
  {
      product.find({
          _id: req.session._id,
      })
      .then(data=>{
          if(data.length!=0){
              res.render('adminupdate',{
                  product : data[0]
              });
            
          }
          else
              {
                  res.redirect("login.html");
              }
      })
})
app.get('/userprofile',function(req,res)
  {
      product.find({
          _id: req.session._id,
      })
      .then(data=>{
          if(data.length!=0){
              res.render('userprofile',{
                  product : data[0]
              });
            
          }
          else
              {
                  res.redirect("login.html");
              }
      })
})
app.get('/usercommunities',function(req,res)
  {
          if(req.session.islogin==1){
              res.render('usercommunities',{
                  product : req.session.data
              });
            
          }
          else
              {
                  res.redirect("login.html");
              }
})
app.get('/userupdate',function(req,res)
  {
      product.find({
          _id: req.session._id,
      })
      .then(data=>{
          if(data.length!=0){
              res.render('userupdate',{
                  product : data[0]
              });
            
          }
          else
              {
                  res.redirect("login.html");
              }
      })
})
app.get('/useredit',function(req,res)
  {
      product.find({
          _id: req.session._id,
      })
      .then(data=>{
          if(data.length!=0){
              res.render('useredit',{
                  product : data[0]
              });
            
          }
          else
              {
                  res.redirect("login.html");
              }
      })
})
app.get('/userchangepass',function(req,res)
  {
      product.find({
          _id: req.session._id,
      })
      .then(data=>{
          if(data.length!=0){
              res.render('userchangepass',{
                  product : data[0]
              });
            
          }
          else
              {
                  res.redirect("login.html");
              }
      })
})
app.get('/deactivate',function(req,res)
  {
          if(req.session.islogin==1){
              res.render('deactivate',{
                  product : req.session.data
              });
            
          }
          else
              {
                  res.redirect("login.html");
              }
})
app.get('/edit',function(req,res)
  {
      product.find({
          _id: req.session._id,
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
          _id: req.session._id,
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
          _id: req.session._id,
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
          _id: req.session._id,
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
          _id: req.session._id,
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
            
        })
        res.send("1");
    }
});
app.post('/del',function(req,res)
       {
        product.updateOne({"_id":req.session._id},{$set:{"del":req.body.del}},function(error,result){
            
    if(error)
        throw error;
            
        })
        res.send("1");
    });
app.post('/changepass2',function(req,res)
       {
    console.log(req.body);
        if(req.session.data.photoname=="default.png")
            res.send("0");
    else{
        product.updateOne({"_id":req.session._id},{$set:{"name":req.body.name1,"dob":req.body.dob,"gender":req.body.gender,"phoneno":req.body.phoneno,"city":req.body.city,"first":"false"}},function(error,result){
            
    if(error)
        throw error;
            else
               
             res.send("1");
        })
       
    }
});

app.post('/updateuserlist',function(req,res)
       {
    console.log(req.body);
        product.updateOne({"_id":req.body._id},{$set:{"emailid":req.body.emailid,"phoneno":req.body.phoneno,"city":req.body.city,"status":req.body.status,"role":req.body.role}},function(error,result){
            
    if(error)
        throw error;
        })
        res.send("1");
});
app.post('/restrict',function(req,res)
       {
    console.log(req.body);
        product.updateOne({"_id":req.body._id},{$set:{"restrict":req.body.restrict}},function(error,result){
            
    if(error)
        throw error;
        })
    if(req.body.restrict=="0")
        res.send("1");
    else
        res.send("0");
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
          _id: req.session._id,
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