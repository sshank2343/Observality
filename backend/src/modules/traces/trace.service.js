const Trace = require("./trace.model");


const listTraces = async ({projectId,page = 1, limit = 25 ,status})=>{
    const query = {projectId};
    if(status) query.status = status

    const skip = (page - 1)* limit;

    const [traces, total] = await Promise.all([
        Trace.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit))
            .lean(),
        Trace.countDocuments(query),
    ])
    return {
        traces,
        pagination: {
            page:Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total/limit),
        }
    }
}


const getTraceById = async({traceId, projectId}) => {
    const trace = await Trace.findOne({_id:traceId,projectId}).lean();

    if(!trace){
        const err = new Error('Trace not found');
        err.status=404;
        throw err;
    }
    return trace;
}

module.exports = {listTraces, getTraceById}