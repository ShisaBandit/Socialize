var models = require('../models/models');
var Blog = models.Blog;
var User = models.User;
var Update = models.Update;
var check = require('validator').check,
    sanitize = require('validator').sanitize;
var nodemailer = require('nodemailer');
var smtpTransport = nodemailer.createTransport("sendmail");

exports.checkAuthed = function (req, res) {
    User.find({_id: req.session.passport.user}, function (err, user) {
        if (err)console.log(err);
        console.log(user[0].username);
        //noinspection MagicNumberJS
        return res.send(user[0].username, 200);
    })
};

exports.checkProfileAuthed = function (req, res,next) {
    User.findOne({_id: req.session.passport.user}, function (err, users) {
        var matchfound = false;
        if (err)console.log(err);
            for(var x = 0;x < users.profiles.length;x++){
                console.log(users.profiles[x]._id);
                if(req.params.id == users.profiles[x]._id){
                    matchfound = true;
                }
            }
        if(matchfound == true){
            return next();
        }else{
            return res.send({fail:'noaccess'}, 200);
        }

    })
}

//update docs route
exports.lastUpdateSame = function (req, res) {
    Update.findOne({}).lean().exec(function (err, update) {
        var returnResult = [];
        if (err)console.log(err);
        if (update == null) {
            var updateCreate = new Update();
            updateCreate.save(function (err, newUpdate) {
                if (err)console.log(err);
                returnResult.push(newUpdate);
                res.end(JSON.stringify(returnResult));
            });
        } else {
            returnResult.push(update);
            res.end(JSON.stringify(returnResult));
        }
    })
};

exports.lastUpdateSameId = function (req, res) {
    var dateFromClient = req.params.date;
    var response = [];

    Update.findOne({}, function (err, update) {
        var obj = {};
        if (update == null) {
            obj.result = "false";
        } else {
            if (dateFromClient == update.lastUpdate.getTime()) {
                obj.result = "false";
            } else {
                obj.lastUpdate = update.lastUpdate;
                obj.result = "true";
            }
        }
        response.push(obj);
        return res.end(JSON.stringify(response));
    });

};

exports.logout = function (req, res) {
    req.logout();
    //noinspection MagicNumberJS
    res.send('loggedout', 410);
};

exports.loginAuth = function (req, res) {
    User.findOne({'username': req.body.username, 'password': req.body.password, admin: {$in: ['superuser', 'admin']}},
        function (err, administrator) {
        if (err)console.log(err);
        if (administrator) {
            req.session.loggedIn = true;
        } else {
            req.session.loggedIn = false;
        }

        return res.send(200);
    });

};

