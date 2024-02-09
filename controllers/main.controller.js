const Transactions = require('../models/transactions.model')
const User = require('../models/user.model')
const ContactQuery = require('../models/query.model')
const Holders = require('../models/holder.model')
const { sendQuerySubmissionEmail } = require('../utils/Email')
const { getElapsedTime } = require('../utils/auth.utils')
require('dotenv').config();
const {Web3}=require('web3')
const web3=new Web3(process.env.ETHEREUMNODEURL)



//TOKEN TRANSACTION
const tokenTransaction = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        // const blockNumber = req.params.blockId
        let contractTranasaction = await Transactions.find({ 'contractAddress': { $ne: null } }).sort({ "_id": 1 }).skip(skip)
            .limit(limit);
        let contractTransactionCount = await Transactions.find({ 'contractAddress': { $ne: null } }).countDocuments({})
        if (!contractTranasaction) {
            return res.atatus(400).json({ message: "Token transactions not found of this block number" })
        }
        const transactionsWithElapsedTime = contractTranasaction.map(transaction => {
            const createdElapsedTime = getElapsedTime(transaction.createdAt);
            const updatedElapsedTime = getElapsedTime(transaction.updatedAt);
            return { ...transaction.toObject(), createdElapsedTime, updatedElapsedTime };
        });
        res.status(200).json({ contractTransactionCount, contractTranasaction: transactionsWithElapsedTime })
    } catch (error) {
        console.error(error);
        next(error)
    }
};






const calculateChartData = (transactions, keyExtractor, transformation) => {
    const chartData = {};
    transactions.forEach(({ timeStamp, value }) => {
        const date = new Date(timeStamp * 1000);
        const monthKey = keyExtractor(date);
        chartData[monthKey] = transformation(chartData[monthKey], value);
    });
    return chartData;
};

const keyExtractor = (date) => `${date.getFullYear()}-${(date.getMonth() + 1)}-${(date.getDate()).toString().padStart(2, '0')}`;



//CHART DATA
// const getTransactionForChart = async (req, res, next) => {
//     try {
//         const transactions = await Transactions.find({}).sort({ createdAt: -1 });

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
//         const chart={
//             chartLabels,
//             chartValues,
//             priceChartDataValues,
//             avgGasPriceValues:avgGasPriceValuesList,
//             dailyGasPriceValues
//         }
//         // res.status(200).json({ chartLabels, chartValues, priceChartDataValues, avgGasPriceValues: avgGasPriceValuesList, dailyGasPriceValues });
//         res.status(200).json({ chart });

//     } catch (error) {
//         console.error(error);
//         next(error);
//     }
// };




const getTransactionForChart = async (req, res, next) => {
    try {
        let dateFilter = []
        const timeRange=req.query.timerange
        if(timeRange){
            const startDate=new Date()
            startDate.setUTCMonth(startDate.getUTCMonth() - (timeRange === '1month' ? 1 : (timeRange === '6months' ? 6 : (timeRange === '1year' ? 12 : 0))));
            
            dateFilter=[{$match:{createdAt:{$gte:startDate}}}];
        }
        const transactions = await Transactions.aggregate([ 
            ...dateFilter,
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$createdAt"
                        }
                    },
                    count: { $sum: 1 },
                    totalValue: {
                        $sum: {
                            $convert: {
                                input: "$value",
                                to: "long",
                                onError: 0,
                                onNull: 0
                            }
                        }
                    },
                    totalGasPrice: { $sum: { $divide: [{ $convert: { input: "$gasPrice", to: "long", onError: 0, onNull: 0 } }, 1e9] } },
                    transactionCount: { $sum: 1 },
                    totalCummulativeGasUsed: { $avg: "$cumulativeGasUsed" },
                    blockCount: { $sum: { $cond: [{ $eq: ["$value", null] }, 0, 1] } },
                    totalReward: {
                        $sum: {
                            $ifNull: [
                                {
                                    $convert: {
                                        input: "$value",
                                        to: "long",
                                        onError: 0,
                                        onNull: 0
                                    }
                                },
                                0
                            ]
                        }
                    }
                    
                }
            },
            {
                $project: {
                    chartLabels: "$_id",
                    chartValues: "$count",
                    priceChartDataValues: { $divide: ["$totalValue", 83] },
                    dailyGasPriceValues: { $divide: ["$totalGasPrice", 83] },
                    avgGasPriceValues: { $divide: ["$totalGasPrice", "$transactionCount"] },
                    blocksAndRewardsChartValues:"$blockCount",
                    totalReward:"$totalReward",
                    transactionFee:{$divide:["$totalCummulativeGasUsed",83]}
                }
            },
            { $sort: { chartLabels: -1 } }
        ]);

        const chart = {
            chartLabels: transactions.map(entry => entry.chartLabels),
            chartValues: transactions.map(entry => entry.chartValues),
            priceChartDataValues: transactions.map(entry => entry.priceChartDataValues),
            dailyGasPriceValues: transactions.map(entry => entry.dailyGasPriceValues),
            avgGasPriceValues: transactions.map(entry => isNaN(entry.avgGasPriceValues) ? 0 : entry.avgGasPriceValues),
            blockCount: transactions.map(entry => entry.blocksAndRewardsChartValues),
            totalReward: transactions.map(entry => entry.totalReward),
            transactionFee:transactions.map(entry=>entry.transactionFee)

        };

        res.status(200).json(chart);  
    } catch (error) {
        console.error(error);
        next(error);
    }
};








//ACCOUNTS

