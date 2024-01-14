const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const cors = require('cors')
const jwt = require('jsonwebtoken')
// G6DPxr02t7K3myUB
const port = process.env.PORT || 5000
mongoose.connect('mongodb+srv://tarakravindra242005:G6DPxr02t7K3myUB@usersdb.ospvpeo.mongodb.net/?retryWrites=true&w=majority').then(()=>{
    console.log('Connected to Database')
}).catch(err=>console.log(err))
app.use(cors())
app.use(express.json());
const authMiddleware=(req,res,next)=>{
 const token =req.headers['x-access-token']
  if(token){
    const decode = jwt.verify(token,'secret')
    req.user = decode
  next()}
  else {
    return res.send("An error occured")
  }
}
const userData = new mongoose.Schema({
    position:String,
    rollno:Number,
    department:String,
    password:String
})
const requestData = new mongoose.Schema({
  service:String,
  rollno:Number,
  status:String,
  accepted:{type:Boolean,default:true},
  reason:String,
  requestStartTime:String,
  requestEndTime:String
})
const requestModel = mongoose.model('userrequests',requestData)
const userModel = mongoose.model('users',userData)
const adminUserData = new mongoose.Schema({
    position:String,
    Identity:String,
    password:String,
    requests:Array
})
const userAdminModel = mongoose.model('adminusers',adminUserData)
app.post('/register',async (req,res)=>{
    console.log(req.body)
    if(req.body.position==='student'){
    const user = await userModel.findOne({rollno:req.body.rollno})
    if(user){
        return res.send("User Already Exists")
    }
    req.body.password= await bcrypt.hash(req.body.password,10);
    userModel.create({
        position:req.body.position,
        rollno:req.body.rollno,
        department:req.body.department,
        password:req.body.password
    })
    res.send("Registered successfully as student")
   }
   else if(req.body.position==='MIS' || req.body.position==='DEAN'){
    const user = await userAdminModel.findOne({Identity:req.body.rollno})
    if(user){
        return res.send("User Already Exists")
    }
    req.body.password= await bcrypt.hash(req.body.password,10);
    userAdminModel.create({
        position:req.body.position,
        Identity:req.body.rollno,
        password:req.body.password,
        requests:[]
    })
    res.send("Registered successfully as Admin")
   }
   

})
app.post('/login',async (req,res)=>{
     const position = req.body.position
     if(position === 'MIS'){
       const user = await userAdminModel.findOne({Identity:req.body.rollno})
       if(user){
        bcrypt.compare(req.body.password,user.password).then((result)=>{
           if(result){
            const token = jwt.sign({_id:user._id},'secret')

             return res.send({
                message:'Successful',
                token:token
             })
           }
           res.send({message:'wrong password'})

        })
       }
       else{
        res.send({message:'User not found'})
    }
     }
     else if(position==='student'){
        const user = await userModel.findOne({rollno:req.body.rollno})
        if(user){
         bcrypt.compare(req.body.password,user.password).then((result)=>{
            if(result){
                const token = jwt.sign({_id:user._id},'secret')
              return res.send({message : 'Successful',token:token})
            }
            res.send({message:'wrong password'})
         })
        }
        else{
            res.send({message:'User not found'})
        }
     }
     else if(position==='DEAN'){
      const user = await userAdminModel.findOne({Identity:req.body.rollno})
      if(user){
       bcrypt.compare(req.body.password,user.password).then((result)=>{
          if(result){
              const token = jwt.sign({_id:user._id},'secret')
            return res.send({message : 'Successful',token:token})
          }
          res.send({message:'wrong password'})
       })
      }
      else{
          res.send({message:'User not found'})
      }
     }
     else{
        res.send({message:'User not found'})
     }
})
app.get('/getUser/student',authMiddleware,async (req,res)=>{
  const decode = req.user
  const currentUser_student = await userModel.findOne({_id:decode})
  console.log(currentUser_student)
  if(currentUser_student)
  res.send(currentUser_student)
  else res.send('Not allowed')
})
app.get('/getUser/admin',authMiddleware,async (req,res)=>{
  const decode = req.user 
  console.log(decode._id)
  const currentUser_admin = await userAdminModel.findOne({_id:decode})
  if(currentUser_admin){
  res.send(currentUser_admin)
console.log(currentUser_admin)}
else {res.send('Not allowed')
console.log("checkkkk")}
})
app.post('/dropMinor', async (req, res) => {
  const { rollno, service, minor, department, fa, reason } = req.body;

  try {
    let someAdmin = await userAdminModel.findOne({ position: 'MIS' });

    if (!someAdmin) {
      return res.status(404).send('Admin not found');
    }

    // Check if the service already exists for the user in requests array
    const existingService = await requestModel.findOne({ rollno, service });

    if (existingService) {
      if(existingService.accepted)
      return res.send('Service already submitted');
    }

    // If service does not exist, add the request to the array
    if (!someAdmin.requests) {
      someAdmin.requests = []; // Initialize requests array if it doesn't exist
    }

    someAdmin.requests.push({
      rollno: rollno,
      service: service,
      minor: minor,
      department: department,
      fa: fa,
      reason: reason
    });
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().slice(0, 10);
    await someAdmin.save();
    await requestModel.create({
      service: service,
      rollno: rollno,
      status: 'student',
      accepted:true,
      requestStartTime:formattedDate
    });

    res.status(200).send('Request added successfully');
  } catch (error) {
    console.error('Error adding request:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/requestData',authMiddleware,async (req,res)=>{
  const user_id = req.user
  console.log(user_id)
  const user = await userModel.findOne({_id:user_id})
  const userRequests = await requestModel.find({rollno:user.rollno})
  console.log(userRequests)
  res.send(userRequests)
})
app.post('/admin/forward', authMiddleware, async (req, res) => {
  const currentUser_id = req.user;
  const forwardedData = req.body;
 
  if(forwardedData.message==='rejected'){
    const requestData2 = await requestModel.findOneAndUpdate({
      service:forwardedData.service,
      rollno:forwardedData.rollno,
    },{
      $set:{status:'MIS-REJECT',
      accepted:false,reason:forwardedData.reason},
      new:true
    })
    const updatedUser = await userAdminModel.findByIdAndUpdate(
      currentUser_id,
      { $pull: { requests: {rollno:forwardedData.rollno,
                             service:forwardedData.service} } },
      { new: true }
    );
  }
  else {
   const requestData = await requestModel.findOneAndUpdate(
      {
        rollno: forwardedData.rollno,
        service: forwardedData.service,
        accepted:true
      },
      { $set: { status: 'MIS' } },
      { new: true }
    );
    
    const updatedUser = await userAdminModel.findByIdAndUpdate(
      currentUser_id,
      { $pull: { requests: forwardedData } },
      { new: true }
    );

  
    if (!updatedUser) {
      return res.status(404).send('User not found or data not removed');
    }
    const someAdmin = await userAdminModel.findOne({position:'DEAN'})
    someAdmin.requests.push(forwardedData)
    await someAdmin.save()
    console.log('Data removed successfully');
    console.log(updatedUser);
    res.status(200).send('Forwarded Successfully');
  }
});
app.post('/dean/accept',authMiddleware,async (req,res)=>{
  const forwardedData = req.body;
  const currentUser_id = req.user;
  const currentDate = new Date()
  const formattedDate = currentDate.toISOString().slice(0, 10);
  if(req.body.message==='rejected'){
    const requestData2 = await requestModel.findOneAndUpdate({
      service:forwardedData.service,
      rollno:forwardedData.rollno,
      accepted:true
    },{
      $set:{status:'DEAN-REJECT',
      accepted:false,reason:forwardedData.reason,requestEndTime:formattedDate},
      new:true
    })
    const updatedUser = await userAdminModel.findByIdAndUpdate(
      currentUser_id,
      { $pull: { requests: {rollno:forwardedData.rollno,
                             service:forwardedData.service} } },
      { new: true }
    );
    res.send('Rejected by Dean')
  }
  else {
  const updatedUser = await userAdminModel.findByIdAndUpdate(
    currentUser_id,
    { $pull: { requests: forwardedData } },
    { new: true }
  );
  const requestData2 = await requestModel.findOneAndUpdate(
    {
      rollno: forwardedData.rollno,
      service: forwardedData.service,
      accepted:true
    },
    { $set: { status: 'DEAN' ,accepted:true,requestEndTime:formattedDate} },
    { new: true }
  );
  res.status(200).send('Accepted Successfully');}
})
app.listen(port,()=>console.log(`Running on ${port}`))