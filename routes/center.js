const express = require("express");
const {
  getCenters,
  getCenter,
  createCenter,
  updateCenter,
  deleteCenter,
  //  getCentersInRadius,
  // centersPhotoUpload,
} = require("../controller/center");

const center = require("../models/Center");

// Include other resource routers
// const JobsRouter = require("./job");
const reviewRouter = require("./reviews");

const router = express.Router();

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

// Re-route into other resource routers
// router.use("/job", JobsRouter);
router.use("/:centerId/reviews", reviewRouter);

// router.route("/radius/:zipcode/:distance").get(getVendorsInRadius);

router
  .route("/:centerId/photo")
  .put(protect, authorize("center", "admin"), centersPhotoUpload);

router
  .route("/")
  .get(advancedResults(Center, "admin"), getCenters)
  .post(protect, authorize("center", "admin"), createCenter);

router
  .route("/:centerId")
  .get(getCenter)
  .put(protect, authorize("center", "admin"), updateCenter)
  .delete(protect, authorize("center", "admin"), deleteCenter);

module.exports = router;
