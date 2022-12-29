var express = require("express");
const { isAuth } = require("../authentication");

var router = express.Router();

const User = require("../model/User");

/* GET home page. */
router.put("/deposit", isAuth, async (req, res) => {
  const user = req.user;

  // Retrieve the amount to be deposited from the request body
  const balance = req.body.amount;
  User.findByIdAndUpdate(
    user._id,
    { $inc: { amount: balance } },
    { new: true },
    (err, updatedBalance) => {
      if (err) {
        return res.status(500).send(err);
      }

      // Return a success response to the client
      res.json({
        success: true,
        message: "Deposit successful",
      });
    }
  );
});

router.put("/withdrawn", isAuth, async (req, res) => {
  User.findOne({ _id: req.user._id }, (err, user) => {
    if (err) {
      return res.status(500).send({ error: "Error retrieving user account" });
    }

    // Check if the user has sufficient funds to make the withdrawal
    if (user.amount < req.body.amount) {
      return res.status(400).send({ error: "Insufficient funds" });
    }

    // Update the user's balance by subtracting the withdrawal amount
    user.amount -= req.body.amount;

    // Save the updated balance to the database
    user.save((err) => {
      if (err) {
        return res.status(500).send({ error: "Error updating balance" });
      }

      // Return a success message to the client
      return res.send({ message: "Withdrawal successful" });
    });
  });
});

router.get("/request", isAuth, async (req, res) => {
  const user = req.user;
  User.findById(user._id, (err, data) => {
    if (err) {
      return res.status(500).send(err);
    } else {
      return res.status(200).send(data);
    }

  });
});

module.exports = router;
