// server/controllers/paymentController.js
import Payment from "../models/paymentModel.js";
import User from "../models/userModel.js";
import Course from "../models/courseModel.js";

export const processPayment = async (req, res) => {
  try {
    const { courseId, amount = 100, paymentMethod } = req.body;

    const userId = req.user._id;

    // Verify the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // Verify the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if user is already enrolled
    const alreadyEnrolled = user.enrolledCourses.some(
      (course) => course.courseId.toString() === courseId
    );

    if (alreadyEnrolled) {
      return res.status(200).json({
        success: true,
        message: "User is already enrolled in this course",
      });
    }

    const transactionId =
      "dummy_" + Math.random().toString(36).substring(2, 15);

    // Create payment record
    const payment = new Payment({
      courseId,
      userId,
      amount,
      paymentMethod,
      status: "completed",
      transactionId,
    });

    await payment.save();

    // Add course to user's enrolledCourses
    user.enrolledCourses.push({
      courseId,
      paymentId: payment._id,
    });

    await user.save();

    res.json({
      success: true,
      transactionId,
      paymentId: payment._id,
      message: "Payment successful",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
