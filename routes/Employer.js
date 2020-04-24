const express = require("express");
const {
  getemployers,
  getemployer,
  createemployer,
  updateemployer,
  deleteemployer,
} = require("../controller/Employer");

const Employer = require("../models/Employer");
const router = express.Router();

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");


router
  .route("/")
  .get(advancedResults(Employer, "admin"), getemployers)
  .post(protect, authorize("employer", "admin"), createemployer);

router
  .route("/:employerId")
  .get(getemployer)
  .put(protect, authorize("employer", "admin"), updateemployer)
  .delete(protect, authorize("employer", "admin"), deleteemployer);

module.exports = router;    