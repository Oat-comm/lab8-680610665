import { Router, type Request, type Response } from "express";
import {
    zStudentId,
    zCourseId,
} from "../libs/zodValidators.js";

import type { Enrollment } from "../libs/types.js";

// import database
import { enrollments } from "../db/db.js";

const router = Router();

router.delete("/", (req: Request, res: Response) => {
    try {
        const body = req.body;

        const studentId = body.studentId;
        const courseId = body.courseId;

        const findEnrollIdx = enrollments.findIndex((e: Enrollment) => e.courseId === courseId && e.studentId === studentId);

        console.log(findEnrollIdx);

        if (findEnrollIdx === -1) {
            return res.status(404).json({
                ok: false,
                message: "Enrollment does not exist"
            });
        }

        enrollments.splice(findEnrollIdx, 1);

        return res.status(200).json({
            ok: true,
            message: "Enrollment has been deleted"
        });


    } catch (err) {
        return res.status(500).json({
            ok: false,
            error: err
        })
    }
});


export default router;