export interface FinTechLoanRecord {
  id: string;
  applicantId: string;
  loanAmount: number;
  creditScore: number;
  annualIncome: number;
  dti: number; // Debt-to-Income percentage
  interestRate: number;
  defaultProbability: number; // Percentage
  fraudScore: number; // 0 - 100
  underwritingTier: 'Prime+' | 'Prime' | 'Near-Prime' | 'Subprime';
  status: 'Approved' | 'Rejected' | 'Under Review' | 'Defaulted';
  repaymentVelocityDays: number;
  expectedYield: number;
}

export function generateFintechDataset(count: number = 160): FinTechLoanRecord[] {
  const records: FinTechLoanRecord[] = [];

  for (let i = 0; i < count; i++) {
    const creditScore = 550 + Math.floor(Math.random() * 280);
    const annualIncome = 38000 + Math.floor(Math.random() * 140000);
    const loanAmount = 3000 + Math.floor(Math.random() * 42000);
    const dti = Number((12 + (850 - creditScore) * 0.08 + (Math.random() * 10 - 5)).toFixed(1));

    let underwritingTier: FinTechLoanRecord['underwritingTier'] = 'Prime';
    let baseRate = 8.5;

    if (creditScore >= 760) {
      underwritingTier = 'Prime+';
      baseRate = 6.2;
    } else if (creditScore >= 680) {
      underwritingTier = 'Prime';
      baseRate = 9.8;
    } else if (creditScore >= 620) {
      underwritingTier = 'Near-Prime';
      baseRate = 15.4;
    } else {
      underwritingTier = 'Subprime';
      baseRate = 24.5;
    }

    const interestRate = Number((baseRate + (Math.random() * 2 - 1)).toFixed(2));
    const fraudScore = Math.floor(Math.random() * 85) + (dti > 45 ? 12 : 0);
    const defaultProbability = Number(
      Math.min(95, Math.max(1.2, ((850 - creditScore) * 0.12 + (dti * 0.4) + (Math.random() * 6 - 3)))).toFixed(1)
    );

    let status: FinTechLoanRecord['status'] = 'Approved';
    if (fraudScore > 75 || defaultProbability > 40) {
      status = 'Rejected';
    } else if (defaultProbability > 22 || fraudScore > 50) {
      status = Math.random() > 0.5 ? 'Under Review' : 'Approved';
    } else if (defaultProbability > 18 && Math.random() < 0.15) {
      status = 'Defaulted';
    }

    const expectedYield = Math.round(loanAmount * (interestRate / 100) * (1 - defaultProbability / 100));

    records.push({
      id: `LN-${5000 + i}`,
      applicantId: `USR-${9000 + i}`,
      loanAmount,
      creditScore,
      annualIncome,
      dti,
      interestRate,
      defaultProbability,
      fraudScore,
      underwritingTier,
      status,
      repaymentVelocityDays: 30 + Math.floor(Math.random() * 60),
      expectedYield,
    });
  }

  return records;
}
