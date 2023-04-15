import express from 'express';
import { createRequestPicks, getAllRequestPicks, getIdRequestPick, getUserRequestPick, hrApprovesPicks, hrMassApprovesPicks, submitRequestPicks } from "../controllers/requestpicksController.js";
export const reqPicksRoutes = express.Router();
reqPicksRoutes.get('/', getAllRequestPicks);
reqPicksRoutes.get('/pick-id/:id', getIdRequestPick);
reqPicksRoutes.get('/:id', getUserRequestPick);
reqPicksRoutes.post('/', createRequestPicks);
reqPicksRoutes.patch('/:id', submitRequestPicks);
reqPicksRoutes.patch('/approve-pick/:id', hrApprovesPicks);
reqPicksRoutes.patch('/approve-picks/:id', hrMassApprovesPicks);
reqPicksRoutes.delete('/:id');
//# sourceMappingURL=picksRoute.js.map