const User = require('../models/user');

exports.get_all_users = (req, res, next) => {
    User.find().exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(error => res.status(500).json({
            message: error.message
        }));
};


exports.get_user_by_id = (req, res, next) => {
    const id = req.params.userId;

    User.findById(id).exec()
        .then(result => {
            if (result) {
                res.status(200).json(result)
            } else {
                res.status(404).json({
                    message: "Object not found!"
                })
            }

        })
        .catch(error => res.status(500).json({
            message: error.message
        }));
};


exports.create_user = (req, res, next) => {
    const user = new User({
        _id: mongoose.Types.ObjectId(),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        age: req.body.age
    })

    user.save().then(result => {
        res.status(200).json({
            result: result
        })
    }).catch(error => {
        res.status(500).json({
            error: error
        })
    });
};

exports.update_user = (req, res, next) => {
    const id = req.params.userId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    User.update({ _id: id }, { $set: updateOps }).exec()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(error => res.status(500).json({
            error: error
        }));
};

exports.delete_user = (req, res, next) => {
    const id = req.params.userId;
    User.remove({ _id: id }).exec()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(error => next(error));
};