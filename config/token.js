import jwt from "jsonwebtoken";

const genToken = (userId) => {
  try {
   
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "10y" });
    return token;
  } catch (error) {
    console.error("Error generating token:", error.message);
    throw new Error("Token generation failed");
  }
};

export default genToken;
