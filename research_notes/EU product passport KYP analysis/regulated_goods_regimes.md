# Mandatory traceability, serialization and verification regimes for regulated goods (non-cannabis) and their relation to the EU Digital Product Passport — state as of 13 November 2026

Reading note: items tagged **[BK]** are background knowledge cited to the primary legal text or official page but not re-fetched in this session; everything else comes from searches run on 13 Nov 2026. Search results were read as summaries, not full pages, so exact dates should be checked against the Official Journal before being quoted in anything binding.

## 1. Medicines: EU FMD / Delegated Regulation 2016/161, US DSCSA, Switzerland

### Takeaway
EU medicines serialization is item-level, industry-run and industry-paid, and verification ends at the pharmacy counter: the patient has no access to the repository and no official way to check a pack. Magistral/officinal preparations (the route by which medical cannabis flower is dispensed in Germany) fall outside the Directive and therefore outside serialization, which is the clearest unserved gap in the pharmaceutical chain.

### Cited Findings
- Legal basis: Directive 2011/62/EU (amending 2001/83/EC, Art. 54(o) and 54a) and Delegated Regulation (EU) 2016/161, applying since 9 Feb 2019. Each pack of (broadly) prescription medicine carries a unique identifier in a 2D DataMatrix (product code, serial number, batch, expiry) plus an anti-tampering device **[BK]** — [Delegated Regulation 2016/161](https://eur-lex.europa.eu/eli/reg_del/2016/161/oj)
- Architecture: "end-to-end" verification, not full track-and-trace. Manufacturers upload serials; the pack is verified and decommissioned at the point of supply to the public; wholesalers verify on a risk basis. The repository system is set up and managed by a non-profit legal entity established by manufacturers and marketing authorisation holders, and costs are borne by manufacturers (Art. 31 of the Delegated Regulation; Art. 54a(2)(e) of Directive 2001/83) **[BK]** — [Delegated Regulation 2016/161](https://eur-lex.europa.eu/eli/reg_del/2016/161/oj)
- Data access: repository data belongs to the party that generated it; competent authorities get access for supervision, pharmacovigilance and reimbursement purposes (Arts. 38-39). There is no provision for patient or public access **[BK]** — [Delegated Regulation 2016/161](https://eur-lex.europa.eu/eli/reg_del/2016/161/oj)
- Magistral and officinal formulas prepared in a pharmacy are excluded from Directive 2001/83/EC altogether (Art. 3(1) and (2)), so the safety-feature obligation does not reach them **[BK]** — [Directive 2001/83/EC consolidated](https://eur-lex.europa.eu/eli/dir/2001/83/oj)
- German cannabis flower: classification is disputed. OLG Hamburg (22 Dec 2020, 3 W 38/20) treated flower as a starting material because essential processing happens in the pharmacy; most Länder authorities reportedly treat it as a bulk medicinal product for preparing magistral medicines — [CMS](https://cms.law/de/deu/legal-updates/cannabisblueten-ausgangsstoff-oder-bereits-arzneimittel)
- In Germany the pharmacy software determines automatically whether a pack is subject to verification; "nearly all prescription medicines" are — [ABDA securPharm FAQ](https://abda.de/fileadmin/user_upload/assets/securpharm/FAQ_securPharmCD_V5_20240913.pdf)
- Weakness, false alerts: EMVO attributed alerts mostly to missing or incorrect data uploads to the European Hub and scanner misconfiguration; an EMVO report put false alerts at about 3% of all scans in the early period; stakeholders proposed letting end users dispense alerting packs until the alert level stabilised below 0.05% — [GMP-compliance.org](https://www.gmp-compliance.org/gmp-news/track-trace-emvo-stakeholders-call-for-inspections); [European Pharmaceutical Review](https://www.europeanpharmaceuticalreview.com/?p=122637)
- National handling diverges: Belgium allows an alerting pack to be supplied pending evaluation and inspects pharmacies with too many alerts; Finland requires investigation before dispensing — [FAMHP Belgium](https://www.afmps.be/en/news/falsified_medicines_directive_end_of_transition_period_and_beginning_of_monitoring_activities); [Finnish MVO guideline](https://www.laakevarmennus.fi/sites/default/files/2020-06/Alert%20Handling%20Guideline%20for%20Medicines%20Verification%20System%202.0_EN%20%28v1%29.pdf)
- Pharmacy representatives said in 2023 that the legislation "seriously underestimated" the alert burden, especially for very small businesses — [Pharmaceutical Executive](https://www.pharmexec.com/view/the-challenge-of-taking-on-falsified-medicines-in-europe)
- ESPR scope: medicinal products and veterinary medicinal products are expressly excluded from the ESPR, so no DPP will apply to them — [GS1 on DPP out-of-scope products](https://support.gs1.org/support/solutions/articles/43000758757-which-products-are-out-of-scope-for-the-dpp-initiative-); [A&O Shearman](https://www.aoshearman.com/en/insights/navigating-the-eus-ecodesign-for-sustainable-products-regulation)
- US DSCSA: package-level serialization with electronic, interoperable exchange of transaction data between trading partners. Enforcement has been phased through exemptions; wholesale distributors have been subject to enforcement since 27 Aug 2025 — [Blue Link](https://www.bluelinkerp.com/blog/dscsa-enforcement-distributors-selling-small-dispensers/)
- DSCSA small dispensers: on 6 Aug 2026 FDA reportedly extended the small-dispenser exemption from 27 Nov 2026 to 27 Nov 2027, and asked small dispensers to complete an assessment survey by 22 Sept 2026 — [LSPedia](https://www.lspedia.com/blog/the-fda-just-extended-the-small-dispenser-dscsa-exemption-heres-what-you-still-need-to-do); [NABP August 2026 mailbag](https://nabp.pharmacy/members/board-resources/mailbag/august-electronic-mailbags/)
- Switzerland: under Art. 17a of the Therapeutic Products Act, applying and verifying unique identifiers and anti-tampering devices is voluntary, on the stated ground that no counterfeit medicines intended for the Swiss market have been detected in the legal supply chain; the Federal Council may make it mandatory by ordinance — [FOPH](https://www.bag.admin.ch/en/combatting-counterfeit-therapeutic-products)
- A draft Swiss implementing ordinance with explanatory report (May 2025) covers SMVO and its subsidiary SMVS; pharmaSuisse opposed the approach in its September 2025 consultation response — [FOPH draft ordinance](https://www.bag.admin.ch/dam/bag/de/dokumente/biomed/heilmittel/vo-vl-fmd-2025.pdf.download.pdf/Verordnung_DE.pdf); [pharmaSuisse response](https://pharmasuisse.org/system/files/media/documents/2025-09/Antwortformular%20pharmaSuisse.pdf)

### Inferences
- The FMD answers one question only: "is this serial known and not yet dispensed?" It carries no data on origin, intermediate handlers, quality testing or cold chain, and the answer is given to the pharmacist, not the patient. A consumer-facing layer cannot read the EMVS, so it would have to build its own evidence rather than re-expose official data.
- The DSCSA has no central repository at all (bilateral EPCIS exchange), so patient verification is structurally absent there too.
- Pharmacy-compounded and unlicensed products are the natural entry point: they are prescription-grade goods with no item-level identifier and no verification step, and German cannabis flower is the largest such category. This is a regulatory white space, not a competitor's territory.
- The alert history is a warning for any new verification layer: data-quality errors by upstream parties surface as accusations of falsification at the point of sale, and the cost lands on the smallest actor.

### Gaps
- No current (2025-2026) EMVO alert-rate figure was found; the 3% and 0.05% figures date from 2019-2020.
- I could not confirm whether the Swiss ordinance has been adopted or whether serialization remains voluntary in practice as of November 2026.
- Italy and Greece had extended transition periods for joining the EU system (to 2025, with a further Italian extension I recall but could not confirm); status not verified.
- No EU patient-facing verification app tied to the EMVS was found. From background knowledge only, consumer scanning exists in some non-EU systems (Turkey's ITS, Russia's Chestny ZNAK, SMS/scratch-code schemes in Nigeria, QR codes on top-selling brands in India); none of this was verified in session.
- No source explicitly states that cannabis flower dispensed as a magistral preparation is exempt from securPharm; the conclusion follows from the Directive's scope, not from a securPharm statement.
- The DSCSA 2027 date comes from vendor and NABP summaries; the FDA notice itself was not read.

## 2. Tobacco: TPD Articles 15-16, FCTC Protocol, planned revision

### Takeaway
Tobacco has the most complete item-level track-and-trace in the EU, but it is built for excise and enforcement authorities, consumers get only a visible security feature, and its independence from the industry is contested by NGOs, academics and, in September 2026, the EU's own auditors. Extension to vapes and nicotine pouches is expected in the TPD revision but no proposal had been confirmed as published.

### Cited Findings
- Legal basis: Directive 2014/40/EU Arts. 15 (traceability) and 16 (security feature), implemented by Implementing Regulation (EU) 2018/574, Delegated Regulation (EU) 2018/573 and Implementing Decision (EU) 2018/576 **[BK]** — [Directive 2014/40/EU](https://eur-lex.europa.eu/eli/dir/2014/40/oj); [Implementing Regulation 2018/574](https://eur-lex.europa.eu/eli/reg_impl/2018/574/oj)
- Mandatory for cigarettes and roll-your-own since 20 May 2019 and for all other tobacco products since 20 May 2024 — [osapiens](https://osapiens.com/en/regulations/tpd)
- Granularity and operation: unique identifier on every unit pack, with aggregation levels; identifiers generated by ID issuers appointed by each Member State; each manufacturer/importer contracts an approved independent primary repository; a single secondary repository holds a copy of all data and is accessible to Member States and the Commission; manufacturers bear the costs **[BK]** — [Implementing Regulation 2018/574](https://eur-lex.europa.eu/eli/reg_impl/2018/574/oj)
- Vapes, nicotine pouches and e-liquids containing no tobacco are outside the current traceability scope — [osapiens](https://osapiens.com/en/regulations/tpd)
- Independence criticism: the system uses a "mixed" governance model said to have been shaped by industry pressure in consultation, and relies on providers (Inexto, Dentsu Tracking) with links to Philip Morris's Codentify technology — [Gallagher and Gilmore, Tobacco Control](https://tobaccocontrol.bmj.com/content/29/e1/e56); [Génération Sans Tabac](https://www.generationsanstabac.org/en/actualites/suivi-et-tracabilite-des-produits-du-tabac-lingerence-de-lindustrie-du-tabac-reste-majeure/)
- A senior DG SANTE official was hired by Dentsu as director of regulatory affairs a few months after leaving; MEPs criticised the lack of transparency about the Dentsu contract (advocacy source) — [Génération Sans Tabac](https://www.generationsanstabac.org/en/?p=21354)
- The Commission's own evaluation credited the system with sustaining a long-term decline in illicit trade but found "no significant change in the post-2019 slope in illicit trade" — [Génération Sans Tabac on the Commission evaluation](https://www.generationsanstabac.org/en/?p=26575)
- European Court of Auditors Special Report 23/2026 (8 Sept 2026), "Combating the illicit trade in tobacco in the EU: Fragmented efforts and persistent gaps": estimated cost of about EUR 13bn a year, no reliable picture of the size or structure of the illicit market, production shifting inside the EU — [Brussels Signal](https://brusselssignal.eu/2026/09/eu-not-up-to-the-task-of-fighting-illicit-tobacco-trade-auditors-find/); [EUobserver](https://euobserver.com/236167/eu-lags-behind-in-fight-against-illicit-tobacco-report-found/)
- Press coverage of the audit says letting industry control or influence traceability solutions conflicts with the FCTC Protocol — [Health Policy Watch](https://healthpolicy-watch.news/europe-failing-illegal-tobacco/)
- The International Tax Stamp Association called for reform as the EU reviews the system (interested party: tax-stamp suppliers compete with the incumbent model) — [ITSA](https://tax-stamps.org/news/itsa-calls-for-reform-as-eu-reviews-tobacco-traceability-system/)
- TPD revision: call for evidence and public consultation ran May-June 2026 (consultation closing 15 June 2026); a proposal was expected by end-2026, with application likely from 2028 according to a vendor source. Options include extending scope to novel products, with traceability for e-cigarettes and pouches requested by health NGOs — [osapiens](https://osapiens.com/en/regulations/tpd); [Freyr](https://www.freyrsolutions.com/consumer-industry-news/european-commission-launches-review-of-eu-tobacco-and-tobacco-advertising-rules); [EuroHealthNet response](https://eurohealthnet.eu/wp-content/uploads/publications/2026/2606_consultation-response_tobacco-products-and-advertising.pdf)
- The separate Tobacco Taxation Directive proposal would bring e-cigarettes, heated tobacco and nicotine pouches into excise scope; it needs unanimity and was still under negotiation in August 2026 — [Euronews](https://www.euronews.com/2026/08/19/can-the-eu-stop-smoking-and-vaping-not-quite-but-it-can-raise-taxes)

### Inferences
- Tobacco is the closest structural analogue to a regulated-cannabis track-and-trace: item-level, state-issued identifiers, excise-driven. Its lesson is that the governance question (who generates codes, who holds the repository, who chooses and pays the provider) dominates the technology question.
- "Industry pays and selects, authority reads" produces a system whose independence is permanently disputed. A new entrant whose repository is paid for by the brands it verifies will face the same objection unless audit rights and data custody are separated from the paying party.
- Nicotine pouches and vapes are a likely next mandated category (2028 or later). That is a window in which voluntary provenance could be sold, but any such product would be displaced or absorbed once the mandate arrives.
- If excise is extended to these products, the state acquires the same fiscal motive that produced tobacco track-and-trace; that motive, not consumer protection, has historically been what gets item-level systems built.

### Gaps
- I found no confirmation that the TPD revision proposal had been published by 13 Nov 2026; the "end-2026" and "2028" dates come from vendor pages.
- The ECA report and the Commission evaluation were read only through press and advocacy coverage; the audit's specific recommendations on the traceability system were not retrieved.
- No source was found describing an official consumer-facing lookup of tobacco unique identifiers. From background knowledge the consumer sees only the overt element of the security feature; unverified in session.
- Swiss position on tobacco traceability (Switzerland has not, to my knowledge, ratified the FCTC or its Protocol) was not researched.
- FCTC Protocol details (in force since 2018, Art. 8 global tracking regime and the bar on delegating obligations to the industry) are stated from background knowledge and not sourced here.

## 3. Medical devices: MDR/IVDR UDI and EUDAMED

### Takeaway
EUDAMED became mandatory for its first four modules on 28 May 2026 and is the one regime in this set with a genuinely public database, but what the public sees is model-level registration and certificate data, not confirmation that a particular unit is genuine.

### Cited Findings
- From 28 May 2026 use of four modules is mandatory: Actor Registration, UDI/Device Registration, Notified Bodies and Certificates, and Market Surveillance — [TÜV Nord](https://www.tuev-nord.de/en/knowledge/standards-in-focus/eudamed-mandatory-use-of-first-four-modules-from-may-28-2026/); [HPRA](https://www.hpra.ie/news-events/news/article/mandatory-use-of-eudamed-modules-for-medical-devices)
- New devices must be registered before first placing on the market; devices already on the market have a transition period ending 28 Nov 2026 (some sources say 27 Nov) — [Obelis](https://www.obelis.net/news/eudamed-becomes-mandatory-on-28-may-2026-deadlines-for-actor-device-and-certificate-registrations/); [Taylor Wessing](https://www.taylorwessing.com/en/insights-and-events/insights/2026/01/eudamed-rollout)
- Mandatory use of the Vigilance module is expected in Q2 2027 — [NSF](https://www.nsf.org/life-science-regulatory-news/eudamed-milestone-mandatory-modules-from-28-may-2026)
- A public website exists separately from the registered-user portal; the database is meant to improve information access for the public and healthcare professionals — [EUDAMED public site](https://ec.europa.eu/tools/eudamed); [BASG](https://www.basg.gv.at/en/companies/medical-devices/eudamed)
- UDI structure under Regulation (EU) 2017/745: a device identifier (UDI-DI, model level) and a production identifier (UDI-PI: lot, serial, expiry). Only the UDI-DI and related device data go into the database **[BK]** — [Regulation 2017/745](https://eur-lex.europa.eu/eli/reg/2017/745/oj)
- Medical devices are not on the list of product groups excluded from the ESPR (the list covers food, feed, medicinal and veterinary medicinal products, living organisms, products of human origin, reproduction material and vehicles) — [GS1](https://support.gs1.org/support/solutions/articles/43000758757-which-products-are-out-of-scope-for-the-dpp-initiative-)

### Inferences
- EUDAMED lets anyone check that a manufacturer, model and certificate exist. It does not hold serials, so it cannot tell a consumer whether the unit in their hand is authentic. Unit-level authentication of devices is an open lane, though one mostly relevant to hospitals and distributors.
- EUDAMED shows the cost of a state-run registry: the database was due in 2020 and became partly mandatory six years late. A founder should not plan around a public registry arriving on schedule.

### Gaps
- Whether the Swiss equivalent (swissdamed) device module is now mandatory was not verified.
- No data found on actual public usage of EUDAMED.

## 4. Food: General Food Law, FSMA 204, organic/TRACES, wine e-label, fraud

### Takeaway
Food traceability is batch-level, held privately by each operator and invisible to consumers, with no central database. The wine e-label is the working precedent for a legally mandated QR code that must lead to neutral, tracking-free product information, and its rules sharply restrict what such a page may do.

### Cited Findings
- EU: Regulation (EC) 178/2002 Art. 18 obliges each operator to identify its immediate supplier and immediate customer ("one step back, one step forward") and to produce this for authorities on demand; it creates no shared repository and no consumer right of access **[BK]** — [Regulation 178/2002](https://eur-lex.europa.eu/eli/reg/2002/178/oj)
- Food and feed are excluded from the ESPR, so no DPP — [GS1](https://support.gs1.org/support/solutions/articles/43000758757-which-products-are-out-of-scope-for-the-dpp-initiative-)
- US FSMA 204: compliance date moved from 20 Jan 2026 to 20 July 2028; Congress directed FDA not to enforce before that date; the requirements themselves are unchanged — [FDA](https://www.fda.gov/food/food-safety-modernization-act-fsma/fsma-final-rule-requirements-additional-traceability-records-certain-foods); [Federal Register proposed rule 2025-14967](https://public-inspection.federalregister.gov/2025-14967.pdf)
- Large retailers and foodservice distributors have written FSMA 204 requirements into supplier contracts on earlier timelines than the legal date — [The Packer](https://www.thepacker.com/news/food-safety/what-you-need-know-about-fsma-204-delay)
- Wine e-label: under Regulation (EU) 2021/2117, wine produced from 8 Dec 2023 must show the energy value on the physical label; the ingredient list and full nutrition declaration may be given electronically via QR code — [Food Safety Magazine](https://www.food-safety.com/articles/9045-new-eu-regulations-for-wine-ingredients-and-nutritional-labeling-come-into-effect-december-8); [NSF](https://www.nsf.org/gb/en/knowledge-library/enhancing-transparency-eu-wine-industry-amendment-wine-labelling)
- The linked page may not carry advertising or sales content and may not collect or track user data — [wein.plus](https://magazine.wein.plus/this-is-how-nutritional-value-and-ingredient-information-must-look-on-the-label-all-details-of-the-eu-regulation-from-december)
- Regulation (EU) 2026/471, in effect from 18 March 2026, extended and adjusted the digital option, including rules for reduced-alcohol wines and harmonised identification of the electronic means on the pack — [Vinetur](https://vinetur.com/en/2026031997832/european-union-enforces-sweeping-wine-labeling-rules-to-boost-transparency-and-consumer-information.html); [ainia](https://www.ainia.com/en/?p=187706)
- One QR code can serve several national markets, cutting relabelling cost — [Vinetur](https://vinetur.com/en/20260518100711/eu-wine-labels-add-qr-codes-to-dutch-bottles.html)
- Honey fraud: in the Commission's "From the Hives" coordinated action, 46% of sampled imported honey consignments were suspected of non-compliance with the Honey Directive **[BK]** — [European Commission](https://food.ec.europa.eu/safety/eu-agri-food-fraud-network/eu-coordinated-actions/honey-2021-2022_en)

### Inferences
- The wine e-label proves that EU law will accept a QR code as the carrier of mandatory consumer information, and that the industry will adopt shared platforms to deliver it. It also sets a hostile precedent for commercial models: the mandated page must be free of marketing and tracking. A KYP layer that monetises scan data or brand content would have to sit on a separate link from any legally required information.
- Batch-level one-up-one-down is enough to run a recall but cannot prove origin to a consumer, which is why fraud concentrates in goods where origin carries the price premium (honey, olive oil, seafood, organic). These are categories where the legal regime is weakest and the consumer's wish to verify is strongest.
- FSMA 204's delay shows the pattern seen elsewhere: legal deadlines slip, but large buyers impose the requirement by contract anyway. Retailer mandates may be a more reliable demand driver than statute.

### Gaps
- No consumer scan-rate data for wine e-labels was found.
- Whether the FSMA 204 extension has been published as a final rule (as opposed to proposed rule plus appropriations directive) was not confirmed.
- EU organic certificates in TRACES (Regulation 2018/848), infant formula, olive oil and seafood fraud cases, and the fisheries control traceability rules were not researched; I recall that organic operator certificates are publicly searchable in TRACES but did not verify it.

## 5. Alcohol and spirits

### Takeaway
Alcohol control is fiscal and consignment-level (EMCS) with nationally fragmented tax stamps; nothing in the EU regime gives the consumer an authentication tool, and anti-counterfeit work is left to brands.

### Cited Findings
- EMCS: movements of excise goods under duty suspension are tracked electronically per consignment under Directive (EU) 2020/262; it is a system between economic operators and tax authorities **[BK]** — [Directive 2020/262](https://eur-lex.europa.eu/eli/dir/2020/262/oj)
- E-labelling for wine applies as described in section 4; reporting on Regulation 2026/471 says wine is now to be treated like other food for consumer information purposes — [Vinetur](https://vinetur.com/en/2026031997832/european-union-enforces-sweeping-wine-labeling-rules-to-boost-transparency-and-consumer-information.html)
- Eurofins describes new EU labelling rules covering both wine and spirit drinks — [Eurofins](https://www.eurofins.com/en-nl/food-feed-testing/knowledge-news-articles/new-eu-rules-for-the-labelling-of-wine-and-spirit-drinks/)

### Inferences
- Alcohol has no EU-level item serialization. Because it is food, it is outside the ESPR. Authentication of premium spirits and wine is therefore a purely private market, already served by brand-owned and consortium tools.

### Gaps
- National excise-stamp schemes, their consumer-check features, and industry anti-counterfeit programmes were not researched in session. No sourced figures on counterfeit alcohol are included.

## 6. Chemicals, cosmetics, detergents, fertilisers, pesticides

### Takeaway
This is where sectoral law is converging on the DPP: the new Detergents Regulation mandates a product passport from 2029, and CLP and fertiliser rules now allow digital labels. The information is model- or formulation-level compliance data, not provenance or authenticity.

### Cited Findings
- Detergents: Regulation (EU) 2026/405 was published on 2 March 2026, entered into force 22 March 2026 and applies from 23 Sept 2029, replacing Regulation 648/2004 — [UL](https://www.ul.com/news/eu-publishes-new-detergent-regulation); [A.I.S.E.](https://aise.eu/new-detergents-regulation-official-defining-moment-sector/)
- Detergents and end-user surfactants must have a Digital Product Passport reachable through a QR code on the pack; labelling may be partly digital, but health and environmental protection information and minimum use instructions stay on the physical label (Art. 18) — [DQS](https://www.dqsglobal.com/en/explore/blog/eu-updates-detergents-regulation-eu-2026-405-compliance-timelines); [REACH24H](https://en.reach24h.com/news/industry-news/chemical/eu-detergents-and-surfactants-regulation-EU-2026-405)
- CLP: Regulation (EU) 2024/2865 entered into force 10 Dec 2024 and permits digital labelling; Regulation (EU) 2025/2439 postponed several labelling obligations (formatting, advertising, distance sales, fuel stations) to 1 Jan 2028 but did not remove the digital-label permission — [REACH24H](https://en.reach24h.com/news/industry-news/chemical/eu-delays-clp-implementation-dates-to-2028); [CIRS](https://www.cirs-group.com/en/chemicals/eu-revised-clp-regulation-officially-comes-into-effect)
- Fertilising products: Regulation (EU) 2024/2516 introduced digital labelling into the Regulation 2019/1009 framework; where another EU act requires a product passport, the declaration of conformity and digital label must also be available through it. A 2026 simplification omnibus proposes further amendments — [Council document ST-10621-2026](https://data.consilium.europa.eu/doc/document/ST-10621-2026-INIT/en/pdf); [Fieldfisher](https://www.fieldfisher.com/en-be/locations/belgium/insights/vi-simplification-omnibus)
- Cosmetics and tobacco do not appear in the ESPR exclusion list — [GS1](https://support.gs1.org/support/solutions/articles/43000758757-which-products-are-out-of-scope-for-the-dpp-initiative-)
- Cosmetics: product notification to the CPNP under Regulation (EC) 1223/2009 Art. 13 is made available to competent authorities and poison centres, not to the public **[BK]** — [Regulation 1223/2009](https://eur-lex.europa.eu/eli/reg/2009/1223/oj)

### Inferences
- The Detergents Regulation is the first proof that the DPP idea is being copied into sectoral law outside the ESPR's own delegated acts. Expect the same pattern in future revisions of other chemical-product laws, which gradually shrinks the set of regulated goods that have no mandated QR.
- These digital labels disclose composition and compliance documents for a product type. None of them verifies the individual unit or the supply path. A provenance layer is complementary in content, but will compete for the same physical QR and for consumer attention.
- Cosmetics are the notable open case: in ESPR scope in principle, a closed authority-only database, heavy counterfeiting, and no DPP delegated act scheduled that I could identify.

### Gaps
- Application date for fertiliser digital labelling was not confirmed (I recall 1 May 2027; unverified).
- SCIP (ECHA's public database of articles containing substances of very high concern) and pesticide labelling/record-keeping rules were not researched in session.
- Final status of the 2026 chemicals omnibus was not established.

## 7. Supply-chain due diligence laws that demand provenance evidence

### Takeaway
These laws do not create consumer-facing systems; they create business-to-authority and business-to-business demand for provenance evidence, and their timelines have slipped repeatedly. As of November 2026 the EUDR is due to apply on 30 Dec 2026, the Forced Labour Regulation on 14 Dec 2027, and the CSDDD only in July 2029 for a much smaller group of companies.

### Cited Findings
- EUDR: Regulation (EU) 2025/2650 moved application to 30 Dec 2026 for large and medium companies and 30 June 2027 for micro and small enterprises — [EY](https://taxnews.ey.com/news/2026-0237-eu-deforestation-regulation-application-postponed-to-30-december-2026); [Bird & Bird](https://cm.twobirds.com/en/insights/2025/out-of-the-woods-the-eudr-postponed-and-simplified)
- On 4 May 2026 the Commission published a simplification package following the mandated review and stated there would be no further postponement — [Hogan Lovells](https://www.hoganlovells.com/en/publications/eu-deforestation-regulation-commission-publishes-simplification-package-ahead-of-december-2026)
- EUDR mechanism: operators file a due diligence statement in the EU Information System including geolocation of the plots of production; reference numbers pass down the chain **[BK]** — [Regulation 2023/1115](https://eur-lex.europa.eu/eli/reg/2023/1115/oj)
- CSDDD after Omnibus I: Directive (EU) 2026/470, published 26 Feb 2026; scope cut to companies with more than 5,000 employees and over EUR 1.5bn turnover; transposition by 26 July 2028, application from 26 July 2029; climate transition plan duty and EU-wide civil liability removed; first guidelines due July 2027 — [Covington](https://www.cov.com/en/news-and-insights/insights/2026/02/eu-csddd-csrd-omnibus-published-in-official-journal-transposition-delegated-acts-and-guidelines-are-next); [Clifford Chance](https://www.cliffordchance.com/insights/resources/blogs/business-and-human-rights-insights/2026/02/omnibus-i-the-european-union-concludes-csddd-and-csrd-reforms.html)
- Forced Labour Regulation (EU) 2024/3015 applies from 14 Dec 2027 — [European Commission](https://single-market-economy.ec.europa.eu/single-market/goods/forced-labour-regulation_en)
- Commission guidelines and the Forced Labour Single Portal were issued in late June 2026 (sources give 26 or 30 June), with Official Journal publication on 3 Sept 2026; the risk database was not yet available in September 2026 and only ten Member States had designated competent authorities — [Covington](https://www.cov.com/en/news-and-insights/insights/2026/07/european-commission-publishes-forced-labour-regulation-guidelines-key-takeaways-for-companies); [Osborne Clarke](https://www.osborneclarke.com/insights/regulatory-outlook-september-2026-modern-slavery)
- Jones Day characterises the guidelines as "mandatory due diligence in disguise"; Human Rights Watch called them a positive step needing more — [Jones Day](https://www.jonesday.com/pt/insights/2026/07/eu-forced-labor-guidelines-mandatory-due-diligence-in-disguise); [HRW](https://www.hrw.org/news/2026/09/14/eu-forced-labor-guidance-a-positive-step-but-more-needed)

### Inferences
- With the CSDDD narrowed to very large companies, the product-level instruments (EUDR, Forced Labour Regulation) now carry most of the provenance burden. Both attach to the product at the border or on the market, not to the company, which is the logic a "Know Your Product" layer follows.
- The Forced Labour Regulation is a ban backed by investigation, with no prescribed evidence format. That leaves room for private evidence services, but the buyer is the compliance department, not the consumer.
- EUDR is the only regime here with a state-run, product-linked data system (geolocated statements). Its data is not public; consumers cannot look up the plot behind their coffee.
- Repeated delay and dilution is the dominant pattern in 2025-2026. A business plan that depends on a due-diligence deadline holding is fragile.

### Gaps
- No post-May-2026 confirmation that the EUDR simplification package was adopted unchanged or that the 30 Dec 2026 date still stands; this should be re-checked.
- UFLPA enforcement statistics for 2026, Conflict Minerals Regulation (EU) 2017/821 and CBAM were not researched in session. From background knowledge, the UFLPA's rebuttable presumption puts the burden of proving origin on the importer and is the strongest existing commercial driver for tracing evidence; unverified here.
- The Batteries Regulation's battery passport (due February 2027 as I recall) is the first live DPP and belongs with the DPP researcher; not covered.

## 8. Precious goods and other provenance regimes

### Takeaway
Diamonds show how hard mandatory provenance is even with G7 political backing: the traceability mandate has been postponed repeatedly and replaced for now by an importer self-declaration. Luxury shows the alternative, an industry consortium offering item-level consumer-facing passports with no legal mandate.

### Cited Findings
- G7/EU diamond traceability: the mandatory mechanism was planned for 1 Sept 2024, moved to March 2025, then to 1 Jan 2026 — [Jeweller Magazine](https://www.jewellermagazine.com/Article/13834/Another-setback-for-European-Unions-diamond-tracking-scheme); [National Jeweler](https://nationaljeweler.com/articles/13682-eu-once-again-pushes-back-deadline-on-diamond-traceability)
- As of 1 Jan 2026 traceability-based evidence is still not mandatory for all imports; instead importers of natural polished diamonds of 0.5 carat and above must sign a "Due Diligence Statement on Diamond Origin" — [AWDC FAQ](https://www.awdc.be/g7eu-sanctions-faq); [JCK](https://www.jckonline.com/editorial-article/eu-diamond-importers-diligence/)
- Rough diamonds verified in Antwerp receive a G7 certificate number entered on the import declaration; Antwerp has argued for multiple verification points rather than a single node — [AWDC](https://awdc.be/update-g7-sixteenth-sanction-package-against-russia); [Rapaport](https://rapaport.com/news/antwerp-backs-multiple-verification-points-for-diamond-sanctions/)
- The US was reported to have cooled on enforcing diamond traceability after industry backlash (date of report not confirmed) — [Mining.com/Reuters](https://www.mining.com/web/us-lukewarm-on-g7-russian-diamond-ban-after-industry-backlash/)
- Aura Blockchain Consortium: over 50 luxury member brands and over 80 million products registered as of January 2026 (over 70 million in September 2025); expanding beyond fashion, for example boats — [Aura Consortium](https://auraconsortium.com/?p=2348); [Aura Consortium, Axopar](https://auraconsortium.com/?p=2357)
- Luxury brands are presenting these as digital product passports ahead of ESPR requirements — [Glossy](https://www.glossy.co/fashion/luxury/how-digital-product-passports-are-showing-up-in-luxury)
- Explosives: Directive 2008/43/EC requires unique identification of each item of civil explosive and record-keeping along the chain, held by the companies and available to authorities **[BK]** — [Directive 2008/43/EC](https://eur-lex.europa.eu/eli/dir/2008/43/oj)
- Firearms: Directive (EU) 2021/555 requires unique marking of firearms and essential components and national data-filing systems for authorities **[BK]** — [Directive 2021/555](https://eur-lex.europa.eu/eli/dir/2021/555/oj)

### Inferences
- The Kimberley Process certifies shipments of rough stones, not individual polished stones, and the G7 attempt to go further stalled on governance and on who controls the verification node. Centralised chokepoints provoke resistance from every other trading centre.
- Aura is the nearest existing analogue to a consumer-facing KYP layer: item-level, brand-funded, scan-to-verify. Its limits are also instructive: it is a brand-controlled assertion, with members acting as both data source and governor, and there is no independent party attesting to the claims.
- Explosives and firearms are fully closed regimes (item-level, authority-only, safety-critical). There is no lane there.

### Gaps
- No G7 diamond decision later than January 2026 was found.
- LBMA gold programmes, CITES permits and labelling (for example caviar container codes), and the Kimberley Process's own reform status were not researched in session.
- Aura figures are self-reported and not independently audited as far as I could see.

## 9. Consumer-protection rules shaping what may be claimed

### Takeaway
The legal ground for verified claims shifted in 2026: the Green Claims Directive's mandatory third-party verification is dead, while the Empowering Consumers Directive has applied since 27 September 2026 and bans vague or unsubstantiated environmental claims and non-certified sustainability labels through unfair commercial practices law.

### Cited Findings
- Green Claims Directive: withdrawal announced June 2025; the Commission's 2027 work programme (early November 2026) lists the proposal for withdrawal, citing lack of Member State support; independent ex-ante verification of green claims is therefore dropped — [MLex](https://www.mlex.com/mlex/articles/2546190); [Lewis Silkin](https://www.lewissilkin.com/insights/2026/11/07/the-green-claims-directive-is-dead-but-what-will-be-the-net-effect-of-zero-toler-102o8n1); [Mintz](https://www.mintz.com/insights-center/viewpoints/2026-03-16-eu-commission-abandons-anti-greenwashing-law)
- Directive (EU) 2024/825 has applied since 27 September 2026 and prohibits vague or unsupported environmental claims; anti-greenwashing now rests on the amended Unfair Commercial Practices Directive — [A&L Goodbody](https://www.algoodbody.com/insights-publications/goodbye-green-claims-directive-where-does-that-leave-the-law-on-environmental-claims); [Lewis Silkin](https://www.lewissilkin.com/insights/2026/11/07/the-green-claims-directive-is-dead-but-what-will-be-the-net-effect-of-zero-toler-102o8n1)
- Directive 2024/825 also bans sustainability labels that are not based on a certification scheme or established by public authorities **[BK]** — [Directive 2024/825](https://eur-lex.europa.eu/eli/dir/2024/825/oj)
- General Product Safety Regulation (EU) 2023/988, applying since 13 Dec 2024: products must carry type, batch or serial identification; the Commission may require a traceability system for products posing serious risk; specific duties for online marketplaces; recalls published through Safety Gate **[BK]** — [Regulation 2023/988](https://eur-lex.europa.eu/eli/reg/2023/988/oj)
- Product Liability Directive (EU) 2024/2853: to be transposed by 9 Dec 2026; extends "product" to software and widens the set of liable economic operators **[BK]** — [Directive 2024/2853](https://eur-lex.europa.eu/eli/dir/2024/2853/oj)

### Inferences
- The ban on non-certified sustainability labels cuts both ways for a KYP mark. A "verified" badge that implies environmental or social qualities must sit on a certification scheme with independent monitoring, or it is itself an unfair practice. A badge limited to authenticity and provenance facts is less exposed.
- With the Green Claims Directive gone, there is no statutory role of "accredited claim verifier" to grow into. Demand for verification will come from enforcement risk under unfair-practices law and from retailers, not from a mandate.
- A verification provider whose software output is relied on by consumers should assume it can be drawn into product liability and misleading-practice claims once the new liability rules apply in December 2026.

### Gaps
- Whether the Green Claims proposal has been formally withdrawn (as opposed to listed for withdrawal) was not confirmed.
- National transposition status of Directive 2024/825 beyond Germany, and of the Product Liability Directive, was not checked.
- The GPSR and PLD points are from the legal texts and were not checked against 2026 guidance or case law.

## 10. Synthesis: closed and open lanes, and lessons for a new entrant

### Takeaway
Every compulsory regime examined stops at the authority or the last licensed professional; none gives the consumer a unit-level provenance check. The open lanes are goods that fall between regimes (compounded and unlicensed medicines, nicotine products before the TPD revision, cosmetics, origin-premium foods, alcohol), not the already-serialized categories, where the data is legally closed.

### Cited Findings
Comparison table (assembled from the findings and sources in sections 1-9; "consumer access" means what a member of the public can check about the specific unit they hold).

| Regime | Granularity | Operator / who pays | Consumer access | Verified by | ESPR/DPP |
|---|---|---|---|---|---|
| EU medicines (FMD) | Item (pack serial) | Industry non-profit (EMVO + national bodies); manufacturers pay | None | Pharmacist, wholesaler; authorities read | Excluded |
| US medicines (DSCSA) | Item (package) | Decentralised between trading partners; each pays own | None | Trading partners, FDA on request | n/a |
| Swiss medicines | Item, voluntary | SMVO/SMVS; industry | None | Pharmacy if participating | n/a |
| Magistral / unlicensed medicines | None mandated | n/a | None | Pharmacist's own identity testing | Excluded |
| EU tobacco | Item (unit pack) + aggregation | State-appointed ID issuers; industry-contracted repositories; one secondary repository; manufacturers pay | Visible security feature only | Customs, excise, police | Not excluded, no DPP act |
| Vapes, nicotine pouches | None at EU level | n/a | None | n/a | Not excluded |
| Medical devices | Model in database; lot/serial on device only | Commission (EUDAMED); public funds plus operator effort | Public model and certificate lookup | Authorities, notified bodies, hospitals | Not excluded |
| Food (EU) | Batch, one-up-one-down | Each operator; no central system | None beyond the label | Authorities on demand | Excluded |
| Wine e-label | Product/vintage | Producer or shared platform; producer pays | Ingredients and nutrition via QR; no provenance | n/a (information, not verification) | Excluded (food) |
| Alcohol excise (EMCS) | Consignment | Tax authorities | None | Tax authorities | Excluded (food) |
| Detergents (from 2029) | Product model | Manufacturer | Product passport via QR | Market surveillance | Sectoral DPP |
| Cosmetics (CPNP) | Product formulation | Commission portal; responsible person files | None | Authorities, poison centres | In scope, no DPP act found |
| EUDR | Consignment linked to plots | Commission information system; operators file | None | Customs and competent authorities | Separate regime |
| Forced Labour Regulation | Product, case by case | Authorities investigate; companies hold evidence | Public decisions on banned products (portal) | Competent authorities | Separate regime |
| Diamonds (KP / G7) | Shipment (rough); importer declaration (polished) | Governments and trade bodies | None official | Customs | n/a |
| Luxury (Aura) | Item | Brand consortium; brands pay | Scan-to-verify, brand-controlled | The brand itself | Voluntary pre-DPP |
| Explosives, firearms | Item | Companies and national registers | None | Police, authorities | n/a |

- Sources for each row are those cited in the corresponding section above; key anchors: [Delegated Regulation 2016/161](https://eur-lex.europa.eu/eli/reg_del/2016/161/oj), [Implementing Regulation 2018/574](https://eur-lex.europa.eu/eli/reg_impl/2018/574/oj), [EUDAMED public site](https://ec.europa.eu/tools/eudamed), [Regulation 178/2002](https://eur-lex.europa.eu/eli/reg/2002/178/oj), [GS1 on DPP scope](https://support.gs1.org/support/solutions/articles/43000758757-which-products-are-out-of-scope-for-the-dpp-initiative-), [AWDC FAQ](https://www.awdc.be/g7eu-sanctions-faq), [Aura Consortium](https://auraconsortium.com/?p=2348)
- Cannabis pointer (covered by another researcher): German medical cannabis flower sits in the magistral/starting-material category whose legal classification is itself contested, which is why it carries no FMD serial — [CMS](https://cms.law/de/deu/legal-updates/cannabisblueten-ausgangsstoff-oder-bereits-arzneimittel)

### Inferences
- **Where the data stops.** In every mandatory system the last reader is an authority or a licensed intermediary. This is by design: the systems exist to protect revenue or to catch falsified goods in the legal chain, and the legislator treats the licensed chain itself as the consumer's guarantee. The consumer's question ("where did this come from, who tested it, is this unit the real one?") is not asked by any of them.
- **Closed lanes.** Licensed medicines, tobacco, explosives, firearms, excise movements. Data ownership and access are fixed by law, repositories are closed, and a third party cannot read or re-expose them. The only possible role is as a supplier to the mandated system, a crowded vendor market.
- **Open lanes.** (1) Compounded and unlicensed medicines; (2) vapes and nicotine pouches until the TPD revision bites, probably not before 2028; (3) cosmetics and supplements; (4) origin-premium foods and alcohol, where law gives batch traceability only and fraud is documented; (5) polished diamonds and other high-value goods where the state mandate stalled; (6) unit-level authentication on top of model-level registries such as EUDAMED and the coming sectoral product passports.
- **DPP boundary.** Food and medicines are excluded from the ESPR and will not get a DPP. Tobacco, cosmetics, chemicals and devices are not excluded but have their own regimes and no DPP act in sight, apart from detergents. So for most highly regulated consumables the DPP will not close the consumer gap in this decade. That supports a KYP layer positioned as "the passport for goods the DPP does not cover", provided it uses DPP-compatible identifiers so it is not stranded if sectoral law catches up.
- **Lessons.**
  - Governance beats technology. Tobacco shows that an industry-paid, industry-selected repository is attacked as captured regardless of its technical merit. Separate who pays from who holds and audits the data, from the start.
  - Data quality is the real failure mode. FMD false alerts came from upload and scanner errors, not falsified packs, and the burden fell on pharmacies. A consumer-facing "not verified" result caused by a supplier's data error is a reputational event for the brand and the verifier.
  - Chokepoints provoke resistance. The single Antwerp node for diamonds and the single secondary tobacco repository both became political targets. Federated or multi-node designs travel better.
  - Mandates slip, contracts bite. EUDAMED, EUDR, FSMA 204, DSCSA, G7 diamonds and the CSDDD were all delayed or narrowed in 2025-2026. Retailer and distributor requirements moved faster than law. Sell to the party that can impose a requirement by contract.
  - Authenticity is a narrower and safer claim than quality or sustainability. After September 2026, sustainability-flavoured badges need a certification scheme behind them; a statement of verifiable facts about origin and custody does not carry the same exposure.
  - A mandated QR page is not a marketing channel. The wine rules forbid advertising and tracking on the mandatory information page; assume the same for any future mandated passport.
  - Self-asserted brand passports are the incumbent. Aura-style systems prove consumers and brands will use item-level passports, but the brand vouches for itself. Independence of the verifier is the one thing that model cannot offer, and it is the thing regulators and auditors have criticised most in the mandated systems.

### Gaps
- No evidence was gathered on consumer willingness to scan or pay, on per-unit costs of any of these systems, or on the fees charged by EMVO, national verification bodies or tobacco ID issuers. Cost comparisons in a report should be treated as unsupported unless another researcher supplies them.
- Whether cosmetics, tobacco or medical devices appear in any ESPR working plan or planned delegated act was not confirmed; the statement that no DPP act is in sight for them rests on absence of evidence in these searches.
- Items most in need of re-checking before publication: TPD revision proposal status; EUDR 30 Dec 2026 date; DSCSA small-dispenser extension to 2027; Swiss serialization ordinance; formal withdrawal of the Green Claims proposal; fertiliser digital-labelling date.
