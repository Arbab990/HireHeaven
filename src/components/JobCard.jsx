"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Link from "next/link";
import { BriefcaseBusiness, MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import { ApplyForJob } from "@/redux/action/job";
import { motion } from "framer-motion";

const JobCard = ({ job }) => {
  const { user } = useSelector((state) => state.user);
  const { btnLoading, applications } = useSelector((state) => state.job);
  const dispatch = useDispatch();

  const applyHandler = () => {
    dispatch(ApplyForJob(job._id));
  };

  const [applied, setapplied] = useState(false);

  useEffect(() => {
    if (applications && job._id) {
      applications.forEach((item) => item.job === job._id && setapplied(true));
    }
  }, [applications, job._id]);

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="w-[350px] shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl">
        <CardHeader>
          <div className="flex justify-between items-center gap-3">
            <CardTitle className="text-xl font-semibold dark:text-white">
              {job.title}
            </CardTitle>
            <Link href={`/company/${job.company}`}>
              <img
                src={job.comapnyLogo}
                alt="company"
                className="rounded-full w-16 h-16 border border-gray-300 dark:border-gray-600 hover:scale-105 transition-transform duration-300"
              />
            </Link>
          </div>
          <CardDescription className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <BriefcaseBusiness />
            {job.experience === 0 ? <p>Fresher</p> : <p>{job.experience} Years</p>}
          </CardDescription>
          <CardDescription className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
            <MapPin /> {job.location}
          </CardDescription>
          <CardDescription className="text-gray-700 dark:text-gray-300">
            ₹ {job.salary} 
          </CardDescription>
        </CardHeader>

        <CardContent className="text-gray-800 dark:text-gray-200">
          {job.description.slice(0, 62)}...
        </CardContent>

        <CardFooter className="flex justify-between items-center">
          <Link href={`/jobs/${job._id}`}>
            <Button variant="outline">View Detail</Button>
          </Link>

          {user && user.role === "jobseeker" && (
            <>
              {applied ? (
                <p className="text-green-500 font-medium">Already Applied</p>
              ) : (
                job.status !== "closed" && (
                  <Button
                    onClick={applyHandler}
                    disabled={btnLoading}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  >
                    Easy Apply
                  </Button>
                )
              )}
            </>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default JobCard;

