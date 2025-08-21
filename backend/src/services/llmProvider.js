
const uuid = require('uuid').v4;

class LLMProvider {
  constructor({stubMode}) {
    this.stubMode = stubMode;
  }

  classify(text) {
    if (this.stubMode) {
      const t = text.toLowerCase();
      let score = 0.0, category = 'other';
      if (t.match(/refund|invoice|charge|billing/)) { category='billing'; score=0.9; }
      else if (t.match(/error|bug|stack|exception/)) { category='tech'; score=0.85; }
      else if (t.match(/delivery|shipment|tracking|package/)) { category='shipping'; score=0.8; }
      else { category='other'; score=0.45; }
      return Promise.resolve({ predictedCategory: category, confidence: score, modelInfo: { provider: 'stub', model: 'stub-v1', promptVersion: 1 } });
    }
    // real provider would go here
    return Promise.reject(new Error('Not implemented'));
  }

  draft(text, articles) {
    if (this.stubMode) {
      const lines = [
        `Hello — thanks for raising this.`,
        `I looked into your issue and here are some helpful articles:`
      ];
      articles.forEach((a, idx) => {
        lines.push(`${idx+1}. ${a.title} — See excerpt: "${a.body.slice(0,120)}..."`);
      });
      lines.push(`If this doesn't solve it, we'll assign a human and follow up.`);
      const draft = lines.join('\n\n');
      return Promise.resolve({ draftReply: draft, citations: articles.map(a=>String(a._id)), modelInfo: { provider: 'stub', model: 'stub-v1', promptVersion: 1 } });
    }
    return Promise.reject(new Error('Not implemented'));
  }
}

module.exports = LLMProvider;
