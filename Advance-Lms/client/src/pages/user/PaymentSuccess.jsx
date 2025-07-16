import React, { useEffect } from "react";
import {
  FaCreditCard,
  FaUniversity,
  FaUser,
  FaRupeeSign,
} from "react-icons/fa";
import { AiOutlineRight, AiOutlineDown } from "react-icons/ai";
import { useCreateCoursePurchaseMutation } from "../../redux/api/paymentApi";
import { useNavigate, useParams } from "react-router-dom";

import { useViewProfileQuery } from "../../redux/api/userApi";

const PaymentOptions = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { courseId, amount } = params;

  const [createCoursePurchase, { isLoading }] =
    useCreateCoursePurchaseMutation();

  const { data: profileInfo } = useViewProfileQuery();

  const handlePayment = async () => {
    try {
      const response = await createCoursePurchase({
        courseId,
        amount: amount || 10,
        paymentMethod: "card",
        userId: profileInfo?.user?._id,
      }).unwrap();

      if (response?.success) {
        navigate("/profile");
      } else {
        console.log("Payment response:", response?.message);
      }
    } catch (error) {
      console.error("Payment error:", error?.data?.message || error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 rounded-2xl overflow-hidden shadow-lg border border-gray-200">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-bold">Acme Corp</h1>
          <p className="text-xs bg-blue-500 px-2 py-0.5 rounded-full inline-block mt-1">
            Razorpay Trusted Business
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FaUser className="text-white text-lg" />
          <span className="text-xs">Test Mode</span>
        </div>
      </div>

      {/* Body */}
      <div className="bg-white p-4">
        <h2 className="text-lg font-semibold mb-4">Payment Options</h2>

        {/* Card Payment */}
        <p className="text-gray-500 text-sm mb-2">Pay Using Card</p>
        <div className="border rounded-xl mb-4 overflow-hidden">
          <div className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-2">
              <FaCreditCard className="text-blue-600" />
              <span className="text-sm font-medium">
                Credit/Debit Cards
                <span className="bg-blue-600 text-white ml-2 px-2 py-0.5 rounded-lg text-xs">
                  Test Mode
                </span>
              </span>
            </div>
            <AiOutlineDown className="text-gray-400" />
          </div>
        </div>

        {/* Other Payment Methods */}
        <p className="text-gray-500 text-sm mb-2">Other Payment Methods</p>
        <div className="border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer">
            <div className="flex items-center gap-2">
              <FaUniversity className="text-blue-600" />
              <span className="text-sm font-medium">Netbanking</span>
            </div>
            <AiOutlineRight className="text-gray-400" />
          </div>
        </div>

        {/* Test Mode Notice */}
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg flex items-start gap-2 text-xs">
          <span className="text-yellow-500">ℹ️</span>
          <p className="text-yellow-700">
            <strong>Test Mode:</strong> No real money will be transferred. Use
            test card: 4111 1111 1111 1111
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t px-4 py-3 bg-white flex justify-between items-center">
        <div>
          <p className="font-semibold text-lg flex items-center">
            <FaRupeeSign className="mr-1" /> {amount}
          </p>
          <p className="text-xs text-gray-500">Course ID: {courseId}</p>
        </div>
        <button
          onClick={handlePayment}
          disabled={isLoading}
          className={`bg-black text-white text-sm px-6 py-2 rounded-lg font-medium ${
            isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-800"
          }`}
        >
          {isLoading ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
};

export default PaymentOptions;