exports.register = function (req, res) {
    var errorMessage = [];
    var userCount = 0,
        adminCount = 0,
        username = req.body.username,
        password = req.body.password,
        firstname = req.body.firstName,
        lastname = req.body.lastName,
        email = req.body.email,
        dob = req.body.dob;

    var validEmail = true;
    var validDob = true;
        //var checkObject = check(email).len(6,64).isEmail();
    try{
        check(email,'not a valid email').len(6,64).isEmail();
    }catch(e){
        console.log(e.message);
        validEmail = false;
    }

    try{
        check(dob).isDate();
    }catch (e)
    {
        validDob = false;
    }

        minUsernameLength = 5,
        maxUsernameLength = 16,
        minPasswordLength = 5,
        maxPasswordLength = 16
        minfirstnameLength = 0,
        minlastnameLength = 0,
        maxfirstNameLength = 15,
        maxlastNameLength = 15;
    if(req.body.betacode == "hardcoded"){
        User.count({username: username}, function (err, count) {
            if (err)console.log(err);
            userCount = count;
            //then get admin count
            User.count({username: username, admin: {$in: ['superuser', 'admin']}}, function (err, count) {
                if (err)console.log(err);
                adminCount = count;
                //then check count
                //TODO:redo this section of code in promises
                //username checks
                if (
                    userCount < 1 && adminCount < 1 &&
                        username != undefined &&
                        username != "" &&
                        username.length > minUsernameLength &&
                        username.length < maxUsernameLength &&
                        //password checks
                        password != undefined &&
                        password.length > minPasswordLength &&
                        password.length < maxPasswordLength &&
                        password != username &&
                        //firstname checks
                        firstname != undefined &&
                        firstname.length > minfirstnameLength &&
                        firstname.length < maxfirstNameLength &&
                        //lastname checks
                        lastname != undefined &&
                        lastname.length > minlastnameLength &&
                        lastname.length < maxlastNameLength &&
                        validEmail == true &&
                        validDob == true


                    ) {
                    var user = new User(req.body);

                    user.gravatar = calcMD5(user.email);
                    user.lost = req.body.groupcode;

                    user.save(function (err) {
                        if (err){
                            console.log(err);
                            console.log(err.path);
                            return res.end(JSON.stringify({'fail': errorMessage}));

                        }
                        //register a new wall if one was attached to request
                        var blog = new Blog({
                            firstName:req.body.firstName,
                            lastName:req.body.lastName,
                            subgroup:req.body.subgroup

                        })
                        SendConfirmationMail(email);
                        return res.end(JSON.stringify({'success': 'true'}));
                    });
                } else {


                    //uername length check
                    if (username == undefined || username == "") {
                        errorMessage.push('Please enter a username');
                    }else if ( username.length < minUsernameLength) {
                        errorMessage.push('Username must be longer than ' + minUsernameLength);
                    }else if (username.length > maxUsernameLength) {
                        errorMessage.push('Username must be shorter than ' + maxUsernameLength);
                    }
                    //password check
                    if (password == undefined || password == "") {
                        errorMessage.push('Please enter a password');
                    }else if ( password.length < minPasswordLength) {
                        errorMessage.push('Password must be longer than ' + minPasswordLength);
                    }else if (password.length > maxPasswordLength) {
                        errorMessage.push('Password must be shorter than ' + maxPasswordLength);
                    }

                    if (password == username) {
                        errorMessage.push('Password can not be the same as username');
                    }

                    if (userCount >= 1 || adminCount >= 1) {
                        errorMessage.push('username already taken');
                    }

                    if (firstname == undefined || firstname == "") {
                        errorMessage.push('Please enter a first name');
                    }else if (firstname.length < minfirstnameLength) {
                        errorMessage.push('First name must be longer than ' + minfirstnameLength);
                    }else if (firstname.length > maxfirstNameLength) {
                        errorMessage.push('First name must be shorter than ' + maxPasswordLength);
                    }

                    if (lastname == undefined || lastname == "") {
                        errorMessage.push('Please enter a last name');
                    }else if (lastname.length < minlastnameLength) {
                        errorMessage.push('Last name must be longer than ' + minlastnameLength);
                    }else if (lastname.length > maxlastNameLength) {
                        errorMessage.push('Last name must be shorter than ' + maxlastNameLength);
                    }

                    if(!validEmail)
                    {
                        errorMessage.push('Not a valid email')
                    }
                    if(!validDob){
                        errorMessage.push('Not a valid Date')
                    }
                    if (errorMessage.length == 0 || errorMessage === undefined) {
                        errorMessage.push('unknown error');
                    }
                    return res.end(JSON.stringify({'fail': errorMessage}));
                }
            });
        });
    }
    else{
        errorMessage.push('Beta code is incorrect');
        return res.end(JSON.stringify({'fail':errorMessage}));
    }



};

function SendConfirmationMail(to){
    var mailOptions = {
        from:"Welcome@AngelsOfEureka.org",
        to:to,
        subject:"Welcome to AngelsOfEureka.org",
        text:"This is a confirmation email please click this link to confirm you want to register",
        html:"<p>BOLDNESS</p>"
    }
    smtpTransport.sendMail(mailOptions,function(error,response){
        if(error){
            console.log(error);
            console.log("problems sending mail")
        }else{
            console.log("message sent")
        }
    })
}


