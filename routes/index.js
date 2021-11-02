let express = require("express");
let router = express.Router();
let studenthousingDB = require("../db/mySQLiteDB.js");

const listingDB = require("../db/mySqliteDB.js");

// save a session for app
let session;

/* GET home page. */
router.get("/", async function (req, res) {
  console.log("Got request for /");

  const listings = await studenthousingDB.getListings();
  //const rating = await studenthousingDB.getRatings();

  session = req.session;
  if (session.userid) {
    console.log("got user " + session.userid);
    res.render("index", {
      title: "StudentHousingFinderHome",
      listings: listings,
    });
  } else
    res.render("index", {
      title: "StudentHousingFinderHome",
      listings: listings,
    });
});

// After user logs in, render page depending on owner/student status
router.post("/user", async function (req, res) {
  console.log("Got request for /user");

  // let user = req.flash("user");
  // req.flash(req.flash("user"));
  // // if (user == "") {
  // //   res.redirect("/register");
  // // }
  // console.log("got user " + user);

  const listings = await studenthousingDB.getListings();
  console.log("got listings");
  const user = await studenthousingDB.getUserByUsername(req.body.username);
  console.log("got user", user);
  const owner = await studenthousingDB.getOwnerByUsername(user);
  // const student = await studenthousingDB.getOwnerByUsername(user);

  if (req.body.password == user.password) {
    session = req.session;
    session.userid = req.body.username;
    console.log("req.session: ", req.session);
    if (owner != undefined) {
      res.render("ownerView", {
        title: "StudentHousingFinderOwnerHome",
        listings: listings,
      });
      console.log("owner session: ", req.session);
    } else {
      res.render("studentView", {
        // need to create studentView
        title: "StudentHousingFinderStudentHome",
        listings: listings,
      });
      console.log("student session: ", req.session);
    }
  } else {
    res.redirect("/");
  }
});

// logout does not work yet
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

router.get("/register", function (req, res) {
  res.render("register");
});
router.get("/owner", function (req, res) {
  res.render("owner");
});
router.get("/student", function (req, res) {
  res.render("student");
});

/* GET user registration */
router.get("/signin", function (req, res) {
  res.render("signin", { title: "Sign In" });
});

/* POST create listing. */
router.post("/listings/create", async function (req, res) {
  console.log("Got post listings/create");

  const listing = req.body;
  console.log("Got create listing", listing);

  await listingDB.createListing(listing);
  console.log("Listing created");

  res.redirect("/");
});

/* POST send message. */
router.post("/message/send", async function (req, res) {
  console.log("Got post message/send");

  const msg = req.body;
  console.log("Got create message", msg);

  await listingDB.createMessage(msg);
  console.log("Message created");

  res.redirect("/");
});

/* GET listing details. */
router.get("/listings/:listingID", async function (req, res) {
  console.log("Got listing details");

  const listingID = req.params.listingID;

  console.log("Got listing details ", listingID);

  const listing = await listingDB.getListingByID(listingID);

  console.log("Listing updated");

  res.render("listingDetails", { listing: listing });
});

/* POST update listing. */
router.post("/listings/update", async function (req, res) {
  console.log("POST listings/update");

  const listing = req.body;
  // console.log("POST update listing", listing);

  await listingDB.updateListing(listing);
  console.log("Listing updated");

  res.redirect("/");
});

/* POST delete listing. */
router.post("/listings/delete", async function (req, res) {
  console.log("POST delete listing");

  const listing = req.body;

  // console.log("got delete listing", listing);

  await listingDB.deleteListing(listing);

  console.log("Listing deleted");

  res.redirect("/");
});

module.exports = router;
