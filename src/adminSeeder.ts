
import sequelize from "./database/connection";
import bcrypt from "bcrypt";

const adminSeeder = async (): Promise<void> => {
  const User = sequelize.models.User;
  const [data] = await User.findAll({
    where: {
      email: "p2admin@gmail.com",
    },
  });
  if (!data) {
    await User.create({
      email: "p2admin@gmail.com",
      password: bcrypt.hashSync("p2password", 8),
      username: "p2admin",
      role: "admin",
    });
    console.log("admin credentials seeeded sucessfully");
  } else {
    console.log("admin credentials seeded successfully");
  }
};
export default adminSeeder;
