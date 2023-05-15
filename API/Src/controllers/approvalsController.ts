'use strict'
import { NextFunction, Request, Response } from 'express';
import { Approvals } from '../dbcontext/dbContext.js';
import { IApprovals } from '../dbcontext/Interfaces.js';
import { dbclose, dbconnect } from '../Configs/dbConnect.js';

export const getApps = async (req: Request, res: Response , next: NextFunction) => {
    try {
        await dbconnect()
        const approvals: IApprovals = await Approvals.find({}).lean().sort({ 'createdOn': 1 }).exec();
        await dbclose()
       return res.status(200).json(approvals);
    } catch (error) {
        console.log(error)
       return res.status(500).json('Server responded with an error')
    }

}