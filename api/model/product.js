const mongoose = require('mongoose');

var productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    price: { type: Number, required: true }
});

productSchema.methods.findSimilarPrices = function(cb) {
    return this.model('Product').find({ price: this.price }, cb);
};

module.exports = mongoose.model('Product', productSchema);