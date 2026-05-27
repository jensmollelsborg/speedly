import { useState, useMemo } from "react";

// ── Pictet design tokens (MUST be first) ──
const P={
  navy:"#1a2332",navyLight:"#2c3e50",
  gold:"#8b7355",goldLight:"#a89279",goldBg:"#f5f0e8",
  warmGray:"#f2efe9",
  border:"#e5e0d6",borderLight:"#ede9e1",
  text:"#1a2332",textMuted:"#5a6370",textLight:"#8a9099",
  accent:"#1a5f7a",accentLight:"#e8f2f6",
  red:"#8b3a3a",redBg:"#faf0f0",
  amber:"#7a5c2e",amberBg:"#faf5eb",
  green:"#3a6b3a",greenBg:"#f0f7f0",
  sans:'"Inter",-apple-system,sans-serif',
  serif:'Georgia,"Times New Roman",serif',
};
const BC={red:P.redBg,amber:P.amberBg,green:P.greenBg};
const TC={red:P.red,amber:P.amber,green:P.green};

// ── Data ──
const DATA=[
{id:"mas610",code:"SG-2026-001",name:"MAS Notice 610 — Submission of statistics and returns",reg:"MAS",juris:"SG",entity:["Pictet Singapore"],status:"In force",badge:"High",bc:"red",deadline:"2026-10-01",category:["Regulatory Reporting"],teams:["Finance Singapore","Risk Singapore"],reports:["MAS Form 1","SFA 04-N02"],summary:"Revised reporting granularity — 8-category asset-class breakdown in Form 1, new Form 1A supplement, exposure-class breakdowns in large exposures.",impact:"Pictet SG files Form 1 monthly and SFA 04-N02 quarterly. New granularity requires data model changes. Form 1A needs SA-CCR output not currently structured for reporting.",timeline:[{d:"2026-03-15",l:"Published"},{d:"2026-06-30",l:"Consultation closed"},{d:"2026-10-01",l:"Effective"}],refs:["MAS Notice 610 (Revised Oct 2026)","MAS Notice 610 (Nov 2023)","MAS Notice SFA 04-N02"],skills:["regulator-watch","reg-impact-assessor"],contexts:["pictet-singapore","capital-liquidity-requirements"],gaps:["No tech team mapped","No data lineage","SA vs IRB unknown"],reportDetails:[{name:"MAS Form 1",sev:"Major",freq:"Monthly",owner:"Finance Singapore",lastProduced:"2026-04-30",lastFeedback:"MAS queried asset-class granularity in Q1 — requested resubmission with additional breakdowns.",sections:[{s:"§3 Credit risk",c:"8-category breakdown (was 3)",d:"Exposure data, RWA"},{s:"New: Form 1A",c:"New SA supplement",d:"SA-CCR, collateral haircuts"}]},{name:"SFA 04-N02",sev:"Moderate",freq:"Quarterly",owner:"Risk Singapore",lastProduced:"2026-03-31",lastFeedback:"No issues in last filing. Clean submission.",sections:[{s:"§2 Large exposures",c:"Exposure-class breakdowns for CMS",d:"Counterparty data by asset class"}]}],actions:[{id:"A1",title:"Extend capital adequacy data model",effort:"Heavy",owner:"Finance Singapore",deadline:"2026-09-01",desc:"Modify data model for 8 asset classes. Add internal-to-MAS mapping. Update Form 1 generation. Create Form 1A from SA-CCR engine.",tests:["All 8 asset classes populated in test Form 1","Form 1A generates for SA entities","Regression: old 3-cat totals = sum of new 8","RWA reconciliation: Form 1 §3 matches Form 1A","MASNET XML schema validation passes"]},{id:"A2",title:"Update SFA 04-N02 template",effort:"Medium",owner:"Risk Singapore",deadline:"2026-09-01",desc:"Add exposure-class breakdown columns to quarterly return.",tests:["Exposure-class columns present","Breakdown sum = total per counterparty","Regression: existing totals unchanged"]}]},
{id:"finma-opres",code:"CH-2026-001",name:"FINMA Circular 2026/x — Operational resilience",reg:"FINMA",juris:"CH",entity:["Geneva HQ","Luxembourg"],status:"Consultation",badge:"Medium",bc:"amber",deadline:"2027-01-01",category:["Operational Resilience"],teams:["Group Compliance","Group Risk","Compliance Luxembourg"],reports:["Annual regulatory audit","ICT incident report (new)"],summary:"24h ICT incident reporting, critical third-party register, annual BCP testing, board-level resilience officer.",impact:"Geneva HQ has no dedicated op-res framework. Current ICT escalation SLA is 72h vs required 24h. Luxembourg may need DORA alignment.",timeline:[{d:"2026-05-01",l:"Draft published"},{d:"2026-09-15",l:"Consultation closes"},{d:"2027-01-01",l:"Expected effective"}],refs:["FINMA Circular 2026/x (draft)","FINMA Circular 2023/1","DORA — Regulation (EU) 2022/2554"],skills:["regulator-watch","reg-impact-assessor","policy-compliance-checker"],contexts:["pictet-geneva-hq","pictet-luxembourg","reports-finma-geneva"],gaps:["No tech team mapped","No op-resilience context","New report unassigned","No ICT incident taxonomy"],reportDetails:[{name:"Annual regulatory audit",sev:"Moderate",freq:"Annual",owner:"Group Compliance",lastProduced:"2025-12-15",lastFeedback:"Auditors flagged absence of formal operational resilience framework.",sections:[{s:"New: Op resilience annex",c:"Auditors attest to ICT + BCP capability",d:"Incident logs, BCP records, vendor register"}]},{name:"ICT incident report (new)",sev:"New obligation",freq:"Ad-hoc (24h)",owner:"Not assigned",lastProduced:"Never",lastFeedback:"New obligation — no prior filings.",sections:[{s:"Entire report",c:"New filing to FINMA",d:"ICT incident classification, timeline, remediation"}]}],actions:[{id:"A1",title:"Build ICT incident reporting workflow",effort:"Heavy",owner:"TBD",deadline:"2026-12-01",desc:"Design classification + escalation workflow with 24h SLA.",tests:["Critical incident → notification within 24h","Audit trail for threshold-assessed incidents","Below-threshold logged not escalated","Template has all required FINMA fields"],blocked:true},{id:"A2",title:"Create third-party risk register",effort:"Medium",owner:"Operations + IT Risk",deadline:"2026-11-01",desc:"Extend SG outsourcing register group-wide.",tests:["All critical vendors migrated","Each has criticality + exit fields","BCP records linked"]},{id:"A3",title:"Annual BCP testing framework",effort:"Light",owner:"Group Risk",deadline:"2026-11-01",desc:"Formalise BCP testing into documented annual cycle.",tests:["Template has all circular-required fields","At least one test documented in 12 months"]}]},
{id:"finma-ai",code:"CH-2026-002",name:"FINMA Guidance 2026 — AI in financial services",reg:"FINMA",juris:"CH",entity:["Geneva HQ","Pictet Asset Management"],status:"In force",badge:"High",bc:"red",deadline:"2026-12-01",category:["Technology"],teams:["Group Compliance","PAM Compliance","IT Risk"],reports:["Annual regulatory audit"],summary:"Model risk governance, explainability for client-facing AI, third-party AI vendor due diligence.",impact:"Impacts AI/ML models in portfolio construction, suitability, risk management.",timeline:[{d:"2026-02-01",l:"Published"},{d:"2026-12-01",l:"Effective"}],refs:["FINMA Guidance on AI (2026)"],skills:["regulator-watch","reg-impact-assessor"],contexts:["pictet-geneva-hq","pictet-asset-management"],gaps:["No AI/ML model inventory"],reportDetails:[{name:"Annual regulatory audit",sev:"Moderate",freq:"Annual",owner:"Group Compliance",lastProduced:"2025-12-15",lastFeedback:"No AI-specific findings. New annex from next cycle.",sections:[{s:"New: AI governance annex",c:"Model inventory and governance review",d:"Model inventory, validation records"}]}],actions:[{id:"A1",title:"Create AI/ML model inventory",effort:"Heavy",owner:"IT Risk",deadline:"2026-09-01",desc:"Catalogue all AI/ML models across Geneva and PAM.",tests:["All production models listed","Risk classification assigned"]},{id:"A2",title:"Model validation framework",effort:"Heavy",owner:"Group Risk",deadline:"2026-10-01",desc:"Independent validation for client-facing AI models.",tests:["Validation report per high-risk model","Explainability metric documented"]}]},
{id:"mas-aml",code:"SG-2026-002",name:"MAS Notice — Enhanced AML/CFT requirements",reg:"MAS",juris:"SG",entity:["Pictet Singapore"],status:"In force",badge:"High",bc:"red",deadline:"2026-08-01",category:["AML","KYC"],teams:["Compliance Singapore","AML Unit (Geneva)"],reports:["MAS Notice 626"],summary:"Enhanced CDD for virtual asset clients, new BO verification, expanded PEP screening.",impact:"Pictet SG must update KYC for virtual asset exposure.",timeline:[{d:"2026-01-15",l:"Published"},{d:"2026-08-01",l:"Effective"}],refs:["MAS AML/CFT Notice 2026","MAS Notice 626"],skills:["regulator-watch","reg-impact-assessor"],contexts:["pictet-singapore","aml-cft-framework"],gaps:["No virtual asset taxonomy"],reportDetails:[{name:"MAS Notice 626",sev:"Major",freq:"Annual",owner:"Compliance Singapore",lastProduced:"2025-12-31",lastFeedback:"MAS noted room for improvement in BO verification depth.",sections:[{s:"§3 CDD",c:"New virtual asset client category",d:"Client classification, BO verification"},{s:"§5 PEP screening",c:"Expanded PEP definition",d:"Screening hit data"}]}],actions:[{id:"A1",title:"Update KYC for virtual assets",effort:"Medium",owner:"Compliance Singapore",deadline:"2026-06-15",desc:"Add virtual asset client classification and enhanced CDD.",tests:["VA client type in onboarding","Enhanced CDD triggered"]},{id:"A2",title:"Expand PEP screening scope",effort:"Light",owner:"AML Unit (Geneva)",deadline:"2026-07-01",desc:"Update screening rules for expanded PEP definition.",tests:["New PEP categories in engine","Regression: existing hits unchanged"]}]},
{id:"cssf-dora",code:"LU-2026-001",name:"CSSF Circular — DORA implementation",reg:"CSSF",juris:"LU",entity:["Luxembourg"],status:"In force",badge:"High",bc:"red",deadline:"2027-01-17",category:["Operational Resilience","Technology"],teams:["Compliance Luxembourg","IT Risk","Operations Luxembourg"],reports:["CSSF incident report (new)","COREP"],summary:"Digital operational resilience: ICT risk management, incident reporting, third-party risk.",impact:"Luxembourg must implement full DORA framework including 4h major incident notification.",timeline:[{d:"2025-11-01",l:"CSSF circular published"},{d:"2027-01-17",l:"DORA effective"}],refs:["CSSF DORA Circular 2025","DORA Regulation (EU) 2022/2554"],skills:["regulator-watch","reg-impact-assessor"],contexts:["pictet-luxembourg","reports-cssf-luxembourg"],gaps:["No DORA policy-area context","4h channel TBD"],reportDetails:[{name:"CSSF incident report (new)",sev:"New obligation",freq:"Ad-hoc (4h)",owner:"Compliance Luxembourg",lastProduced:"Never",lastFeedback:"New obligation.",sections:[{s:"Full report",c:"Major ICT incident notification",d:"Incident classification, impact, timeline"}]},{name:"COREP",sev:"Minor",freq:"Quarterly",owner:"Finance Luxembourg",lastProduced:"2026-03-31",lastFeedback:"Clean submission.",sections:[{s:"Operational risk section",c:"New DORA fields",d:"ICT risk metrics"}]}],actions:[{id:"A1",title:"DORA ICT risk framework",effort:"Heavy",owner:"IT Risk",deadline:"2026-10-01",desc:"Establish ICT risk management framework per DORA Chapter II.",tests:["ICT risk policy documented","BIA completed","Recovery time objectives set"]},{id:"A2",title:"Incident notification workflow",effort:"Heavy",owner:"Compliance Luxembourg",deadline:"2026-11-01",desc:"4h major incident notification to CSSF.",tests:["4h notification triggered","Classification matches RTS","Reports generated"]}]},
{id:"fatf-bo",code:"GL-2026-001",name:"FATF — Revised beneficial ownership guidance",reg:"FATF",juris:"Global",entity:["Geneva HQ","Luxembourg","Pictet Singapore"],status:"In force",badge:"High",bc:"red",deadline:"2026-12-31",category:["AML","KYC"],teams:["AML Unit (Geneva)","Compliance Luxembourg","Compliance Singapore"],reports:["MAS Notice 626","CSSF AML report"],summary:"Lowered BO thresholds (25%→10% high-risk), multi-layer look-through, nominee disclosure.",impact:"All entities must update BO identification procedures.",timeline:[{d:"2026-03-01",l:"Published"},{d:"2026-12-31",l:"Expected transposition"}],refs:["FATF BO Guidance 2026"],skills:["regulator-watch","reg-impact-assessor"],contexts:["aml-cft-framework","pictet-geneva-hq","pictet-luxembourg","pictet-singapore"],gaps:["National timelines differ"],reportDetails:[{name:"MAS Notice 626",sev:"Moderate",freq:"Annual",owner:"Compliance Singapore",lastProduced:"2025-12-31",lastFeedback:"See SG-2026-002.",sections:[{s:"BO section",c:"10% threshold for high-risk",d:"BO records"}]},{name:"CSSF AML report",sev:"Moderate",freq:"Annual",owner:"Compliance Luxembourg",lastProduced:"2026-03-31",lastFeedback:"No findings on BO.",sections:[{s:"BO procedures",c:"Updated thresholds",d:"BO data"}]}],actions:[{id:"A1",title:"Update BO identification procedures",effort:"Heavy",owner:"AML Unit (Geneva)",deadline:"2026-09-01",desc:"Revise group-wide BO policy: 10% threshold, multi-layer look-through.",tests:["10% threshold applied","Look-through for multi-layer","Nominee disclosure recorded"]}]},
{id:"cssf-aml",code:"LU-2026-002",name:"CSSF — 6AMLD transposition updates",reg:"CSSF",juris:"LU",entity:["Luxembourg"],status:"In force",badge:"High",bc:"red",deadline:"2026-09-01",category:["AML","KYC"],teams:["Compliance Luxembourg"],reports:["CSSF AML report"],summary:"Extended predicate offences, enhanced corporate liability, training frequency increase.",impact:"Luxembourg must update AML policies and increase training to semi-annual.",timeline:[{d:"2026-01-15",l:"Published"},{d:"2026-09-01",l:"Effective"}],refs:["CSSF 6AMLD Circular 2026"],skills:["regulator-watch","reg-impact-assessor"],contexts:["pictet-luxembourg","aml-cft-framework"],gaps:[],reportDetails:[{name:"CSSF AML report",sev:"Moderate",freq:"Annual",owner:"Compliance Luxembourg",lastProduced:"2026-03-31",lastFeedback:"Improve training documentation.",sections:[{s:"Predicate offences",c:"Extended list",d:"Risk assessment"},{s:"Training",c:"Semi-annual",d:"Training records"}]}],actions:[{id:"A1",title:"Update AML policy",effort:"Medium",owner:"Compliance Luxembourg",deadline:"2026-07-15",desc:"Revise for new predicate offences.",tests:["All predicates listed","Risk assessment updated"]},{id:"A2",title:"Increase training frequency",effort:"Light",owner:"Compliance Luxembourg",deadline:"2026-08-01",desc:"Annual to semi-annual.",tests:["Schedule updated","H1 training completed"]}]},
{id:"finma-esg",code:"CH-2026-003",name:"FINMA Circular 2026/y — ESG risk disclosure",reg:"FINMA",juris:"CH",entity:["Geneva HQ","Pictet Asset Management"],status:"Consultation",badge:"Medium",bc:"amber",deadline:"2027-06-01",category:["ESG","Regulatory Reporting"],teams:["Group Risk","PAM Compliance","Group Finance"],reports:["Annual regulatory audit"],summary:"Climate risk stress testing, ESG risk integration in ICAAP.",impact:"Requires quantitative climate scenarios in ICAAP.",timeline:[{d:"2026-04-01",l:"Consultation opened"},{d:"2027-06-01",l:"Expected effective"}],refs:["FINMA ESG Circular draft"],skills:["regulator-watch","reg-materiality-triage"],contexts:["pictet-geneva-hq","pictet-asset-management"],gaps:["No ESG policy-area context"],reportDetails:[{name:"Annual regulatory audit",sev:"Moderate",freq:"Annual",owner:"Group Compliance",lastProduced:"2025-12-15",lastFeedback:"ESG disclosures noted for enhancement.",sections:[{s:"New: ESG risk annex",c:"Climate stress testing review",d:"Scenario data"}]}],actions:[{id:"A1",title:"Integrate climate scenarios into ICAAP",effort:"Heavy",owner:"Group Risk",deadline:"2027-03-01",desc:"Add NGFS-aligned climate stress scenarios.",tests:["NGFS scenarios modelled","Capital impact calculated"]}]},
{id:"finma-liq",code:"CH-2026-004",name:"FINMA — Revised liquidity ordinance",reg:"FINMA",juris:"CH",entity:["Geneva HQ"],status:"In force",badge:"Medium",bc:"amber",deadline:"2026-10-01",category:["Capital & Liquidity"],teams:["Group Finance","Group Treasury"],reports:["Liquidity return (LCR/NSFR)"],summary:"Revised HQLA definitions, new intraday liquidity monitoring.",impact:"Updated HQLA classification and new intraday monitoring required.",timeline:[{d:"2026-02-01",l:"Published"},{d:"2026-10-01",l:"Effective"}],refs:["FINMA Revised LiqO 2026"],skills:["regulator-watch","reg-impact-assessor"],contexts:["pictet-geneva-hq","capital-liquidity-requirements"],gaps:[],reportDetails:[{name:"Liquidity return (LCR/NSFR)",sev:"Major",freq:"Monthly",owner:"Group Finance",lastProduced:"2026-04-30",lastFeedback:"Clean submission.",sections:[{s:"HQLA classification",c:"Revised definitions",d:"Asset data"},{s:"New: Intraday monitoring",c:"New section",d:"Intraday cash flows"}]}],actions:[{id:"A1",title:"Update HQLA classification",effort:"Medium",owner:"Group Finance",deadline:"2026-08-15",desc:"Reclassify assets under new definitions.",tests:["New categories applied","LCR recalculated"]},{id:"A2",title:"Intraday liquidity monitoring",effort:"Heavy",owner:"Group Treasury",deadline:"2026-09-01",desc:"Build intraday monitoring capability.",tests:["Data captured hourly","FINMA format report"]}]},
{id:"mas-sanctions",code:"SG-2026-003",name:"MAS — Updated sanctions screening",reg:"MAS",juris:"SG",entity:["Pictet Singapore"],status:"In force",badge:"Medium",bc:"amber",deadline:"2026-09-15",category:["AML","Sanctions"],teams:["Compliance Singapore","AML Unit (Geneva)"],reports:["Suspicious Transaction Reports"],summary:"Real-time wire screening, expanded sanctions lists, 24h remediation.",impact:"Batch screening must move to real-time for wires.",timeline:[{d:"2026-03-15",l:"Published"},{d:"2026-09-15",l:"Effective"}],refs:["MAS Sanctions Notice 2026"],skills:["regulator-watch","reg-impact-assessor"],contexts:["pictet-singapore","aml-cft-framework"],gaps:["No screening system context"],reportDetails:[{name:"Suspicious Transaction Reports",sev:"Moderate",freq:"Ad-hoc",owner:"Compliance Singapore",lastProduced:"2026-04-12",lastFeedback:"3 STRs filed Q1 2026. All accepted.",sections:[{s:"Screening section",c:"Real-time evidence required",d:"Screening logs"}]}],actions:[{id:"A1",title:"Real-time wire screening",effort:"Heavy",owner:"Compliance Singapore",deadline:"2026-08-01",desc:"Upgrade from batch to real-time.",tests:["Wires screened pre-execution","New lists integrated","24h SLA met"]}]},
{id:"finma-cyber",code:"CH-2026-005",name:"FINMA — Cyber risk reporting",reg:"FINMA",juris:"CH",entity:["Geneva HQ"],status:"In force",badge:"Medium",bc:"amber",deadline:"2026-09-01",category:["Technology"],teams:["IT Risk","Group Compliance"],reports:["Annual regulatory audit"],summary:"24h cyber incident reporting, annual cyber resilience self-assessment.",impact:"Cyber self-assessment is a new annual obligation.",timeline:[{d:"2026-02-15",l:"Published"},{d:"2026-09-01",l:"Effective"}],refs:["FINMA Cyber Risk Notice 2026"],skills:["regulator-watch","reg-impact-assessor"],contexts:["pictet-geneva-hq"],gaps:["Overlaps with op-res circular"],reportDetails:[{name:"Annual regulatory audit",sev:"Moderate",freq:"Annual",owner:"Group Compliance",lastProduced:"2025-12-15",lastFeedback:"No cyber findings. New annex next cycle.",sections:[{s:"New: Cyber resilience annex",c:"Self-assessment results",d:"Cyber risk metrics"}]}],actions:[{id:"A1",title:"Cyber resilience self-assessment",effort:"Medium",owner:"IT Risk",deadline:"2026-07-15",desc:"Design and execute annual framework.",tests:["Self-assessment completed","Results documented"]}]},
{id:"cssf-mifid",code:"LU-2026-003",name:"CSSF — MiFID II suitability updates",reg:"CSSF",juris:"LU",entity:["Luxembourg"],status:"In force",badge:"Medium",bc:"amber",deadline:"2026-09-01",category:["Conduct","KYC"],teams:["Compliance Luxembourg"],reports:["MiFID II transaction reports"],summary:"Sustainability preferences in suitability, cost disclosure revisions.",impact:"Advisory clients must have sustainability preferences recorded.",timeline:[{d:"2026-02-15",l:"Published"},{d:"2026-09-01",l:"Effective"}],refs:["CSSF MiFID II Circular 2026"],skills:["regulator-watch","reg-impact-assessor"],contexts:["pictet-luxembourg"],gaps:[],reportDetails:[{name:"MiFID II transaction reports",sev:"Minor",freq:"T+1",owner:"Compliance Luxembourg",lastProduced:"2026-05-26",lastFeedback:"Automated reporting normal. No ARM rejections.",sections:[{s:"Suitability fields",c:"Sustainability preference flags",d:"Client data"}]}],actions:[{id:"A1",title:"Update suitability questionnaire",effort:"Medium",owner:"Compliance Luxembourg",deadline:"2026-07-15",desc:"Add sustainability preferences.",tests:["Preferences captured","Matching validates"]}]},
{id:"cssf-pillar3",code:"LU-2026-004",name:"CSSF — Pillar III ESG disclosure",reg:"CSSF",juris:"LU",entity:["Luxembourg"],status:"In force",badge:"Medium",bc:"amber",deadline:"2026-12-31",category:["ESG","Regulatory Reporting"],teams:["Risk Luxembourg","Finance Luxembourg"],reports:["Pillar III disclosure"],summary:"Quantitative ESG risk metrics aligned with EBA ITS.",impact:"Add climate transition and physical risk metrics to Pillar III.",timeline:[{d:"2026-03-01",l:"Published"},{d:"2026-12-31",l:"Effective"}],refs:["CSSF Pillar III ESG Circular"],skills:["regulator-watch","reg-impact-assessor"],contexts:["pictet-luxembourg","reports-cssf-luxembourg"],gaps:["No ESG data pipeline"],reportDetails:[{name:"Pillar III disclosure",sev:"Major",freq:"Annual",owner:"Risk Luxembourg",lastProduced:"2025-12-31",lastFeedback:"CSSF noted ESG disclosures for improvement.",sections:[{s:"New: ESG risk tables",c:"Quantitative climate metrics",d:"Transition risk, physical risk, GAR"}]}],actions:[{id:"A1",title:"ESG Pillar III data pipeline",effort:"Heavy",owner:"Risk Luxembourg",deadline:"2026-10-01",desc:"Source metrics, compute GAR, populate EBA templates.",tests:["GAR computed","Transition risk populated","Physical risk populated"]}]},
{id:"eu-amlr",code:"LU-2026-005",name:"EU AML Regulation (AMLR)",reg:"EBA",juris:"LU",entity:["Luxembourg"],status:"In force",badge:"High",bc:"red",deadline:"2027-07-01",category:["AML","KYC"],teams:["Compliance Luxembourg","AML Unit (Geneva)"],reports:["CSSF AML report"],summary:"Harmonised CDD, €10k cash limit, AMLA authority.",impact:"Luxembourg must align to harmonised CDD standards.",timeline:[{d:"2024-07-19",l:"Adopted"},{d:"2027-07-01",l:"Application date"}],refs:["EU AMLR 2024/1624"],skills:["regulator-watch","reg-impact-assessor"],contexts:["pictet-luxembourg","aml-cft-framework"],gaps:["AMLA evolving"],reportDetails:[{name:"CSSF AML report",sev:"Major",freq:"Annual",owner:"Compliance Luxembourg",lastProduced:"2026-03-31",lastFeedback:"No CDD findings. Cash not yet assessed.",sections:[{s:"CDD procedures",c:"Harmonised EU standards",d:"Risk assessment"},{s:"Cash handling",c:"€10k limit",d:"Transaction monitoring"}]}],actions:[{id:"A1",title:"Harmonise CDD to AMLR",effort:"Heavy",owner:"Compliance Luxembourg",deadline:"2027-04-01",desc:"Align to AMLR standards.",tests:["CDD matches AMLR","Risk factors updated","BO register queried"]}]},
{id:"finma-outsourcing",code:"CH-2026-006",name:"FINMA Circular 2018/3 — Outsourcing (amendment)",reg:"FINMA",juris:"CH",entity:["Geneva HQ"],status:"In force",badge:"Low",bc:"green",deadline:"2026-07-01",category:["Operational Resilience"],teams:["Group Compliance","Operations Geneva"],reports:["Annual regulatory audit"],summary:"Enhanced notification for material outsourcing changes, cloud addenda.",impact:"Update outsourcing register and notification process.",timeline:[{d:"2026-01-01",l:"Published"},{d:"2026-07-01",l:"Effective"}],refs:["FINMA Circular 2018/3 (amended)"],skills:["regulator-watch"],contexts:["pictet-geneva-hq"],gaps:[],reportDetails:[{name:"Annual regulatory audit",sev:"Minor",freq:"Annual",owner:"Group Compliance",lastProduced:"2025-12-15",lastFeedback:"Outsourcing register adequate. Cloud addenda recommended.",sections:[{s:"Outsourcing section",c:"Updated notification",d:"Register"}]}],actions:[{id:"A1",title:"Update outsourcing notification",effort:"Light",owner:"Operations Geneva",deadline:"2026-06-01",desc:"Revise notification, add cloud addenda.",tests:["Template updated","Addenda available"]}]},
{id:"finma-rem",code:"CH-2026-007",name:"FINMA — Remuneration circular amendment",reg:"FINMA",juris:"CH",entity:["Geneva HQ"],status:"In force",badge:"Low",bc:"green",deadline:"2026-07-01",category:["Conduct"],teams:["Group HR","Group Compliance"],reports:["Annual regulatory audit"],summary:"Enhanced malus/clawback, ESG metrics in variable compensation.",impact:"HR policies need expanded clawback triggers and ESG KPIs.",timeline:[{d:"2026-01-15",l:"Published"},{d:"2026-07-01",l:"Effective"}],refs:["FINMA Remuneration amendment 2026"],skills:["regulator-watch"],contexts:["pictet-geneva-hq"],gaps:[],reportDetails:[{name:"Annual regulatory audit",sev:"Minor",freq:"Annual",owner:"Group Compliance",lastProduced:"2025-12-15",lastFeedback:"Remuneration compliant. ESG emerging.",sections:[{s:"Remuneration section",c:"Expanded clawback",d:"Comp data"}]}],actions:[{id:"A1",title:"Update remuneration policy",effort:"Medium",owner:"Group HR",deadline:"2026-06-01",desc:"Revise clawback, add ESG KPIs.",tests:["Clawback updated","ESG KPIs in scorecards"]}]},
{id:"mas-conduct",code:"SG-2026-004",name:"MAS — Fair dealing guidelines",reg:"MAS",juris:"SG",entity:["Pictet Singapore"],status:"In force",badge:"Low",bc:"green",deadline:"2026-10-01",category:["Conduct"],teams:["Compliance Singapore"],reports:[],summary:"Clearer switching disclosure and fee transparency.",impact:"Minor process update for client documentation.",timeline:[{d:"2026-05-01",l:"Published"},{d:"2026-10-01",l:"Effective"}],refs:["MAS Fair Dealing 2026"],skills:["regulator-watch"],contexts:["pictet-singapore"],gaps:[],reportDetails:[],actions:[{id:"A1",title:"Update switching disclosures",effort:"Light",owner:"Compliance Singapore",deadline:"2026-09-01",desc:"Revise disclosure templates.",tests:["Templates updated","Fee breakdown approved"]}]},
{id:"cssf-wb",code:"LU-2026-006",name:"CSSF — Whistleblowing framework",reg:"CSSF",juris:"LU",entity:["Luxembourg"],status:"In force",badge:"Low",bc:"green",deadline:"2026-07-01",category:["Conduct"],teams:["Compliance Luxembourg","HR Luxembourg"],reports:[],summary:"Updated whistleblowing channels and protection measures.",impact:"Update internal reporting channels.",timeline:[{d:"2026-03-01",l:"Published"},{d:"2026-07-01",l:"Effective"}],refs:["CSSF Whistleblowing 2026"],skills:["regulator-watch"],contexts:["pictet-luxembourg"],gaps:[],reportDetails:[],actions:[{id:"A1",title:"Update whistleblowing procedures",effort:"Light",owner:"Compliance Luxembourg",deadline:"2026-06-15",desc:"Revise channels.",tests:["Channel updated","Staff communicated"]}]},
{id:"eba-fp",code:"LU-2026-007",name:"EBA — Fit and proper guidelines",reg:"EBA",juris:"LU",entity:["Luxembourg"],status:"In force",badge:"Low",bc:"green",deadline:"2026-12-01",category:["Conduct"],teams:["Compliance Luxembourg","HR Luxembourg"],reports:[],summary:"ESG knowledge requirements for management body.",impact:"Board appointment needs ESG competency assessment.",timeline:[{d:"2026-04-01",l:"Published"},{d:"2026-12-01",l:"Effective"}],refs:["EBA Fit & Proper 2026"],skills:["regulator-watch"],contexts:["pictet-luxembourg"],gaps:[],reportDetails:[],actions:[{id:"A1",title:"Update fit and proper assessment",effort:"Light",owner:"Compliance Luxembourg",deadline:"2026-10-01",desc:"Add ESG competency criteria.",tests:["ESG criteria in template","Board assessed"]}]},
];

