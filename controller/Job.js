const path = require("path");

const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Job = require("../models/Job");


exports.getjobs = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
  });

  exports.getjob = asyncHandler(async (req, res, next) => {
    const job = await Job.findById(req.params.jobId);
  
    if (!job) {
      return next(
        new ErrorResponse(
          `Job not found with id of ${req.params.jobId}`,
          404
        )
      );
    }
  
    res.status(200).json({ success: true, data: job });
  });
  // @desc      Create new fundriser
// @route     POST /api/v1/fundrisers
// @access    Private
exports.createjob = asyncHandler(async (req, res, next) => {
  // Add user to req,body
  req.body.user = req.user.id;

  // Check for published fundrisers
  // const publishedjob = await Job.findOne({ user: req.user.id });

  // // If the user is not an admin, they can only add one fundriser
  // if (publishedjob && req.user.role !== "admin") {
  //    return next(
  //     new ErrorResponse(
  //       `The user with ID ${req.user.id} has already  a job`,
  //       400
  //    )
  //   );
  //  }

  const job = await Job.create(req.body);

  res.status(201).json({
    success: true,
    data: job,
  });
});

exports.updatejob = asyncHandler(async (req, res, next) => {
    let job = await Job.findById(req.params.jobId);
  
    if (!job) {
      return next(
        new ErrorResponse(
          `job not found with id of ${req.params.jobId}`,
          404
        )
      );
    }
  
    job = await Job.findByIdAndUpdate(req.params.jobId, req.body, {
      new: true,
      runValidators: true,
    });
  
    res.status(200).json({ success: true, data: job });
  });

  exports.deletejob = asyncHandler(async (req, res, next) => {
    const job = await Job.findById(req.params.jobId);
  
    if (!job) {
      return next(
        new ErrorResponse(
          `job not found with id of ${req.params.jobId}`,
          404
        )
      );
    }
  
    
   job.remove();
  
    res.status(200).json({ success: true, data: {} });
  });