import express from 'express';
import { createRequestPicks, getAllRequestPicks, getUserRequestPick, hrApprovesPicks, hrMassApprovesPicks, submitRequestPicks } from "../controllers/requestpicksController.js";
export const reqPicksRoutes = express.Router();
reqPicksRoutes.get('/', getAllRequestPicks);
reqPicksRoutes.get('/:id', getUserRequestPick);
reqPicksRoutes.post('/', createRequestPicks);
reqPicksRoutes.patch('/:id', submitRequestPicks);
reqPicksRoutes.patch('/approve-pick/:id', hrApprovesPicks);
reqPicksRoutes.patch('/approve-picks', hrMassApprovesPicks);
reqPicksRoutes.delete('/:id');
//# sourceMappingURL=picksRoute.js.map