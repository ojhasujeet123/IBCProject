const Transactions = require('../models/transactions.model')
const User = require('../models/user.model')
const ContactQuery = require('../models/query.model')
const Holders = require('../models/holder.model')
const { sendQuerySubmissionEmail } = require('../utils/Email')



//token transaction
const tokenTransaction = async (req, res, next) => {
    try {
        // const blockNumber = req.params.blockId
        let contractTranasaction = await Transactions.find({ 'contractAddress': { $ne: null } }).sort({ "_id": 1 })
        let contractTransactionCount = await Transactions.find({ 'contractAddress': { $ne: null } }).countDocuments({})
        if (!contractTranasaction) {
            return res.atatus(400).json({ message: "Token transactions not found of this block number" })
        }
        res.status(200).json({ contractTransactionCount, contractTranasaction })
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



//Chart Data
const getTransactionForChart = async (req, res, next) => {
    try {
        const transactions = await Transactions.find({}).sort({ timeStamp: 1 });

        const chartData = calculateChartData(transactions, keyExtractor, (prevValue, value) => (prevValue || 0) + 1);
        const priceChartData = calculateChartData(transactions, keyExtractor, (prevValue, value) => (prevValue || 0) + value / 83);
        const dailyGasPrice = calculateChartData(transactions, keyExtractor, (prevValue, value) => (prevValue || 0) + value / 83);
        const avgGasPriceValues = calculateChartData(transactions, keyExtractor, (prevValue, gasPrice) => {
            if (!prevValue) {
                prevValue = { totalGasPrice: 0, transactionCount: 0 };
            }
            const gasPriceGwei = gasPrice / 1e9;
            prevValue.totalGasPrice += gasPriceGwei;
            prevValue.transactionCount++;
            return prevValue;
        });

        const chartLabels = Object.keys(chartData);
        const chartValues = Object.values(chartData);
        const priceChartDataValues = Object.values(priceChartData);
        const dailyGasPriceValues = Object.values(dailyGasPrice);
        const avgGasPriceValuesList = Object.keys(avgGasPriceValues).map(monthKey => {
            const average = avgGasPriceValues[monthKey].totalGasPrice / avgGasPriceValues[monthKey].transactionCount;
            return isNaN(average) ? 0 : average;
        });

        res.status(200).json({ chartLabels, chartValues, priceChartDataValues, avgGasPriceValues: avgGasPriceValuesList, dailyGasPriceValues });
    } catch (error) {
        console.error(error);
        next(error);
    }
};





const accounts = async (req, res, next) => {
    try {
        let page = req.query.page || 1;
        let limit = req.query.limit || 10;

        let accountHolder = await Holders.find({}).countDocuments();
        let holders = await Holders.find({}).sort({ "balance": -1 }).limit(limit).skip(parseInt((page - 1) * limit));

        // Fetch total transactions for each holder's address
        let holdersWithTransactions = await Promise.all(
            holders.map(async (holder) => {
                const transactions = await Transactions.find({ $or: [{ from: holder.address }, { to: holder.address }] });
                const totalTransactions = transactions ? transactions.length : 0;

                //calculate transaction percentage
                const transactionPercentage = ((totalTransactions / accountHolder) * 100).toFixed(2)

                return { ...holder.toObject(), totalTransactions, transactionPercentage };
            })
        );

        res.status(200).json({ accountHolder, holders: holdersWithTransactions });
    } catch (error) {
        console.error(error);
        next(error);
    }
}


const blocks=async(req,res,next)=>{
    try {
        let page = req.query.page || 1;
        let limit = req.query.limit ||10;

        let countBlocks=await Transactions.find({}).countDocuments();
        let blocks= await Transactions.find({}).select('blockNumber createdAt value').limit(limit).skip(parseInt((page - 1) * limit));
        let blocksWithTransactions=await Promise.all(
            blocks.map(async(block)=>{
                const blocksData=await Transactions.find({blockNumber:block.blockNumber})
                const totalBlocksData=blocksData ? blocksData.length:0
                return {...block.toObject(),totalBlocksData}
            })
        );
        res.status(200).json({countBlocks,blocks:blocksWithTransactions})
    } catch (error) {
        console.error(error);
        next(error)
    }
}
// const blocks = async (req, res, next) => {
//     try {
//         let page = req.query.page || 1;
//         let limit = req.query.limit || 10;

//         let countBlocks = await Transactions.find({}).countDocuments();
//         let blocks = await Transactions.find({}).select('blockNumber createdAt value').limit(limit).skip(parseInt((page - 1) * limit));
//         let blocksWithTransactions = await Promise.all(
//             blocks.map(async (block) => {
//                 const blocksData = await Transactions.find({ blockNumber: block.blockNumber })
//                     .select('transactionData'); // Assuming 'transactionData' is the field in your model containing transaction information
//                 const totalBlocksData = blocksData ? blocksData.length : 0;
//                 return { ...block.toObject(), totalBlocksData, transactions: blocksData };
//             })
//         );
//         res.status(200).json({ countBlocks, blocks: blocksWithTransactions });
//     } catch (error) {
//         console.error(error);
//         next(error);
//     }

// }

const blockDetailByBlockNumber = async (req, res, next) => {
    try {
        const blockNumber = req.params.blocks;

        // Find the block details
        const detailsOfSingleBlock = await Transactions.findOne({ blockNumber });
        if (!detailsOfSingleBlock) {
            return res.status(404).json({ message: "Block not found for the given block number" });
        }

        // Find all transactions associated with the block number
        const blockTransactions = await Transactions.find({ blockNumber });

        // Include transactions in the response
        const response = {
            detailsOfSingleBlock: detailsOfSingleBlock.toObject(),
            blockTransactions: blockTransactions.map(transaction => transaction.toObject())

        };

        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        next(error);
    }
};


// const blockDetailByBlockNumber= async(req,res,next)=>{
//     try{
//     const detailsOfSingleBlock = await Transactions.findOne({ blockNumber: req.params.blocks });
//         console.log(detailsOfSingleBlock);
//     if (!detailsOfSingleBlock){
//         return res.status(404).json({ message: "Transaction not found for the given hash" });
//     }

//     res.status(200).json({ detailsOfSingleBlock });
// } catch (error) {
//     console.error(error);
//     next(error);
// }
// }








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