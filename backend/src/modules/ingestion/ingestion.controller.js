const { traceSchema } = require('../../schemas/trace.schema');
const { ingestTrace } = require("./ingestion.service");



const receiveTrace = async (req,res,next) =>{
    try {
        const traceData = traceSchema.parse(req.body);

        const trace = await ingestTrace({
            traceData,
            projectId:req.project.id,
            orgId: req.project.orgId
        });
        res.status(201).json({id:trace._id, status:'ingested'})
    } catch (error) {
        next(error);
    }
}


module.exports = { receiveTrace}