const path = require("path");

const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Employer = require("../models/Employer");


exports.getemployers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
  });

  exports.getemployer = asyncHandler(async (req, res, next) => {
    const employer = await Employer.findById(req.params.employerId);
  
    if (!employer) {
      return next(
        new ErrorResponse(
          `employer not found with id of ${req.params.employerId}`,
          404
        )
      );
    }
  
    res.status(200).json({ success: true, data: employer });
  });
  // @desc      Create new donor
// @route     POST /api/v1/donors
// @access    Private
exports.createemployer= asyncHandler(async (req, res, next) => {
  // Add user to req,body
  req.body.user = req.user.id;

  // Check for published donor
  const publishedemployer = await Employer.findOne({ user: req.user.id });

  // If the user is not an admin, they can only add one donor
  if (publishedemployer && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.id} has already  a employer`,
        400
      )
    );
  }

  const employer = await employer.create(req.body);

  res.status(201).json({
    success: true,
    data: employer,
  });
});

exports.updateemployer = asyncHandler(async (req, res, next) => {
    let employer = await Employer.findById(req.params.employerId);
  
    if (!employer) {
      return next(
        new ErrorResponse(
          `employer not found with id of ${req.params.employerId}`,
          404
        )
      );
    }
  
    employer = await Employer.findByIdAndUpdate(req.params.employerId, req.body, {
      new: true,
      runValidators: true,
    });
  
    res.status(200).json({ success: true, data: employer });
  });

  exports.deleteemployer = asyncHandler(async (req, res, next) => {
    const employer = await Employer.findById(req.params.employerId);
  
    if (!employer) {
      return next(
        new ErrorResponse(
          `employer not found with id of ${req.params.employerId}`,
          404
        )
      );
    }
  
    
   
  
    employer.remove();
  
    res.status(200).json({ success: true, data: {} });
  });