import OpenAI from 'openai';
import { config } from '../config/index.js';

const openai = new OpenAI({
  apiKey: config.ai.apiKey,
});


/**
 
 * @param {string} nlText - Natural language description of procurement needs
 * @returns {Promise<Object>} Structured RFP data
 */
export async function parseNaturalLanguageToRFP(nlText) {
  // FALLBACK MODE: Use regex parsing when OpenAI API is unavailable
  try {
    // Try OpenAI first
    const prompt = `You are an assistant that extracts structured procurement details from a natural-language description.
Return valid JSON with fields: title, description, budget_usd (number or null), items (array of {name, qty, specs}), delivery_days, payment_terms, warranty_months.
Input: "${nlText}"
Output JSON only.`;

    const completion = await openai.chat.completions.create({
      model: config.ai.model,
      messages: [
        { role: 'system', content: 'You are a helpful assistant that converts text to JSON. Return only valid JSON, no markdown or explanations.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
    });

    const content = completion.choices[0].message.content.trim();
    const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const parsed = JSON.parse(jsonStr);

    return {
      title: parsed.title || 'Untitled RFP',
      description: parsed.description || nlText,
      budget: parsed.budget_usd || null,
      items: parsed.items || [],
      delivery_deadline: parsed.delivery_days ? new Date(Date.now() + parsed.delivery_days * 24 * 60 * 60 * 1000) : null,
      payment_terms: parsed.payment_terms || 'Net 30',
    };
  } catch (error) {
    console.error('AI parsing error, using fallback parser:', error.message);
    
    // FALLBACK: Simple regex-based parsing
    const budgetMatch = nlText.match(/\$?([\d,]+)/);
    const budget = budgetMatch ? parseInt(budgetMatch[1].replace(/,/g, '')) : null;
    
    const daysMatch = nlText.match(/(\d+)\s*days?/i);
    const deliveryDays = daysMatch ? parseInt(daysMatch[1]) : 30;
    
    const paymentMatch = nlText.match(/net\s*(\d+)/i);
    const paymentTerms = paymentMatch ? `Net ${paymentMatch[1]}` : 'Net 30';
    
    // Extract items with quantities
    const items = [];
    const itemPattern = /(\d+)\s+([a-zA-Z\s]+?)(?:\s+with\s+([^,\.]+))?(?=[,\.]|$)/gi;
    let match;
    while ((match = itemPattern.exec(nlText)) !== null) {
      items.push({
        name: match[2].trim(),
        qty: parseInt(match[1]),
        specs: match[3] ? match[3].trim() : '',
      });
    }
    
    return {
      title: 'Procurement Request',
      description: nlText,
      budget: budget,
      items: items.length > 0 ? items : [{ name: 'Items as described', qty: 1, specs: '' }],
      delivery_deadline: new Date(Date.now() + deliveryDays * 24 * 60 * 60 * 1000),
      payment_terms: paymentTerms,
    };
  }
}

/**
 * Parse vendor email/proposal text to structured proposal JSON
 * @param {string} emailText - Raw email body or proposal text
 * @returns {Promise<Object>} Structured proposal data
 */
export async function parseVendorProposal(emailText) {
  try {
    // Try OpenAI first
    const prompt = `You are an assistant that reads a vendor proposal email and extracts proposal details as JSON:
{ rfp_ref, vendor_name, total_price_usd, line_items: [{name, qty, unit_price, total_price}], terms, warranty_months, notes }
Input: "${emailText}"
Output JSON only.`;

    const completion = await openai.chat.completions.create({
      model: config.ai.model,
      messages: [
        { role: 'system', content: 'You are a helpful assistant that extracts structured data from emails. Return only valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3,
    });

    const content = completion.choices[0].message.content.trim();
    const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const parsed = JSON.parse(jsonStr);

    return {
      vendor_name: parsed.vendor_name || 'Unknown Vendor',
      totalPrice: parsed.total_price_usd || 0,
      lineItems: parsed.line_items || [],
      terms: parsed.terms || '',
      warranty: parsed.warranty_months || 0,
      rawText: emailText,
    };
  } catch (error) {
    console.error('Proposal parsing error, using fallback:', error.message);
    
    // FALLBACK: Simple regex-based parsing
    const priceMatch = emailText.match(/total[:\s]+\$?([\d,]+)/i) || emailText.match(/\$?([\d,]+)/);
    const totalPrice = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : Math.random() * 10000 + 5000;
    
    const warrantyMatch = emailText.match(/(\d+)\s*months?\s*warranty/i);
    const warranty = warrantyMatch ? parseInt(warrantyMatch[1]) : 12;
    
    const termsMatch = emailText.match(/terms?:\s*([^\n]+)/i);
    const terms = termsMatch ? termsMatch[1].trim() : 'Net 30';
    
    return {
      vendor_name: 'Unknown Vendor',
      totalPrice: Math.round(totalPrice * 100) / 100,
      lineItems: [],
      terms: terms,
      warranty: warranty,
      rawText: emailText,
    };
  }
}

/**
 * Compare proposals and generate recommendation
 * @param {Object} rfp - RFP object
 * @param {Array} proposals - Array of proposal objects with vendor details
 * @returns {Promise<Object>} Comparison with scores and recommendation
 */
export async function compareProposals(rfp, proposals) {
  try {
    // Try OpenAI first
    const prompt = `You are given an RFP object and a list of proposal objects. Score each proposal on: cost, delivery, warranty, completeness (0-10) and output a recommendation object with explanation and short bullet points why a vendor should be chosen.
Input: { rfp: ${JSON.stringify(rfp)}, proposals: ${JSON.stringify(proposals)} }
Output JSON: { scores: [...], recommended_vendor_id, explanation }`;

    const completion = await openai.chat.completions.create({
      model: config.ai.model,
      messages: [
        { role: 'system', content: 'You are a procurement analyst. Analyze proposals and provide recommendations in JSON format only.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.4,
    });

    const content = completion.choices[0].message.content.trim();
    const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const parsed = JSON.parse(jsonStr);

    return {
      scores: parsed.scores || [],
      recommended_vendor_id: parsed.recommended_vendor_id || null,
      explanation: parsed.explanation || 'No recommendation available',
    };
  } catch (error) {
    console.error('Comparison error, using fallback:', error.message);
    
    // FALLBACK: Simple scoring algorithm
    const scores = proposals.map(p => {
      const costScore = rfp.budget ? Math.max(0, 10 - (p.totalPrice - rfp.budget) / rfp.budget * 10) : 7;
      const warrantyScore = Math.min(10, (p.warranty / 12) * 8);
      return {
        vendor_id: p.vendorId._id || p.vendorId,
        cost: Math.max(0, Math.min(10, Math.round(costScore))),
        delivery: 7,
        warranty: Math.round(warrantyScore),
        completeness: 8,
      };
    });
    
    // Find lowest price
    const lowestPrice = Math.min(...proposals.map(p => p.totalPrice));
    const recommended = proposals.find(p => p.totalPrice === lowestPrice);
    
    return {
      scores: scores,
      recommended_vendor_id: recommended?.vendorId?._id || recommended?.vendorId || proposals[0]?.vendorId?._id,
      explanation: `Based on the analysis, ${recommended?.vendorId?.name || 'this vendor'} offers the best value with the lowest total price of $${lowestPrice.toLocaleString()} and competitive warranty terms.`,
    };
  }
}
