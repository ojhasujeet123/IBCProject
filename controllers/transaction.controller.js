const Transactions=require('../models/transactions.model')


const getTransaction=async(req,res)=>{
    const page=parseInt(req.query.page)||1;
    const limit=3;
    try {
        const skip=(page-1)*limit
        const transaction = await Transactions.find( { })
        .select({from:1,to:1,hash:1,_id:0})
        .skip(skip).limit(limit)
        if(!transaction || transaction.length ===0){
            return res.status(404).json({message:"Transaction not exist"})
        }
        res.status(200).json({
            transaction
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Internal Server Error"})
    }
}


module.exports=getTransaction;