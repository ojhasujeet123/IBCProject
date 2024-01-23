const Transactions = require('../models/transactions.model');

const transactionController = {
    // get transaction
    getTransaction: async (req, res, next) => {
        const page = parseInt(req.query.page) || 1;
        const limit = 3;

        try {
            const skip = (page - 1) * limit;

            //By hash
            if (req.query.hash) {
                const transactionOfSingleUser = await Transactions.findOne({ hash: req.query.hash });

                if (!transactionOfSingleUser) {
                    return res.status(404).json({ message: "Transaction not found for the given hash" });
                }

                res.status(200).json({ transactionOfSingleUser });
            }
            // By address
            else if (req.query.from && req.query.to) {
                const transactionByAddress = await Transactions.find({ $and: [{ from: req.query.from }, { to: req.query.to }] })
                if (!transactionByAddress) {
                    return res.status(404).json({ message: "Transaction not find from thr given address" })
                }

                res.status(200).json({ transactionByAddress })
            }
            //By api 
            else {
                const transactions = await Transactions.find({},{ from: 1, to: 1, hash: 1,createdAt:1, _id: 0 })
                    .skip(skip)
                    .limit(limit);

                if (!transactions || transactions.length === 0) {
                    return res.status(404).json({ message: "Transaction not exist" });
                }

                res.status(200).json({ transactions });
            }
        } catch (error) {
            console.error(error);
            next(error);
        }
    },
};

module.exports = transactionController;