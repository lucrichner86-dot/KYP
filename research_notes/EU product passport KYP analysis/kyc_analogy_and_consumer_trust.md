# KYC analogy and consumer trust evidence for a "Know Your Product" (KYP) venture — research notes (state: November 2026)

Reading notes for the report writer:
- Most figures below come from web-search result summaries, not from full-text reads of the primary documents. Two fetch attempts on primary pages failed (hosts not reachable from this session: `www.cannabisbusinesstimes.com`, `rbj.net`). Where a number is second-hand, vendor-funded or self-reported, it is marked.
- Items marked **[standing knowledge, not re-verified this session]** are well-established regulatory facts that I cite to the official text but did not re-open; verify before quoting article numbers.
- "Supports thesis" / "Undermines thesis" tags are my reading, not the sources'.

---

## A1. How KYC/AML works structurally, why it is painful, and what (partly) fixed it

### Takeaway
KYC works because the law puts a non-delegable duty and liability on a defined gatekeeper (the bank), not because customers want it; it is expensive (about USD 2,000-5,000 per corporate review, USD 85bn/yr in EMEA) and largely non-portable. Attempts to share the work (bank-owned KYC utilities) mostly failed on economics, liability and standards, while the things that did scale are narrow, standardised identifiers and credentials (LEI, eID wallets) rather than shared "verdicts".

