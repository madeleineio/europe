/**
 * Created by nmondon on 31/10/2014.
 */

exports.index = function(req, res){
    res.render('index');
};

exports.partials = function(req, res){
    var name = req.params.name;
    res.render('partials/' + name);
};