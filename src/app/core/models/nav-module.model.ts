export type NavCategory = 'Operation' | 'Report' | 'Setup';

export interface NavFeature {
  label: string;
  path: string;
}

export interface NavFeatureGroup {
  label: string;
  children: NavFeature[];
}

export interface NavCategoryNode {
  label: NavCategory;
  children: NavFeatureGroup[];
}

export interface NavModule {
  id: string;
  label: string;
  children: NavCategoryNode[];
}

export interface NavModuleGroup {
  id: string;
  label: string;
  icon: string;
  children: NavModule[];
}

const defaultReports = (): NavFeatureGroup[] => [
  group('Operational Reports', ['Daily Summary', 'Exception Report', 'Activity Register', 'Pending Items']),
  group('Management Reports', ['Performance Dashboard', 'Compliance Summary', 'Aging Analysis', 'Audit Trail'])
];

const defaultSetup = (): NavFeatureGroup[] => [
  group('Configuration', ['General Setup', 'Approval Matrix', 'Limit Setup', 'Document Rules', 'Notification Rules']),
  group('Reference Data', ['Product Setup', 'Branch Setup', 'Code Maintenance', 'Holiday Calendar'])
];

function slug(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function group(label: string, features: string[]): NavFeatureGroup {
  return {
    label,
    children: features.map((feature) => ({ label: feature, path: slug(feature) }))
  };
}

function categories(
  operationGroups: NavFeatureGroup[],
  setupGroups = defaultSetup(),
  reportGroups = defaultReports()
): NavCategoryNode[] {
  return [
    { label: 'Operation', children: operationGroups },
    { label: 'Report', children: reportGroups },
    { label: 'Setup', children: setupGroups }
  ];
}

export const NAV_TREE: NavModuleGroup[] = [
  {
    id: 'banking',
    label: 'Banking',
    icon: 'bank',
    children: [
      {
        id: 'core-banking',
        label: 'Core Banking',
        children: categories([
          group('Customer Management', [
            'Customer Registration',
            'Customer Search',
            'Customer Update',
            'Customer Merge',
            'Blacklist Customer',
            'Customer Status',
            'Customer Timeline'
          ]),
          group('Account Management', ['Open Account', 'Account Search', 'Account Update', 'Account Hold', 'Close Account', 'Account Statement']),
          group('Loan Management', ['Loan Application', 'Loan Appraisal', 'Loan Approval', 'Disbursement', 'Repayment Schedule', 'Loan Restructure']),
          group('Transaction', ['Cash Deposit', 'Cash Withdrawal', 'Fund Transfer', 'Transaction Reversal', 'Transaction Authorization']),
          group('Cheque', ['Cheque Book Request', 'Cheque Issue', 'Stop Cheque', 'Cheque Clearing', 'Cheque Status']),
          group('Remittance', ['New Remittance', 'Remittance Search', 'Payout', 'Cancel Remittance', 'Remittance Register']),
          group('Deposit Products', [
            'Term Deposit Open',
            'Deposit Renewal',
            'Premature Encashment',
            'Interest Instruction',
            'Maturity Calendar',
            'Lien Marking'
          ]),
          group('Card Services', ['Card Request', 'Card Activation', 'Card Limit Change', 'PIN Reset', 'Card Block', 'Card Replacement']),
          group('Standing Instruction', ['Instruction Create', 'Instruction Search', 'Instruction Update', 'Instruction Suspend', 'Execution History']),
          group('Clearing House', ['Inward Clearing', 'Outward Clearing', 'Return Instrument', 'Clearing Batch', 'Settlement Review']),
          group('Cash Vault', ['Vault Open', 'Vault Transfer', 'Cash Requisition', 'Cash Position', 'Vault Close', 'Cash Insurance']),
          group('Branch Operations', ['Branch Cash Summary', 'Teller Assignment', 'Service Desk Queue', 'End of Day', 'Branch Exceptions']),
          group('Compliance Review', ['KYC Exception', 'AML Screening', 'Sanction Hit Review', 'EDD Request', 'Risk Override', 'Review History']),
          group('Limit Management', ['Customer Limit', 'Account Limit', 'Transaction Limit', 'Temporary Limit', 'Limit Approval', 'Limit Audit']),
          group('Fee & Charge', ['Charge Assessment', 'Charge Waiver', 'Fee Reversal', 'Tax Calculation', 'Fee Register']),
          group('Document Service', ['Document Upload', 'Document Checklist', 'Document Verification', 'Document Expiry', 'Document Archive']),
          group('Notification Service', ['SMS Advice', 'Email Advice', 'Statement Alert', 'Failed Notification', 'Notification Preference']),
          group('Service Request', ['New Request', 'Request Search', 'Request Assignment', 'Request Escalation', 'Request Closure']),
          group('Dispute Management', ['Dispute Create', 'Dispute Search', 'Dispute Investigation', 'Provisional Credit', 'Dispute Resolution']),
          group('Relationship Management', ['RM Assignment', 'Portfolio View', 'Customer Notes', 'Follow-up Task', 'Opportunity Register']),
          group('Operational Approval', ['Pending Approval', 'Bulk Approval', 'Approval Delegation', 'Approval History', 'Rejected Items'])
        ])
      },
      {
        id: 'agent-banking',
        label: 'Agent Banking',
        children: categories([
          group('Agent Operations', ['Agent Onboarding', 'Agent Search', 'Agent Limit Update', 'Agent Settlement', 'Agent Commission']),
          group('Outlet Management', ['Outlet Registration', 'Outlet Search', 'Outlet Cash Position', 'Outlet Status'])
        ])
      },
      {
        id: 'mobile-banking',
        label: 'Mobile Banking',
        children: categories([
          group('Wallet Management', ['Wallet Registration', 'Wallet Search', 'Wallet Update', 'Wallet Freeze', 'Wallet Statement']),
          group('Mobile Transactions', ['Cash In', 'Cash Out', 'Merchant Payment', 'Bill Payment', 'Transaction Dispute'])
        ])
      },
      {
        id: 'internet-banking',
        label: 'Internet Banking',
        children: categories([
          group('User Enrollment', ['Enroll Customer', 'Credential Reset', 'Device Approval', 'Access Review']),
          group('Digital Services', ['Beneficiary Setup', 'Transfer Approval', 'Service Request', 'Session Review'])
        ])
      },
      {
        id: 'merchant-banking',
        label: 'Merchant Banking',
        children: categories([
          group('Merchant Management', ['Merchant Registration', 'Merchant Search', 'Merchant Update', 'Settlement Profile']),
          group('Settlement', ['Batch Settlement', 'Settlement Review', 'Fee Adjustment', 'Dispute Handling'])
        ])
      }
    ]
  },
  {
    id: 'compliance',
    label: 'Compliance',
    icon: 'shield',
    children: [
      {
        id: 'kyc',
        label: 'KYC',
        children: categories(
          [
            group('Person KYC', ['Customer Registration', 'KYC Profile', 'Document Capture', 'Identity Verification', 'Risk Classification', 'Approval Review']),
            group('Business Verification', ['Business Profile', 'Owner Information', 'Trade License Check', 'Address Verification', 'Business Risk Rating']),
            group('KYC Review', ['Pending Review', 'Send Back', 'Approve KYC', 'Reject KYC', 'Review History'])
          ],
          [
            group('KYC Configuration', ['Document Type Setup', 'Risk Rule Setup', 'Review Frequency', 'Approval Matrix']),
            group('Verification Setup', ['Provider Mapping', 'Required Field Setup', 'Checklist Setup'])
          ],
          [group('KYC Reports', ['Customer Register', 'Pending KYC', 'Rejected KYC', 'High Risk Customers', 'Verification Aging'])]
        )
      },
      {
        id: 'kyb',
        label: 'KYB',
        children: categories([
          group('Business Onboarding', ['Business Registration', 'Beneficial Owner Capture', 'Ownership Structure', 'Entity Verification', 'KYB Approval']),
          group('Legal Document Review', ['Registration Certificate', 'Tax Document', 'Trade License', 'Board Resolution', 'Document Exception'])
        ])
      },
      {
        id: 'aml-screening',
        label: 'AML Screening',
        children: categories([
          group('Watchlist Screening', ['Sanction Screening', 'PEP Screening', 'Adverse Media Search', 'Watchlist Match Review', 'False Positive Marking']),
          group('Screening Queue', ['Pending Matches', 'Escalated Matches', 'Batch Screening', 'Screening History'])
        ])
      },
      {
        id: 'customer-due-diligence',
        label: 'Customer Due Diligence',
        children: categories([
          group('CDD Review', ['CDD Checklist', 'Customer Risk Review', 'Profile Refresh', 'Source of Fund Review', 'Review Approval']),
          group('Enhanced Due Diligence', ['EDD Request', 'EDD Investigation', 'Senior Approval', 'EDD Closure'])
        ])
      },
      {
        id: 'transaction-monitoring',
        label: 'Transaction Monitoring',
        children: categories([
          group('Monitoring Alerts', ['Alert Queue', 'Alert Assignment', 'Alert Investigation', 'Alert Disposition', 'Alert Escalation']),
          group('Scenario Review', ['Threshold Breach', 'Velocity Pattern', 'Structuring Alert', 'Unusual Activity'])
        ])
      },
      {
        id: 'compliance-case-management',
        label: 'Compliance Case Management',
        children: categories([
          group('Case Operations', ['Create Case', 'Case Search', 'Case Assignment', 'Investigation Notes', 'Case Escalation', 'Case Closure']),
          group('Evidence Management', ['Evidence Upload', 'Evidence Review', 'Linked Alerts', 'Case Timeline'])
        ])
      },
      {
        id: 'regulatory-reporting',
        label: 'Regulatory Reporting',
        children: categories([
          group('Regulatory Submissions', ['STR Draft', 'SAR Draft', 'CTR Register', 'Submission Review', 'Regulator Response']),
          group('Compliance Registers', ['High Risk Register', 'PEP Register', 'Rejected Customer Register', 'Screening Register'])
        ])
      },
      {
        id: 'compliance-policy-setup',
        label: 'Compliance Policy & Setup',
        children: categories([
          group('Policy Configuration', ['Risk Policy', 'Screening Policy', 'CDD Policy', 'EDD Policy', 'Retention Policy']),
          group('Rule Configuration', ['Risk Score Rule', 'Alert Threshold', 'Escalation Rule', 'Review Calendar'])
        ])
      }
    ]
  },
  {
    id: 'survey',
    label: 'Survey',
    icon: 'map',
    children: [
      {
        id: 'land-survey',
        label: 'Land Survey',
        children: categories([
          group('Land Information', ['New Survey', 'Search Survey', 'Update Survey', 'GIS Map', 'Boundary Verification', 'Owner History']),
          group('Plot Management', ['Plot Registration', 'Plot Mutation', 'Plot Merge', 'Plot Split', 'Encumbrance Check'])
        ])
      },
      {
        id: 'it-equipment-survey',
        label: 'IT Equipment Survey',
        children: categories([
          group('Asset Inspection', ['New Inspection', 'Asset Search', 'Condition Update', 'Photo Evidence', 'Warranty Check']),
          group('Inventory Reconciliation', ['Scan Asset', 'Missing Asset', 'Transfer Request', 'Disposal Request'])
        ])
      },
      {
        id: 'vehicle-survey',
        label: 'Vehicle Survey',
        children: categories([
          group('Vehicle Inspection', ['New Vehicle Survey', 'Chassis Verification', 'Fitness Check', 'Ownership History', 'Valuation']),
          group('Route Assessment', ['Route Map', 'Mileage Review', 'Permit Check', 'Risk Notes'])
        ])
      },
      {
        id: 'building-survey',
        label: 'Building Survey',
        children: categories([
          group('Building Information', ['New Building Survey', 'Floor Details', 'Occupancy Review', 'Safety Checklist', 'Valuation']),
          group('Utility Review', ['Power Connection', 'Water Supply', 'Fire Safety', 'Maintenance History'])
        ])
      },
      {
        id: 'agricultural-survey',
        label: 'Agricultural Survey',
        children: categories([
          group('Farm Information', ['New Farm Survey', 'Crop Profile', 'Yield Estimate', 'Irrigation Review', 'Owner History']),
          group('Field Verification', ['Boundary Walk', 'Soil Notes', 'Photo Capture', 'Seasonal Risk'])
        ])
      }
    ]
  },
  {
    id: 'pos',
    label: 'POS',
    icon: 'receipt',
    children: [
      {
        id: 'retail-pos',
        label: 'Retail POS',
        children: categories([
          group('Sales Operation', ['New Sale', 'Return Sale', 'Hold Sale', 'Discount Approval', 'Receipt Reprint']),
          group('Cash Desk', ['Cash Open', 'Cash Close', 'Cash Transfer', 'Drawer Audit'])
        ])
      },
      {
        id: 'inventory-pos',
        label: 'Inventory POS',
        children: categories([group('Stock Operation', ['Stock Receive', 'Stock Transfer', 'Stock Adjustment', 'Stock Count', 'Reorder Review'])])
      }
    ]
  },
  {
    id: 'health-medical',
    label: 'Health & Medical',
    icon: 'medical',
    children: [
      {
        id: 'clinic-management',
        label: 'Clinic Management',
        children: categories([
          group('Patient Management', ['Patient Registration', 'Patient Search', 'Visit Update', 'Medical Timeline', 'Referral']),
          group('Appointment', ['Book Appointment', 'Queue Board', 'Reschedule', 'Cancel Appointment'])
        ])
      },
      {
        id: 'pharmacy',
        label: 'Pharmacy',
        children: categories([group('Prescription', ['New Prescription', 'Prescription Search', 'Dispense Medicine', 'Return Medicine'])])
      }
    ]
  },
  {
    id: 'education',
    label: 'Education',
    icon: 'education',
    children: [
      {
        id: 'student-administration',
        label: 'Student Administration',
        children: categories([
          group('Student Management', ['Student Admission', 'Student Search', 'Student Update', 'Guardian Profile', 'Student Timeline']),
          group('Academic Operation', ['Class Assignment', 'Attendance Entry', 'Exam Marks', 'Promotion'])
        ])
      },
      {
        id: 'fee-management',
        label: 'Fee Management',
        children: categories([group('Collection', ['Fee Invoice', 'Payment Entry', 'Waiver Approval', 'Due Follow-up'])])
      }
    ]
  },
  {
    id: 'e-commerce',
    label: 'E-Commerce',
    icon: 'cart',
    children: [
      {
        id: 'marketplace',
        label: 'Marketplace',
        children: categories([
          group('Order Management', ['Order Search', 'Order Review', 'Order Update', 'Cancellation', 'Return Request']),
          group('Catalog Management', ['Product Setup', 'Price Update', 'Stock Sync', 'Promotion Setup'])
        ])
      },
      {
        id: 'delivery',
        label: 'Delivery',
        children: categories([group('Fulfillment', ['Assign Rider', 'Dispatch Order', 'Delivery Update', 'Failed Delivery', 'Proof of Delivery'])])
      }
    ]
  },
  {
    id: 'finance',
    label: 'Finance',
    icon: 'briefcase',
    children: [
      {
        id: 'general-ledger',
        label: 'General Ledger',
        children: categories(
          [
            group('Journal Management', ['Journal Entry', 'Journal Search', 'Journal Approval', 'Journal Reversal', 'Recurring Journal']),
            group('Ledger Operation', ['Chart of Accounts', 'Ledger Posting', 'Trial Balance', 'Opening Balance', 'Period Close'])
          ],
          [group('Ledger Setup', ['Account Group Setup', 'Fiscal Year Setup', 'Posting Rule Setup', 'Currency Setup'])],
          [group('Ledger Reports', ['General Ledger', 'Trial Balance', 'Journal Register', 'Account Statement'])]
        )
      },
      {
        id: 'accounts-payable',
        label: 'Accounts Payable',
        children: categories(
          [
            group('Vendor Invoice', ['Invoice Entry', 'Invoice Search', 'Invoice Approval', 'Invoice Hold', 'Payment Request']),
            group('Vendor Payment', ['Payment Voucher', 'Payment Review', 'Payment Release', 'Advance Adjustment'])
          ],
          [group('Payable Setup', ['Vendor Setup', 'Payment Term Setup', 'Tax Rule Setup', 'Approval Matrix'])],
          [group('Payable Reports', ['Vendor Ledger', 'Aging Payable', 'Payment Register', 'Outstanding Invoice'])]
        )
      },
      {
        id: 'accounts-receivable',
        label: 'Accounts Receivable',
        children: categories(
          [
            group('Customer Invoice', ['Invoice Create', 'Invoice Search', 'Invoice Approval', 'Credit Note', 'Receipt Allocation']),
            group('Collection', ['Receipt Entry', 'Collection Review', 'Deposit Slip', 'Bad Debt Proposal'])
          ],
          [group('Receivable Setup', ['Customer Setup', 'Collection Rule Setup', 'Credit Term Setup'])],
          [group('Receivable Reports', ['Customer Ledger', 'Aging Receivable', 'Collection Register', 'Outstanding Bill'])]
        )
      },
      {
        id: 'budget-cost-control',
        label: 'Budget & Cost Control',
        children: categories([
          group('Budget Operation', ['Budget Create', 'Budget Revision', 'Budget Approval', 'Budget Transfer', 'Budget Utilization']),
          group('Cost Center Control', ['Cost Center Allocation', 'Expense Review', 'Variance Analysis', 'Commitment Tracking'])
        ])
      },
      {
        id: 'treasury-management',
        label: 'Treasury Management',
        children: categories([
          group('Cash & Bank', ['Bank Account Setup', 'Bank Reconciliation', 'Cash Forecast', 'Fund Transfer', 'Liquidity Position']),
          group('Investment & Borrowing', ['Investment Register', 'Maturity Review', 'Borrowing Register', 'Interest Accrual'])
        ])
      }
    ]
  },
  {
    id: 'administration',
    label: 'Administration',
    icon: 'gear',
    children: [
      {
        id: 'system-administration',
        label: 'System Administration',
        children: categories([
          group('User Administration', ['User Create', 'User Search', 'User Update', 'Deactivate User', 'Password Reset']),
          group('Role Administration', ['Role Create', 'Role Search', 'Permission Matrix', 'Role Assignment'])
        ])
      },
      {
        id: 'tenant-administration',
        label: 'Tenant Administration',
        children: categories([
          group('Tenant Management', ['Tenant Create', 'Tenant Search', 'Tenant Settings', 'Tenant Status']),
          group('Branch Management', ['Branch Create', 'Branch Search', 'Branch Update', 'Branch Status'])
        ])
      },
      {
        id: 'human-resource-management',
        label: 'Human Resource Management',
        children: categories(
          [
            group('Employee Management', ['Employee Onboarding', 'Employee Search', 'Employee Profile', 'Employment Status', 'Employee Transfer']),
            group('Attendance & Leave', ['Attendance Entry', 'Attendance Review', 'Leave Application', 'Leave Approval', 'Roster Management'])
          ],
          [group('HR Setup', ['Department Setup', 'Designation Setup', 'Leave Type Setup', 'Shift Setup', 'Holiday Calendar'])],
          [group('HR Reports', ['Employee Register', 'Attendance Summary', 'Leave Balance', 'Headcount Report'])]
        )
      },
      {
        id: 'payroll-management',
        label: 'Payroll Management',
        children: categories(
          [
            group('Payroll Processing', ['Salary Structure', 'Payroll Run', 'Payroll Review', 'Payroll Approval', 'Salary Disbursement']),
            group('Payroll Adjustment', ['Allowance Entry', 'Deduction Entry', 'Overtime Calculation', 'Bonus Processing', 'Tax Adjustment'])
          ],
          [group('Payroll Setup', ['Pay Grade Setup', 'Allowance Setup', 'Deduction Setup', 'Tax Slab Setup', 'Bank Advice Setup'])],
          [group('Payroll Reports', ['Payslip', 'Salary Register', 'Tax Statement', 'Payroll Summary'])]
        )
      },
      {
        id: 'fixed-asset-management',
        label: 'Fixed Asset Management',
        children: categories(
          [
            group('Asset Lifecycle', ['Asset Registration', 'Asset Search', 'Asset Transfer', 'Asset Maintenance', 'Asset Disposal']),
            group('Asset Accounting', ['Asset Capitalization', 'Depreciation Run', 'Depreciation Review', 'Asset Revaluation'])
          ],
          [group('Asset Setup', ['Asset Category Setup', 'Location Setup', 'Depreciation Method', 'Custodian Setup'])],
          [group('Asset Reports', ['Asset Register', 'Depreciation Schedule', 'Asset Movement', 'Disposal Register'])]
        )
      }
    ]
  },
  {
    id: 'security',
    label: 'Security',
    icon: 'lock',
    children: [
      {
        id: 'access-control',
        label: 'Access Control',
        children: categories([
          group('Privilege Management', ['Menu Privilege', 'API Privilege', 'Data Scope', 'Approval Rule', 'Access Review']),
          group('Session Security', ['Active Sessions', 'Force Logout', 'Device Trust', 'Login History'])
        ])
      },
      {
        id: 'audit-security',
        label: 'Audit Security',
        children: categories([group('Audit Review', ['Audit Search', 'Sensitive Action Review', 'Exception Review', 'Export Audit'])])
      }
    ]
  },
  {
    id: 'reporting',
    label: 'Reporting',
    icon: 'bar-chart',
    children: [
      {
        id: 'enterprise-reports',
        label: 'Enterprise Reports',
        children: categories([
          group('KYC Reports', ['Customer Register', 'Pending KYC', 'Rejected KYC', 'High Risk Customers', 'Verification Aging']),
          group('Security Reports', ['User Access Report', 'Role Matrix', 'Login Report', 'Privilege Changes'])
        ])
      },
      {
        id: 'analytics',
        label: 'Analytics',
        children: categories([group('Dashboards', ['Executive Dashboard', 'Branch Dashboard', 'Risk Dashboard', 'Operational KPI'])])
      }
    ]
  }
];

export function pathKey(path: readonly number[]): string {
  return path.join('.');
}
