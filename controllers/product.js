const Sauce = require('../models/Sauce');
const User = require('../models/User');
const fs = require('fs');


/* GET ALL */
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
}

/* GET ONE BY ID */
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

/* POST ONE / ADD ONE */
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistr�e !' }))
        .catch(error => res.status(400).json({ error }));
};

/* UPDATE ONE */
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifi�e !' }))
        .catch(error => res.status(400).json({ error }));
};

/* DELETE ONE */
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprim�e !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

/* LIKE DISLIKE ONE */
exports.likeSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        console.log(sauce);
        if (req.body.like == 1) {
            sauce.usersLiked.push(req.body.userId);
            Sauce.updateOne({ _id: req.params.id }, { likes: ++sauce.likes, usersLiked: sauce.usersLiked })
                    .then(() => res.status(200).json({ message: 'Sauce Likée !' }))
                    .catch(error => res.status(400).json({ error }));
        } else if (req.body.like == 0) {
            if (sauce.usersLiked.find(userId => userId == req.body.userId) != undefined) {
                var Liked = sauce.usersLiked.filter(userId => userId != req.body.userId);
                Sauce.updateOne({ _id: req.params.id }, { likes: --sauce.likes, usersLiked: Liked })
                    .then(() => res.status(200).json({ message: 'Like retiré !' }))
                    .catch(error => res.status(400).json({ error }));
            } else {
                var Disliked = sauce.usersDisliked.filter(userId => userId != req.body.userId);
                Sauce.updateOne({ _id: req.params.id }, { likes: --sauce.dislikes, usersDisliked: Disliked })
                    .then(() => res.status(200).json({ message: 'Dislike retiré !' }))
                    .catch(error => res.status(400).json({ error }));
            }
        } else if (req.body.like == -1) {
            sauce.usersDisliked.push(req.body.userId);
            Sauce.updateOne({ _id: req.params.id }, { dislikes: ++sauce.dislikes, usersDisliked: sauce.usersDisliked })
                .then(() => res.status(200).json({ message: 'Sauce Dislikée !' }))
                .catch(error => res.status(400).json({ error }));
        }
           
    })
/*
Définit le statut "j'aime" pour userID fourni.
Si j'aime = 1, l'utilisateur aime la sauce.
Si j'aime = 0, l'utilisateur annule ce qu'il aime ou ce qu'il n'aime pas.
Si j'aime = -1, l'utilisateur n'aime pas la sauce.
L'identifiant de l'utilisateur doit être ajouté ou supprimé du tableau approprié,
en gardant une trace de ses préférences et en l'empêchant d'aimer ou de ne pas aimer la même sauce plusieurs fois.
Nombre total de "j'aime" et de "je n'aime pas" à mettre à jour avec chaque "j'aime".
*/
};