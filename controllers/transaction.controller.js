const Transactions = require('../models/transactions.model');
const Holders=require('../models/holder.model')

const transactionController = {

//GET ALL  TRANSACTION





getAllTransactions: async (req, res, next) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const [transactions, totalBlocksNumber, accountHolder, totalTransactions, totalAmountResult] = await Promise.all([
            Transactions.find({})
                .sort({ timeStamp: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Transactions.distinct('blockNumber'),
            Holders.countDocuments({}),
            Transactions.countDocuments({}),
            Transactions.aggregate([
                {
                    $group: {
                        _id: null,
                        totalAmount: {
                            $sum: {
                                $toDecimal: "$value"
                            }
                        }
                    }
                }
            ]).exec(),
        ]);

        const totalBlocks = totalBlocksNumber.length;

        const convertToIST = (timestamp) => new Date(timestamp * 1000).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

        const transactionsIST = transactions.map(transaction => ({
            ...transaction,
            timestamp: convertToIST(transaction.timeStamp),
            createdAt: convertToIST(transaction.createdAt),
            updatedAt: convertToIST(transaction.updatedAt),
        }));

        const totalAmount = totalAmountResult[0]?.totalAmount || 0;

        res.status(200).json({
            totalAmount,
            totalBlocks,
            accountHolder,
            totalTransactions,
            transactions: transactionsIST
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
},





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