const accounts = async (req, res, next) => {
    try {
        let page = req.query.page || 1;
        let limit = parseInt(req.query.limit, 10) || 10;
        let sortOrder = req.query.order === 'asc' ? 1 : -1



        const totalTxnAggregate = await Transactions.aggregate([
            { $group: { _id: null, count: { $sum: 1 } } }
        ]);

        const totalTxn = totalTxnAggregate.length > 0 ? totalTxnAggregate[0].count : 0;

        const holdersAggregate = await Holders.aggregate([
            {
                $sort: { "balance": sortOrder }
            },
            {
                $skip: parseInt((page - 1) * limit)
            },
            {
                $limit: limit
            }
        ]);

        const holders = holdersAggregate.map(holder => holder.address);

        const transactionsAggregate = await Transactions.aggregate([
            {
                $match: {
                    $or: [{ from: { $in: holders } }, { to: { $in: holders } }]
                }
            },
            {
                $group: {
                    _id: "$from",
                    totalTransactions: { $sum: 1 }
                }
            }
        ]);

        const holdersWithTransactions = holdersAggregate.map(holder => {
            const transactionData = transactionsAggregate.find(data => data._id === holder.address) || { totalTransactions: 0 };

            const transactionPercentage = ((transactionData.totalTransactions / totalTxn) * 100).toFixed(2);

            return {
                ...holder,
                totalTransactions: transactionData.totalTransactions,
                transactionPercentage
            };
        });

        const accountHolder = await Holders.find({}).countDocuments()

        res.status(200).json({ accountHolder, holders: holdersWithTransactions });
    } catch (error) {
        console.error(error);
        next(error);
    }
};






//BLOCKS




const blocks = async (req, res, next) => {
    try {
        let { page = 1, limit = 10 } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        let countBlocks = await Transactions.distinct('blockNumber');
        let uniqueBlockNumbers = new Set();
        let blocksWithTransactions = [];
        let skipCount = 0;

        while (blocksWithTransactions.length < limit && skipCount < countBlocks.length) {
            const blocksData = await Transactions.find({}, 'blockNumber createdAt value from gasUsed')
                .sort({ updatedAt: -1 })
                .limit(limit - blocksWithTransactions.length)
                .skip(parseInt((page - 1) * limit) + skipCount);

            for (const block of blocksData) {
                if (!uniqueBlockNumbers.has(block.blockNumber)) {
                    uniqueBlockNumbers.add(block.blockNumber);

                    const blocksData = await Transactions.find({ blockNumber: block.blockNumber }, 'createdAt value gasUsed')
                    const totalValue = blocksData.reduce((acc, transaction) => acc + parseFloat(transaction.value), 0);
                    const totalGasUsed = blocksData.reduce((acc, transaction) => acc + parseFloat(transaction.gasUsed), 0);
                    let blocksDataCount = blocksData.length;
                    const elapsedTime = getElapsedTime(block.createdAt)
                    blocksWithTransactions.push({ ...block.toObject(), elapsedTime, totalGasUsed, totalValue, blocksDataCount });
                }
            }

            skipCount += limit;
        }

        res.status(200).json({ countBlocks: countBlocks.length, blocks: blocksWithTransactions });
    } catch (error) {
        console.error(error);
        next(error);
    }
};






// const blockDetailByBlockNumber = async (req, res, next) => {
//     try {
//         const blockNumber = req.params.blocks;

//         // Find the block details
//         const detailsOfSingleBlock = await Transactions.findOne({ blockNumber });
//         if (!detailsOfSingleBlock) {
//             return res.status(404).json({ message: "Block not found for the given block number" });
//         }

//         // Find all transactions associated with the block number
//         const blockTransactions = await Transactions.find({ blockNumber });
//         let blockCount = blockTransactions.length
//         // Include transactions in the response
//         const response = {
//             detailsOfSingleBlock: detailsOfSingleBlock.toObject(),
//             blockCount,
//             blockTransactions: blockTransactions.map(transaction => transaction.toObject())

//         };

//         res.status(200).json(response);
//     } catch (error) {
//         console.error(error);
//         next(error);
//     }
// };



const blockDetailByBlockNumber = async (req, res, next) => {
    try {
        const blockNumber = req.params.blocks;

        const detailsOfSingleBlock = await web3.eth.getBlock(blockNumber, true);

        if (!detailsOfSingleBlock) {
            return res.status(404).json({ message: "Block not found for the given block number" });
        }

        // Convert BigInt values to strings
        const blockDetailsStringified = JSON.parse(JSON.stringify(detailsOfSingleBlock, (key, value) => {
            if (typeof value === 'bigint') {
                return value.toString();
            }
            return value;
        }));

        const blockTransactions = await Transactions.find({ blockNumber });
        let blockCount = blockTransactions.length;

        const response = {
            detailsOfSingleBlock: {
                ...blockDetailsStringified,
                blockCount,
            },
            blockTransactions: blockTransactions.map(transaction => transaction.toObject()),
        };

        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        next(error);
    }
};




const contactquery = async (req, res, next) => {
    try {
        const { email, name, subject, message } = req.body
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" })
        }

        const newContactQuery = new ContactQuery({
            user: user._id,
            email,
            name,
            subject,
            message
        })

        await newContactQuery.save()
        await sendQuerySubmissionEmail(name, email, "general Inquiry")
        res.status(200).json({ newContactQuery, message: "Contact query saved successfully" })
    } catch (error) {
        console.error(error);
        next(error)
    }
}

module.exports = {
    tokenTransaction,
    getTransactionForChart,
    contactquery,
    accounts,
    blocks,
    blockDetailByBlockNumber
}
