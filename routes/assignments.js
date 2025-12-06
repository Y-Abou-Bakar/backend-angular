let Assignment = require('../model/assignment');

// Récupérer tous les assignments (GET)
async function getAssignments(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const aggregateQuery = Assignment.aggregate([
      { $sort: { id: -1 } }
    ]);

    const result = await Assignment.aggregatePaginate(aggregateQuery, {
      page: page,
      limit: limit
    });

    res.json({
      docs: result.docs,
      totalDocs: result.totalDocs,
      limit: result.limit,
      page: result.page,
      totalPages: result.totalPages,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
      nextPage: result.nextPage,
      prevPage: result.prevPage
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Récupérer un assignment par son id (GET)
async function getAssignment(req, res) {
  try {
    const assignmentId = parseInt(req.params.id, 10);
    const assignment = await Assignment.findOne({ id: assignmentId });
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    res.json(assignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Ajout d'un assignment (POST)
async function postAssignment(req, res) {
  try {
    // Générer automatiquement un ID unique basé sur le timestamp et un nombre aléatoire
    const newId = req.body.id || Date.now() + Math.floor(Math.random() * 1000);
    
    const assignment = new Assignment({
      id: newId,
      nom: req.body.nom,
      dateDeRendu: req.body.dateDeRendu,
      rendu: req.body.rendu
    });

    console.log('POST assignment reçu:', assignment);
    const savedAssignment = await assignment.save();
    console.log('Assignment sauvegardé avec ID:', savedAssignment.id);
    res.json(savedAssignment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Update d'un assignment (PUT)
async function updateAssignment(req, res) {
  try {
    console.log('UPDATE recu assignment:', req.body);
    console.log('Cherchant par id:', req.body.id);
    
    const assignment = await Assignment.findOneAndUpdate(
      { id: req.body.id },
      {
        nom: req.body.nom,
        dateDeRendu: req.body.dateDeRendu,
        rendu: req.body.rendu
      },
      { new: true }
    );
    
    console.log('Assignment trouve et update:', assignment);
    
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found with id: ' + req.body.id });
    }
    res.json({ message: 'updated', data: assignment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Suppression d'un assignment (DELETE)
async function deleteAssignment(req, res) {
  try {
    const assignmentId = parseInt(req.params.id, 10);
    const assignment = await Assignment.findOneAndDelete({ id: assignmentId });
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    res.json({ message: `${assignment.nom} deleted`, data: assignment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Suppression de tous les assignments (DELETE ALL)
async function deleteAllAssignments(req, res) {
  try {
    const result = await Assignment.deleteMany({});
    res.json({ message: 'All assignments deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment, deleteAllAssignments };
