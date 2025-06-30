const Admin = require("../models/adminSchema.js");

const adminRegister = async (req, res) => {
  try {
    // Validate required fields
    const { name, email, password, collegeName } = req.body;
    if (!name || !email || !password || !collegeName) {
      return res.status(400).send({ message: "All fields are required" });
    }

    const existingAdminByEmail = await Admin.findOne({ email });

    if (existingAdminByEmail) {
      return res.status(400).send({ message: "Email already exists" });
    } else {
      const admin = new Admin({
        name,
        email,
        password, // Should be hashed in a production environment
        collegeName,
        role: "Admin",
      });

      let result = await admin.save();
      result = result.toObject();
      delete result.password;
      res.status(201).send(result);
    }
  } catch (err) {
    console.error("Admin registration error:", err);
    res
      .status(500)
      .send({ message: "Error registering admin", error: err.message });
  }
};

const adminLogIn = async (req, res) => {
  try {
    if (!req.body.email || !req.body.password) {
      return res
        .status(400)
        .send({ message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) {
      return res.status(404).send({ message: "User not found" });
    }

    if (req.body.password !== admin.password) {
      return res.status(401).send({ message: "Invalid password" });
    }

    const adminData = admin.toObject();
    delete adminData.password;

    res.status(200).send(adminData);
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).send({ message: "Login error", error: err.message });
  }
};

const getAdminDetail = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).send({ message: "Admin not found" });
    }

    const adminData = admin.toObject();
    delete adminData.password;
    res.status(200).send(adminData);
  } catch (err) {
    console.error("Get admin details error:", err);
    res
      .status(500)
      .send({ message: "Error fetching admin details", error: err.message });
  }
};

module.exports = { adminRegister, adminLogIn, getAdminDetail };