const JURIS=[...new Set(DATA.map(d=>d.juris))].sort();
const ENTITIES=[...new Set(DATA.flatMap(d=>d.entity))].sort();
const CATS=[...new Set(DATA.flatMap(d=>d.category))].sort();
const ALL_TEAMS=[...new Set(DATA.flatMap(d=>d.teams))].sort();
const ALL_REPORTS=[...new Set(DATA.flatMap(d=>d.reports).filter(Boolean))].sort();

// ── Shared components ──
function Badge({c,children}){return <span style={{display:"inline-block",fontSize:11,padding:"2px 10px",borderRadius:4,fontWeight:500,background:BC[c]||P.warmGray,color:TC[c]||P.textMuted,verticalAlign:"middle",letterSpacing:"0.3px"}}>{children}</span>;}
function GapN({n}){if(!n)return null;return <span style={{fontSize:11,color:P.amber,display:"inline-flex",alignItems:"center",gap:3}}><i className="ti ti-alert-triangle" style={{fontSize:12}}/>{n}</span>;}
function Src({sk,cx}){return <div style={{marginTop:8,padding:"6px 10px",background:P.warmGray,borderRadius:4,fontSize:11,color:P.textMuted,display:"flex",flexWrap:"wrap",gap:4,alignItems:"center"}}><span style={{fontWeight:500,marginRight:2}}>Source:</span>{sk?.map(s=><span key={s} style={{display:"inline-flex",alignItems:"center",gap:3,padding:"1px 7px",borderRadius:4,border:`0.5px solid ${P.border}`,color:P.accent,fontSize:11,background:P.accentLight}}><i className="ti ti-cpu" style={{fontSize:11}}/>{s}</span>)}{cx?.map(c=><span key={c} style={{display:"inline-flex",alignItems:"center",gap:3,padding:"1px 7px",borderRadius:4,border:`0.5px solid ${P.border}`,color:P.gold,fontSize:11,background:P.goldBg}}><i className="ti ti-database" style={{fontSize:11}}/>{c}</span>)}</div>;}
function Gap({children}){return <div style={{display:"flex",gap:8,padding:"6px 10px",borderRadius:4,background:P.amberBg,color:P.amber,fontSize:12,marginTop:8,alignItems:"flex-start",border:`0.5px solid ${P.borderLight}`}}><i className="ti ti-alert-triangle" style={{fontSize:13,marginTop:1,flexShrink:0}}/><span>{children}</span></div>;}

