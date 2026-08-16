// Simple, transparent rule-based eligibility & profile-match engine.
// Weights sum to 100. Each criterion is checked independently and explained,
// so the score is never a mysterious black-box number.

export const WEIGHTS = {
  course: 20,
  year: 15,
  marks: 15,
  income: 20,
  category: 10,
  location: 10,
  documents: 10,
};

function docsSubmittedFor(opportunity, documents) {
  const required = opportunity.requiredDocuments || [];
  if (required.length === 0) return { have: 0, total: 0, missing: [] };
  const have = required.filter((docType) =>
    documents.some((d) => d.type === docType && d.status !== 'Rejected')
  );
  const missing = required.filter((docType) => !have.includes(docType));
  return { have: have.length, total: required.length, missing };
}

export function evaluateOpportunity(student, opportunity, documents = []) {
  const checks = [];
  let score = 0;

  // Course
  const courseMatch =
    !opportunity.eligibleCourses ||
    opportunity.eligibleCourses.length === 0 ||
    opportunity.eligibleCourses.includes(student.course);
  checks.push({
    key: 'course',
    label: 'Course',
    yourValue: student.course || '—',
    required: opportunity.eligibleCourses?.join(', ') || 'Any course',
    pass: courseMatch,
  });
  if (courseMatch) score += WEIGHTS.course;

  // Year
  const yearMatch =
    !opportunity.eligibleYears ||
    opportunity.eligibleYears.length === 0 ||
    opportunity.eligibleYears.includes(student.year);
  checks.push({
    key: 'year',
    label: 'Year',
    yourValue: student.year || '—',
    required: opportunity.eligibleYears?.join(', ') || 'Any year',
    pass: yearMatch,
  });
  if (yearMatch) score += WEIGHTS.year;

  // Marks (use CGPA-derived % if available, else 12th %)
  const studentMarks = Number(student.cgpa ? student.cgpa * 9.5 : student.twelfthPercentage) || 0;
  const marksMatch = studentMarks >= (opportunity.minimumMarks || 0);
  checks.push({
    key: 'marks',
    label: 'Minimum Marks',
    yourValue: `${studentMarks.toFixed(1)}%`,
    required: `${opportunity.minimumMarks || 0}%`,
    pass: marksMatch,
  });
  if (marksMatch) score += WEIGHTS.marks;

  // Income
  const incomeMatch = Number(student.familyIncome || 0) <= (opportunity.incomeLimit || Infinity);
  checks.push({
    key: 'income',
    label: 'Family Income Limit',
    yourValue: student.familyIncome ? `₹${Number(student.familyIncome).toLocaleString('en-IN')}` : '—',
    required: opportunity.incomeLimit ? `Within ₹${opportunity.incomeLimit.toLocaleString('en-IN')}` : 'No limit',
    pass: incomeMatch,
  });
  if (incomeMatch) score += WEIGHTS.income;

  // Category
  const categoryMatch =
    !opportunity.eligibleCategories ||
    opportunity.eligibleCategories.length === 0 ||
    opportunity.eligibleCategories.includes(student.category);
  checks.push({
    key: 'category',
    label: 'Category',
    yourValue: student.category || '—',
    required: opportunity.eligibleCategories?.join(', ') || 'All categories',
    pass: categoryMatch,
  });
  if (categoryMatch) score += WEIGHTS.category;

  // Location / state
  const locationMatch =
    !opportunity.eligibleStates ||
    opportunity.eligibleStates.length === 0 ||
    opportunity.eligibleStates.includes(student.state);
  checks.push({
    key: 'location',
    label: 'State / Location',
    yourValue: student.state || '—',
    required: opportunity.eligibleStates?.join(', ') || 'All India',
    pass: locationMatch,
  });
  if (locationMatch) score += WEIGHTS.location;

  // Documents
  const docStatus = docsSubmittedFor(opportunity, documents);
  const docsMatch = docStatus.total === 0 || docStatus.have === docStatus.total;
  checks.push({
    key: 'documents',
    label: 'Required Documents',
    yourValue: docStatus.total ? `${docStatus.have}/${docStatus.total}` : 'None required',
    required: docStatus.total ? `${docStatus.total}/${docStatus.total}` : '—',
    pass: docsMatch,
    partial: !docsMatch && docStatus.have > 0,
  });
  if (docsMatch) score += WEIGHTS.documents;
  else if (docStatus.have > 0) score += Math.round(WEIGHTS.documents * (docStatus.have / docStatus.total));

  const hardFails = checks.filter((c) => !c.pass && c.key !== 'documents');
  let status = 'ready';
  if (hardFails.length > 0) status = 'not-eligible';
  else if (!docsMatch) status = 'almost-ready';

  return {
    score: Math.round(score),
    checks,
    status, // 'ready' | 'almost-ready' | 'not-eligible'
    missingDocuments: docStatus.missing,
  };
}

export function rankOpportunities(student, opportunities, documents) {
  return opportunities
    .map((op) => ({ opportunity: op, evaluation: evaluateOpportunity(student, op, documents) }))
    .sort((a, b) => b.evaluation.score - a.evaluation.score);
}
