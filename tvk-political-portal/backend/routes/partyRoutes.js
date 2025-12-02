import express from 'express';
import { 
    getPartyNetwork, 
    addPartyUnit, 
    updatePartyUnit, 
    deletePartyUnit 
} from '../controllers/partyController.js';

// 1. Router for public/unauthenticated routes (no checkAuth middleware applied)
const unauthenticatedRouter = express.Router();

// 2. Router for authenticated routes (checkAuth middleware will be applied globally in server.js)
const authenticatedRouter = express.Router();

// --------------------------------------------------------------------
// UN-AUTHENTICATED ROUTES (Public Read Access)
// --------------------------------------------------------------------
// GET /api/party-network/ (Used by the frontend to display the public tree)
unauthenticatedRouter.get("/", getPartyNetwork);
// Note: You can add /barriers here if it's a separate public GET endpoint

// --------------------------------------------------------------------
// 🔒 AUTHENTICATED ROUTES (Admin Write Access)
// These routes require the x-api-key check (from checkAuth) AND a valid token (to be checked here).
// --------------------------------------------------------------------
// POST /api/party-network/add (Admin "Save Details" for new units)
authenticatedRouter.post("/add", addPartyUnit);

// PUT /api/party-network/:id
authenticatedRouter.put("/:id", updatePartyUnit);

// DELETE /api/party-network/:id
authenticatedRouter.delete("/:id", deletePartyUnit);


// Export both routers for use in server.js
export default {
    unauthenticated: unauthenticatedRouter,
    authenticated: authenticatedRouter
};