function Fold({title,sub,badges,children,startOpen=false}){
  const[o,setO]=useState(startOpen);
  return <div style={{background:"#fff",border:`0.5px solid ${P.border}`,borderRadius:4,marginBottom:10,overflow:"hidden"}}>
    <div onClick={e=>{e.stopPropagation();setO(x=>!x);}} style={{padding:"10px 12px",cursor:"pointer",display:"flex",gap:8,alignItems:"flex-start"}} onMouseEnter={e=>e.currentTarget.style.background=P.warmGray} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
      <span style={{fontSize:13,color:P.textLight,transition:"transform 0.2s",transform:o?"rotate(90deg)":"none",flexShrink:0,marginTop:2,display:"inline-block"}}>▶</span>
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}><span style={{fontSize:13,fontWeight:500,color:P.navy}}>{title}</span>{badges}</div>
        {sub&&<div style={{fontSize:12,color:P.textMuted,marginTop:2}}>{sub}</div>}
      </div>
    </div>
    {o&&<div style={{padding:"0 12px 12px 35px"}}>{children}</div>}
  </div>;
}

function Ask({hint}){
  const[v,setV]=useState("");
  return <div style={{padding:"12px 0 4px",borderTop:`0.5px solid ${P.border}`,marginTop:16}}>
    <div style={{display:"flex",gap:8}}>
      <input value={v} onChange={e=>setV(e.target.value)} placeholder={hint} style={{flex:1,fontSize:13,padding:"8px 12px",borderRadius:4,border:`0.5px solid ${P.border}`,background:"#fff",color:P.text,outline:"none"}} onKeyDown={e=>{if(e.key==="Enter"&&v.trim()){window.sendPrompt?.(v);setV("");}}}/>
      <button onClick={()=>{if(v.trim()){window.sendPrompt?.(v);setV("");}}} style={{padding:"8px 14px",borderRadius:4,border:`0.5px solid ${P.border}`,background:"transparent",cursor:"pointer",fontSize:13,color:P.text}}>Ask ↗</button>
    </div>
  </div>;
}

