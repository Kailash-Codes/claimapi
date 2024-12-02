import express from "express";
import cors from "cors";

const app = express();

// Middleware to parse JSON requests
app.use(express.json({ limit: "100mb" }));
app.use(cors());

// Dummy user credentials and access codes
const dummyUser = {
  username: "jeenasherma",
  password: "jeenasherma",
};

const validAccessCodes = [
  "L9KS6wrd6FaK4nsyKeJ9w3E8RU60mkyF",
  "THM3xkZzXeza5ISoTyPKl6oLpVa88tYl2",
];

// Root route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Endpoint for user authentication
app.post("/user/check.php", (req, res) => {
  const { username, password } = req.body;

  // Validate request body
  if (!username || !password) {
    return res.status(400).json({
      status: "error",
      data: "Username and password are required",
    });
  }

  // Authenticate the user
  if (username === dummyUser.username && password === dummyUser.password) {
    return res.status(200).json({
      status: "success",
      data: {
        access_code: "L9KS6wrd6FaK4nsyKeJ9w3E8RU60mkyF",
      },
    });
  }

  // Respond with an error if authentication fails
  return res.status(401).json({
    status: "error",
    data: "Invalid username or password",
  });
});

// Endpoint for claim creation
app.post("/claim/create.php", (req, res) => {
  const { claim_code, access_code } = req.body;

  // Validate request body
  if (!claim_code || !access_code) {
    return res.status(400).json({
      status: "fail",
      data: "Claim code and access code are required",
    });
  }

  // Validate access code
  if (!validAccessCodes.includes(access_code)) {
    return res.status(401).json({
      status: "fail",
      data: "Invalid Token",
    });
  }
  if (claim_code == 1234) {
    return res.status(400).json({
      status: "fail",
      data: "Claim code redeemed already",
    });
  }
  // Simulate claim creation and respond with success
  return res.status(200).json({
    status: "success",
    data: {
      id: "180",
    },
  });
});

// Endpoint for single file upload
app.post("/file/upload.php", (req, res) => {
  const { claim_id, name, access_code, file } = req.body;

  // Validate request body
  if (!claim_id || !name || !access_code || !file) {
    return res.status(400).json({
      status: "fail",
      data: "claim_id, name, access_code, and file are required",
    });
  }

  // Validate access code
  if (!validAccessCodes.includes(access_code)) {
    return res.status(401).json({
      status: "fail",
      data: "Invalid access code",
    });
  }

  console.log("Received single file:", {
    claim_id,
    name,
    file: file.slice(0, 20) + "...", // Log a truncated version of the file string
  });

  return res.status(200).json({
    status: "success",
    data: "File uploaded successfully",
  });
});

// Endpoint for multiple file uploads
app.post("/claim/uploadMultiple.php", (req, res) => {
  const { claim_id, name, access_code, file } = req.body;

  // Validate request body
  if (!claim_id || !name || !access_code || !file || !Array.isArray(file)) {
    return res.status(400).json({
      status: "fail",
      data: "claim_id, name, access_code, and an array of files are required",
    });
  }

  // Validate access code
  if (!validAccessCodes.includes(access_code)) {
    return res.status(401).json({
      status: "fail",
      data: "Invalid Token",
    });
  }

  // Process each file
  file.forEach((f, index) => {
    console.log(`File ${index + 1}: ${f.slice(0, 20)}...`); // Log a truncated version of each file string
  });

  return res.status(200).json({
    status: "success",
    data: "Files uploaded Successfully",
  });
});

// Start the server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
