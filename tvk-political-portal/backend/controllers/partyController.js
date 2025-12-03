import PartyUnit from "../models/PartyUnit.js";

// ==========================================
// 1. GET FULL NETWORK (Tree Structure)
// ==========================================
// Route: GET /api/party-network
export const getPartyNetwork = async (req, res) => {
  try {
    const allUnits = await PartyUnit.find({}).lean();

    const unions = allUnits.filter((u) => u.type === "union");
    const villages = allUnits.filter((u) => u.type === "village");
    const wards = allUnits.filter((u) => u.type === "ward");
    const booths = allUnits.filter((u) => u.type === "booth");

    // Build Hierarchy Tree
    const tree = unions.map((union) => {
      const unionVillages = villages
        .filter((v) => String(v.parentId) === String(union._id))
        .map((village) => {
          const villageWards = wards
            .filter((w) => String(w.parentId) === String(village._id))
            .map((ward) => {
              const wardBooths = booths.filter(
                (b) => String(b.parentId) === String(ward._id)
              );
              return { ...ward, id: ward._id, booths: wardBooths.map(b => ({...b, id: b._id})) };
            });
          return { ...village, id: village._id, wards: villageWards };
        });
      return { ...union, id: union._id, villages: unionVillages };
    });

    res.json(tree);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Network load failed" });
  }
};

// ==========================================
// 2. ADD UNIT (The Save Function)
// ==========================================
// Route: POST /api/party-network/add
export const addPartyUnit = async (req, res) => {
  try {
    // 1. Get data from Frontend
    const { nameTa, type, parentId, personName, roleTa, phone, photoUrl } = req.body;

    // 2. Validation
    if (type !== "union" && !parentId) {
      return res.status(400).json({ message: `${type} requires a valid parent selection` });
    }

    // 3. Save to Database
    const newUnit = await PartyUnit.create({
      nameTa,
      type, 
      parentId: parentId || null,
      person: personName, // Maps 'personName' from UI to 'person' in DB
      roleTa,
      phone,
      photo: photoUrl
    });

    res.status(201).json(newUnit);
  } catch (err) {
    console.error("Error saving unit:", err);
    res.status(500).json({ message: "Failed to add unit", error: err.message });
  }
};

// ==========================================
// 3. DELETE UNIT
// ==========================================
// Route: DELETE /api/party-network/:id
export const deletePartyUnit = async (req, res) => {
  const { id } = req.params;
  try {
    // Helper to find all children recursively
    const findAllChildren = async (parentId) => {
      const children = await PartyUnit.find({ parentId });
      let ids = children.map(c => c._id);
      for (const child of children) {
        const grandChildren = await findAllChildren(child._id);
        ids = [...ids, ...grandChildren];
      }
      return ids;
    };

    // 1. Find all descendants (Villages/Wards under this Union)
    const childrenIds = await findAllChildren(id);
    
    // 2. Delete descendants
    if (childrenIds.length > 0) {
      await PartyUnit.deleteMany({ _id: { $in: childrenIds } });
    }

    // 3. Delete the item itself
    await PartyUnit.findByIdAndDelete(id);

    res.json({ message: "Unit and all sub-levels deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting unit" });
  }
};
// backend/controllers/partyController.js

// ... existing functions (get, add, delete) ...

// @desc    Update a Party Unit
// @route   PUT /api/party-network/:id
export const updatePartyUnit = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Construct update object
    const updateData = {
      nameTa: req.body.nameTa,
      // Map frontend 'personName' to database 'person'
      person: req.body.personName, 
      roleTa: req.body.roleTa,
      phone: req.body.phone,
      photo: req.body.photoUrl // This is the Base64 image string
    };

    // Find by ID and Update
    const updatedUnit = await PartyUnit.findByIdAndUpdate(id, updateData, { 
      new: true // Return the updated document
    });

    if (!updatedUnit) {
      return res.status(404).json({ message: "Unit not found" });
    }

    res.json(updatedUnit);
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ message: "Failed to update details" });
  }
};