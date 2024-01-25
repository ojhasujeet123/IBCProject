const Transactions = require('../models/transactions.model');

const transactionController = {

    // Get Transaction by Hash
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




    // Get Transaction by Address
    getTransactionByAddress: async (req, res, next) => {
        try {
            const transactionByAddress = await Transactions.find({ address: req.query.address });

            if (!transactionByAddress || transactionByAddress.length === 0) {
                return res.status(404).json({ message: "Transaction not exist for this address" });
            }

            res.status(200).json({ transactionByAddress });
        } catch (error) {
            console.error(error);
            next(error);
        }
    },


    getAllTransactions: async (req, res, next) => {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit;

        try {
            const skip = (page - 1) * limit;

            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const transactions = await Transactions.find({})
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(limit);

            const totalTransactions = await Transactions.countDocuments({})
            let today_txns = await Transactions.find({ createdAt: { $gte: today, $lt: new Date(today.valueOf() + 86400000) } }).countDocuments()

            if (!transactions || transactions.length === 0) {
                return res.status(404).json({ message: "Transaction not exist" });
            }

            // Convert timestamps to IST format
            const transactionsIST = transactions.map(transaction => ({
                ...transaction._doc,
                timestamp: new Date(transaction.timeStamp * 1000).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
                createdAt: new Date(transaction.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
                updatedAt: new Date(transaction.updatedAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
            }));

            res.status(200).json({ totalTransactions, today_txns, transactions: transactionsIST });
        } catch (error) {
            console.error(error);
            next(error);
        }
    },







    // Get Transaction Chart Data
    getTransactionForChart: async (req, res, next) => {
        try {
            const transactions = await Transactions.find({})
                .sort({ timeStamp: 1 });

            const chartData = {};

            transactions.forEach(transaction => {
                const date = new Date(transaction.timeStamp * 1000);
                const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1)}-${(date.getDate()).toString().padStart(2, '0')}`;

                if (!chartData[monthKey]) {
                    chartData[monthKey] = 0;
                }
                chartData[monthKey]++;
            });

            const chartLabels = Object.keys(chartData);
            const chartValues = Object.values(chartData);

            res.status(200).json({ chartLabels, chartValues });
        } catch (error) {
            console.error(error);
            next(error);
        }
    }





};


const tokenTransaction = async (req, res, next) => {
    try {
        const blockNumber = req.params.blockId
        let contractTranasaction = await Transactions.find({ 'contractAddress': { $ne: null } }).sort({ "_id": 1 })
        let contractTransactionCount = await Transactions.find({'contractAddress':{$ne:null}}).countDocuments({})
        if (!contractTranasaction) {
            return res.atatus(400).json({ message: "Token transactions not found of this block number" })
        }
        res.status(200).json({ contractTransactionCount,contractTranasaction })
    } catch (error) {
        console.error(error);
        next(error)
    }
};

module.exports = { ...transactionController, tokenTransaction };




