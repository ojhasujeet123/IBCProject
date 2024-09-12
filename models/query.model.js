const mongoose=require('mongoose')
const {Schema}=mongoose;

const querySchema=new Schema({
    email: {
        type: String,
        required:true,
        sparse: true,
        trim: true,
        default: '',
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
      },
      name:{
        type:String,
        required:true
      },
      subject:{
        type:String,
        required:true
      },
      message:{
        type:String,
      }
},{
    timestamps:true
}
)

module.exports=mongoose.model("Query",querySchema)