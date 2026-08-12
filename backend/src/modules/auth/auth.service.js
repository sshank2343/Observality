const bcrypt = require('bcryptjs');
const { prisma } = require('../../config/postgres.config');
const { signToken } = require('./jwt.utils');



const SALT_ROUNDS = 10;

const registerUser = async ({email, password, orgName}) => {
    const existing = await prisma.user.findUnique({where:{email}});
    if(existing){
        const err = new Error("Email already in use");
        err.status = 409;
        throw err;
    }

    const passwordHash = await bcrypt.hash(password,SALT_ROUNDS);

    const organization = await prisma.organization.create({
        data:{
            name: orgName,
            users:{
                create:{
                    email,
                    passwordHash,
                    role:'admin'
                },
            },
        },
        include: { users:true}
    })
    const user = organization.users[0];
    const token = signToken({ userId: user.id, orgId: organization.id, role: user.role });

    return { token, user: { id: user.id, email: user.email, role: user.role }, orgId: organization.id };
}

const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }

  const token = signToken({ userId: user.id, orgId: user.organizationId, role: user.role });

  return { token, user: { id: user.id, email: user.email, role: user.role }, orgId: user.organizationId };
};

module.exports = { registerUser, loginUser };