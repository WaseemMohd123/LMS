import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import {
  useGetCourseLecturesQuery,
  useDeleteLectureMutation,
} from "../../redux/api/courseApi";
import { toast } from "react-toastify";
import {
  MdOutlineVideoLibrary,
  MdOutlineAssignment,
  MdOutlineQuiz,
  MdExpandMore,
  MdExpandLess,
  MdDelete,
} from "react-icons/md";
import { BsCheckCircleFill } from "react-icons/bs";

const Lectures = () => {
  const { courseId } = useParams();
  const [expandedLectures, setExpandedLectures] = useState({});
  const [deleteLecture, { isLoading: isDeleting }] = useDeleteLectureMutation();

  const {
    data: lectureData,
    isLoading: isLecturesLoading,
    isError: isLecturesError,
    error: lecturesError,
    refetch: refetchLectures,
  } = useGetCourseLecturesQuery(courseId);

  const lectures = lectureData?.course?.lectures || [];

  useEffect(() => {
    if (isLecturesError) {
      toast.error(lecturesError?.data?.message || "Failed to load lectures");
    }
  }, [isLecturesError]);

  const toggleLecture = (lectureId) => {
    setExpandedLectures((prev) => ({
      ...prev,
      [lectureId]: !prev[lectureId],
    }));
  };

  const handleDeleteLecture = async (lectureId) => {
    if (!window.confirm("Are you sure you want to delete this lecture?"))
      return;

    try {
      const response = await deleteLecture({
        courseId: courseId,
        lectureId: lectureId,
      }).unwrap();

      toast.success(response.message || "Lecture deleted successfully");
      refetchLectures();
    } catch (error) {
      console.error("Delete error details:", error);
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Failed to delete lecture. Please try again."
      );
    }
  };
  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Content */}
          <div className="lg:w-2/3 space-y-8">
            {/* Curriculum Card */}
            <div className="p-6 sm:p-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Lectures
              </h2>
              {isLecturesLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
              ) : lectures.length > 0 ? (
                <div className="space-y-4">
                  {lectures.map((lecture) => (
                    <div
                      key={lecture._id}
                      className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 transition"
                    >
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer"
                        onClick={() => toggleLecture(lecture._id)}
                      >
                        <div className="flex items-center">
                          {lecture.type === "video" ? (
                            <MdOutlineVideoLibrary className="text-indigo-600 mr-3 text-xl" />
                          ) : lecture.type === "quiz" ? (
                            <MdOutlineQuiz className="text-indigo-600 mr-3 text-xl" />
                          ) : (
                            <MdOutlineAssignment className="text-indigo-600 mr-3 text-xl" />
                          )}
                          <h3 className="text-lg font-semibold text-gray-800">
                            {lecture.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          {expandedLectures[lecture._id] ? (
                            <MdExpandLess className="text-gray-500 text-xl" />
                          ) : (
                            <MdExpandMore className="text-gray-500 text-xl" />
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteLecture(lecture._id);
                            }}
                            disabled={isDeleting}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="Delete lecture"
                          >
                            <MdDelete className="text-xl" />
                          </button>
                        </div>
                      </div>

                      {expandedLectures[lecture._id] && (
                        <div className="p-4 border-t border-gray-200 bg-gray-50">
                          <p className="text-gray-600 mb-4">
                            {lecture.description || "No description available"}
                          </p>
                          {lecture.video?.url && (
                            <div className="relative pt-[56.25%] rounded-md overflow-hidden bg-black">
                              <ReactPlayer
                                url={lecture.video.url}
                                width="100%"
                                height="100%"
                                controls
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                }}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No lectures available.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lectures;