/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Copyright (C) Paul Johnston 1999 - 2000.
 * Updated by Greg Holt 2000 - 2001.
 * See http://pajhome.org.uk/site/legal.html for details.
 */

/*
 * Convert a 32-bit number to a hex string with ls-byte first
 */
var hex_chr = "0123456789abcdef";
function rhex(num) {
    str = "";
    for (j = 0; j <= 3; j++)
        str += hex_chr.charAt((num >> (j * 8 + 4)) & 0x0F) +
            hex_chr.charAt((num >> (j * 8)) & 0x0F);
    return str;
}

/*
 * Convert a string to a sequence of 16-word blocks, stored as an array.
 * Append padding bits and the length, as described in the MD5 standard.
 */
function str2blks_MD5(str) {
    nblk = ((str.length + 8) >> 6) + 1;
    blks = new Array(nblk * 16);
    for (i = 0; i < nblk * 16; i++) blks[i] = 0;
    for (i = 0; i < str.length; i++)
        blks[i >> 2] |= str.charCodeAt(i) << ((i % 4) * 8);
    blks[i >> 2] |= 0x80 << ((i % 4) * 8);
    blks[nblk * 16 - 2] = str.length * 8;
    return blks;
}

/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */
function add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
}

/*
 * Bitwise rotate a 32-bit number to the left
 */
function rol(num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt));
}

/*
 * These functions implement the basic operation for each round of the
 * algorithm.
 */
function cmn(q, a, b, x, s, t) {
    return add(rol(add(add(a, q), add(x, t)), s), b);
}
function ff(a, b, c, d, x, s, t) {
    return cmn((b & c) | ((~b) & d), a, b, x, s, t);
}
function gg(a, b, c, d, x, s, t) {
    return cmn((b & d) | (c & (~d)), a, b, x, s, t);
}
function hh(a, b, c, d, x, s, t) {
    return cmn(b ^ c ^ d, a, b, x, s, t);
}
function ii(a, b, c, d, x, s, t) {
    return cmn(c ^ (b | (~d)), a, b, x, s, t);
}

/*
 * Take a string and return the hex representation of its MD5.
 */