### Cited Findings
**Structure of the obligation**
- FATF Recommendations set the global template: risk-based approach (R.1), customer due diligence incl. beneficial owner and ongoing monitoring (R.10), record keeping for at least five years (R.11), and reliance on third parties (R.17) under which ultimate responsibility stays with the relying institution **[standing knowledge, not re-verified this session]** — [FATF Recommendations](https://www.fatf-gafi.org/en/publications/Fatfrecommendations/Fatf-recommendations.html)
- EU: the AML Regulation (EU) 2024/1624 ("single rulebook") has its key obligations applying from 10 July 2027 — [fintech.global, eIDAS/AMLR deadlines](https://fintech.global/?p=248133); legal text at [EUR-Lex 2024/1624](https://eur-lex.europa.eu/eli/reg/2024/1624/oj)
- Switzerland: the Geldwäschereigesetz (GwG, SR 955.0) places due-diligence duties on financial intermediaries (identification of contracting party and beneficial owner, clarification, documentation, reporting to MROS) **[standing knowledge, not re-verified this session]** — [Fedlex SR 955.0](https://www.fedlex.admin.ch/eli/cc/1998/892_892_892/de)

**Cost and pain (figures)**
- Total cost of financial-crime compliance in EMEA: USD 85bn per year (LexisNexis Risk Solutions / Forrester Consulting, 482 senior decision-makers, 2023 study); costs rose for 98% of institutions; 70% reported cost escalation for compliance/KYC technology; KYC at account onboarding named the top impediment. Second-hand reporting of the study — [Bizcommunity](https://www.bizcommunity.com/article/study-reveals-annual-cost-of-financial-crime-compliance-totals-85bn-in-emea-675251a); [LexisNexis press release](https://risk.lexisnexis.com/global/de/about-us/press-room/press-release/20240306-true-cost-of-compliance)
- Global financial-crime compliance cost cited at over USD 206bn (secondary coverage of LexisNexis) — [Future Nexus](https://www.heyfuturenexus.com/global-financial-crime-compliance-costs-analyzed-in-lexisnexis-risk-solutions-report/)
- UK financial firms spend more than GBP 21,000 per hour on financial crime and fraud via onboarding and screening — [LexisNexis UK](https://risk.lexisnexis.co.uk/about-us/press-room/press-release/20240718-fighting-financial-crime-and-fraud)
- Average cost of one KYC review of a corporate client: USD 2,598, up 17% since 2022 (Fenergo, >1,100 executives, 2023); 2024 edition: ~65% of firms spend USD 2,000-5,000 per review — [A-Team Insight](https://a-teaminsight.com/blog/fenergo-study-reveals-true-cost-of-kyc)
- 70% of financial institutions lost clients in the past year because of slow onboarding (record; 67% in 2024); Fenergo survey of 600 decision-makers, August 2025; average onboarding abandonment about 10%; UK corporate banks often exceed six weeks — [Fenergo newsroom](https://www.fenergo.com/newsroom/share-of-banks-losing-clients-to-poor-kyc-practices-surges-to-record-high); [fintech.global](https://fintech.global/2025/10/08/70-of-banks-lose-clients-due-to-slow-onboarding/%20)
- Earlier Fenergo data: a corporate KYC review takes 31-60 days at 40% of banks — [Fenergo blog](https://resources.fenergo.com/blogs/the-cost-of-kyc-compliance-in-finance-how-digitalization-helps)

**Shared utilities: mostly failed**
- Singapore's MAS-backed banking KYC utility was shelved; MAS managing director Ravi Menon: "The economics did not work out. Our proposed solution was going to cost more than the savings that banks will get out of it." — [Asian Private Banker](https://asianprivatebanker.com/private-wealth/regulations/mas-not-succeeded-building-kyc-utility-ravi-menon/)
- The Association of Banks in Singapore cited stakeholders' "widely divergent" needs — [Asian Private Banker](https://asianprivatebanker.com/private-wealth/regulations/stakeholders-widely-divergent-needs-challenge-halted-kyc-project-abs/)
- McKinsey's recurring failure causes: intrinsically misaligned incentives of third-party utilities, over-ambitious designs whose cost exceeds savings, limited bank commitment/oversight, member consensus, data privacy, vendors covering only one KYC function — [McKinsey](https://www.mckinsey.com/industries/financial-services/our-insights/banking-matters/a-kyc-aml-utility-driving-scale-efficiency-and-effectiveness)
- Fenergo: inconsistent KYC standards and poor data quality frustrate data sharing — [Fenergo, "KYC Utilities: The Second Coming"](https://www.fenergo.com/blogs/kyc-utilities-the-second-coming-learning-from-past-failures)
- Nordic KYC Utility / Invidem: founded 2019 by Danske Bank, DNB, Handelsbanken, Nordea, SEB, Swedbank; launched 2021; first non-owner client only in April 2022 — [Finextra](https://finextra.com/newsarticle/35591/nordic-kyc-utility-selects-technology-partners); [The Paypers](https://thepaypers.com/digital-identity-security-online-fraud/bank-founded-kyc-service-invidem-gets-its-first-non-owner-client-in-the-nordics--1255831)

**What did scale: standard identifiers and reusable credentials**
- LEI (GLEIF): over 3.35 million LEIs, ~92,000 new in Q2 2026 — [GLEIF Q2 2026 business report](https://www.gleif.org/lei-data/global-lei-index/download-global-lei-system-business-reports/download-global-lei-system-business-report-q2-2026/q2-2026-quarterly_business_report.pdf). But renewal discipline is weak: Q1 2026 renewal rate 56.6%, only 61.9% of LEIs in good standing — [GLEIF Q1 2026 business report](https://www.gleif.org/lei-data/global-lei-index/download-global-lei-system-business-reports/download-global-lei-system-business-report-q1-2026/q1-2026-quarterly_business_report.pdf); ~1.19m cumulative lapsed records in July 2026 — [GLEIF data quality report July 2026](https://www.gleif.org/lei-data/gleif-data-quality-management/quality-reports/download-data-quality-report-july-2026/2026-08-07-lei-data-quality-report-july-2026.pdf)
- eIDAS 2.0 / EUDI wallet: legal deadline for every member state to offer a wallet is 24 December 2026, but the Commission was "doubtful" in April 2026 that all would launch this year; fewer than half of 27 member states on track (another observatory: fewer than one third) — [Biometric Update](https://www.biometricupdate.com/202604/eu-commission-doubtful-all-member-states-will-be-able-launch-eudi-wallets-this-year); [Corbado](https://www.corbado.com/blog/eudi-wallet-2026-deadline-rollout-eic-2026). Germany targets 2 January 2027 — [Sumsub news](https://sumsub.com/media/news/germany-moves-ahead-with-eudi-wallet/). Regulated sectors must accept the wallet roughly a year after issuance (around late 2027) — [Trinsic](https://www.trinsic.id/blog/europe-s-digital-identity-deadline-is-real.-but-the-rollout-won-t-be-uniform)

### Inferences
- **Undermines "KYC without the pain" as a simple port:** KYC demand is 100% regulation-driven; nobody buys KYC voluntarily. A KYP layer without a legal or contractual obligation on some gatekeeper has no equivalent pull.
- **Supports the thesis in a narrow form:** the scalable part of the KYC stack is (a) a standard identifier with a neutral governance body (LEI/GLEIF) and (b) cryptographically reusable attestations (EUDI wallet, vLEI). The KYP analogue is "issuer-signed, reusable product/batch credentials", not a shared database of judgements.
- Utilities failed where the relying party stayed liable (FATF R.17 logic) and therefore re-did the checks anyway. A KYP venture must decide who carries liability when a "verified" batch turns out to be wrong; if retailers stay fully liable, they will re-verify and the cost saving disappears.
- Even a mandated, cheap identifier decays: ~38% of LEIs are not in good standing. Expect the same for product/supplier credentials unless renewal is tied to market access.

### Gaps
- AMLA (EU AML Authority) timeline — direct supervision of selected entities from 2028 — was not confirmed in any source retrieved; treat as unverified.
- Current status of Invidem is unclear: one search summary inferred it was still operating (~40 staff) from an undated interview; I could not confirm or refute a wind-down. Check before citing it as either a success or a failure.
- No data retrieved on SWIFT KYC Registry membership, or on the Clarient / KYC.com / Thomson Reuters Org ID consolidation; no vLEI issuance counts or LEI fee levels.
- No per-check price points retrieved for KYB vendors (Sumsub, Onfido, Fenergo, Dun & Bradstreet, Moody's/Kompany).
- The Swiss GwG revision (transparency register) status was not checked.

---

## A2. Who would be the KYC-equivalent actors for products, and is "KYP" already a recognised concept?

### Takeaway
"Know Your Product" is already a defined regulatory term in Canadian securities regulation (and used loosely in financial product governance), so the name is not novel and carries a different meaning for compliance professionals. For physical goods the obliged-party / verifier / relying-party structure already exists under other names (GMP supplier qualification and QP release, accreditation and notified bodies, marketplace "know your business customer" rules), which means a KYP venture is entering an occupied field and must plug into it rather than replace it.

### Cited Findings
**KYP as an existing term**
- In Canada, KYP is a formal obligation: firms must understand the structure, features, costs and risks of products they make available; set out in CIRO guidance on "Product Due Diligence and Know-Your-Product" (IIROC Rule 3300 series) and MFDA Rule 2.2.5 — [CIRO](https://www.ciro.ca/news-room/publications/product-due-diligence-and-know-your-product); [MFDA MSN-0048](https://mfda.ca/wp-content/uploads/MSN-0048-1.pdf)
- The Client Focused Reforms' KYC, product due diligence, KYP and suitability rules took full effect 31 December 2021; a joint CSA/CIRO sweep reviewed 105 registered firms for compliance (Staff Notice 31-368, December 2025) — [CSA/CIRO Notice 31-368](https://www.asc.ca/-/media/ASC-Documents-part-1/Regulatory-Instruments/2025/12/6255537-CSA-CIRO-Notice-31-368-Client-Focused-Reforms.pdf); [BLG commentary](https://www.blg.com/en/insights/2025/12/csa-ciro-illuminate-enhanced-expectations-in-phase-2-client-focused-reform-sweep)
- Two layers exist there: dealer-level product due diligence and the individual adviser's own KYP duty; the firm's approval does not remove the individual's responsibility (exam-prep source, secondary) — [securitiesmastery](https://securitiesmastery-com.pages.dev/ciro/cco/compliance-responsibilities/know-your-product/)

**Existing product-side analogues of the KYC role structure**
- Online marketplaces: DSA Article 30 is explicitly a "know your business customer" (KYBC) rule — the marketplace must collect trader identity/contact data before the trader can sell, make best efforts to check reliability, request documents, and suspend traders that do not comply; traders remain liable for accuracy — [Mondaq](https://www.mondaq.com/compliance/1367256/online-marketplaces-and-the-digital-services-act-understanding-trader-traceability)
- GPSR Article 22 adds product-safety duties for marketplaces on top of the DSA, including suspending traders that frequently offer non-compliant products — [Mason Hayes & Curran](https://www.mhc.ie/latest/insights/product-safety-for-providers-of-online-marketplaces)
- Pharma: EU GMP (EudraLex Vol. 4) requires manufacturers to qualify and audit suppliers (Chapter 5, Chapter 7) and requires a named Qualified Person to certify each batch before release (Annex 16; Directive 2001/83/EC Art. 51) — personal, non-delegable responsibility **[standing knowledge, not re-verified this session]** — [EudraLex Volume 4](https://health.ec.europa.eu/medicinal-products/eudralex/eudralex-volume-4_en)
- Accreditation: Regulation (EC) 765/2008 provides for a single national accreditation body per member state that accredits conformity assessment bodies (testing labs to ISO/IEC 17025, product certifiers to ISO/IEC 17065) **[standing knowledge, not re-verified this session]** — [EUR-Lex 765/2008](https://eur-lex.europa.eu/eli/reg/2008/765/oj)
- ESPR (Regulation (EU) 2024/1781) creates the Digital Product Passport addressed to "consumers, authorities and all economic operators"; the Commission ran four stakeholder surveys in 2025 on requirements for DPP service providers — [EC news](https://single-market-economy.ec.europa.eu/news/take-part-our-impact-assessment-digital-product-passport-2025-07-25_en); [CosmeticObs](https://client.cosmeticobs.com/en/articles/regulation-57/four-european-surveys-on-the-future-digital-product-passport-8884)
- Supplier-risk platforms use a "verify once, share many" model that the supplier is effectively forced into: EcoVadis reports 48% of revenue from buyers and 52% from suppliers (its own EU ESG-ratings disclosure); a user review notes suppliers "do not have a choice" because a customer requires it — [EcoVadis trust centre](https://ecovadis.com/trust-center/esma/); [PeerSpot](https://peerspot.com/questions/what-is-your-experience-regarding-pricing-and-costs-for-ecovadis)

### Inferences
- Mapping (my synthesis): **obliged party** = the economic operator placing the product on the market (manufacturer/importer; in cannabis the licensed producer or pharmacy/club); **verifier** = accredited lab / certifier / QP; **relying party** = retailer, marketplace, regulator, and only lastly the consumer; **liability** = stays with the economic operator and, in pharma, personally with the QP. In no existing regime does a consumer-facing trust layer carry the liability.
- **Supports thesis:** DSA Art. 30 shows EU law already borrows KYC logic for commerce, and regulated goods (pharma, medical cannabis under GMP/GDP) already generate batch-level verified data (CoA, QP release) that is not exposed downstream. The KYP gap is exposure and portability of existing attestations, not creation of new ones.
- **Undermines thesis:** the venture's natural legal role is unclear. If it is not accredited (17065) it is a data intermediary, not a verifier; if it seeks accreditation it becomes a certification body with the associated cost and conflict-of-interest rules.
- Naming risk: in financial compliance "KYP" already means product due diligence by distributors. Useful as an analogy for investors, potentially confusing for compliance buyers.

### Gaps
- No sources retrieved on Amazon/Zalando product-compliance documentation requirements beyond supplements (see A3), nor on Sedex, IntegrityNext, Prewave, Sphera, Assent, SGS, Compliance & Risks, ProductIP pricing or adoption.
- Did not find any established use of "Know Your Product" in pharmacy practice or supply-chain regulation in Europe; absence of evidence only (one search).
- Notified-body regime details (e.g. MDR) not researched in this session.

---

## A3. Business-model precedents for trust marks and verification layers: who pays, what made some trusted

### Takeaway
Almost every verification layer is paid for by the verified party (licence fee, subscription, audit fee), and the trusted ones protect themselves structurally: consumer-funded testing with arm's-length logo licensing (Stiftung Warentest), or a mandate from a dominant buyer (EcoVadis, Amazon's supplement rule). Consumer-funded apps (Yuka) achieved influence through a simple score and scale, not through provenance detail.

### Cited Findings
**Who pays, how much**
- B Corp (US/Canada): annual fee tiered by revenue — e.g. USD 2,100 for USD 0-5m revenue, USD 3,150 for USD 5-7.5m, USD 3,938 for USD 7.5-10m (2026, per secondary guide); from 2027 restructured into an "Annual IP License & Community Fee" (USD 1,470 for USD 0-5m) plus separate independent audit fees — [B Lab US/CA 2027 fees](https://usca.bcorporation.net/fees/); [beancount guide](https://beancount.io/blog/2026/07/19/is-b-corp-certification-worth-it-small-business-guide). Sources conflict on exact 2026 numbers.
- Fairtrade: licence fees are paid by companies using the Mark and are volume-based; separate from the Minimum Price and Premium paid to producers — [Fairtrade licence fees](https://www.fairtrade.net/ca-en/for-business/your-path-to-certification/license-fees.html)
- EcoVadis: supplier subscriptions "tailored" by size/plan/location; third-party estimates USD 500-11,000 per year for suppliers and USD 15,000-40,000 per year for buyers assessing 50-100 suppliers (vendor-comparison site, unverified) — [EcoVadis support](https://support.ecovadis.com/hc/en-us/articles/360011788959); [toolradar](https://toolradar.com/tools/ecovadis/pricing)
- Stiftung Warentest: main income is magazine/online sales; logo licensing is a secondary stream — 644 licence contracts brought in about EUR 3.8m in 2015; licensing is run entirely by the non-profit RAL gGmbH to keep the foundation independent of manufacturers; part of the licence income funds re-tests of about 10% of products advertised with the seal — [Versicherungsbote](https://www.versicherungsbote.de/id/4841021/Stiftung-Warentest-Logo-Lizenzen/); [test.de, Werbung mit Tests](https://www.test.de/unternehmen/werbung-5016972-0/)
- Trustpilot: freemium; most revenue from business subscriptions; says over 97% of businesses on the platform do not pay; reports 7.8 million fake reviews detected and removed in 2025 (4.5 million in 2024) — [Trustpilot trust page](https://corporate.trustpilot.com/trust). A 2021 US class action alleged negative reviews of subscribers were removed or buried (allegation, not a finding) — [Top Class Actions](https://topclassactions.com/lawsuit-settlements/lawsuit-news/class-action-lodged-over-trustpilot-reviews)

**Supplements: third-party verification as a purchase criterion — partially, and mainly via retailer mandate**
- About 47% of US supplement users look for a quality-assurance mark, up from 33% in 2007 (Natural Marketing Institute, reported 2015); most treat it as reassurance rather than a deciding factor — [SupplySide](https://supplysidesj.com/certification/supplement-users-and-product-certifications)
- More than 40% of UK and US supplement buyers say they actively look for quality/certification marks (CIL survey commissioned by the certifier INFORMED, 2026 — interested sponsor) — [Stacker via KRDO](https://krdo.com/stacker-nutrition-diet/2026/08/20/why-consumers-are-reading-supplement-labels-closely/)
- Consumers cannot tell real from fake seals: 15% of regular supplement takers said they look for a fictitious seal ("Test Labs USA") in a Consumer Reports survey (2022) — [Consumer Reports](https://www.consumerreports.org/health/supplements/what-to-know-before-you-take-that-supplement-a8255329318)
- Amazon (April 2024) required compliance verification for sexual-enhancement, weight-management and sports-nutrition supplements to come directly from an approved third-party testing/inspection/certification body (initially NSF, UL, Eurofins), with listings suppressed otherwise — [Nutraceuticals World](https://www.nutraceuticalsworld.com/exclusives/amazon-supplement-policy-update-third-party-verification-required-from-nsf-ul-or-eurofins/); as of January 2026 seven approved TIC companies and expanded documentation for all supplements — [Epstein Becker Green](https://www.ebglaw.com/insights/publications/amazons-third-party-supplement-testing-mandate-explained)
- CVS has required third-party testing for all supplements since 2019 — [Modern Retail](https://www.modernretail.co/?p=94618)
- Industry raised concerns about Amazon's choice of only a few testing agencies — [New Hope](https://newhope.com/regulatory/supplement-industry-raises-concerns-amazon-chosen-testing-agencies)

**Consumer-funded scoring apps**
- Yuka: self-reported impact study (>20,000 volunteer respondents; self-selection acknowledged): 94% put products back when rated red; 92% buy fewer ultra-processed products — [Yuka social impact report](https://yuka.io/wp-content/uploads/social-impact/en/Social%20impact%20-%20Yuka.pdf)
- Intermarché announced in September 2019 it would reformulate 900 own-brand products to score better on Yuka (removing 142 additives) — [Euronews](https://www.euronews.com/2019/09/20/french-supermarket-chain-to-remove-additives-using-phone-app-that-rates-products); [Altavia](https://altavia-group.com/?p=340163)
- 2026 trade press: Yuka "drives reformulation but leaves brands in the dark" (brands cannot engage with or contest the score) — [FoodNavigator](https://www.foodnavigator.com/Article/2026/02/09/yuka-drives-reformulation-but-shuts-out-food-makers/)

**Conflicts of interest when the producer pays**
- Ali Enterprises (Karachi, 2012): factory burned down three weeks after receiving SA8000 certification issued by RINA (audit by a local subcontractor); at least 250 workers died — [Clean Clothes Campaign](https://cleanclothes.org/news/2020/faulty-pakistan-factory-audit-italian-social-auditor-rina-yet-again-disregards-families-harmed-by-textile-factory-fire-); [WSR Network](https://wsr-network.org/what-is-wsr/csr-and-msis/msi-case-study-ali-enterprises-pakistan/)
- Rana Plaza (2013): 1,134+ killed; audits by TÜV Rheinland under Amfori BSCI did not flag building safety; TÜV Rheinland said structural safety was outside its mandate — [Clean Clothes Campaign, "Fig Leaf for Fashion"](https://cleanclothes.org/file-repository/figleaf-for-fashion-brief.pdf)
- Suppliers seeking SA8000 pay the full cost of certification; critics describe the social-audit system as "fraught with conflicts of interest" (advocacy sources) — [Business & Human Rights Resource Centre](https://www.business-humanrights.org/en/social-audits-in-the-textile-industry-how-to-control-the-controllers)

### Inferences
- Trust drivers that recur: (1) the verifier chooses what to test, not the producer (Stiftung Warentest, Yuka, ConsumerLab-style models); (2) negative results are published; (3) the mark is licensed at arm's length; (4) a dominant buyer or regulator makes it a condition of market access. Marks where the producer chooses, pays and can keep failures private are the ones implicated in scandals.
- **Supports thesis:** supplements show that in a weakly regulated ingestible category third-party verification did become a gate — but the trigger was Amazon and CVS, not consumer pull (roughly 40-47% "look for" a seal, and 15% "look for" a seal that does not exist).
- **Undermines thesis:** consumer-pays models at scale are scoring apps with one number, not provenance layers. A producer-pays KYP inherits the audit-industry conflict of interest unless scope and publication of failures are outside the producer's control.
- Being "locked out" matters commercially: Yuka shows a consumer-side verifier can be powerful while being resented by brands; EcoVadis shows the opposite model (supplier pays because buyer demands) scales revenue faster.

### Gaps
- No usable sources retrieved on Öko-Test licensing/criticism, TÜV mark pricing, CodeCheck, Open Food Facts, EWG, Good On You, ConsumerLab's or USP Verified's fee structures, Labdoor or Clean Label Project (business model and methodology criticism). TÜV Süd/Brumadinho and TÜV Rheinland/PIP implants were not sourced.
- No independent (controlled) evaluation of Yuka's effect on purchases was found; all user-impact numbers are self-reported by Yuka.
- CVS "Tested to be Trusted" failure rates not found.

---

## A4. Lessons from failed or disappointing provenance ventures (blockchain traceability 2017-2022)

### Takeaway
The technology worked; the business did not. Failures trace to governance (competitors would not join a platform controlled by one player), weak economics versus a normal database, the "garbage in, garbage out" problem at data entry, and negligible consumer usage. What persisted did so where a dominant buyer mandated participation for an operational purpose (recall speed), not for consumer storytelling.

### Cited Findings
- TradeLens (IBM/Maersk) was discontinued (announced end of November 2022): technically viable but "failed to meet its commercial goals" — [ABI Research](https://www.abiresearch.com/market-research/insight/7781608-ibm-and-maersks-tradelens-platform-discont?hsLang=en)
- Analyses attribute the failure to competitors' distrust of a platform controlled by one player and the need for independent governance — [IMD](https://www.imd.org/ibyimd/supply-chain/where-does-blockchain-go-from-here/); [UNSW BusinessThink](https://businessthink.unsw.edu.au/articles/blockchain-future-supply-chains)
- Everledger (diamond/luxury provenance, later batteries and art): entered voluntary administration in 2023 after an investor failed to deliver a second funding tranche; UK arm liquidated April 2023; IP put up for sale — [Ledger Insights](https://www.ledgerinsights.com/everledger-bankruptcy-esg-blockchain-traceability/); [Jeweller Magazine](https://www.jewellermagazine.com/Article/12243/Australian-diamond-tracing-tech-company-collapses)
- Walmart told leafy-greens suppliers they had to integrate with IBM Food Trust by September 2019, citing an E. coli outbreak — [CoinDesk](https://www.coindesk.com/ibm-food-supply-chain-blockchain-carrefour-live-production/)
- Carrefour's QR-linked blockchain traceability on own-brand chicken: an IBM executive reported a "double-digit sales lift" but said he was not sure whether it came from the technology or the accompanying TV campaign (attributed in 2018-19 trade coverage; exact article not re-verified) — [RetailDetail](https://www.retaildetail.eu/en/news/food/carrefour-and-walmart-take-blockchain-next-level)
- Peer-reviewed 2025 study: despite business approval, food blockchain traceability systems "are hindered by a lack of consumer participation and low usage rates" — [Frontiers in Sustainable Food Systems](https://www.frontiersin.org/articles/10.3389/fsufs.2025.1515188/full)
- EU fresh-vegetable study "Why Blockchain Does (Not) Work?" concludes one-size-fits-all blockchain traceability is challenged by real-world results — [Internet Technology Letters (Wiley)](https://onlinelibrary-wiley-com-443.webvpn.zafu.edu.cn/doi/abs/10.1002/itl2.647)
- Oracle problem: blockchain guarantees integrity only after data is on-chain; it cannot guarantee the accuracy of what is entered — [Cointelegraph](https://cointelegraph.com/news/blockchain-can-end-the-food-fraud-crisis-but-it-s-a-costly-battle); academic treatment — [Sustainability 12(6) 2391](https://iris.unito.it/retrieve/handle/2318/1919366/1166790/sustainability-12-02391-with-cover.pdf)
- Choice study on blockchain food traceability: spending more time reading traceability information behind a QR code did not raise willingness to pay — [British Food Journal (Tran et al., 2024)](https://www.emerald.com/insight/content/doi/10.1108/BFJ-09-2023-0812/full/html)

### Inferences
- **Supports the founder's design choice:** building on *regulatory* track-and-trace data (seed-to-sale systems, GMP batch records) partly addresses the oracle problem, because the data is created under legal duty and inspection rather than volunteered for marketing.
- **Undermines the consumer-first go-to-market:** every documented survivor was pulled by a buyer mandate or regulatory need; the consumer-facing layer was at best a marketing by-product with unproven sales effect.
- Neutral governance is a precondition: a KYP layer owned by one producer, one wholesaler or one track-and-trace vendor will meet the TradeLens problem.

### Gaps
- Current (2025-26) status of IBM Food Trust not established. No sourced account of Provenance.org's shift from blockchain traceability to claim-verification software. No hard consumer scan-rate data from any blockchain food pilot.

---

## B1. Scan rates and real usage of on-pack QR codes / smart labels

### Takeaway
Measured (not self-reported) scan rates for information QR codes are consistently tiny — on the order of 0.1% to about 1% of shoppers — while surveys asking people whether they scan report 50-75%. I found no published scan rates from any fashion DPP pilot, GS1 2D retail pilot, or cannabis CoA programme.

### Cited Findings
**Measured behaviour**
- WHO/Europe (February 2025 report on alcohol labels) cites a pilot in which only 0.26% of shoppers scanned QR codes for health information; industry disputed the pilot's scientific validity; sample and location not given in coverage — [WHO/Europe](https://www.who.int/europe/news-room/14-02-2025-alcohol-labels-should-warn-of-cancer-risk--says-new-who-europe-report); [Just Drinks](https://www.just-drinks.com/news/who-cancer-warning-alcohol-labels)
- European Cancer Organisation cites a supermarket experiment in which fewer than one in a thousand people accessed QR-code information (study not named in coverage) — [Alcohol Review](https://alcoholreview.substack.com/p/european-cancer-federation-says-qr)
- Field experiment on oyster purchases (US): only 1.2% of participants scanned the QR labels with their own devices — [AgEcon Search record 287977](https://ageconsearch.umn.edu/record/287977)
- USDA/Deloitte "Study of Electronic or Digital Link Disclosure" (2017; 150+ observations and interviews, nearly 1,000 crowdsourced participants): consumers were unaware digital links carried food information and assumed they were marketing; USDA concluded some consumers would lack adequate access and added a phone-number option — [USDA AMS (study PDF)](https://ams.prod.usda.gov/sites/default/files/media/USDADeloitteStudyofElectronicorDigitalDisclosure20170801.pdf); [FoodNavigator](https://www.foodnavigator.com/Article/2017/09/11/Digital-GMO-disclosure-faces-significant-but-manageable-challenges/). A 2026 Consumer Brands Association whitepaper argues this evidence is outdated (industry source) — [CBA whitepaper](https://consumerbrandsassociation.org/wp-content/uploads/2026/05/CBA-State-of-Digital-Disclosure-Whitepaper.pdf)

**Self-reported behaviour (much higher)**
- 75% of consumers in Germany, France, Italy, Spain and Czechia say they have scanned a QR code on a food or drink product; nearly half say they do so regularly (survey commissioned by spiritsEUROPE — interested sponsor) — [spiritsEUROPE](https://spirits.eu/media/press-releases/digital-labels-new-survey-shows-a-majority-of-european-consumers-regularly-use-e-labels-to-access-product-information); [ESM Magazine](https://esmmagazine.com/drinks/three-quarters-of-consumers-have-scanned-a-qr-code-on-a-food-or-drink-product-study-finds-207710)
- EU wine e-labels (ingredients/nutrition via QR, mandatory for wine from December 2023): a Renew MEP quoted the 0.26% figure in the debate on the wine package — [Brussels Signal](https://brusselssignal.eu/2025/06/eu-wine-sectors-digital-labelling-switch-raises-questions); French compliance checks found persisting digital access problems — [Vinetur](https://www.vinetur.com/2025092291465/most-french-wines-meet-new-eu-labeling-rules-but-digital-access-issues-persist.html)

**Pilots that published no consumer scan data**
- Trace4Value (RISE/Vinnova, with Kappahl and Marimekko, TrusTrace): DPP via QR on children's garments, pilot through 2024 "to be evaluated"; no scan rates published in coverage — [Just Style](https://www.just-style.com/news/kappahl-trace4value-share-first-digital-product-passport-products/)
- Nobody's Child (Fabacus): DPP since September 2023, extended to more collections; the brand used gifted credit to encourage scans; no scan rates published — [Mintel](https://www.mintel.com/insights/uncategorised-market-news/digital-product-passports-how-retailers-can-turn-compliance-to-consumer-focused-value/); [The Retail Bulletin](https://www.theretailbulletin.com/fashion/nobodys-child-launches-digital-product-passport-12-03-2024/)
- Tesco GS1 QR trial: stated aims are date-code accuracy, waste reduction, preventing out-of-date sales, plus consumer information — [Packaging Europe](https://www.packagingeurope.com/tesco-trials-gs1-qr-codes-in-select-uk-stores/). Woolworths (Australia) reports up to 21% productivity gain in expiry management and up to 40% food-waste reduction — supply-side outcomes only — [GS1 case study](https://www.gs1.org/system/files/case-study-woolworths-gs1australia.pdf)

**Pharma leaflets**
- Belgium/Luxembourg e-PIL pilot (hospital-only medicines, since 2018, over 4m packs): 97-98% of hospital pharmacists reported no inconvenience without paper leaflets; the users are professionals; "patients very infrequently demand the PIL" — [EFPIA](https://efpia.eu/news-events/the-efpia-view/blog-articles/electronic-product-information-epi-making-the-latest-medicine-s-information-available-for-patients-without-any-delay/); [EMA presentation](https://www.ema.europa.eu/en/documents/presentation/presentation-e-pil-belgium-luxembourg-pioneer-pilot-project-n-lambot_en.pdf)

**Cannabis**
- US regulators point consumers to CoAs via dispensary request or on-pack QR (e.g. New Jersey) — [NJ Cannabis Regulatory Commission](https://www.nj.gov/cannabis/documents/How%20to%20Read%20a%20COA.pdf)
- A survey by Cannabis Public Policy Consulting, announced by track-and-trace vendor Metrc (n = 3,061 consumers/patients, 33 US jurisdictions, online, cross-sectional), reports that state-issued QR codes raised feelings of protection and trust; a search summary quoted "100% of respondents" feeling more protected, which is implausible as stated and could not be checked (page not reachable) — [Cannabis Business Times (vendor news)](https://www.cannabisbusinesstimes.com/vendor-news/news/15836139/national-study-links-stateissued-cannabis-qr-codes-with-greater-consumer-trust-confidence)

### Inferences
- **Strongly undermines** any model whose revenue or impact depends on a large share of consumers scanning at the shelf. A two-orders-of-magnitude gap separates stated (50-75%) from observed (0.1-1.2%) scanning.
- The absence of published scan rates from fashion DPP and GS1 pilots after two to three years is itself weak evidence that the numbers are not flattering (inference; could also be commercial confidentiality).
- Scanning is higher when it is the only way to do something the user already wants (authenticate, register, claim a reward) or when a professional needs the data. Design implication: the consumer value should be delivered at the point of choice (shelf tag, menu, web shop filter, budtender/pharmacist screen), with the QR as an audit trail.
- Cannabis could differ: products are bought at a counter or online menu with staff mediation, and potency/contaminant data is purchase-relevant. This is a hypothesis; no measured CoA scan rates were found.

### Gaps
- No measured scan rates for: SmartLabel (US), U-Label / EU wine e-labels, GS1 2D pilots, any CIRPASS-2 pilot, Chinese infant-formula traceability codes, or cannabis CoA QR codes (Metrc Retail ID, Canadian or German products).
- The primary source and method of the 0.26% pilot were not retrieved.
- `cannabisbusinesstimes.com` and `rbj.net` were not reachable from this session; the Metrc/CPPC study should be read in the original before any figure is used.

---

## B2. Does provenance / traceability / third-party verification change choice or willingness to pay?

### Takeaway
Stated willingness to pay for traceability and certified attributes is reliably positive in choice experiments, but it is among the lowest-valued credence attributes, shrinks sharply in real purchase settings, and independent verification does not consistently beat a brand's own claim in consumer experiments. Distrust of claims is high and rising, which creates a role for verification, but mainly as a credibility backstop rather than a premium driver.

### Cited Findings
**Meta-analyses and choice experiments**
- Meta-analysis of 35 discrete choice experiments (n = 35,725): consumers state a premium of 3.79 PPP$/kg (95% CI 2.7-4.89) for eco-labelled foods; organic labels attract higher WTP than other labels — [Bastounis et al. 2021, Nutrients (PMC)](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8398923/)
- Meta-analysis of sustainability attributes: traceability has the lowest WTP — about 18% premium for red meat and 26% for dairy (Yang & Renwick 2019, via secondary infographic) — [Our Land and Water](https://ourlandandwater.nz/outputs/predicted-willingness-to-pay-price-premium-for-red-meat-and-dairy-products/)
- Meta-analysis of traceable-meat WTP (23 studies, 88 valuations): estimates depend significantly on base price and country — [Cicia & Colantuoni 2010](https://ageconsearch.umn.edu/record/97028)
- A 2024 meta-analysis in Food Control consolidates WTP evidence on food traceability (results not retrieved) — [catalogue entry](https://vitagri.org/evidence/NRmpvgvgbg-00l/)
- China: choice experiments find traceability information valued above brand and country of origin for infant formula; consumers with higher food-safety risk perception pay more — [British Food Journal](https://www.emerald.com/insight/content/doi/10.1108/BFJ-11-2016-0555/full/html). Nanjing online survey (n = 704): premium of ~143.7 CNY for traceability versus 285.3 CNY for quality certification — [Foods (MDPI)](https://mdpi.com/2304-8158/11/17/2689) (attribution of figures to these two papers is from search summaries; verify)

**Lab vs. real store (the size of the gap)**
- French randomised trial of front-of-pack labels in 60 supermarkets over ten weeks: effect sizes were on average 17 times smaller than in comparable laboratory studies; Nutri-Score, the best performer, raised purchases of top-third products by 14% but improved the nutritional quality of the labelled basket by only 2.5% — [Dubois et al., TSE working paper](https://www.tse-fr.eu/node/120536)
- "65% say they want to buy purpose-driven brands, about 26% do" — widely repeated, attributed to a 2017 BBMG/GlobeScan study; original not retrieved — [SLD](https://www.sld.com/blog/the-intention-action-gap-and-sustainable-products/)
- Counter-evidence from sales data: US sustainability-marketed CPG products reached 25.4% market share in 2025 (23.8% in 2024; 14.6% in 2013) and delivered 44.9% of CPG growth 2013-2025, with average price premiums reported around 26.6% (NYU Stern CSB / Circana) — [NYU Stern SMSI](https://www.stern.nyu.edu/experience-stern/about/departments-centers-initiatives/centers-of-research/center-sustainable-business/research/csb-sustainable-market-share-index); [FoodNavigator](https://www.foodnavigator.com/Article/2026/04/22/sustainable-products-gain-share-despite-headwinds/). Note: "marketed as sustainable" is not "verified".

**Independent verification vs. self-declared claims (mixed)**
- Chocolate experiment: stated WTP highest (EUR 1.69) when third-party label and self-declared claim appeared together, lowest (EUR 1.24) with the third-party label alone — [Sustainability 12(23) 10115](https://mdpi.com/2071-1050/12/23/10115)
- Coffee brand study: self-declaration raised preference as much as independent Fair Trade certification — [European Business Review](https://emerald.com/insight/content/doi/10.1108/EBR-06-2013-0090/full/html)
- Supplements: 15% of users "look for" a non-existent seal (see A3) — [Consumer Reports](https://www.consumerreports.org/health/supplements/what-to-know-before-you-take-that-supplement-a8255329318)

**Claim distrust and label fatigue (Europe)**
- European Commission 2020 study: 53.3% of examined environmental claims were vague, misleading or unfounded; 40% unsubstantiated (sample reported as 150 claims) — [FoodNavigator](https://www.foodnavigator.com/Article/2023/03/24/commission-proposes-ban-on-misleading-environmental-claims)
- November 2020 sweep of online shops: of 344 "seemingly dubious" claims, authorities had reason to believe 42% were false or deceptive — [Yahoo/Reuters](https://news.yahoo.com/greenwashing-rampant-online-stores-consumer-141453925.html)
- About 230 sustainability labels in the EU, "leading to consumer confusion and distrust" — [European Commission, EU Ecolabel](https://environment.ec.europa.eu/topics/circular-economy/eu-ecolabel/consumers_en)
- Share of EU consumers who say they take environmental information into account when buying fell to about 43% from 56% in 2022 (Consumer Conditions Scoreboard 2025, via Spanish press; verify in primary) — [El Español](https://www.elespanol.com/enclave-ods/historias/20251223/podemos-fiarnos-eco-laberinto-etiquetas-europa-terminos-verdes-manidos/1003744065788_0.html)
- 62% of consumers felt organisations were greenwashing in 2025 (52% in 2024, 33% in 2023) — Capgemini consumer research — [Capgemini](https://capgemini.turtl.co/story/insights-research-library-sustainability-trends-2025/page/3)
- By contrast, an official scheme retains trust: 81% of Europeans believe EU Ecolabel products have lower environmental impact (75% in 2023), Eurobarometer reported October 2026 — [Eunews](https://www.eunews.it/en/2026/10/08/the-eu-ecolabel-is-winning-over-consumers-81-per-cent-consider-it-to-be-more-sustainable/)
- Policy context: reports differ on whether the Green Claims Directive was withdrawn or merely stalled; the Empowering Consumers Directive applies from 27 September 2026 — [Renewable Matter](https://www.renewablematter.eu/en/eu-ecolabel-consumer-confidence-meets-new-anti-greenwashing-rules)

**Cannabis**
- Label accuracy problem is real: Colorado flower study (23 samples, 10 dispensaries; PLOS ONE 2023) found observed THC on average 23.1% below the lowest and 35.6% below the highest labelled values; ~70% of samples were more than 15% below label. Small sample; several authors had industry ties — [PLOS ONE via RePEc](https://econpapers.repec.org/RePEc:plo:pone00:0282396); [MJBizDaily](https://mjbizdaily.com/?p=381950)
- German discrete choice experiment (n = 193, flowers; Applied Food Research 2025): most valued attributes were type and strength of effect, then packaging and labelling; largest segment "Otto Normal" consumers at 63.7% — [HAW Hamburg repository](https://reposit.haw-hamburg.de/handle/20.500.12738/17588)

**Luxury resale**
- More than half of consumers expect to pay at least 40% less for a pre-owned item that cannot be authenticated (Certilogo survey of its own users — vendor, self-selected) — [Certilogo](https://discover.certilogo.com/blogs/insights/products-with-authentication-are-worth-more)
- 63% of luxury shoppers worry it is too easy to buy fakes online by accident (Havas Media) — [Decision Marketing](https://www.decisionmarketing.co.uk/?p=128253)

### Inferences
- A defensible planning assumption: stated premiums must be discounted heavily (the Dubois trial suggests an order of magnitude) and traceability per se is valued less than the outcome attributes it proves (safety, potency accuracy, authenticity, organic).
- **Supports thesis:** verification is worth most where (a) the attribute is safety- or value-critical, (b) fraud or label inflation is known, and (c) the buyer cannot check — exactly cannabis potency/contaminants, infant formula in China, and luxury resale authenticity. In these, "not verified" is priced as a discount, which is a stronger mechanism than a premium for "verified".
- **Undermines thesis:** in ordinary categories consumers do not distinguish an independent seal from a brand claim or even from a fake seal; a new private "KYP verified" mark would start with no recognition among ~230 existing labels. State/EU-backed marks retain trust (Ecolabel 81%).
- Cannabis-specific risk: if verified testing shows lower THC than competitors' inflated labels, honest verification can *reduce* sales unless all competitors are held to the same layer — an argument for regulator- or retailer-level adoption rather than brand-by-brand opt-in.

### Gaps
- No cannabis-specific study of WTP for independently verified lab results was found; no European survey quantifying "tested/quality-assured" as a reason for choosing legal or pharmacy supply (Swiss pilot literature found dealt with purchase frequency only).
- No meta-analysis directly comparing third-party versus self-declared claims was found; evidence is single experiments with convenience samples.
- Tran et al. 2024 (Food Control) pooled results not retrieved. Primary Eurobarometer / Consumer Conditions Scoreboard figures not read in the original.
- Supplements: no controlled study of WTP for USP/NSF marks retrieved.

---

## B3. What makes transparency information usable

### Takeaway
Information changes behaviour when it is compressed into a single comparable signal at the point of choice and when it can be negative; raw data behind a link does not. The larger documented effect of summary scores is on producers (reformulation) rather than on shoppers.

### Cited Findings
- Nutri-Score outperformed other label formats in the 60-supermarket trial; mechanism identified by in-store surveys: it attracts attention and helps shoppers rank products within a category; effect grows with within-category variance — [Dubois et al., TSE](https://www.tse-fr.eu/node/120536)
- Even so, the real-store effect was small (basket quality +2.5%) — [Dubois et al., TSE working paper PDF](https://publications.ut-capitole.fr/id/eprint/34702/1/wp_tse_1088.pdf)
- Yuka's single 0-100 score with red ratings: 94% of surveyed users say they put red-rated products back (self-reported, volunteer sample of ~20,000) — [Yuka impact report](https://yuka.io/wp-content/uploads/social-impact/en/Social%20impact%20-%20Yuka.pdf); producer response: Intermarché reformulating 900 products — [Euronews](https://www.euronews.com/2019/09/20/french-supermarket-chain-to-remove-additives-using-phone-app-that-rates-products)
- More time spent reading QR-linked traceability detail did not increase WTP — [British Food Journal, Tran et al. 2024](https://www.emerald.com/insight/content/doi/10.1108/BFJ-09-2023-0812/full/html)
- USDA/Deloitte: consumers assume QR codes are marketing unless explicitly told otherwise; access barriers (apps, connectivity, skills) — [FoodNavigator](https://www.foodnavigator.com/Article/2017/09/11/Digital-GMO-disclosure-faces-significant-but-manageable-challenges/)
- Public-health bodies argue QR-only disclosure is a "licence to hide" and that essential information must be on-pack — [Alcohol Review](https://alcoholreview.substack.com/p/european-cancer-federation-says-qr)
- Trace4Value pilot learning: some DPP data was EU-centric and not relevant or possibly inaccurate for consumers elsewhere — [TrusTrace](https://trustrace.com/knowledge-hub/how-to-gather-data-for-the-dpp)
- EU energy label: analysis of a 2019 Eurobarometer (n = 27,438, 28 member states) finds that even very high label awareness does not necessarily translate into substantially greater influence on purchases in some countries — [ERSA working paper](https://econrsa.org/publications/socioeconomic-determinants-of-awareness-of-energy-labels-and-their-influence-on-purchase-decisions-in-the-eu/)
- Stiftung Warentest re-tests about 10% of products advertised with its seal and withdraws licences — a mechanism for negative information — [test.de](https://www.test.de/unternehmen/werbung-5016972-0/)

### Inferences
- Design rules that follow from the evidence: one graded, comparable signal per product (pass/fail or A-E) visible without scanning; negatives (failed tests, recalls, expired verification) shown as prominently as positives; raw CoA/track-and-trace data one tap behind for the minority and for professionals.
- The lever with the best evidence is supply-side: a public, comparable score changes producer behaviour even when few consumers act on it. A KYP layer might create more value by making producers compete on verified metrics than by informing individual purchases.
- A "passport" (document metaphor) is the wrong UX primitive for consumers; a "score/flag" is the right one. The passport is for B2B and authorities.

### Gaps
- No evidence retrieved on how consumers respond to recall or failed-test information delivered via product QR codes. No independent evidence on Nutri-Score-driven reformulation was retrieved.

---

## B4. Are B2B buyers and regulators the real users of provenance data?

### Takeaway
The documented, measurable benefits of item-level data are operational and regulatory (expiry management, waste, recall speed, professional access to product information, market surveillance); consumer benefits are asserted mainly in vendor-funded surveys. No source proves consumers are irrelevant, but the weight of measured evidence points to business and authority users.

### Cited Findings
- Woolworths 2D barcodes: up to 21% productivity improvement in expiry-date management, up to 40% food-waste reduction — [GS1](https://www.gs1.org/system/files/case-study-woolworths-gs1australia.pdf); Tesco's trial goals are likewise date-code accuracy and waste — [Packaging Europe](https://www.packagingeurope.com/tesco-trials-gs1-qr-codes-in-select-uk-stores/)
- GS1 "Sunrise 2027" is a point-of-sale readiness goal (retail scanners able to read 2D codes by end 2027) — [GS1 UK](https://www.gs1uk.org/insights/press-releases/GS1UK-collaborates-with-leading-retailers-and-brands-to-launch-the-second-barcode-revolution)
- Walmart's blockchain mandate was justified by outbreak tracing, i.e. recall speed — [CoinDesk](https://www.coindesk.com/ibm-food-supply-chain-blockchain-carrefour-live-production/)
- e-PIL pilot users were hospital pharmacists and physicians; patients rarely request the leaflet — [EFPIA](https://efpia.eu/news-events/the-efpia-view/blog-articles/electronic-product-information-epi-making-the-latest-medicine-s-information-available-for-patients-without-any-delay/)
- A TU Delft thesis distinguishes a "compliance passport" for B2B and regulation from a "consumer passport" centred on ownership, authenticity and storytelling — [TU Delft repository](https://repository.tudelft.nl/file/File_d412b492-7ddf-46b8-a571-8b009a66aa0d)
- RREUSE ran a 2025 DPP survey of repairers, refurbishers and recyclers as a user group — [RREUSE survey](https://cdn.nimbu.io/s/zx3wipv/channelentries/sv0b8c5/files/1756816526849/rreuse-2025-dpp-survey-repairers-refurbishers-repurposers-recyclers.pdf?414p73d)
- Consumer-positive DPP surveys exist but are weak: Certilogo/SDA Bocconi — 71% believe DPPs will increase trust in brands, 49% expect greater loyalty (sample drawn from Certilogo's own authentication users; vendor) — [FashionUnited](https://fashionunited.uk/press/business/digital-product-passport-a-new-era-of-trust-and-transparency-in-fashion-starting-with-consumers-according-to-a-certilogo-survey/2025021880205). Consumers International surveyed 1,000 German consumers on DPPs for smartphones; University of Marburg surveyed 230 German consumers on valued DPP information — [Consumers International](https://www.consumersinternational.org/what-we-do/sustainable-consumption/digital-product-passports); [Uni Marburg white paper 47](https://www.uni-marburg.de/en/fb02/research-groups/business-administration/digitalization/white-paper-series/whitepaper-47-eng.pdf)
- Consumer organisations want consumer-facing access protected in the DPP registry rules — [Euroconsumers feedback, June 2026](https://www.euroconsumers.org/wp-content/uploads/2026/06/Euroconsumers-Feedback-on-Commission-Draft-Implementing-Regulation-on-the-Digital-Product-Passport-Registry.pdf)

### Inferences
- The realistic first paying customers for a KYP layer are relying parties with a compliance or liability problem: pharmacies/retailers and marketplaces (DSA/GPSR duties), wholesalers/importers (GDP supplier qualification), insurers, and regulators running pilots. Consumers are beneficiaries and a legitimacy source, not the revenue base.
- The consumer-facing layer still has strategic value: it is what distinguishes KYP from a supplier-compliance SaaS, and it is what a regulator or retailer can point to. But it should be budgeted as a cost of legitimacy, not a growth engine, until measured scan/usage data says otherwise.

### Gaps
- No quantitative study directly comparing consumer versus business/authority access volumes for any DPP or traceability system. Results of the Consumers International and Marburg surveys were not retrieved. No CIRPASS-2 pilot results found.

---

## B5. Precedents where consumer-facing verification became standard because a regulator or dominant retailer required it

### Takeaway
Every precedent found where verification became a market standard was mandate-driven — by law (EU wine e-labels, EU energy label, DSA trader checks, state cannabis QR codes) or by a gatekeeping buyer (Amazon, CVS, Walmart, EcoVadis customers). None became standard through consumer demand alone, and mandated disclosure does not by itself produce consumer use.

### Cited Findings
- Amazon made third-party TIC verification a listing condition for supplement categories in 2024 and widened it by 2026; non-compliant listings are suppressed — [Nutraceuticals World](https://www.nutraceuticalsworld.com/exclusives/amazon-supplement-policy-update-third-party-verification-required-from-nsf-ul-or-eurofins/); [Epstein Becker Green](https://www.ebglaw.com/insights/publications/amazons-third-party-supplement-testing-mandate-explained); commentary frames it as Amazon acting where the FDA does not — [Science-Based Medicine](https://sciencebasedmedicine.org/amazon-goes-where-the-fda-does-not/)
- CVS: third-party testing for all supplements since 2019 — [Modern Retail](https://www.modernretail.co/?p=94618)
- Walmart: leafy-greens suppliers required onto IBM Food Trust by September 2019 — [CoinDesk](https://www.coindesk.com/ibm-food-supply-chain-blockchain-carrefour-live-production/)
- DSA Art. 30: marketplaces had to collect and check trader data, including for existing traders within 12 months of 17 February 2024, and suspend non-compliers — [Mondaq](https://www.mondaq.com/compliance/1367256/online-marketplaces-and-the-digital-services-act-understanding-trader-traceability)
- EU wine: QR e-labels for ingredients and nutrition mandated; yet measured scanning is cited at 0.26% — [Brussels Signal](https://brusselssignal.eu/2025/06/eu-wine-sectors-digital-labelling-switch-raises-questions)
- US bioengineered-food disclosure: QR allowed by statute, but USDA had to add alternatives after the access study — [Hogan Lovells](https://www.hlc.com/en/publications/usda-seeks-information-regarding-revisions-to-digital-disclosure-option-for-bioengineered-foods)
- US cannabis: state-issued/track-and-trace-linked QR codes on retail packaging (Metrc Retail ID) link to the CoA; the vendor-announced study recommends standardising such codes across regulated products — [Metrc](https://www.metrc.com/learn-to-read-a-cannabis-certificate-of-analysis-with-confidence-see-how-retail-id-makes-access-easy-and-builds-trust-for-safer-informed-cannabis-choices/)
- EcoVadis: suppliers subscribe because customers require it (52% of revenue from suppliers) — [EcoVadis](https://ecovadis.com/trust-center/esma/)
- Retailer adoption of a third-party score: Intermarché reformulated around Yuka without any mandate — the nearest example of consumer-side pressure creating a de facto standard — [Euronews](https://www.euronews.com/2019/09/20/french-supermarket-chain-to-remove-additives-using-phone-app-that-rates-products)

### Inferences
- **Overall test of the thesis.** Supported: (1) EU law is already importing KYC logic into commerce (DSA Art. 30; GPSR; ESPR/DPP); (2) regulated goods already produce verified batch data that is not portable or visible downstream; (3) verification has measurable value where fraud or label inflation is documented (cannabis potency, supplements, luxury resale); (4) reusable-credential infrastructure (LEI/vLEI, EUDI wallet) is arriving, if late. Undermined: (1) "KYC without the pain" misreads why KYC exists — it is compelled, and the venture needs an equivalent compulsion (regulator, pharmacy chain, marketplace, insurer); (2) consumers scan at 0.1-1% and do not reliably reward independent verification over brand claims; (3) shared verification utilities fail when liability stays with the relying party; (4) producer-pays verification has a poor integrity record.
- The most evidence-consistent positioning: KYP as a neutral, reusable attestation layer that relying parties (retailers, marketplaces, authorities) require and consumers can inspect — "verify once, rely many times" for product batches — rather than a consumer app or a new trust mark.
- For cannabis in Europe the practical route to "standard" is adoption by a licensing authority or a pilot-trial operator, or by pharmacy/wholesale chains as a supplier condition; brand-by-brand opt-in creates an adverse-selection problem (honest potency looks worse).

### Gaps
- No European cannabis precedent (Germany, Switzerland, Netherlands, Czechia, Malta) of a mandated consumer-facing verification layer was researched in this session; adjacent researchers may cover track-and-trace specifics.
- No measured consumer usage data for any mandated scheme other than the alcohol/wine pilot figure.
- EU Falsified Medicines Directive (pack-level verification at dispensing) and tobacco track-and-trace are obvious regulator-mandated precedents but were not sourced here.
