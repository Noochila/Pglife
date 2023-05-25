require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const session = require("express-session");
const passport = require("passport");
const mongooseLocal = require("passport-local-mongoose");

let position = 0;
mongoose.connect("mongodb://127.0.0.1:27017/pglifeDB");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }

}));
app.use(passport.initialize());
app.use(passport.session());

const pgSchema = mongoose.Schema({
    pg_name: String,
    pg_address: String,
    price: String,
    rating: String,
    type: String,
    about: String,
    cleaning: String,
    foodQuality: String,
    Safety: String,
    review: String,
    review_people: []
});
const userSchema = mongoose.Schema({
    username: String,
    number: Number,
    email: String,
    password: String,
    college: String,
    gender: String
});
userSchema.plugin(mongooseLocal, { usernameField: "email" });
let demoUser = {
    name: "",
    email: "",
    phone: "",
    college: ""
}

const mumbai = mongoose.model("mumbai", pgSchema);
const delhi = mongoose.model("delhi", pgSchema);
const banglore = mongoose.model("banglore", pgSchema);
const hyderbad = mongoose.model("hyderbad", pgSchema);
const user = mongoose.model("people", userSchema);


passport.use(user.createStrategy());

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());



app.get("/", function (req, res) {
    if (position == 1) {

        res.render("pglife", { title: "Home", renderUser: demoUser, position: position });
    } else {
        res.render("pglife", { title: "Home", position: position });
    }

});
app.get("/property_detail", function (req, res) {

    if (position == 1) {


        res.render("property_detail", { title: "property_details", renderUser: demoUser, position: position });
    } else {
        res.render("property_detail", { title: "property_details", position: position });

    }





});
app.get("/mumbai", function (req, res) {
    mumbai.find({}, function (err, item) {
        if (!err) {
            if (item) {

                if (position == 1) {

                    res.render("mumbai", { title: "Mumbai", mumbai: item, renderUser: demoUser, position: position });


                } else {
                    res.render("mumbai", { title: "mumbai", position: position, mumbai: item });

                }



            }
        }
    })

});


app.get("/delhi", function (req, res) {
    delhi.find({}, function (err, item) {
        if (!err) {
            if (item) {

                if (position == 1) {

                    res.render("delhi", { title: "Delhi", delhi: item, renderUser: demoUser, position: position });


                } else {
                    res.render("delhi", { title: "Delhi", delhi: item, position: position });

                }



            }
        }
    })

});
app.get("/banglore", function (req, res) {




    if (position == 1) {

        res.render("banglore", { title: "Banglore", renderUser: demoUser, position: position });


    } else {
        res.render("banglore", { title: "Banglore", position: position });

    }




});
app.get("/hyderbad", function (req, res) {

    if (position == 1) {

        res.render("hyderbad", { title: "Hyderbad", renderUser: demoUser, position: position });


    } else {
        res.render("hyderbad", { title: "Hyderbad", position: position });

    }
});

app.post("/", function (req, res) {
    let city = _.toLower(req.body.city);
    if (city == "delhi") {
        res.redirect("/delhi");
    }
    else if (city == "banglore") {
        res.redirect("/banglore");
    }
    else if (city == "mumbai") {
        res.redirect("/mumbai");
    }
    else if (city == "hyderbad") {
        res.redirect("/hyderbad");
    }
    else {
        res.redirect("/")
    }

});
app.post("/property_details", function (req, res) {
    let city = _.upperFirst(req.body.titleofpg);
    let id = req.body.id;
    if (city == "Delhi") {
        delhi.find({ _id: id }, function (err, founditem) {


            if (position == 1) {

                res.render("property_detail", { title: city, renderUser: demoUser, position: position, founditem: founditem });


            } else {
                res.render("property_detail", { title: city, position: position, founditem: founditem });

            }




        })
    }
    else if (city == "Mumbai") {
        mumbai.find({ _id: id }, function (err, founditem) {
            if (position == 1) {

                res.render("property_detail", { title: city, renderUser: demoUser, position: position, founditem: founditem });


            } else {
                res.render("property_detail", { title: city, position: position, founditem: founditem });

            }

        })

    }
    else if (city == "Banglore") {

        banglore.find({ _id: id }, function (err, founditem) {

            if (position == 1) {

                res.render("property_detail", { title: city, renderUser: demoUser, position: position, founditem: founditem });


            } else {
                res.render("property_detail", { title: city, position: position, founditem: founditem });

            }
        })
    }
    else if (city == "Hyderbad") {
        hyderbad.find({ _id: id }, function (err, founditem) {
            if (position == 1) {

                res.render("property_detail", { title: city, renderUser: demoUser, position: position, founditem: founditem });


            } else {
                res.render("property_detail", { title: city, position: position, founditem: founditem });

            }
        })

    }

});
app.get("/confirm", function (req, res) {
    if (req.isAuthenticated()) {


        position = 1;
        res.redirect("/");


    }
    else {
        res.redirect("/");
    }
});
app.get("/dashboard", function (req, res) {
    if (position == 1) {

        res.render("dashboard", { title: "Dashboard", renderUser: demoUser });
    } else {
        res.redirect("/");
    }
})
app.post("/signup", function (req, res) {
    const name = req.body.full_name;
    const phone = req.body.phone;
    const email = req.body.email;
    const password = req.body.password;
    const college = req.body.college_name;
    const gender = req.body.gender;
    demoUser = { name: name, email: email, phone: phone, college: college };

    user.register({ username: name, email: email, number: phone, college: college, gender: gender }, password, function (err, user) {
        if (err) {
            console.log(err);

        }
        else {
            passport.authenticate("local")(req, res, function (err) {
                if (err) {
                    console.log(err);
                }
                else {

                    res.redirect("/confirm");
                }
            })

        }
    });

});

app.post("/login", function (req, res) {
    const newuser = new user({ email: req.body.email, password: req.body.password })
    user.find({ email: req.body.email }, function (err, user) {
     
        demoUser = {
            name: user[0].username,
            email: user[0].email,
            phone: user[0].number,
            college: user[0].college
        }
    })
    req.login(newuser, function (err) {
        if (err) {
            console.log(err)
        }
        else
            passport.authenticate("local")(req, res, function () {
                res.redirect("/confirm")
            })
    })
});
app.get("/logout", function (req, res) {
    req.logout(function (err) {
        if (!err) {
            position = 0;
            res.redirect("/");
        }
    });

});


app.listen(3000, () => {
    console.log("servor running in port 3000")
});