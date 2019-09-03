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

  mongoose.connect(mongoDB,{
      useNewUrlParser: true,
      useFindAndModify:false
  });

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
    desc:String,
    id:String,
    commstatus:String,
    member:Array,
    join:Array,
    asktojoin:Array
    
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
      photoname:String,
      create:Array
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
                          {
                               if(data[0].role=="User")
                                  res.redirect('/simpleusercommunities');
                              else
                               res.redirect('/usercommunities');
                          }
                              
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
        ob.photoname="/default.png";
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
    pass: 'password'
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
    req.session.islogin=0;
    res.redirect('login.html');
})
var storage = multer.diskStorage({
  destination : './public',
  filename : function(req, file, callback)
  {
    photoName='/'+file.fieldname + '-' + Date.now() + '@' +path.extname(file.originalname)
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
                          {
                              if(data[0].role=="User")
                                  res.send("user")
                              else
                      res.send("new"); 
                          }
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
    pass: 'password'
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
            console.log(req.body);
             function getMonths(monthno)
  {
    var month=["Jan","Feb","Mar","Apr","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return month[monthno-1];
  }
        var date = new Date()
    console.log(date);
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    today = + dd + '-' + getMonths(mm) + '-' + yyyy;
    var obj=
    {
    communityname:req.body.commName,
    rule:req.body.rate,
    location:"Not Added",
    owner:req.session.data.name,
    createdate:today,
    pic:photoName,    
    desc:req.body.descArea,
    id:req.session.data._id,
    commstatus:"Active"        
    }
            
//    if(error)
//        throw error;
//        })
    let newuser=new yojna(obj);
                 newuser.save().then(result=>{
                     product.findOneAndUpdate({"_id":req.session._id},{$push:{create:result._id}},function(error,result){
                         if(error)
                          throw error;
                               })
                     if(req.session.data.role=="Superadmin")
                     res.render('createcommunities',{product:req.session.data});
                     else
                     res.render('usercreatecommunities',{product:req.session.data});    
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
    pass: 'password'
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
  app.get('/profile',logger,logger1,function(req,res)
  {
     
              
      product.find({
          _id: req.session._id,
      })
      .then(data=>{
          if(data.length!=0){
           res.render('profile',{
                  product : data[0]
              });  
            
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
      
//      app.get('/getTagTable',function(req,res)
//  {
//     var data=tag.find({}).exec(function(error,result)
//                               {
//         if(error)
//             throw error;
//         else
//             res.send(JSON.stringify(result));
//     })
//    
//  })

    app.get('/getcommunity',function(req,res)
  {
     yojna.find({ $or: [{ id : req.session.data._id },{join : {$in : [req.session.data._id] }},{asktojoin : {$in : [req.session.data._id] }}] }).exec(function(error,result){
        if(error)
        throw error;
        else {
            res.send(JSON.stringify(result));
        }
    })
    
  })
 app.get('/getusercommunity',function(req,res)
  {
     yojna.find({ $or: [{join : {$in : [req.session.data._id] }},{asktojoin : {$in : [req.session.data._id] }}] }).exec(function(error,result){
        if(error)
        throw error;
        else {
            res.send(JSON.stringify(result));
        }
    })
    
  })
app.post('/getsearch',function(req,res)
          { 
    console.log(req.body);
    let finddata={ $and: [{ id : { $not : { $eq : req.session.data._id }}},{join : {$nin : [req.session.data._id] }},{asktojoin : {$nin : [req.session.data._id] }}] };
    
    yojna.find( finddata ).skip(req.body.start).limit(req.body.end).exec(function(error,result) {
          if(error)
          throw error;
          else {
            res.send(result);
          }
      })
              })
app.get('/getusersearch',function(req,res)
       {
    yojna.find({ $and: [{join : {$nin : [req.session.data._id] }},{asktojoin : {$nin : [req.session.data._id] }}] }).exec(function(error,result){
        if(error)
        throw error;
        else {
            res.send(JSON.stringify(result));
        }
    })
})
app.get('/getallcommunity',function(req,res)
  {
     var data=yojna.find({}).exec(function(error,result)
                               {
         if(error)
             throw error;
         else
             res.send(JSON.stringify(result));
     })
    
  })
app.post('/users',function (req, res) {
    var count;
    if(req.body.order[0].column==0)
    {
      if(req.body.order[0].dir=="asc")
      getdata("emailid",1);
      else
      getdata("emailid",-1);
    }
    else if(req.body.order[0].column==2)
    {
      if(req.body.order[0].dir=="asc")
      getdata("city",1);
      else
      getdata("city",-1);
    }
    else if(req.body.order[0].column==3)
    {
      if(req.body.order[0].dir=="asc")
      getdata("status",1);
      else
      getdata("status",-1);
    }
    else if(req.body.order[0].column==4)
    {
      if(req.body.order[0].dir=="asc")
      getdata("role",1);
      else
      getdata("role",-1);
    }

    else {
      getdata("emailid",1);
    }


    function getdata(colname,sortorder)
    {
        product.countDocuments(function(e,count){
          var start=parseInt(req.body.start);
          var len=parseInt(req.body.length);
          var role=req.body.role;
          var status=req.body.status;
          var search=req.body.search.value;
          var getcount=10;
         // console.log(req.body.search.value.length);


        var findobj={};
          console.log(role,status);
          if(role!='All')
             { findobj.role=role;
             }
          else{
              delete findobj["role"];
          }
          if(status!="All")
              {findobj.status=status;}
          else{
              delete findobj["status"];
          }
          if(search!='')
              findobj["$or"]= [{
              "emailid":  { '$regex' : search, '$options' : 'i' }
          }, {
              "city": { '$regex' : search, '$options' : 'i' }
          }
          ,{
              "status":  { '$regex' : search, '$options' : 'i' }
          }
          ,{
              "role": { '$regex' : search, '$options' : 'i' }
          }]
          else{
              delete findobj["$or"];
          }


          product.find(findobj).countDocuments(function(e,coun){
          getcount=coun;
        }).catch(err => {
          console.error(err)
          res.send(err)
        })

          product.find(findobj).skip(start).limit(len).sort({[colname] : sortorder})
          .then(data => {
              res.send({"recordsTotal" : count,"recordsFiltered" :getcount,data})
            })
            .catch(err => {
              console.error(err)
            //  res.send(error)
            })
        });
      }
})
app.post('/pagination',function (req, res) {
    var count;

    if(req.body.order[0].column==0)
    {
      if(req.body.order[0].dir=="asc")
      getdata("communityname",1);
      else
      getdata("communityname",-1);
    }
    else if(req.body.order[0].column==2)
    {
      if(req.body.order[0].dir=="asc")
      getdata("location",1);
      else
      getdata("location",-1);
    }
    else if(req.body.order[0].column==3)
    {
      if(req.body.order[0].dir=="asc")
      getdata("owner",1);
      else
      getdata("owner",-1);
    }
    else if(req.body.order[0].column==4)
    {
      if(req.body.order[0].dir=="asc")
      getdata("createdate",1);
      else
      getdata("createdate",-1);
    }

    else {
      getdata("communityname",1);
    }


    function getdata(colname,sortorder)
    {
        yojna.countDocuments(function(e,count){
          var start=parseInt(req.body.start);
          var len=parseInt(req.body.length);
          var rule=req.body.rule;
          var search=req.body.search.value;
          var getcount=10;
         // console.log(req.body.search.value.length);


        var findobj={};
          if(rule!='All')
             { findobj.rule=rule;
             }
          else{
              delete findobj["rule"];
          }
          if(search!='')
              findobj["$or"]= [{
              "communityname":  { '$regex' : search, '$options' : 'i' }
          }, {
              "location": { '$regex' : search, '$options' : 'i' }
          }
          ,{
              "owner":  { '$regex' : search, '$options' : 'i' }
          }
          ,{
              "createdate": { '$regex' : search, '$options' : 'i' }
          }]
          else{
              delete findobj["$or"];
          }


          yojna.find(findobj).countDocuments(function(e,coun){
          getcount=coun;
        }).catch(err => {
          console.error(err)
          res.send(err)
        })

          yojna.find(findobj).skip(start).limit(len).sort({[colname] : sortorder})
          .then(data => {
              res.send({"recordsTotal" : count,"recordsFiltered" :getcount,data})
            })
            .catch(err => {
              console.error(err)
            //  res.send(error)
            })
        });
      }
})
app.post('/getTagTable',function (req, res) {
    var count;

    if(req.body.order[0].column==0)
    {
      if(req.body.order[0].dir=="asc")
      getdata("tagname",1);
      else
      getdata("tagname",-1);
    }
    else if(req.body.order[0].column==1)
    {
      if(req.body.order[0].dir=="asc")
      getdata("created",1);
      else
      getdata("created",-1);
    }
    else if(req.body.order[0].column==2)
    {
      if(req.body.order[0].dir=="asc")
      getdata("date1",1);
      else
      getdata("date1",-1);
    }
    else {
      getdata("tagname",1);
    }


    function getdata(colname,sortorder)
    {
        tag.countDocuments(function(e,count){
          var start=parseInt(req.body.start);
          var len=parseInt(req.body.length);
          var search=req.body.search.value;
          var getcount=10;
         // console.log(req.body.search.value.length);


        var findobj={};
         findobj.delete='1';
          if(search!='')
              findobj["$or"]= [{
              "tagname":  { '$regex' : search, '$options' : 'i' }
          }, {
              "created": { '$regex' : search, '$options' : 'i' }
          }
          ,{
              "date1":  { '$regex' : search, '$options' : 'i' }
          }]
          else{
              delete findobj["$or"];
          }


          tag.find(findobj).countDocuments(function(e,coun){
          getcount=coun;
        }).catch(err => {
          console.error(err)
          res.send(err)
        })

          tag.find(findobj).skip(start).limit(len).sort({[colname] : sortorder})
          .then(data => {
              res.send({"recordsTotal" : count,"recordsFiltered" :getcount,data})
            })
            .catch(err => {
              console.error(err)
            //  res.send(error)
            })
        });
      }
})
app.get('/add',logger,logger1,function(req,res)
  {
      product.find({
          _id: req.session._id,
      })
      .then(data=>{
          if(data.length!=0){
              res.render('Add',{
                  product : req.session.data
              });
            
          }
          })
      
})
app.get('/communities',logger,logger1,function(req,res)
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
          })
         
})
app.get('/createcommunities',logger,function(req,res)
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
          })
         
})
app.get('/firstuser',logger,function(req,res)
  {
     
              console.log(req.session.data);
              res.render('firstuser',{
                  product : req.session.data
              });
            
          
})
  app.get('/adminprofile',logger,logger1,function(req,res)
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
           })
     
})  
app.get('/admincommunities',logger,logger1,function(req,res)
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
          })
      
})
app.get('/adminchangepass',logger,logger1,function(req,res)
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
      })
          
})
app.get('/adminedit',logger,logger1,function(req,res)
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
      })
        
})
app.get('/adminupdate',logger,logger1,function(req,res)
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
      })
          
      
})
app.get('/userprofile',logger,function(req,res)
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
      })
          
      
})
app.get('/usercommunities',logger,function(req,res)
  {
          
              res.render('usercommunities',{
                  product : req.session.data
              });
        
})
app.get('/simpleusercommunities',logger,function(req,res)
  {
          
              res.render('simpleusercommunities',{
                  product : req.session.data
              });
            
          
          
})
app.get('/userupdate',logger,function(req,res)
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
          })
     
})
app.get('/useredit',logger,function(req,res)
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
      })
      
})
app.get('/userchangepass',logger,function(req,res)
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
      })
      
})
app.get('/deactivate',logger,function(req,res)
  {
              res.render('deactivate',{
                  product : req.session.data
              });
            
         
})
app.get('/edit',logger,function(req,res)
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
      })
 
      
})

