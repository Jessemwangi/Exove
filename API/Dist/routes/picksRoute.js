import express from 'express';
import { WhoToGiveFeedbackTo, createRequestPicks, finalPickSubmit, getAllRequestPicks, getIdRequestPick, getUserRequestPick, hrApprovesPicks, hrMassApprovesPicks, submitRequestPicks } from "../controllers/requestpicksController.js";
export const reqPicksRoutes = express.Router();
reqPicksRoutes.get('/', getAllRequestPicks);
reqPicksRoutes.get('/pick-id/:id', getIdRequestPick);
reqPicksRoutes.get('/:id', getUserRequestPick);
reqPicksRoutes.post('/', createRequestPicks);
reqPicksRoutes.patch('/:id', submitRequestPicks);
reqPicksRoutes.patch('/approve-pick/:id', hrApprovesPicks);
reqPicksRoutes.patch('/approve-picks/:id', hrMassApprovesPicks);
reqPicksRoutes.delete('/:id');
reqPicksRoutes.patch('/submit/:id', finalPickSubmit);
reqPicksRoutes.get('/feeds_to/:name', WhoToGiveFeedbackTo);
//# sourceMappingURL=picksRoute.js.map