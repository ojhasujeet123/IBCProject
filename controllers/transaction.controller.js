const Transactions = require('../models/transactions.model');
const Holders=require('../models/holder.model')

const transactionController = {

//GET ALL  TRANSACTION
getAllTransactions: async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = req.query.limit || 10;

    try {
        const skip = (page - 1) * limit;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Find transactions for the last 24 hours
        const yesterday = new Date(today.getTime() - 86400000); // 24 hours ago
        const today_txns = await Transactions.find({
            createdAt: { $gte: yesterday, $lt: today }
        });
        
        // Calculate last 24 hrs transaction amount
        const lastOneDayTxn = today_txns.reduce((sum, txn) => {
            return sum + parseInt(txn.value);
        }, 0);

        // Calculate last one hour transaction amount
        const lastOneHour = new Date(today.getTime() - 60 * 60 * 1000); // One hour ago
        const lastOneHour_txns = await Transactions.find({
            createdAt: { $gte: lastOneHour, $lt: today }
        });

        const lastOneHourTxn = lastOneHour_txns.reduce((sum, txn) => {
            return sum + parseInt(txn.value);
        }, 0);

        // Convert timestamps to IST format
        const transactions = await Transactions.find({})
            .sort({ timeStamp: -1 })
            .skip(skip)
            .limit(limit);

        const accountHolder = await Holders.find({}).countDocuments({});
        const totalTransactions = await Transactions.countDocuments({});

        const transactionsIST = transactions.map(transaction => ({
            ...transaction._doc,
            timestamp: new Date(transaction.timeStamp * 1000).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
            createdAt: new Date(transaction.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
            updatedAt: new Date(transaction.updatedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        }));

        res.status(200).json({
            lastOneDayTxn,
            lastOneHourTxn,
            accountHolder,
            totalTransactions,
            today_txns: today_txns.length,
            transactions: transactionsIST
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
},















    // GET TRANSACTION BY HASH
    getTransactionByHash: async (req, res, next) => {
        try {
            const transactionOfSingleUser = await Transactions.findOne({ hash: req.params.hash });

            if (!transactionOfSingleUser) {
                return res.status(404).json({ message: "Transaction not found for the given hash" });
            }

            res.status(200).json({ transactionOfSingleUser });
        } catch (error) {
            console.error(error);
            next(error);
        }
    },








    //GET TRANSACTION BY ADDRESS

    getTransactionByAddress: async (req, res, next) => {
        try {
            const transactionByAddress = await Transactions.find({
                $or: [{ from: req.params.address }, { to: req.params.address }]
            });

            if (!transactionByAddress || transactionByAddress.length === 0) {
                return res.status(404).json({ message: "Transactions not found for this address" });
            }
            res.status(200).json({ transactionByAddress });
        } catch (error) {
            console.error(error);
            next(error);
        }
    },   
};







module.exports=transactionController




