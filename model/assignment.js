let mongoose = require('mongoose');
let Schema = mongoose.Schema;
var aggregatePaginate = require('mongoose-aggregate-paginate-v2');

let AssignmentSchema = Schema({
    id: Number,
    dateDeRendu: Date,
    nom: String,
    rendu: Boolean
});

// Transformer pour s'assurer que l'id est bien retourné
AssignmentSchema.set('toJSON', {
    transform: function(doc, ret) {
        // S'assurer que l'id existe
        if (!ret.id && ret._id) {
            ret.id = ret._id;
        }
        return ret;
    }
});

AssignmentSchema.plugin(aggregatePaginate);

// C'est à travers ce modèle Mongoose qu'on pourra faire le CRUD
module.exports = mongoose.model('Assignment', AssignmentSchema);
