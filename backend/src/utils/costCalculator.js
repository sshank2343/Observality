const { getPricing } = require("../config/pricing.config.j")


const calculateCost = ({ provider, model, inputTokens, outputTokens})=>{
    const pricing = getPricing(provider,model);

    if(!pricing) return 0;

    const inputCost = (inputTokens / 1000) * pricing.input;
    const outputCost = (outputTokens / 1000) * pricing.output;

    return Number((inputCost+outputCost).toFixed(6))
}

module.exports = { calculateCost };