const BillingCycle = require('./billingCycle')
const errorHandle = require('../common/errorHandle')

BillingCycle.methods(['get', 'post', 'put', 'delete'])
BillingCycle.updateOptions({new: true, runValidators: true})
BillingCycle.after('post', errorHandle).after('put', errorHandle) 

// Correção do método GET, devido a versão do Node-Restfun...
BillingCycle.route('get', (req, res, next) => {
    BillingCycle.find({}, (err, docs) => {
        if (!err){
            res.json(docs)

        } else {

            res.status(500).json({errors: [error]})
        }
    })
})

// Mapeando contador de registros...
BillingCycle.route('count', (req, res, next) => {
    BillingCycle.count((error, value) => {
        if (error) {
            res.status(500).json({errors: [error]})

        } else {
            res.json({value})

        }
    })
})

// Somatoria de todos os Débitos e Créditos...
BillingCycle.route('summary', (req, res, next) => {
    BillingCycle.aggregate([{ 
        $project: {credit: {$sum: "$credits.value"}, debt: {$sum: "$debts.value"}} 
    }, { 
        $group: {_id: null, credit: {$sum: "$credit"}, debt: {$sum: "$debt"}}
    }, { 
        $project: {_id: 0, credit: 1, debt: 1}
    }], (error, result) => {
        if(error) {
            res.status(500).json({errors: [error]})
        } else {
            res.json(result[0] || {credit: 0, debt: 0})
        }
    })
})

module.exports = BillingCycle