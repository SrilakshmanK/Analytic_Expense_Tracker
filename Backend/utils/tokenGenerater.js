import jwt from 'jsonwebtoken';




export const createToken = async (userId) => {
  try {
    const token = await jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );
    console.log(token)
    return token 
  } catch (error) {
    console.error("JWT Error:", error);
    throw new Error("Failed to generate token");
  }
};