const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  const password = "student123";
  const hashedPassword = await bcrypt.hash(password, 10);

  const students = [
    {
      firstName:"student1",
      lastName:"1",
      email: "student1@uni.com",
      indexNo: "S1001",
      faculty: "Engineering",
      roomNumber: "A101",
    },
    {
      firstName:"student2",
      lastName:"2",
      email: "student2@uni.com",
      indexNo: "S1002",
      faculty: "Science",
      roomNumber: "B202",
    },
    {
      firstName:"student3",
      lastName:"3",
      email: "student3@uni.com",
      indexNo: "S1003",
      faculty: "IT",
      roomNumber: "C303",
    },
    {
      firstName:"student4",
      lastName:"4",
      email: "student4@uni.com",
      indexNo: "S1004",
      faculty: "Business",
      roomNumber: "D404",
    },
    {
      firstName:"student5",
      lastName:"5",
      email: "student5@uni.com",
      indexNo: "S1005",
      faculty: "Engineering",
      roomNumber: "E505",
    },
  ];

  for (const s of students) {
    await prisma.user.create({
      data: {
        firstName:s.firstName,
        lastName:s.lastName,
        email: s.email,
        password: hashedPassword,
        role: "STUDENT",
        student: {
          create: {
            indexNo: s.indexNo,
            faculty: s.faculty,
            roomNumber: s.roomNumber,
            isResidential: true, // IMPORTANT
          },
        },
      },
    });
  }

  console.log("✅ Demo residential students inserted successfully");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
