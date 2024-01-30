const Transactions = require('../models/transactions.model');
const Holders=require('../models/holder.model')

const transactionController = {

//GET ALL  TRANSACTION

    getAllTransactions: async (req, res, next) => {
        const page = parseInt(req.query.page) || 1;
        const limit = req.query.limit || 10;

        try {
            const skip = (page - 1) * limit;

            const today = new Date()
            today.setHours(0, 0, 0, 0)

            //Find transaction 
            const transactions = await Transactions.find({})
                .sort({ timeStamp: -1 })
                // .skip(skip)
                // .limit(limit);


            const accountHolder= await Holders.find({}).countDocuments({})
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

            res.status(200).json({accountHolder, totalTransactions, today_txns, transactions: transactionsIST });
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







// const tokenTransaction = async (req, res, next) => {
//     try {
//         // const blockNumber = req.params.blockId
//         let contractTranasaction = await Transactions.find({ 'contractAddress': { $ne: null } }).sort({ "_id": 1 })
//         let contractTransactionCount = await Transactions.find({ 'contractAddress': { $ne: null } }).countDocuments({})
//         if (!contractTranasaction) {
//             return res.atatus(400).json({ message: "Token transactions not found of this block number" })
//         }
//         res.status(200).json({ contractTransactionCount, contractTranasaction })
//     } catch (error) {
//         console.error(error);
//         next(error)
//     }
// };










// const calculateChartData = (transactions, keyExtractor, transformation) => {
//     const chartData = {};
//     transactions.forEach(({ timeStamp, value }) => {
//         const date = new Date(timeStamp * 1000);
//         const monthKey = keyExtractor(date);
//         chartData[monthKey] = transformation(chartData[monthKey], value);
//     });
//     return chartData;
// };

// const keyExtractor = (date) => `${date.getFullYear()}-${(date.getMonth() + 1)}-${(date.getDate()).toString().padStart(2, '0')}`;

// const getTransactionForChart = async (req, res, next) => {
//     try {
//         const transactions = await Transactions.find({}).sort({ timeStamp: 1 });

//         const chartData = calculateChartData(transactions, keyExtractor, (prevValue, value) => (prevValue || 0) + 1);
//         const priceChartData = calculateChartData(transactions, keyExtractor, (prevValue, value) => (prevValue || 0) + value / 83);
//         const dailyGasPrice = calculateChartData(transactions, keyExtractor, (prevValue, value) => (prevValue || 0) + value / 83);
//         const avgGasPriceValues = calculateChartData(transactions, keyExtractor, (prevValue, gasPrice) => {
//             if (!prevValue) {
//                 prevValue = { totalGasPrice: 0, transactionCount: 0 };
//             }
//             const gasPriceGwei = gasPrice / 1e9;
//             prevValue.totalGasPrice += gasPriceGwei;
//             prevValue.transactionCount++;
//             return prevValue;
//         });

//         const chartLabels = Object.keys(chartData);
//         const chartValues = Object.values(chartData);
//         const priceChartDataValues = Object.values(priceChartData);
//         const dailyGasPriceValues = Object.values(dailyGasPrice);
//         const avgGasPriceValuesList = Object.keys(avgGasPriceValues).map(monthKey => {
//             const average = avgGasPriceValues[monthKey].totalGasPrice / avgGasPriceValues[monthKey].transactionCount;
//             return isNaN(average) ? 0 : average;
//         });

//         res.status(200).json({ chartLabels, chartValues, priceChartDataValues, avgGasPriceValues: avgGasPriceValuesList, dailyGasPriceValues });
//     } catch (error) {
//         console.error(error);
//         next(error);
//     }
// };





// module.exports = { ...transactionController, tokenTransaction , getTransactionForChart};
module.exports=transactionController