app.get('/createtag',logger,logger1,function(req,res)
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
      })
  
     
})

app.get('/changepass',logger,function(req,res)
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
      })
    
})
app.get('/taglist',logger,logger1,function(req,res)
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
      })
})
app.get('/adminsearch',logger,logger1,function(req,res)
  {
      product.find({
          _id: req.session._id,
      })
      .then(data=>{
          if(data.length!=0){
              res.render('adminsearch',{
                  product : data[0]
              });
            
          }
      })
           
      
})
app.get('/admincommunityprofile/:pro',logger,logger1,function(req,res)
  {

    var comid=req.params.pro.toString();
    yojna.findOne({"_id":comid},function(err,result)
                 {
        if(err)
            throw err;
        else
            {
        product.findOne({"_id":result.id},function(err,result1)
                       {
            if(err)
                throw err;
        else
        res.render('admincommunityprofile',{product:req.session.data,obj:result,own:result1});
            }) 
    }
    })         
})
app.get('/usercommunityprofile/:pro',logger,function(req,res)
  {
   
    var comid=req.params.pro.toString();
    yojna.findOne({"_id":comid},function(err,result)
                 {
        if(err)
            throw err;
        else
            {
        product.findOne({"_id":result.id},function(err,result1)
                       {
            if(err)
                throw err;
        else
        res.render('usercommunityprofile',{product:req.session.data,obj:result,own:result1});
            }) 
    }
    })
             
})
app.get('/adminpersonalprofile/:pro',logger,logger1,function(req,res)
  {
    var comid=req.params.pro.toString();
    product.findOne({"_id":comid},function(err,result)
                 {
        if(err)
            throw err;
        else
        res.render('adminpersonalprofile',{product:req.session.data,obj:result});    
    })         
})
app.get('/userpersonalprofile/:pro',logger,function(req,res)
  {
    var comid=req.params.pro.toString();
    product.findOne({"_id":comid},function(err,result)
                 {
        if(err)
            throw err;
        else
        res.render('userpersonalprofile',{product:req.session.data,obj:result});    
    })         
})
app.get('/adminsetting/:pro',logger,logger1,function(req,res)
  {
    var comid=req.params.pro.toString();
    yojna.findOne({"_id":comid},function(err,result)
                 {
        if(err)
            throw err;
        else
        res.render('adminsetting',{product:req.session.data,obj:result});    
    })    
})
app.get('/usersetting/:pro',logger,function(req,res)
  {
    var comid=req.params.pro.toString();
    yojna.findOne({"_id":comid},function(err,result)
                 {
        if(err)
            throw err;
        else
        res.render('usersetting',{product:req.session.data,obj:result});    
    })   
})
app.get('/adminpersonalprofile',logger,logger1,function(req,res)
  {
    
      product.find({
          _id: req.session._id,
      })
      .then(data=>{
          if(data.length!=0){
              res.render('adminpersonalprofile',{
                  product : data[0]
              });
            
          }
      })
})
app.get('/userpersonalprofile',logger,function(req,res)
  {
      product.find({
          _id: req.session._id,
      })
      .then(data=>{
          if(data.length!=0){
              res.render('userpersonalprofile',{
                  product : data[0]
              });
            
          }
      })
    
})
app.get('/usersearch',logger,function(req,res)
  {
      product.find({
          _id: req.session._id,
      })
      .then(data=>{
          if(data.length!=0){
              res.render('usersearch',{
                  product : data[0]
              });
            
          }
      })
   
})
app.get('/simpleusersearch',logger,function(req,res)
  {
      product.find({
          _id: req.session._id,
      })
      .then(data=>{
          if(data.length!=0){
              res.render('simpleusersearch',{
                  product : data[0]
              });
            
          }
      })
     
})
app.get('/usercreatecommunities',logger,function(req,res)
  {
      product.find({
          _id: req.session._id,
      })
      .then(data=>{
          if(data.length!=0){
              res.render('usercreatecommunities',{
                  product : data[0]
              });
            
          }
      })
      
})
app.get('/userlist',logger,logger1,function(req,res)
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
app.post('/updatecommunity',function(req,res)
       {
    console.log(req.body);
        yojna.updateOne({"_id":req.body._id},{$set:{"communityname":req.body.communityname,"commstatus":req.body.commstatus}},function(error,result){
            
    if(error)
        throw error;
        })
        res.send("1");
});
app.post('/updatetag',function(req,res)
       {
    console.log(req.body);
        tag.updateOne({"_id":req.body._id},{$set:{"tagname":req.body.tagname,"date1":req.body.date1}},function(error,result){
            
    if(error)
        throw error;
        })
        res.send("1");
});
app.post('/userjoin',function(req,res)
       {
    console.log(req.body);
        yojna.findOneAndUpdate({"_id":req.body._id},{$push:{join:req.session._id,member:"1"}},function(error,result){
            
    if(error)
        throw error;
        })
        res.send("1");
});
app.post('/pending',function(req,res){

    yojna.update({"_id" : req.body._id},{ $pull : {asktojoin : { $in : [req.session.data._id]}}},function(error,result){
        if(error)
        throw error;
        else {
            res.send("1");
        }
    })
})
app.post('/userasktojoin',function(req,res)
       {
    console.log(req.body);
        yojna.findOneAndUpdate({"_id":req.body._id},{$push:{asktojoin:req.session._id}},function(error,result){
            
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
app.get('/update',logger,function(req,res)
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
      })
      
})
function logger(req,res,next)
{
    if(req.session.islogin)
        {
            next();
        }
    else
        res.redirect('login.html');
}
function logger1(req,res,next)
{
    if(req.session.data.role=="Superadmin")
        next();
    else
        res.redirect('login.html');
}
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