function Filters({f,set}){
  const s={fontSize:12,padding:"4px 8px",borderRadius:4,border:`0.5px solid ${P.border}`,background:"#fff",color:P.text,cursor:"pointer",outline:"none",maxWidth:130};
  return <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14,alignItems:"center"}}>
    <i className="ti ti-filter" style={{fontSize:14,color:P.textLight}}/>
    <select style={s} value={f.juris} onChange={e=>set(x=>({...x,juris:e.target.value}))}><option value="">Jurisdiction</option>{JURIS.map(j=><option key={j}>{j}</option>)}</select>
    <select style={s} value={f.entity} onChange={e=>set(x=>({...x,entity:e.target.value}))}><option value="">Entity</option>{ENTITIES.map(j=><option key={j}>{j}</option>)}</select>
    <select style={s} value={f.team} onChange={e=>set(x=>({...x,team:e.target.value}))}><option value="">Team</option>{ALL_TEAMS.map(j=><option key={j}>{j}</option>)}</select>
    <select style={s} value={f.report} onChange={e=>set(x=>({...x,report:e.target.value}))}><option value="">Report</option>{ALL_REPORTS.map(j=><option key={j}>{j}</option>)}</select>
    <select style={s} value={f.cat} onChange={e=>set(x=>({...x,cat:e.target.value}))}><option value="">Category</option>{CATS.map(j=><option key={j}>{j}</option>)}</select>
    {Object.values(f).some(Boolean)&&<button onClick={()=>set({juris:"",entity:"",team:"",report:"",cat:""})} style={{fontSize:11,color:P.textMuted,background:"none",border:"none",cursor:"pointer",textDecoration:"underline"}}>Clear</button>}
  </div>;
}

