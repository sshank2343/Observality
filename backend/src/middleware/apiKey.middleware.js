const { hashApiKey } = require("../modules/auth/apiKey.utils");
const { prisma } = require('../config/postgres.config');


const requireApiKey = async (req,res,next)=>{
    const rawKey = req.headers['x-api-key'];

    if(!rawKey) {
        return res.status(401).json({error:'Missing X_API_Key header'})
    }

    try {
        const keyHash = hashApiKey(rawKey)

        const apiKey = await prisma.apiKey.findUnique({
            where:{ keyHash },
            include: { project: true }
        });

        if(!apiKey || apiKey.revoked){
            return res.status(401).json({error: 'Invalid or revoked API Key'})
        }

        req.project = {
            id: apiKey.project.id,
            orgId: apiKey.project.organizationId,
        };
        next()
    } catch (error) {
        next(error)
    }
}
module.exports = { requireApiKey };