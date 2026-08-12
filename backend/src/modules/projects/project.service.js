const { prisma } = require("../../config/postgres.config")
const { generateApiKey } = require("../auth/apiKey.utils")


const createProject = async({name, orgId}) =>{
    const project = await prisma.project.create({
        data:{
            name,
            organizationId:orgId
        }
    })
    return project
}

const listProjects = async({orgId})=>{
    return await prisma.project.findMany({
        where:{organizationId:orgId},
        include:{
            apiKeys:{
                where: { revoked: false },
                select:{ id: true, keyPrefix: true, createdAt:true },
            },
        },
        orderBy: { createdAt:'desc'}
    })
}

const getProjectById = async ({projectId,orgId}) =>{
    const project = await prisma.project.findFirst({
        where: { id: projectId, organizationId: orgId },
    });

    if (!project) {
        const err = new Error('Project not found');
        err.status = 404;
        throw err;
    }

    return project;
}

const createApiKeyForProject = async ({ projectId, orgId }) => {
  // Ensure the project belongs to the requester's org before issuing a key
  await getProjectById({ projectId, orgId });

  const { rawKey, keyHash, keyPrefix } = generateApiKey();

  const apiKey = await prisma.apiKey.create({
    data: {
      keyHash,
      keyPrefix,
      projectId,
    },
  });

  return { id: apiKey.id, rawKey, keyPrefix, createdAt: apiKey.createdAt };
};


const revokeApiKey = async ({ keyId, orgId }) => {
  // Verify the key belongs to a project under this org before revoking
  const apiKey = await prisma.apiKey.findFirst({
    where: { id: keyId },
    include: { project: true },
  });

  if (!apiKey || apiKey.project.organizationId !== orgId) {
    const err = new Error('API key not found');
    err.status = 404;
    throw err;
  }

  await prisma.apiKey.update({
    where: { id: keyId },
    data: { revoked: true },
  });

  return { revoked: true };
};

module.exports = {
  createProject,
  listProjects,
  getProjectById,
  createApiKeyForProject,
  revokeApiKey,
};