function JiraBtn({label,type}){
  const epic=type==="epic";
  return <button onClick={e=>{e.stopPropagation();alert(`[Demo] Would create Jira ${epic?"Epic":"Test"}: "${label}"`);}} style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,padding:"3px 10px",borderRadius:4,border:`0.5px solid ${epic?P.accent:P.green}`,background:epic?P.accentLight:P.greenBg,color:epic?P.accent:P.green,cursor:"pointer",fontWeight:500,whiteSpace:"nowrap"}}><i className="ti ti-brand-jira" style={{fontSize:12}}/>{epic?"Create epic":"Create test"}</button>;
}

function Logo(){return <svg width="38" height="38" viewBox="0 0 38 38" fill="none"><rect x="10" y="5" width="22" height="28" rx="3" fill={P.goldBg} stroke={P.gold} strokeWidth="1"/><line x1="16" y1="14" x2="26" y2="14" stroke={P.border} strokeWidth="1.2" strokeLinecap="round"/><line x1="16" y1="18" x2="24" y2="18" stroke={P.border} strokeWidth="1.2" strokeLinecap="round"/><line x1="16" y1="22" x2="22" y2="22" stroke={P.border} strokeWidth="1.2" strokeLinecap="round"/><line x1="16" y1="26" x2="25" y2="26" stroke={P.border} strokeWidth="1.2" strokeLinecap="round"/><circle cx="17" cy="17" r="7.5" fill="rgba(250,248,244,0.92)" stroke={P.navy} strokeWidth="1.3"/><line x1="11.5" y1="22.5" x2="5" y2="32" stroke={P.navy} strokeWidth="2" strokeLinecap="round"/><circle cx="17" cy="17" r="5" fill="none" stroke={P.goldLight} strokeWidth="0.4" strokeDasharray="1.5 1.5"/><path d="M6 1L2.5 8H7L3.5 14" fill="none" stroke={P.gold} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;}

