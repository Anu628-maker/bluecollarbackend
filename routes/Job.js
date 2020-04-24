const express = require("express");
const {
  getjobs,
  getjob,
  createjob,
  updatejob,
  deletejob,
} = require("../controller/Job");

const Job = require("../models/Job");
const router = express.Router();

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");


router
  .route("/")
  .get(advancedResults(Job, "admin"), getjobs)
  .post(protect, authorize("job", "admin"), createjob);

router
  .route("/:jobId")
  .get(getjob)
  .put(protect, authorize("job", "admin"), updatejob)
  .delete(protect, authorize("job", "admin"), deletejob);

module.exports = router;