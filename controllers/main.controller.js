const Transactions = require('../models/transactions.model')
const User = require('../models/user.model')
const ContactQuery = require('../models/query.model')
const Holders = require('../models/holder.model')
const { sendQuerySubmissionEmail } = require('../utils/Email')
const { getElapsedTime } = require('../utils/auth.utils')
require('dotenv').config();
const { Web3 } = require('web3')
const { set } = require('mongoose')
const web3 = new Web3(process.env.ETHEREUMNODEURL)







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













//Correct code 

const getTransactionForChart = async (req, res, next) => {
    try {
        let dateFilter = []
        const timeRange = req.query.timerange
        if (timeRange && timeRange !== "all") {
            const startDate = new Date()
            startDate.setUTCMonth(startDate.getUTCMonth() - (timeRange === '1month' ? 1 : (timeRange === '6months' ? 6 : (timeRange === '1year' ? 12 : 0))));

            dateFilter = [{ $match: { createdAt: { $gte: startDate } } }];

       
        }
        const transactions = await Transactions.aggregate([
            ...dateFilter,
            // { $sort: { createdAt: 1 } },
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
                    blocksAndRewardsChartValues: "$blockCount",
                    totalReward: "$totalReward",
                    transactionFee: { $divide: ["$totalCummulativeGasUsed", 83] }
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
            transactionFee: transactions.map(entry => entry.transactionFee)

        };

        res.status(200).json(chart);
    } catch (error) {
        console.error(error);
        next(error);
    }
};











//AVG BLOCK
const avgBlockSize = async (req, res, next) => {
    const { month, year } = req.query;

    if (!month || !year) {
        return res.status(400).json({ message: "Month and year are required." });
    }

    const startDate = new Date(`${year}-${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + 1);
    endDate.setDate(1);

    try {
        const aggregationPipeline = [
            {
                $match: {
                    createdAt: {
                        $gte: startDate,
                        $lt: endDate // Using $lt instead of $lte to exclude the end date
                    }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    blockNumbers: { $push: "$blockNumber" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }, // Sort by the formatted date in ascending order
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    blockNumbers: 1,
                    count: 1,
                }
            }
        ];

        const aggregatedData = await Transactions.aggregate(aggregationPipeline);

        const chartDataPromises = aggregatedData.map(async (data) => {
            const blocks = await Promise.all(data.blockNumbers.map(blockNumber => web3.eth.getBlock(blockNumber)));
            const totalSize = blocks.reduce((total, block) => total + BigInt(block.size), BigInt(0));
            const averageBlockSize = totalSize / BigInt(data.count);

            return {
                date: data.date,
                averageBlockSize: averageBlockSize.toString()
            };
        });

        const chartData = await Promise.all(chartDataPromises);

        res.status(200).json({ message: "Chart data fetched successfully", chartData });
    } catch (error) {
        console.error(error);
        next(error);
    }
};















//ACCOUNT

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
                $match: { balance: { $gt: 0 } } // exclude accounts with balance 0
              },
            
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

            console.log("balance------:",web3.utils.fromWei(holder.balance,"ether"));
            const transactionPercentage = ((web3.utils.fromWei(holder.balance,"ether") / 310000000) * 100).toFixed(7);
            return {
                ...holder,
                totalTransactions: transactionData.totalTransactions,
                transactionPercentage
            };
        });

        const accountHolder = await Holders.find({ balance: { $gt: 0 } }).countDocuments()
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
            const blocksData = await Transactions.find({}, 'blockNumber blockHash createdAt value from gasUsed')
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



const getBlockDetails = async (req, res, next) => {
    try {
        const blockNumber = req.params.blocks;
        const fetchTransactions = req.query.transactions === 'true';

        const detailsOfSingleBlock = await web3.eth.getBlock(blockNumber, true);

        if (!detailsOfSingleBlock) {
            return res.status(404).json({ message: "Block not found for the given block number" });
        }

        // Convert BigInt values to numbers
        const blockDetails = JSON.parse(JSON.stringify(detailsOfSingleBlock, (key, value) => {
            if (typeof value === 'bigint') {
                return Number(value);
            }
            return value;
        }));

        const blockTransactions = await Transactions.find({ blockNumber });
        const blockCount = blockTransactions.length;

        let response = {};

        if (fetchTransactions) {
        response = {
            blockTxns: blockTransactions.map(txn => {
                const txnObject = txn.toObject();
                txnObject.createdAt = getElapsedTime(txnObject.createdAt);
                return txnObject;
            }),
            blockCount,
        };
    }else {
            response = {
                detailsOfSingleBlock: {
                    ...blockDetails,
                    blockCount,
                },
            };
        }

        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        next(error);
    }
};














//CONTACT US

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
        res.status(200).json({success:true, newContactQuery, message: "Contact query saved successfully" })
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
    getBlockDetails,
    avgBlockSize
}