const STEPS=[
  {id:"regwatch",n:"1",label:"Detect + triage"},
  {id:"deepreg",n:"2",label:"Regulation"},
  {id:"deepreport",n:"3",label:"Reports"},
  {id:"actions",n:"4",label:"Actions"},
];
const ACTORS={regwatch:[["AI",P.accent,P.accentLight]],deepreg:[["AI",P.accent,P.accentLight],["Human",P.gold,P.goldBg]],deepreport:[["AI",P.accent,P.accentLight],["Human",P.gold,P.goldBg]],actions:[["AI",P.accent,P.accentLight],["Human",P.gold,P.goldBg],["Jira",P.accent,P.accentLight]]};
const SUBLABELS={regwatch:"AI detects + screens",deepreg:"AI assesses · human reviews",deepreport:"AI maps · human validates",actions:"AI generates · human executes"};

// ── Main app ──
export default function App(){
  const[screen,setScreen]=useState("cover");
  const[selReg,setSelReg]=useState(null);
  const[filters,setFilters]=useState({juris:"",entity:"",team:"",report:"",cat:""});
  const[modal,setModal]=useState(null);

  const filtered=useMemo(()=>DATA.filter(d=>{
    if(filters.juris&&d.juris!==filters.juris)return false;
    if(filters.entity&&!d.entity.includes(filters.entity))return false;
    if(filters.team&&!d.teams.includes(filters.team))return false;
    if(filters.report&&!d.reports.includes(filters.report))return false;
    if(filters.cat&&!d.category.includes(filters.cat))return false;
    return true;
  }),[filters]);

  const reg=selReg?DATA.find(d=>d.id===selReg):null;
  const curIdx=STEPS.findIndex(s=>s.id===screen);
  const canNav=i=>i===0||selReg!=null;

  const cta={fontSize:13,color:"#fff",background:P.navy,border:"none",borderRadius:4,padding:"8px 18px",cursor:"pointer",fontWeight:500,display:"inline-flex",alignItems:"center",gap:4};
  const sec={fontSize:13,color:P.textMuted,background:"none",border:`0.5px solid ${P.border}`,borderRadius:4,padding:"8px 14px",cursor:"pointer"};
  const noSel=<div style={{padding:32,textAlign:"center"}}><div style={{fontSize:14,color:P.textLight,marginBottom:8}}>Select a regulation in step 1.</div><button onClick={()=>setScreen("regwatch")} style={sec}>← Back to detect + triage</button></div>;
  const meta=(l,v)=><div style={{padding:"6px 10px",background:P.warmGray,borderRadius:4}}><div style={{fontSize:12,color:P.textLight}}>{l}</div><div style={{fontSize:13,color:P.navy}}>{v}</div></div>;
  const tag=(t,bg,fg)=><span key={t} style={{fontSize:11,padding:"2px 8px",borderRadius:4,background:bg,color:fg}}>{t}</span>;

  // ── Cover ──
  if(screen==="cover"){
    return <div style={{fontFamily:P.sans,color:P.text}}>
      <style>{`@keyframes fu{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{minHeight:480,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"60px 24px",position:"relative",overflow:"hidden"}}>
        {[25,50,75].map(t=><div key={t} style={{position:"absolute",height:"0.5px",background:`linear-gradient(90deg,transparent,${P.border},transparent)`,width:"100%",top:t+"%"}}/>)}
        <div style={{marginBottom:40,opacity:0,animation:"fu 0.8s ease forwards 0.2s"}}><Logo/></div>
        <div style={{fontSize:12,letterSpacing:3,textTransform:"uppercase",color:P.gold,marginBottom:12,opacity:0,animation:"fu 0.6s ease forwards 0.5s"}}>Team 3</div>
        <div style={{fontFamily:P.serif,fontSize:42,fontWeight:400,color:P.navy,letterSpacing:"-0.5px",marginBottom:8,opacity:0,animation:"fu 0.6s ease forwards 0.7s"}}>Speedly</div>
        <div style={{width:48,height:1.5,background:P.gold,margin:"20px auto",opacity:0,animation:"fu 0.6s ease forwards 0.9s"}}/>
        <div style={{fontSize:16,fontWeight:300,color:P.textMuted,letterSpacing:0.5,opacity:0,animation:"fu 0.6s ease forwards 1.1s"}}>From regulation to action — with speed and impact</div>
        <div style={{marginTop:48,display:"flex",gap:0,alignItems:"flex-start",opacity:0,animation:"fu 0.6s ease forwards 1.4s",width:"100%",maxWidth:520,justifyContent:"center"}}>
          {STEPS.map((st,i)=><div key={st.id} style={{display:"flex",alignItems:"center",flex:1}}>
            <div style={{textAlign:"center",flex:1}}>
              <div style={{width:32,height:32,borderRadius:"50%",background:P.warmGray,border:`0.5px solid ${P.border}`,display:"inline-flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:500,color:P.navy,marginBottom:6}}>{st.n}</div>
              <div style={{fontSize:11,color:P.textMuted,letterSpacing:0.3}}>{st.label}</div>
            </div>
            {i<3&&<div style={{color:P.border,fontSize:14,flexShrink:0,margin:"-10px -4px 0"}}>→</div>}
          </div>)}
        </div>
        <div style={{marginTop:24,display:"flex",gap:24,alignItems:"center",opacity:0,animation:"fu 0.6s ease forwards 1.6s"}}>
          {["AI-powered","Multi-jurisdiction","End-to-end"].map((t,i)=><span key={i} style={{display:"flex",alignItems:"center"}}>{i>0&&<span style={{width:4,height:4,borderRadius:"50%",background:P.gold,marginRight:24}}/>}<span style={{fontSize:11,color:P.textLight,letterSpacing:1,textTransform:"uppercase"}}>{t}</span></span>)}
        </div>
        <button onClick={()=>setScreen("regwatch")} style={{marginTop:40,padding:"14px 36px",fontSize:14,fontWeight:500,letterSpacing:1,textTransform:"uppercase",color:"#fff",background:P.navy,border:"none",borderRadius:4,cursor:"pointer",display:"inline-flex",alignItems:"center",gap:8,opacity:0,animation:"fu 0.6s ease forwards 1.9s"}} onMouseEnter={e=>e.currentTarget.style.background=P.navyLight} onMouseLeave={e=>e.currentTarget.style.background=P.navy}>Demo →</button>
      </div>
    </div>;
  }

  // ── App shell ──
  return <div style={{padding:"0.75rem 0",fontFamily:P.sans,color:P.text,lineHeight:1.6}}>
    {/* Header */}
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24,paddingBottom:16,borderBottom:`0.5px solid ${P.border}`}}>
      <Logo/>
      <div>
        <div style={{fontSize:17,fontWeight:500,color:P.navy,fontFamily:P.serif,letterSpacing:"-0.2px"}}>Team 3: Speedly</div>
        <div style={{fontSize:11,color:P.textLight,letterSpacing:"1.5px",textTransform:"uppercase",marginTop:1}}>regulatory change management</div>
      </div>
    </div>

    {/* Workflow stepper */}
    <div style={{marginBottom:24}}>
      <div style={{display:"flex",alignItems:"flex-start"}}>
        {STEPS.map((st,i)=>{
          const active=screen===st.id;const done=curIdx>i;const locked=!canNav(i);
          return <div key={st.id} style={{display:"flex",alignItems:"center",flex:1}}>
            <div onClick={()=>{if(!locked)setScreen(st.id);}} style={{cursor:locked?"default":"pointer",opacity:locked?0.35:1,flex:1,textAlign:"center"}}>
              <div style={{display:"flex",justifyContent:"center",marginBottom:6,gap:4}}>
                {(ACTORS[st.id]||[]).map(([l,c,bg],j)=><div key={j} title={l} style={{width:22,height:22,borderRadius:"50%",background:bg,border:`0.5px solid ${c}`,display:"flex",alignItems:"center",justifyContent:"center"}}><i className={`ti ti-${l==="Human"?"user":l==="Jira"?"brand-jira":"cpu"}`} style={{fontSize:12,color:c}}/></div>)}
              </div>
              <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:4,background:active?P.navy:done?P.goldBg:P.warmGray,border:active?"none":`0.5px solid ${done?P.goldLight:P.border}`}}>
                <span style={{width:20,height:20,borderRadius:"50%",background:active?"rgba(255,255,255,0.2)":done?P.gold:P.border,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:500,color:active?"#fff":done?"#fff":P.textLight,flexShrink:0}}>{done?"✓":st.n}</span>
                <span style={{fontSize:12,fontWeight:active?500:400,color:active?"#fff":done?P.navy:P.textMuted,whiteSpace:"nowrap"}}>{st.label}</span>
              </div>
              <div style={{fontSize:10,color:P.textLight,marginTop:4}}>{SUBLABELS[st.id]}</div>
            </div>
            {i<3&&<div style={{flexShrink:0,margin:"14px -2px 0",color:P.textLight,fontSize:16}}>→</div>}
          </div>;
        })}
      </div>
      <div style={{display:"flex",gap:14,justifyContent:"center",marginTop:10,fontSize:11,color:P.textLight}}>
        {[["cpu","AI agent",P.accent,P.accentLight],["user","Human",P.gold,P.goldBg],["brand-jira","Jira",P.accent,P.accentLight]].map(([ic,l,c,bg])=><span key={l} style={{display:"inline-flex",alignItems:"center",gap:4}}><span style={{width:14,height:14,borderRadius:"50%",background:bg,border:`0.5px solid ${c}`,display:"inline-flex",alignItems:"center",justifyContent:"center"}}><i className={`ti ti-${ic}`} style={{fontSize:9,color:c}}/></span>{l}</span>)}
      </div>
    </div>

    {/* Selection banner */}
    {screen!=="regwatch"&&reg&&<div style={{display:"flex",alignItems:"center",gap:8,padding:"7px 12px",marginBottom:14,background:P.goldBg,borderRadius:4,fontSize:12,border:`0.5px solid ${P.borderLight}`}}>
      <span style={{fontFamily:"monospace",color:P.gold,fontWeight:500}}>{reg.code}</span>
      <span style={{flex:1,color:P.navy,fontWeight:500,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{reg.name}</span>
      <Badge c={reg.bc}>{reg.badge}</Badge>
      <button onClick={()=>{setSelReg(null);setScreen("regwatch");}} style={{fontSize:11,color:P.gold,background:"none",border:"none",cursor:"pointer"}}>← Change</button>
    </div>}

    {/* Report modal */}
    {modal&&<div style={{minHeight:300,background:"rgba(26,35,50,0.5)",display:"flex",alignItems:"center",justifyContent:"center",borderRadius:4,padding:20,marginBottom:14}}>
      <div style={{background:"#fff",borderRadius:4,padding:24,maxWidth:500,width:"100%"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}><span style={{fontSize:15,fontWeight:500,color:P.navy,fontFamily:P.serif}}>{modal}</span><button onClick={()=>setModal(null)} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:P.textLight}}>×</button></div>
        <div style={{padding:20,background:P.warmGray,borderRadius:4,textAlign:"center",color:P.textMuted,fontSize:13}}><i className="ti ti-file-text" style={{fontSize:32,display:"block",marginBottom:8,color:P.textLight}}/> Demo placeholder — would open the most recent filed version.</div>
        <button onClick={()=>setModal(null)} style={{...sec,marginTop:16}}>Close</button>
      </div>
    </div>}

    {/* S1: REGWATCH */}
    {screen==="regwatch"&&<div>
      <Filters f={filters} set={setFilters}/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:14}}>
        {[["Active changes",filtered.length],["Entities",new Set(filtered.flatMap(d=>d.entity)).size],["Nearest deadline",filtered.length?filtered.reduce((a,b)=>a.deadline<b.deadline?a:b).deadline:"—"]].map(([l,v],i)=><div key={i} style={{background:P.warmGray,borderRadius:4,padding:"10px 14px"}}><div style={{fontSize:11,color:P.textLight,textTransform:"uppercase",letterSpacing:1}}>{l}</div><div style={{fontSize:i===2?15:22,fontWeight:500,color:P.navy,marginTop:i===2?2:0}}>{v}</div></div>)}
      </div>
      {filtered.map(d=>{const sel=selReg===d.id;return <div key={d.id} style={{background:"#fff",border:sel?`2px solid ${P.navy}`:`0.5px solid ${P.border}`,borderRadius:4,marginBottom:10,overflow:"hidden"}}>
        <div onClick={()=>setSelReg(sel?null:d.id)} style={{padding:"10px 12px",cursor:"pointer",display:"flex",gap:8,alignItems:"flex-start"}} onMouseEnter={e=>e.currentTarget.style.background=P.warmGray} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <span style={{width:18,height:18,borderRadius:"50%",border:sel?"none":`0.5px solid ${P.border}`,background:sel?P.navy:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1,fontSize:10,color:"#fff"}}>{sel?"✓":""}</span>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
              <span style={{fontSize:11,fontFamily:"monospace",color:P.textLight}}>{d.code}</span>
              <span style={{fontSize:13,fontWeight:500,color:P.navy}}>{d.name}</span>
              <Badge c={d.bc}>{d.badge}</Badge><GapN n={d.gaps.length}/>
            </div>
            <div style={{fontSize:12,color:P.textMuted,marginTop:2}}>{d.juris} · {d.teams.slice(0,2).join(", ")}{d.teams.length>2?" +"+(d.teams.length-2):""} · {d.deadline}</div>
          </div>
        </div>
        {sel&&<div style={{padding:"0 12px 12px 38px"}}>
          <div style={{fontSize:13,color:P.textMuted,lineHeight:1.6}}>{d.summary}</div>
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:6}}>{d.entity.map(e=>tag(e,P.accentLight,P.accent))}{d.category.map(c=>tag(c,P.goldBg,P.gold))}</div>
          {d.gaps.length>0&&<Gap>{d.gaps.join(" · ")}</Gap>}
          <Src sk={d.skills} cx={d.contexts}/>
          <button onClick={()=>setScreen("deepreg")} style={{...cta,marginTop:10}}>Continue to regulation →</button>
        </div>}
      </div>;})}
      {!filtered.length&&<div style={{padding:24,textAlign:"center",color:P.textLight,fontSize:14}}>No matches.</div>}
      <Ask hint="e.g. Which high-impact changes affect Singapore?"/>
    </div>}

    {/* S2: REGULATION */}
    {screen==="deepreg"&&<div>
      {!reg?noSel:<div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>{meta("Regulator",`${reg.reg} (${reg.juris})`)}{meta("Deadline",reg.deadline)}</div>
        <div style={{fontSize:13,color:P.textMuted,lineHeight:1.6,padding:"8px 12px",background:P.warmGray,borderRadius:4,marginBottom:12}}>{reg.summary}</div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>{reg.entity.map(e=>tag(e,P.accentLight,P.accent))}{reg.category.map(c=>tag(c,P.goldBg,P.gold))}</div>
        {reg.gaps.length>0&&<Gap>{reg.gaps.join(" · ")}</Gap>}
        <div style={{marginTop:12}}/>
        <Fold title="What changes"><div style={{fontSize:13,lineHeight:1.7,color:P.textMuted}}>{reg.summary}</div><Src sk={["regulator-watch"]} cx={[]}/></Fold>
        <Fold title="Impact"><div style={{fontSize:13,lineHeight:1.7,color:P.textMuted}}>{reg.impact}</div><Src sk={reg.skills} cx={reg.contexts}/></Fold>
        <Fold title="Timeline">{reg.timeline.map((t,i)=><div key={i} style={{display:"flex",gap:10,padding:"6px 0",fontSize:13,color:P.text}}><div style={{width:8,height:8,borderRadius:"50%",marginTop:5,flexShrink:0,background:i===reg.timeline.length-1?P.red:P.navy}}/><div><strong>{t.l}</strong> — {t.d}</div></div>)}</Fold>
        <Fold title={`References (${reg.refs.length})`}>{reg.refs.map((r,i)=><div key={i} style={{fontSize:13,marginBottom:5}}><i className="ti ti-file" style={{fontSize:14,marginRight:4,color:P.textLight}}/><a href="#" style={{color:P.accent,textDecoration:"none"}} onClick={e=>e.preventDefault()}>{r}</a></div>)}</Fold>
        <div style={{display:"flex",gap:8,marginTop:12}}><button onClick={()=>setScreen("regwatch")} style={sec}>← Back</button><button onClick={()=>setScreen("deepreport")} style={cta}>Continue to reports →</button></div>
      </div>}
      <Ask hint="e.g. What are the key differences vs the old regulation?"/>
    </div>}

    {/* S3: REPORTS */}
    {screen==="deepreport"&&<div>
      {!reg?noSel:<div>
        <div style={{fontSize:16,fontWeight:500,marginBottom:14,color:P.navy,fontFamily:P.serif}}>Impacted reports</div>
        {!reg.reportDetails.length&&<div style={{color:P.textLight,fontSize:13,padding:16,textAlign:"center"}}>No report impacts identified.</div>}
        {reg.reportDetails.map((r,i)=><Fold key={i} title={r.name} badges={<Badge c={r.sev==="Major"||r.sev==="New obligation"?"red":r.sev==="Moderate"?"amber":"green"}>{r.sev}</Badge>} sub={`${r.freq} · ${r.owner}`}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>{meta("Last produced",r.lastProduced)}{meta("Sections",r.sections.length)}</div>
          <div style={{fontSize:12,color:P.textMuted,padding:"6px 10px",background:P.warmGray,borderRadius:4,marginBottom:10,lineHeight:1.5}}><span style={{fontWeight:500,color:P.navy}}>Last feedback: </span>{r.lastFeedback}</div>
          <table style={{width:"100%",fontSize:13,borderCollapse:"collapse"}}><thead><tr>{["Section","Change","Data"].map(h=><th key={h} style={{textAlign:"left",fontWeight:500,padding:"6px 8px",borderBottom:`0.5px solid ${P.border}`,fontSize:12,color:P.textLight}}>{h}</th>)}</tr></thead><tbody>{r.sections.map((s,j)=><tr key={j}><td style={{padding:"6px 8px",borderBottom:`0.5px solid ${P.borderLight}`}}>{s.s}</td><td style={{padding:"6px 8px",borderBottom:`0.5px solid ${P.borderLight}`,color:P.textMuted}}>{s.c}</td><td style={{padding:"6px 8px",borderBottom:`0.5px solid ${P.borderLight}`,color:P.textMuted}}>{s.d}</td></tr>)}</tbody></table>
          <div style={{display:"flex",gap:8,marginTop:10}}><button onClick={()=>setModal(r.name)} style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:12,padding:"5px 12px",borderRadius:4,border:`0.5px solid ${P.border}`,background:"transparent",cursor:"pointer",color:P.navy}}><i className="ti ti-external-link" style={{fontSize:13}}/> Open report</button></div>
          <Src sk={["reg-impact-assessor"]} cx={reg.contexts}/>
        </Fold>)}
        <div style={{display:"flex",gap:8,marginTop:12}}><button onClick={()=>setScreen("deepreg")} style={sec}>← Back</button><button onClick={()=>setScreen("actions")} style={cta}>Continue to actions →</button></div>
      </div>}
      <Ask hint="e.g. Which reports need schema changes?"/>
    </div>}

    {/* S4: ACTIONS */}
    {screen==="actions"&&<div>
      {!reg?noSel:<div>
        <div style={{fontSize:16,fontWeight:500,marginBottom:14,color:P.navy,fontFamily:P.serif}}>Actions and tests</div>
        {reg.actions.map((a,i)=><Fold key={i} title={<><span style={{fontFamily:"monospace",color:P.textLight,fontSize:11,marginRight:4}}>{reg.code}-{a.id}</span> {a.title}</>} badges={<><Badge c={a.effort==="Heavy"?"red":a.effort==="Medium"?"amber":"green"}>{a.effort}</Badge>{a.blocked&&<span style={{fontSize:11,color:P.red,display:"inline-flex",alignItems:"center",gap:3}}><i className="ti ti-alert-triangle" style={{fontSize:12}}/>Blocked</span>}</>} sub={`${a.owner} · Due ${a.deadline} · ${a.tests.length} tests`}>
          <div style={{fontSize:13,lineHeight:1.7,marginBottom:10,color:P.textMuted}}>{a.desc}</div>
          <div style={{marginBottom:10}}><JiraBtn label={`[${reg.code}] ${a.title}`} type="epic"/></div>
          <div style={{fontSize:14,fontWeight:500,marginBottom:6,color:P.navy}}>Generated tests</div>
          {a.tests.map((t,j)=><div key={j} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:`0.5px solid ${P.borderLight}`,fontSize:13,color:P.text}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:P.gold,flexShrink:0}}/>
            <span style={{flex:1}}>{t}</span>
            <JiraBtn label={`[${reg.code}-${a.id}] ${t}`} type="test"/>
          </div>)}
          <Src sk={["reg-remediation-planner"]} cx={reg.contexts}/>
        </Fold>)}
        <Gap>All tests are requirement-derived stubs. No connection to codebase, test framework, or CI/CD.</Gap>
        <div style={{marginTop:12}}><button onClick={()=>setScreen("deepreport")} style={sec}>← Back</button></div>
      </div>}
      <Ask hint="e.g. What are the dependencies between these actions?"/>
    </div>}
  </div>;
}