function calcMD5(str) {
    x = str2blks_MD5(str);
    a = 1732584193;
    b = -271733879;
    c = -1732584194;
    d = 271733878;

    for (i = 0; i < x.length; i += 16) {
        olda = a;
        oldb = b;
        oldc = c;
        oldd = d;

        a = ff(a, b, c, d, x[i + 0], 7, -680876936);
        d = ff(d, a, b, c, x[i + 1], 12, -389564586);
        c = ff(c, d, a, b, x[i + 2], 17, 606105819);
        b = ff(b, c, d, a, x[i + 3], 22, -1044525330);
        a = ff(a, b, c, d, x[i + 4], 7, -176418897);
        d = ff(d, a, b, c, x[i + 5], 12, 1200080426);
        c = ff(c, d, a, b, x[i + 6], 17, -1473231341);
        b = ff(b, c, d, a, x[i + 7], 22, -45705983);
        a = ff(a, b, c, d, x[i + 8], 7, 1770035416);
        d = ff(d, a, b, c, x[i + 9], 12, -1958414417);
        c = ff(c, d, a, b, x[i + 10], 17, -42063);
        b = ff(b, c, d, a, x[i + 11], 22, -1990404162);
        a = ff(a, b, c, d, x[i + 12], 7, 1804603682);
        d = ff(d, a, b, c, x[i + 13], 12, -40341101);
        c = ff(c, d, a, b, x[i + 14], 17, -1502002290);
        b = ff(b, c, d, a, x[i + 15], 22, 1236535329);

        a = gg(a, b, c, d, x[i + 1], 5, -165796510);
        d = gg(d, a, b, c, x[i + 6], 9, -1069501632);
        c = gg(c, d, a, b, x[i + 11], 14, 643717713);
        b = gg(b, c, d, a, x[i + 0], 20, -373897302);
        a = gg(a, b, c, d, x[i + 5], 5, -701558691);
        d = gg(d, a, b, c, x[i + 10], 9, 38016083);
        c = gg(c, d, a, b, x[i + 15], 14, -660478335);
        b = gg(b, c, d, a, x[i + 4], 20, -405537848);
        a = gg(a, b, c, d, x[i + 9], 5, 568446438);
        d = gg(d, a, b, c, x[i + 14], 9, -1019803690);
        c = gg(c, d, a, b, x[i + 3], 14, -187363961);
        b = gg(b, c, d, a, x[i + 8], 20, 1163531501);
        a = gg(a, b, c, d, x[i + 13], 5, -1444681467);
        d = gg(d, a, b, c, x[i + 2], 9, -51403784);
        c = gg(c, d, a, b, x[i + 7], 14, 1735328473);
        b = gg(b, c, d, a, x[i + 12], 20, -1926607734);

        a = hh(a, b, c, d, x[i + 5], 4, -378558);
        d = hh(d, a, b, c, x[i + 8], 11, -2022574463);
        c = hh(c, d, a, b, x[i + 11], 16, 1839030562);
        b = hh(b, c, d, a, x[i + 14], 23, -35309556);
        a = hh(a, b, c, d, x[i + 1], 4, -1530992060);
        d = hh(d, a, b, c, x[i + 4], 11, 1272893353);
        c = hh(c, d, a, b, x[i + 7], 16, -155497632);
        b = hh(b, c, d, a, x[i + 10], 23, -1094730640);
        a = hh(a, b, c, d, x[i + 13], 4, 681279174);
        d = hh(d, a, b, c, x[i + 0], 11, -358537222);
        c = hh(c, d, a, b, x[i + 3], 16, -722521979);
        b = hh(b, c, d, a, x[i + 6], 23, 76029189);
        a = hh(a, b, c, d, x[i + 9], 4, -640364487);
        d = hh(d, a, b, c, x[i + 12], 11, -421815835);
        c = hh(c, d, a, b, x[i + 15], 16, 530742520);
        b = hh(b, c, d, a, x[i + 2], 23, -995338651);

        a = ii(a, b, c, d, x[i + 0], 6, -198630844);
        d = ii(d, a, b, c, x[i + 7], 10, 1126891415);
        c = ii(c, d, a, b, x[i + 14], 15, -1416354905);
        b = ii(b, c, d, a, x[i + 5], 21, -57434055);
        a = ii(a, b, c, d, x[i + 12], 6, 1700485571);
        d = ii(d, a, b, c, x[i + 3], 10, -1894986606);
        c = ii(c, d, a, b, x[i + 10], 15, -1051523);
        b = ii(b, c, d, a, x[i + 1], 21, -2054922799);
        a = ii(a, b, c, d, x[i + 8], 6, 1873313359);
        d = ii(d, a, b, c, x[i + 15], 10, -30611744);
        c = ii(c, d, a, b, x[i + 6], 15, -1560198380);
        b = ii(b, c, d, a, x[i + 13], 21, 1309151649);
        a = ii(a, b, c, d, x[i + 4], 6, -145523070);
        d = ii(d, a, b, c, x[i + 11], 10, -1120210379);
        c = ii(c, d, a, b, x[i + 2], 15, 718787259);
        b = ii(b, c, d, a, x[i + 9], 21, -343485551);

        a = add(a, olda);
        b = add(b, oldb);
        c = add(c, oldc);
        d = add(d, oldd);
    }
    return rhex(a) + rhex(b) + rhex(c) + rhex(d);
}
