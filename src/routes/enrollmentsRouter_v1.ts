import { Router, type Request, type Response } from "express";
import {
    zStudentId,
    zCourseId,
} from "../libs/zodValidators.js";

import type { Student, Course, Enrollment } from "../libs/types.js";

// import database
import { students, enrollments, courses } from "../db/db.js";

const router = Router();

router.get("/", (req: Request, res: Response) => {
    try {
        const courseId = req.query.courseId;
        const studentId = req.query.studentId;

        if ((courseId && studentId) || (!courseId && !studentId)) {
            return res.status(400).json({
                ok: false,
                message: "Please provide either studentId or courseId and not both!",
            });
        }

        if (courseId) {
            const vaildate = zCourseId.safeParse(courseId);

            if (!vaildate.success) {
                return res.status(400).json({
                    ok: false,
                    message: vaildate.error.issues[0]?.message,
                });
            }

            const ids = enrollments.filter((e) => e.courseId === courseId).map((s) => s.studentId);

            // console.log('ids: ', ids);

            students.forEach(std => {
                console.log(std.studentId, ids.includes(std.studentId));
            });

            const filterStds = students.filter((std: Student) => ids.includes(std.studentId)).map((std: Student) => ({ studentId: std.studentId, firstName: std.firstName, lastName: std.lastName, program: std.program }));

            // console.log('filterStds: ', filterStds);

            return res.status(200).json({
                ok: true,
                students: filterStds
            });
        }

        if (studentId) {
            const vaildate = zStudentId.safeParse(studentId);

            if (!vaildate.success) {
                return res.status(400).json({
                    ok: false,
                    message: vaildate.error.issues[0]?.message,
                });
            }

            // console.log('studentId: ', studentId);
            

            const filteredCourse = enrollments.filter((e) => e.studentId === studentId).map((d) => d.courseId);

            console.log('filteredCourse: ', filteredCourse);

            const result = courses.filter((c) => filteredCourse.includes(c.courseId)).map((d) => ({courseId: d.courseId, title: d.courseTitle}));

            return res.status(200).json({
                ok: true,
                students: result
            });
        }


    } catch (err) {
        return res.status(500).json({
            ok: false,
            error: err
        })
    }
});


export default router;